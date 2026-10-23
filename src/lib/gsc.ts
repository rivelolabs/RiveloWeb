import {createCipheriv,createDecipheriv,createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
import {db} from '@/lib/db';

/**
 * Google Search Console for Growth subscribers.
 * Read-only access (webmasters.readonly). The refresh token is stored AES-256-GCM encrypted.
 * Env: GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GSC_TOKEN_KEY (32 random bytes, base64).
 */
export const GSC_SCOPE='https://www.googleapis.com/auth/webmasters.readonly';
export function gscConfigured(){return !!(process.env.GOOGLE_OAUTH_CLIENT_ID&&process.env.GOOGLE_OAUTH_CLIENT_SECRET&&process.env.GSC_TOKEN_KEY);}
function key(){const k=Buffer.from(process.env.GSC_TOKEN_KEY||'','base64');if(k.length!==32)throw Error('GSC_TOKEN_KEY must be 32 bytes, base64-encoded.');return k;}
function seal(text:string){const iv=randomBytes(12),c=createCipheriv('aes-256-gcm',key(),iv);const enc=Buffer.concat([c.update(text,'utf8'),c.final()]);return [iv,c.getAuthTag(),enc].map(b=>b.toString('base64')).join('.');}
function open(sealed:string){const [iv,tag,enc]=sealed.split('.').map(s=>Buffer.from(s,'base64'));const d=createDecipheriv('aes-256-gcm',key(),iv);d.setAuthTag(tag);return Buffer.concat([d.update(enc),d.final()]).toString('utf8');}

/** Signed OAuth state: binds the Google callback to the Rivelo user who started it (10 min). */
export function signState(userId:string){const body=`${userId}.${Date.now()}.${randomBytes(8).toString('hex')}`;return `${body}.${createHmac('sha256',key()).update(body).digest('base64url')}`;}
export function readState(state:string){const i=state.lastIndexOf('.');if(i<0)return null;const body=state.slice(0,i),sig=Buffer.from(state.slice(i+1)),good=Buffer.from(createHmac('sha256',key()).update(body).digest('base64url'));
  if(sig.length!==good.length||!timingSafeEqual(sig,good))return null;const [userId,at]=body.split('.');return Date.now()-Number(at)<600000?userId:null;}

export function authUrl(origin:string,state:string){
  const u=new URL('https://accounts.google.com/o/oauth2/v2/auth');
  u.search=new URLSearchParams({client_id:process.env.GOOGLE_OAUTH_CLIENT_ID!,redirect_uri:`${origin}/api/gsc/callback`,response_type:'code',scope:`openid email ${GSC_SCOPE}`,access_type:'offline',prompt:'consent',include_granted_scopes:'true',state}).toString();
  return u.href;
}
async function token(params:Record<string,string>){
  const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:process.env.GOOGLE_OAUTH_CLIENT_ID!,client_secret:process.env.GOOGLE_OAUTH_CLIENT_SECRET!,...params}),signal:AbortSignal.timeout(10000),cache:'no-store'});
  const d=await r.json();if(!r.ok)throw Error(d.error_description||d.error||'Google sign-in failed.');return d as {access_token:string;refresh_token?:string;id_token?:string;scope?:string};
}
export async function exchangeCode(origin:string,code:string){return token({grant_type:'authorization_code',code,redirect_uri:`${origin}/api/gsc/callback`});}
const emailFromIdToken=(idToken?:string)=>{try{return idToken?String(JSON.parse(Buffer.from(idToken.split('.')[1],'base64url').toString()).email||''):'';}catch{return '';}};

/* ───────── storage (table rivelo.gsc_connections, migration 012) ───────── */
export type Connection={userId:string;googleEmail:string;siteUrl:string|null;connectedAt:string};
export async function saveConnection(userId:string,t:{refresh_token?:string;id_token?:string}){
  if(!t.refresh_token)throw Error('Google did not return offline access. Remove Rivelo from your Google account permissions and connect again.');
  await db().query(`INSERT INTO rivelo.gsc_connections (user_id,google_email,refresh_token,site_url) VALUES ($1,$2,$3,NULL)
    ON CONFLICT (user_id) DO UPDATE SET google_email=EXCLUDED.google_email,refresh_token=EXCLUDED.refresh_token,updated_at=now()`,[userId,emailFromIdToken(t.id_token),seal(t.refresh_token)]);
}
export async function getConnection(userId:string):Promise<Connection|null>{
  const r=await db().query(`SELECT user_id,google_email,site_url,connected_at FROM rivelo.gsc_connections WHERE user_id=$1`,[userId]);
  const x=r.rows[0];return x?{userId:x.user_id,googleEmail:x.google_email||'',siteUrl:x.site_url,connectedAt:new Date(x.connected_at).toISOString()}:null;
}
export async function setSite(userId:string,siteUrl:string){await db().query(`UPDATE rivelo.gsc_connections SET site_url=$2,updated_at=now() WHERE user_id=$1`,[userId,siteUrl]);}
export async function disconnect(userId:string){
  const r=await db().query(`DELETE FROM rivelo.gsc_connections WHERE user_id=$1 RETURNING refresh_token`,[userId]);
  const rt=r.rows[0]?.refresh_token;if(rt){try{await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(open(rt))}`,{method:'POST',signal:AbortSignal.timeout(8000)});}catch{}}
}
async function accessToken(userId:string){
  const r=await db().query(`SELECT refresh_token FROM rivelo.gsc_connections WHERE user_id=$1`,[userId]);
  if(!r.rows[0])throw Error('Search Console is not connected.');
  return (await token({grant_type:'refresh_token',refresh_token:open(r.rows[0].refresh_token)})).access_token;
}
async function google(userId:string,path:string,body?:unknown){
  const at=await accessToken(userId);
  const r=await fetch(`https://www.googleapis.com/webmasters/v3${path}`,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${at}`,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000),cache:'no-store'});
  const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d?.error?.message||`Search Console error ${r.status}`);return d;
}

