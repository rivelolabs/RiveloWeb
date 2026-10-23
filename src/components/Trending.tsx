"use client";
import Link from 'next/link';
import {ArrowUpRight,ChevronUp,Flame,Rocket} from 'lucide-react';
import type {Product} from '@/lib/directory';
import type {SponsoredSlide} from './HeroSlider';

export type LaunchItem={id:string;source:'producthunt'|'indiehackers'|'rivelo'|'hackernews';name:string;tagline:string;url:string;image:string|null;votes:number;launchedAt:string};
export type Votes={counts:Record<string,{total:number;week:number}>;mine:string[]};
const SOURCE:Record<LaunchItem['source'],string>={producthunt:'Product Hunt',indiehackers:'Indie Hackers',rivelo:'New on Rivelo',hackernews:'Show HN'};

export function UpvoteButton({productId,votes,onVote,compact=false}:{productId:string;votes:Votes;onVote:(id:string)=>void;compact?:boolean}){
  const on=votes.mine.includes(productId),n=votes.counts[productId]?.total||0;
  return <button type="button" className={`rd-upvote${on?' rd-upvote-on':''}${compact?' rd-upvote-compact':''}`} aria-pressed={on} aria-label={`${on?'Remove upvote from':'Upvote'} this product (${n})`} onClick={e=>{e.stopPropagation();onVote(productId);}}><ChevronUp size={compact?14:16}/><span>{n}</span></button>;
}

export default function Trending({catalog,votes,onVote,sponsored,launches,onOpen}:{catalog:Product[];votes:Votes;onVote:(id:string)=>void;sponsored:SponsoredSlide[];launches:LaunchItem[];onOpen:(p:Product)=>void}){
  const promoted=sponsored.map(s=>s.id);
  const score=(p:Product)=>(votes.counts[p.id]?.week||0)*3+(votes.counts[p.id]?.total||0);
  const organic=catalog.filter(p=>!promoted.includes(p.id)).sort((a,b)=>score(b)-score(a)).slice(0,Math.max(3,6-sponsored.length));
  const list=organic;
  const ext=(u:string)=>/^https?:/.test(u);
  return <section className="rd-trending" aria-label="Trending and new launches">
    <div className="rd-trend-col">
      <div className="rd-trend-head"><Flame size={18}/><h2>Trending this week</h2><span className="rd-fine-print">Upvoted by the Rivelo community</span></div>
      {list.length===0&&sponsored.length===0&&<p className="rd-fine-print rd-launch-empty">Approved products will appear here as people upvote them.</p>}<ol className="rd-trend-list">{sponsored.map(s=>{const p=catalog.find(x=>x.id===s.id);return <li key={'sp-'+s.id} className="rd-trend-promoted">
        <span className="rd-trend-rank">★</span>
        {p?<button type="button" className="rd-trend-main" onClick={()=>onOpen(p)}><b>{s.name}</b><span>{s.tagline}</span></button>
          :<a className="rd-trend-main" href={s.url} {...(ext(s.url)?{target:'_blank',rel:'sponsored noopener noreferrer'}:{})}><b>{s.name}</b><span>{s.tagline}</span></a>}
        <span className="rd-sponsored-tag">Promoted</span>
        <UpvoteButton productId={s.id} votes={votes} onVote={onVote}/>
      </li>;})}{list.map((p,i)=><li key={p.id}>
        <span className="rd-trend-rank">{i+1}</span>
        <button type="button" className="rd-trend-main" onClick={()=>onOpen(p)}><b>{p.name}</b><span>{p.tagline}</span></button>
        <UpvoteButton productId={p.id} votes={votes} onVote={onVote}/>
      </li>)}</ol>
    </div>
    <div className="rd-trend-col">
      <div className="rd-trend-head"><Rocket size={18}/><h2>Fresh launches</h2><Link href="/launches" className="rd-trend-more">See all <ArrowUpRight size={14}/></Link></div>
      {launches.length||sponsored.length?<ul className="rd-launch-list">{sponsored.slice(0,2).map(s=><li key={'spl-'+s.id}><a href={s.url} {...(ext(s.url)?{target:'_blank',rel:'sponsored noopener noreferrer'}:{})}>
          {s.logo?/* eslint-disable-next-line @next/next/no-img-element */<img src={s.logo} alt="" width={40} height={40} loading="lazy"/>:<span className="rd-launch-ph">{s.name.slice(0,1)}</span>}
          <span className="rd-launch-text"><b>{s.name}</b><span>{s.tagline}</span><small>Sponsored</small></span><ArrowUpRight size={15}/></a></li>)}{launches.slice(0,Math.max(4,6-Math.min(2,sponsored.length))).map(l=><li key={l.id}>
        <a href={l.url} target="_blank" rel="noopener noreferrer">
          {l.image?/* eslint-disable-next-line @next/next/no-img-element */<img src={l.image} alt="" width={40} height={40} loading="lazy"/>:<span className="rd-launch-ph">{l.name.slice(0,1)}</span>}
          <span className="rd-launch-text"><b>{l.name}</b><span>{l.tagline}</span><small>{SOURCE[l.source]}{l.votes?` · ${l.votes} votes`:''}</small></span>
          <ArrowUpRight size={15}/>
        </a></li>)}</ul>
      :<p className="rd-fine-print">New launches from Product Hunt and the Rivelo community will appear here.</p>}
    </div>
  </section>;
}
