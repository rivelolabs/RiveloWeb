import Link from 'next/link';
import {ArrowRight,BadgeCheck,TrendingUp} from 'lucide-react';
export type BuilderCard={username:string;href:string;handle:string;name:string;photo:string;logo:string|null;claimed:boolean;place:string;flag:string;product:string|null;points:number;week:number;bio:string};
const compact=(n:number)=>n>=1000?`${(n/1000).toFixed(n>=10000?0:1).replace(/\.0$/,'')}K`:String(n);
/** Home page strip: the top builders, linking to their pages and to the full leaderboard. */
export default function TopBuilders({builders}:{builders:BuilderCard[]}){
  if(!builders.length)return null;
  return <section className="tb" aria-labelledby="tb-title">
    <div className="tb-head"><div><span className="rd-overline">THE PEOPLE BEHIND THE PRODUCTS</span><h2 id="tb-title">Top builders</h2><p>Independent makers sharing what they ship.</p></div>
      <Link href="/makers" className="tb-all">All builders <ArrowRight size={15}/></Link></div>
    <ol className="tb-list">{builders.map((b,i)=><li key={b.username}><Link href={b.href} className="tb-card">
      <span className={`tb-rank${i<3?' tb-rank-top':''}`}>{i+1}</span>
      <span className="tb-photo">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={b.photo} alt="" width={52} height={52} loading="lazy" referrerPolicy="no-referrer"/>
        {b.logo&&/* eslint-disable-next-line @next/next/no-img-element */<img className="tb-badge" src={b.logo} alt="" width={20} height={20} loading="lazy"/>}</span>
      <span className="tb-text"><b>{b.name}{b.claimed&&<BadgeCheck size={14} className="tb-check" aria-label="Claimed"/>}</b><small>{b.handle}</small>
        <span className="tb-meta">{b.place&&<span>{b.flag&&<span aria-hidden>{b.flag} </span>}{b.place}</span>}{b.product&&<span className="tb-product">{b.product}</span>}</span></span>
      <span className="tb-points"><strong>{compact(b.points)}</strong>{b.week>0?<em><TrendingUp size={11}/>{compact(b.week)}</em>:<small>pts</small>}</span>
    </Link></li>)}</ol>
    <Link href="/makers" className="tb-join">Building something? <b>Add yourself</b> <ArrowRight size={14}/></Link>
  </section>;
}