/** Properties this Google account can read, best first (domain properties, then verified owners). */
export async function listSites(userId:string){
  const d=await google(userId,'/sites') as {siteEntry?:{siteUrl:string;permissionLevel:string}[]};
  return (d.siteEntry||[]).filter(s=>s.permissionLevel!=='siteUnverifiedUser').map(s=>({siteUrl:s.siteUrl,permission:s.permissionLevel}))
    .sort((a,b)=>Number(b.siteUrl.startsWith('sc-domain:'))-Number(a.siteUrl.startsWith('sc-domain:')));
}

export type GscDay={date:string;clicks:number;impressions:number;ctr:number;position:number};
export type GscRow={key:string;clicks:number;impressions:number;ctr:number;position:number;prevPosition?:number|null};
export type GscReport={siteUrl:string;days:number;range:{start:string;end:string};daily:GscDay[];totals:{clicks:number;impressions:number;ctr:number;position:number};prev:{clicks:number;impressions:number;position:number};queries:GscRow[];pages:GscRow[]};
const iso=(d:Date)=>d.toISOString().slice(0,10);
/** Last N days (Search Console data lags ~2 days), plus the previous N days for comparison. */
export async function report(userId:string,siteUrl:string,days:28|90):Promise<GscReport>{
  const end=new Date(Date.now()-2*86400000),start=new Date(end.getTime()-(days-1)*86400000);
  const pEnd=new Date(start.getTime()-86400000),pStart=new Date(pEnd.getTime()-(days-1)*86400000);
  const path=`/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  type R={rows?:{keys:string[];clicks:number;impressions:number;ctr:number;position:number}[]};
  const q=(s:Date,e:Date,dimensions:string[],rowLimit=25)=>google(userId,path,{startDate:iso(s),endDate:iso(e),dimensions,rowLimit,dataState:'all'}) as Promise<R>;
  const [byDate,byQuery,byPage,prevQ,prevTotal]=await Promise.all([q(start,end,['date'],days+5),q(start,end,['query'],50),q(start,end,['page'],20),q(pStart,pEnd,['query'],250),q(pStart,pEnd,[],1)]);
  const map=new Map((byDate.rows||[]).map(r=>[r.keys[0],r]));
  const daily:GscDay[]=[];for(let t=start.getTime();t<=end.getTime();t+=86400000){const k=iso(new Date(t)),r=map.get(k);daily.push({date:k,clicks:r?.clicks||0,impressions:r?.impressions||0,ctr:r?.ctr||0,position:r?Number(r.position.toFixed(1)):0});}
  const clicks=daily.reduce((s,d)=>s+d.clicks,0),impressions=daily.reduce((s,d)=>s+d.impressions,0);
  const withPos=daily.filter(d=>d.impressions>0);const position=withPos.length?withPos.reduce((s,d)=>s+d.position*d.impressions,0)/withPos.reduce((s,d)=>s+d.impressions,0):0;
  const prevPos=new Map((prevQ.rows||[]).map(r=>[r.keys[0],r.position]));
  const row=(r:{keys:string[];clicks:number;impressions:number;ctr:number;position:number},prev?:Map<string,number>):GscRow=>({key:r.keys[0],clicks:r.clicks,impressions:r.impressions,ctr:r.ctr,position:Number(r.position.toFixed(1)),prevPosition:prev?.has(r.keys[0])?Number(prev.get(r.keys[0])!.toFixed(1)):null});
  const pt=prevTotal.rows?.[0];
  return {siteUrl,days,range:{start:iso(start),end:iso(end)},daily,totals:{clicks,impressions,ctr:impressions?clicks/impressions:0,position:Number(position.toFixed(1))},prev:{clicks:pt?.clicks||0,impressions:pt?.impressions||0,position:pt?Number(pt.position.toFixed(1)):0},
    queries:(byQuery.rows||[]).map(r=>row(r,prevPos)),pages:(byPage.rows||[]).map(r=>row(r))};
}

/** Search Console graphs are free for every signed-in user (SEARCH_CONSOLE_FOR_ALL=false limits them to Growth). */
export async function canUseSearchConsole(userId:string){if(process.env.SEARCH_CONSOLE_FOR_ALL!=='false')return true;return hasGrowth(userId);}
/** Growth subscribers (active plan) can connect. GSC_OPEN_TO_ALL=true lets anyone signed in try it (testing). */
export async function hasGrowth(userId:string){
  if(process.env.GSC_OPEN_TO_ALL==='true')return true;
  const r=await db().query(`SELECT 1 FROM rivelo.subscriptions WHERE user_id=$1 AND plan_id='growth' AND status IN ('active','authenticated') LIMIT 1`,[userId]).catch(()=>({rowCount:0}));
  return !!r.rowCount;
}
