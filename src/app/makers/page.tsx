import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowUpRight,BadgeCheck,HelpCircle,Search,Sparkles,TrendingUp} from 'lucide-react';
import CommunityShell from '@/components/CommunityShell';
import BuildersYou from '@/components/BuildersYou';
import {dbEnabled} from '@/lib/db';
import {cachedBuilders,rankBuilders,suggestions,POINTS,type Builder,type Sort} from '@/lib/db/builders';
import {flag,shortPlace} from '@/lib/flags';
import '../directory.css';
import '../builders.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Builders — indie makers and founders on Rivelo',description:'Meet independent builders: who they are, where they’re based and what they’re shipping. Ranked by Rivelo points, updated through the day.',alternates:{canonical:'https://www.rivelolabs.com/makers'}};
const TABS:[Sort,string][]=[['top','Top'],['trending','Trending'],['rising','Rising'],['new','New']];
const host=(u:string)=>{try{return new URL(u).hostname.replace(/^www\./,'');}catch{return u;}};
const STORE:Record<string,string>={'play.google.com':'Google Play','apps.apple.com':'App Store','itunes.apple.com':'App Store'};
const compact=(n:number)=>n>=1000?`${(n/1000).toFixed(n>=10000?0:1).replace(/\.0$/,'')}K`:String(n);
type Props={searchParams:Promise<{sort?:string;q?:string}>};

export default async function Page({searchParams}:Props){
  const sp=await searchParams;const sort=(TABS.some(t=>t[0]===sp.sort)?sp.sort:'top') as Sort;const q=(sp.q||'').slice(0,80);
  const all:Builder[]=dbEnabled()?await cachedBuilders().catch(()=>[]):[];
  const top=rankBuilders(all,'top'),list=rankBuilders(all,sort,q).slice(0,100);
  const ranks=Object.fromEntries(top.map((b,i)=>[b.username.toLowerCase(),{rank:i+1,points:b.points}]));
  const href=(s:Sort,query=q)=>`/makers?${new URLSearchParams({...(s!=='top'?{sort:s}:{}),...(query?{q:query}:{})})}`;
  const heading=q?`Results for “${q}”`:sort==='top'?'Top builders':sort==='trending'?'Trending this week':sort==='rising'?'Rising fast':'Newest builders';
  const ld={'@context':'https://schema.org','@type':'ItemList',name:'Top builders on Rivelo Labs',itemListElement:top.slice(0,20).map((b,i)=>({'@type':'ListItem',position:i+1,url:`https://www.rivelolabs.com/makers/${b.username}`,name:b.name}))};

  return <CommunityShell active="/makers"><main className="rc-content bl">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld).replace(/</g,'\\u003c')}}/>
    <div className="bl-head"><div><span className="rd-overline">THE PEOPLE BEHIND THE PRODUCTS</span><h1>Builders</h1><p>{all.length.toLocaleString()} independent makers and founders, ranked by what they share and ship on Rivelo.</p></div>
      <a href="#points" className="bl-help" aria-label="How points work"><HelpCircle size={20}/></a></div>

    <form className="bl-search" action="/makers" role="search">{sort!=='top'&&<input type="hidden" name="sort" value={sort}/>}
      <Search size={18}/><input name="q" defaultValue={q} placeholder="Search builders, products or cities" aria-label="Search builders"/>{q&&<Link href={href(sort,'')} className="bl-clear">Clear</Link>}</form>

    <nav className="bl-tabs" aria-label="Sort builders">{TABS.map(([id,label])=><Link key={id} href={href(id)} className={sort===id?'bl-tab-on':''} aria-current={sort===id?'page':undefined}>{label}</Link>)}</nav>
    {all.length>0&&<div className="bl-chips">{suggestions(all).map(s=><Link key={s} href={href(sort,s)} className={q===s?'bl-chip-on':''}><Sparkles size={14}/>{s}</Link>)}</div>}

    <BuildersYou ranks={ranks}/>

    <h2 className="bl-list-title">{heading}</h2>
    {list.length?<ol className="bl-list">{list.map((b,i)=>{const rank=q||sort!=='top'?ranks[b.username.toLowerCase()]?.rank:i+1;
      return <li key={b.username} className="bl-row">
        <span className={`bl-rank${rank&&rank<=3?' bl-rank-top':''}`}>{q||sort!=='top'?i+1:rank}</span>
        <Link href={`/makers/${b.username}`} className="bl-photo" aria-hidden tabIndex={-1}>
          {/* eslint-disable-next-line @next/next/no-img-element */}<img src={b.photo} alt="" width={56} height={56} loading={i<8?'eager':'lazy'} referrerPolicy="no-referrer"/>
          {b.logo&&/* eslint-disable-next-line @next/next/no-img-element */<img className="bl-badge" src={b.logo} alt="" width={20} height={20} loading="lazy"/>}
        </Link>
        <div className="bl-main">
          <p className="bl-name"><Link href={`/makers/${b.username}`}>{b.name}</Link>{b.claimed&&<BadgeCheck size={16} className="bl-check" aria-label="Claimed by the maker"/>}<span>@{b.username}</span></p>
          {(b.bio||b.productDescription)&&<p className="bl-bio">{b.bio||b.productDescription}</p>}
          <div className="bl-tags">
            {b.city&&<Link href={href(sort,shortPlace(b.city))}>{b.country&&<span aria-hidden>{flag(b.country)}</span>}{shortPlace(b.city)}</Link>}
            <Link href={href(sort,b.category==='Indie'?'':b.category)}>{b.category}</Link>
            {b.productUrl&&<a className="bl-product" href={b.productUrl} target="_blank" rel="noopener">
              {/* eslint-disable-next-line @next/next/no-img-element */}<img src={b.logo||`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host(b.productUrl))}&sz=64`} alt="" width={16} height={16} loading="lazy"/>
              {b.product&&b.product!==b.name?b.product:STORE[host(b.productUrl)]||host(b.productUrl)}<ArrowUpRight size={13}/></a>}
            {b.extras.length>0&&<Link href={`/makers/${b.username}`} className="bl-more">+{b.extras.length} more</Link>}
          </div>
        </div>
        <div className="bl-points"><strong>{compact(b.points)}</strong>{b.week>0?<span className="bl-up"><TrendingUp size={12}/>{compact(b.week)}</span>:<small>points</small>}</div>
      </li>;})}</ol>
      :<div className="bl-empty"><h3>{q?'No builders match that yet':'No builders yet'}</h3><p>{q?'Try a city, a country or what they build — like “AI” or “games”.':'Be the first: sign in with X and add yourself.'}</p></div>}

    <section id="points" className="bl-points-help"><h2>How points work</h2><p>Points show how much a builder has shared and shipped on Rivelo. Nobody can buy them.</p>
      <ul>
        <li><b>+{POINTS.claimed}</b> claim your builder page with X</li><li><b>+{POINTS.map}</b> add your city to the map</li><li><b>+{POINTS.product}</b> link the product you’re building</li>
        <li><b>+{POINTS.bio}</b> write a short bio · <b>+{POINTS.logo}</b> add your product logo</li><li><b>+{POINTS.upvote}</b> for every upvote your product gets</li>
        <li><b>+{POINTS.post}</b> per community post · <b>+{POINTS.reply}</b> per reply</li><li><b>up to +{POINTS.audienceMax}</b> for your X audience</li>
      </ul>
      <p><b>Trending</b> counts points earned in the last 7 days. <b>Rising</b> compares this week with everything before it, so newer builders can show up too.</p></section>
  </main></CommunityShell>;
}
