import {db} from './index';
import {cached} from '@/lib/cache';
import {productLabel,xPhoto} from './makers';
import {countryCode} from '@/lib/flags';
import type {Genre,Product} from '@/lib/directory';
import type {Launch} from './trending';

/**
 * Builders leaderboard. Points are earned on Rivelo, and the rules are public on /makers#points:
 * claimed profile 100 · on the map 50 · product listed 50 · bio 20 · logo 10 · each upvote 25 ·
 * each community post 15 · each reply 5 · X audience up to 40 (log scale).
 */
export const POINTS={claimed:100,map:50,product:50,bio:20,logo:10,upvote:25,post:15,reply:5,audienceMax:40} as const;
export type Builder={username:string;name:string;bio:string;photo:string;logo:string|null;claimed:boolean;city:string;country:string|null;lat:number|null;lng:number|null;
  product:string|null;productUrl:string|null;productDescription:string;category:string;points:number;week:number;joinedAt:string;upvotes:number;posts:number};

const CATS:[string,RegExp][]=[['AI',/\b(ai|gpt|llm|agent|machine learning|ml|chatbot|copilot|genai)\b/],['Games',/\b(game|gaming|puzzle|arcade)\b/],['Social',/\b(social|community|chat|chats|friends|dating|video calls?|live calls?|calls|meet|nearby|waves)\b/],['Health',/\b(health|fitness|workout|gym|sleep|habit|meditat|diet|calorie)\b/],
  ['Finance',/\b(finance|budget|invoice|payment|crypto|money|expense|trading|tax)\b/],['Dev tools',/\b(api|developer|devtool|sdk|code|coding|github|deploy|database|open source|cli)\b/],['Design',/\b(design|figma|ui|ux|logo|font|icon)\b/],
  ['Marketing',/\b(seo|marketing|growth|newsletter|ads|social media|outreach|leads)\b/],['Productivity',/\b(productiv|todo|task|notes?|calendar|focus|email|workflow|automation)\b/],['Education',/\b(learn|course|study|student|teach|education|quiz)\b/]];
export const categoryOf=(text:string)=>{const s=text.toLowerCase();return CATS.find(([,re])=>re.test(s))?.[0]||'Indie';};

async function load():Promise<Builder[]>{
  const r=await db().query(`
    WITH m AS (SELECT * FROM rivelo.maker_pages WHERE status IN ('published','claimed')),
    v AS (SELECT lower(substr(product_id,7)) u,count(*)::int total,count(*) FILTER (WHERE created_at>now()-interval '7 days')::int week FROM rivelo.upvotes WHERE product_id LIKE 'maker:%' GROUP BY 1),
    p AS (SELECT author_id,count(*)::int total,count(*) FILTER (WHERE created_at>now()-interval '7 days')::int week FROM rivelo.community_posts WHERE status='published' AND author_id IS NOT NULL GROUP BY 1),
    c AS (SELECT author_id,count(*)::int total,count(*) FILTER (WHERE created_at>now()-interval '7 days')::int week FROM rivelo.community_replies WHERE status='published' AND author_id IS NOT NULL GROUP BY 1)
    SELECT m.username,m.name,m.bio,m.avatar_url,NULLIF(m.logo_url,'') logo,m.followers,m.product_name,m.product_url,m.product_description,m.city,m.lat,m.lng,m.status,m.created_at,m.claimed_at,
      COALESCE(v.total,0) vt,COALESCE(v.week,0) vw,COALESCE(p.total,0) pt,COALESCE(p.week,0) pw,COALESCE(c.total,0) ct,COALESCE(c.week,0) cw
    FROM m LEFT JOIN v ON v.u=lower(m.username) LEFT JOIN p ON p.author_id=m.claimed_by LEFT JOIN c ON c.author_id=m.claimed_by LIMIT 2000`);
  const week=Date.now()-7*86400000;
  return r.rows.map(x=>{
    const claimed=x.status==='claimed',onMap=x.lat!=null&&x.lng!=null,hasProduct=!!x.product_url;
    const audience=Math.min(POINTS.audienceMax,Math.round(10*Math.log10((x.followers||0)+1)));
    const base=(claimed?POINTS.claimed:0)+(onMap?POINTS.map:0)+(hasProduct?POINTS.product:0)+(x.bio?POINTS.bio:0)+(x.logo?POINTS.logo:0)+audience;
    const points=base+x.vt*POINTS.upvote+x.pt*POINTS.post+x.ct*POINTS.reply;
    const joined=x.claimed_at||x.created_at;
    const weekPts=x.vw*POINTS.upvote+x.pw*POINTS.post+x.cw*POINTS.reply+(new Date(joined).getTime()>week?base:0);
    const product=hasProduct||x.product_name?productLabel(x.product_name,x.name):null;
    return {username:x.username,name:x.name,bio:(x.bio||'').trim(),photo:xPhoto(x.avatar_url,x.username),logo:x.logo,claimed,city:x.city||'',country:countryCode(x.city),lat:x.lat,lng:x.lng,
      product,productUrl:x.product_url,productDescription:x.product_description||'',category:categoryOf(`${x.product_name||''} ${x.product_description||''} ${x.bio||''}`),
      points,week:weekPts,joinedAt:new Date(joined).toISOString(),upvotes:x.vt,posts:x.pt+x.ct};
  });
}
export const cachedBuilders=cached(load,'builders',['makers','community'],300);

