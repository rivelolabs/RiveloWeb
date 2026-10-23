import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowUpRight,Rocket} from 'lucide-react';
import CommunityShell from '@/components/CommunityShell';
import {dbEnabled} from '@/lib/db';
import {cachedRecentLaunches,type Launch} from '@/lib/db/trending';
import '../directory.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'New launches — Apps & websites launching this week',description:'Fresh app and website launches from Product Hunt and the Rivelo Labs community, updated through the day.',alternates:{canonical:'https://rivelolabs.com/launches'}};
const SOURCE:Record<Launch['source'],string>={producthunt:'Product Hunt',indiehackers:'Indie Hackers',rivelo:'Rivelo',hackernews:'Show HN'};
export default async function Page(){
  const launches=dbEnabled()?await cachedRecentLaunches(100,14).catch(()=>[]):[];
  const days=new Map<string,Launch[]>();
  for(const l of launches){const d=new Date(l.launchedAt).toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'});days.set(d,[...(days.get(d)||[]),l]);}
  return <CommunityShell active="/launches"><main className="rc-content">
    <div className="rc-page-title"><span className="rd-overline">FRESH OFF THE LAUNCHPAD</span><h1>New launches.<br/><em>Worth a first look.</em></h1><p>Apps and websites launching this week on Product Hunt and here on Rivelo. <Link href="/register" style={{textDecoration:'underline'}}>Launching something?</Link></p></div>
    {launches.length?[...days].map(([day,items])=><section key={day} className="rd-trend-col" style={{marginBottom:20}}>
      <div className="rd-trend-head"><Rocket size={18}/><h2>{day}</h2></div>
      <ul className="rd-launch-list">{items.map(l=><li key={l.id}><a href={l.url} target="_blank" rel="noopener noreferrer">
        {l.image?/* eslint-disable-next-line @next/next/no-img-element */<img src={l.image} alt="" width={40} height={40} loading="lazy"/>:<span className="rd-launch-ph">{l.name.slice(0,1)}</span>}
        <span className="rd-launch-text"><b>{l.name}</b><span>{l.tagline}</span><small>via {SOURCE[l.source]}{l.votes?` · ${l.votes} votes`:''}{l.topics.length?` · ${l.topics.join(', ')}`:''}</small></span><ArrowUpRight size={15}/>
      </a></li>)}</ul>
    </section>):<p className="rd-fine-print">Launches will appear here once the first import runs.</p>}
  </main></CommunityShell>;
}
