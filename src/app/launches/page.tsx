import type {Metadata} from 'next';
import Link from 'next/link';
import {after} from 'next/server';
import {ArrowUpRight,ChevronUp,MessageSquare,Rocket} from 'lucide-react';
import CommunityShell from '@/components/CommunityShell';
import {dbEnabled} from '@/lib/db';
import {cachedRecentLaunches,type Launch} from '@/lib/db/trending';
import {refreshLaunchesIfStale} from '@/lib/launches/refresh';
import {cachedBuilders,withBuilderLaunches} from '@/lib/db/builders';
import '../directory.css';
import '../builders.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'New launches — Apps & websites launching this week',description:'Fresh app and website launches from Product Hunt, Show HN and the Rivelo Labs community, updated through the day.',alternates:{canonical:'https://www.rivelolabs.com/launches'}};
const SOURCE:Record<Launch['source'],string>={producthunt:'Product Hunt',indiehackers:'Indie Hackers',rivelo:'Rivelo',hackernews:'Show HN'};
const TABS:[string,string][]=[['all','All'],['producthunt','Product Hunt'],['hackernews','Show HN'],['rivelo','Rivelo']];
const host=(u:string)=>{try{return new URL(u).hostname.replace(/^www\./,'');}catch{return u;}};
const dayKey=(iso:string)=>iso.slice(0,10);
function dayLabel(key:string){const today=new Date().toISOString().slice(0,10),y=new Date(Date.now()-86400000).toISOString().slice(0,10);
  const d=new Date(key+'T12:00:00Z').toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric',timeZone:'UTC'});return key===today?`Today · ${d}`:key===y?`Yesterday · ${d}`:d;}
type Props={searchParams:Promise<{source?:string}>};

export default async function Page({searchParams}:Props){
  const {source:raw}=await searchParams;const source=TABS.some(t=>t[0]===raw)?raw!:'all';
  if(dbEnabled())after(()=>refreshLaunchesIfStale().catch(()=>null));
  const all=dbEnabled()?withBuilderLaunches(await cachedRecentLaunches(200,14).catch(()=>[]),await cachedBuilders().catch(()=>[])):[];
  const launches=all.filter(l=>source==='all'||l.source===source);
  const days=new Map<string,Launch[]>();
  for(const l of launches){const k=dayKey(l.launchedAt);days.set(k,[...(days.get(k)||[]),l]);}
  const sorted=[...days].sort((a,b)=>b[0].localeCompare(a[0])).map(([k,items])=>[k,items.sort((a,b)=>b.votes-a.votes)] as const);
  const count=(s:string)=>s==='all'?all.length:all.filter(l=>l.source===s).length;
  return <CommunityShell active="/launches"><main className="rc-content bl">
    <div className="rc-page-title"><span className="rd-overline">FRESH OFF THE LAUNCHPAD</span><h1>New launches.<br/><em>Worth a first look.</em></h1><p>Apps and websites launching this week on Product Hunt, Show HN and here on Rivelo, ranked by upvotes. <Link href="/register" style={{textDecoration:'underline'}}>Launching something?</Link></p></div>
    <nav className="bl-tabs" aria-label="Launch source">{TABS.filter(([id])=>id==='all'||count(id)>0).map(([id,label])=><Link key={id} href={id==='all'?'/launches':`/launches?source=${id}`} className={source===id?'bl-tab-on':''} aria-current={source===id?'page':undefined}>{label} <span style={{opacity:.55,fontWeight:500}}>{count(id)}</span></Link>)}</nav>
    {sorted.length?sorted.map(([day,items])=><section key={day} style={{marginBottom:28}}>
      <h2 className="bl-list-title" style={{display:'flex',alignItems:'center',gap:8}}><Rocket size={18}/>{dayLabel(day)}</h2>
      <ol className="bl-list">{items.map((l,i)=><li key={l.id} className="bl-row" style={{gridTemplateColumns:'34px 48px 1fr auto'}}>
        <span className={`bl-rank${i<3?' bl-rank-top':''}`}>{i+1}</span>
        {l.image?/* eslint-disable-next-line @next/next/no-img-element */<img src={l.image} alt="" width={48} height={48} loading="lazy" style={{width:48,height:48,borderRadius:12,objectFit:'cover',background:'var(--rd-soft)'}}/>:<span className="rd-launch-ph" style={{width:48,height:48,borderRadius:12}}>{l.name.slice(0,1)}</span>}
        <div className="bl-main">
          <p className="bl-name"><a href={l.website||l.url} target="_blank" rel="noopener">{l.name}</a></p>
          {l.tagline&&<p className="bl-bio">{l.tagline}</p>}
          <div className="bl-tags">
            <a href={l.url} target="_blank" rel="noopener">{SOURCE[l.source]}<ArrowUpRight size={12}/></a>
            {l.topics.filter(t=>t!==SOURCE[l.source]).slice(0,2).map(t=><span key={t} className="bl-tag">{t}</span>)}
            {l.website&&<a className="bl-product" href={l.website} target="_blank" rel="noopener">{host(l.website).slice(0,32)}<ArrowUpRight size={12}/></a>}
          </div>
        </div>
        <div className="bl-points">{l.votes>0?<><strong style={{display:'flex',alignItems:'center',gap:2}}><ChevronUp size={18}/>{l.votes}</strong>{l.comments>0&&<small style={{display:'flex',alignItems:'center',gap:4}}><MessageSquare size={11}/>{l.comments}</small>}</>:<small>new</small>}</div>
      </li>)}</ol>
    </section>):<div className="bl-empty"><h3>Fresh launches are on their way</h3><p>This page refreshes itself through the day. Check back in a minute.</p></div>}
  </main></CommunityShell>;
}