export type Sort='top'|'trending'|'rising'|'new';
const STOP=new Set(['a','an','the','in','on','at','of','for','who','want','wants','and','or','to','with','builder','builders','maker','makers','people','founder','founders','doing','near','from','based','building']);
export function rankBuilders(all:Builder[],sort:Sort,q=''){
  const words=q.toLowerCase().split(/[^a-z0-9.+#-]+/).filter(w=>w&&!STOP.has(w));
  const list=words.length?all.filter(b=>{const hay=`${b.name} ${b.username} ${b.bio} ${b.product||''} ${b.productDescription} ${b.city} ${b.category} ${b.claimed?'claimed':''} ${b.lat!=null?'map':''}`.toLowerCase();
    return words.every(w=>w==='solo'||w==='indie'?true:hay.includes(w));}):[...all];
  const by:Record<Sort,(a:Builder,b:Builder)=>number>={
    top:(a,b)=>b.points-a.points||a.joinedAt.localeCompare(b.joinedAt),
    trending:(a,b)=>b.week-a.week||b.points-a.points,
    rising:(a,b)=>b.week/Math.max(50,b.points-b.week)-a.week/Math.max(50,a.points-a.week)||b.week-a.week,
    new:(a,b)=>b.joinedAt.localeCompare(a.joinedAt)};
  return list.sort(by[sort]);
}
/** Suggested searches built from the data itself (busiest countries and categories). */
export function suggestions(all:Builder[]){
  const top=(f:(b:Builder)=>string|null)=>[...all.reduce((m,b)=>{const k=f(b);if(k)m.set(k,(m.get(k)||0)+1);return m;},new Map<string,number>())].sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
  const dn=new Intl.DisplayNames(['en'],{type:'region'});
  const countries=top(b=>b.country).slice(0,2).map(c=>dn.of(c)||c),cats=top(b=>b.category==='Indie'?null:b.category).slice(0,2);
  const out=[cats[0]&&`${cats[0]} builders${countries[0]?` in ${countries[0]}`:''}`,countries[1]&&`Builders in ${countries[1]}`,cats[1]&&`${cats[1]} makers`,'Makers on the map'].filter(Boolean) as string[];
  return [...new Set(out)].slice(0,4);
}

/** Claimed builder pages with a product link, as directory products (Apps / Websites). Id "maker:<username>". */
const GENRE:Record<string,Genre>={AI:'AI & developer tools','Dev tools':'AI & developer tools',Games:'Games',Health:'Health & fitness',Social:'Social & community'};
export function builderProducts(all:Builder[]):Product[]{
  return all.filter(b=>b.claimed&&b.productUrl).map(b=>{
    const u=b.productUrl!,store=/play\.google\.com/.test(u)?'Android':/apps\.apple\.com|itunes\.apple\.com/.test(u)?'iOS':null;
    const text=(b.productDescription||b.bio||`Built by @${b.username}`).replace(/\s+/g,' ').trim();
    const name=b.product&&b.product!==b.name?b.product:b.name;
    return {id:`maker:${b.username}`,name,tagline:text.length>150?text.slice(0,149)+'…':text,description:text,genre:GENRE[b.category]||'Productivity',
      platforms:store?[store]:['Web'],type:store?'App':'Website',color:['lilac','lime','peach','butter','blue'][b.username.length%5],letter:name.slice(0,1).toLowerCase(),
      url:u,logo:b.logo||b.photo,claimed:true} as Product;
  });
}

/** Builder pages (added through X) joined in the last `days`, as launches on /launches and Fresh launches. */
export function builderLaunches(all:Builder[],days=14):Launch[]{
  const since=Date.now()-days*86400000;
  return builderProducts(all).flatMap(p=>{const b=all.find(x=>`maker:${x.username}`===p.id)!;if(Date.parse(b.joinedAt)<since)return [];
    return [{id:p.id,source:'rivelo' as const,name:p.name,tagline:p.tagline,url:`/makers/${b.username}`,website:p.url||null,image:p.logo||null,votes:b.upvotes,comments:0,launchedAt:b.joinedAt,topics:[GENRE[b.category]||'Productivity']}];});
}
/** Adds builder launches to a launch list, skipping ones whose website is already there. */
export function withBuilderLaunches(list:Launch[],all:Builder[]){
  const host=(u:string|null)=>{try{return u?new URL(u).href.replace(/^https?:\/\/(www\.)?/,'').replace(/\/$/,''):'';}catch{return '';}};
  const seen=new Set(list.flatMap(l=>[host(l.website),host(l.url)]).filter(Boolean));
  return [...list,...builderLaunches(all).filter(l=>!seen.has(host(l.website)))].sort((a,b)=>b.launchedAt.slice(0,10).localeCompare(a.launchedAt.slice(0,10))||b.votes-a.votes);
}
