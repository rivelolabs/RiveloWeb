import {db} from '@/lib/db';
import {getConnection,report,type GscRow} from '@/lib/gsc';
import {saveResult} from './tasks';

export type WeeklyReport={site:string;range:{start:string;end:string};clicks:number;prevClicks:number;impressions:number;prevImpressions:number;position:number;
  up:GscRow[];down:GscRow[];almost:GscRow[];newQueries:GscRow[]};
/** Last 7 days vs the 7 before, from Search Console (no AI credit used). */
export async function weeklyReport(userId:string):Promise<WeeklyReport|null>{
  const c=await getConnection(userId);if(!c?.siteUrl)return null;
  const r=await report(userId,c.siteUrl,28);
  const last=r.daily.slice(-7),prev=r.daily.slice(-14,-7);const sum=(a:typeof last,k:'clicks'|'impressions')=>a.reduce((n,d)=>n+d[k],0);
  const moved=r.queries.filter(q=>q.prevPosition!=null&&q.impressions>=10);
  return {site:c.siteUrl,range:{start:last[0]?.date||r.range.start,end:last.at(-1)?.date||r.range.end},
    clicks:sum(last,'clicks'),prevClicks:sum(prev,'clicks'),impressions:sum(last,'impressions'),prevImpressions:sum(prev,'impressions'),position:r.totals.position,
    up:moved.filter(q=>q.prevPosition!-q.position>=1).sort((a,b)=>(b.prevPosition!-b.position)-(a.prevPosition!-a.position)).slice(0,5),
    down:moved.filter(q=>q.position-q.prevPosition!>=1).sort((a,b)=>(b.position-b.prevPosition!)-(a.position-a.prevPosition!)).slice(0,5),
    almost:r.queries.filter(q=>q.position>=8&&q.position<=20).sort((a,b)=>b.impressions-a.impressions).slice(0,5),
    newQueries:r.queries.filter(q=>q.prevPosition==null&&q.impressions>=5).slice(0,5)};
}
const pct=(a:number,b:number)=>b?`${a>=b?'+':''}${Math.round((a-b)/b*100)}%`:'new';
export function reportText(w:WeeklyReport){
  const line=(q:GscRow,extra='')=>`• ${q.key} — position ${q.position}${extra}`;
  return [`Your weekly search report for ${w.site.replace(/^sc-domain:/,'')} (${w.range.start} to ${w.range.end})`,'',
    `Clicks: ${w.clicks} (${pct(w.clicks,w.prevClicks)} vs last week)`,`Impressions: ${w.impressions} (${pct(w.impressions,w.prevImpressions)})`,`Average position (28 days): ${w.position}`,'',
    w.up.length?`Moving up:\n${w.up.map(q=>line(q,` (was ${q.prevPosition})`)).join('\n')}`:'',
    w.down.length?`\nSlipping:\n${w.down.map(q=>line(q,` (was ${q.prevPosition})`)).join('\n')}`:'',
    w.almost.length?`\nAlmost on page 1 — worth a better title or a section on the page:\n${w.almost.map(q=>line(q,`, ${q.impressions} impressions`)).join('\n')}`:'',
    w.newQueries.length?`\nNew searches finding you:\n${w.newQueries.map(q=>line(q)).join('\n')}`:''].filter(Boolean).join('\n');
}
/** Weekly report email through Resend (REPORT_FROM_EMAIL or OUTREACH_FROM_EMAIL). Returns false when email isn't configured. */
export async function emailReport(userId:string,w:WeeklyReport){
  const from=process.env.REPORT_FROM_EMAIL||process.env.OUTREACH_FROM_EMAIL;if(!process.env.RESEND_API_KEY||!from)return false;
  const r=await db().query(`SELECT email FROM rivelo.profiles WHERE id=$1`,[userId]);const to=r.rows[0]?.email;if(!to||/@users\.rivelolabs\.com$/.test(to))return false;
  const site=process.env.APP_PUBLIC_URL||'https://www.rivelolabs.com';
  const text=`${reportText(w)}\n\nOpen your dashboard: ${site}/growth\nTurn these emails off in Agent settings on that page.\n\nRivelo Labs`;
  const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`weekly/${userId}/${w.range.end}`},body:JSON.stringify({from,to:[to],reply_to:'hello@rivelolabs.com',subject:`Your week on Google: ${w.clicks} clicks (${pct(w.clicks,w.prevClicks)})`,text}),signal:AbortSignal.timeout(15000)});
  return res.ok;
}
export async function storeReport(userId:string,w:WeeklyReport){return saveResult(userId,'weekly',w);}
