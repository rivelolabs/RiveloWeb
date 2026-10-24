import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowUpRight,MapPin,ShieldCheck,BadgeCheck} from 'lucide-react';
import CommunityShell from '@/components/CommunityShell';
import MakerOwner from '@/components/MakerOwner';
import {dbEnabled} from '@/lib/db';
import {makerByUsername,makerExtras,makerFunding,productLabel,xPhoto,type MakerProduct} from '@/lib/db/makers';
import {fundingLabel} from '@/lib/funding';
import '../../directory.css';
import '../../makers.css';
export const dynamic='force-dynamic';
type Props={params:Promise<{username:string}>};
async function load(username:string){if(!dbEnabled())return null;const m=await makerByUsername(username).catch(()=>null);return m&&(m.status==='published'||m.status==='claimed')?m:null;}
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {username}=await params;const m=await load(username);if(!m)return {title:'Maker not found',robots:{index:false}};
  return {title:`${m.name} (@${m.username}) — Rivelo maker`,description:m.productDescription||m.bio||`${m.name} is building ${m.productName||'something new'}.`,robots:m.status==='claimed'?undefined:{index:false,follow:false},alternates:{canonical:`https://www.rivelolabs.com/makers/${m.username}`},
    openGraph:{type:'profile',title:`${m.name} (@${m.username}) on the Rivelo map`,description:m.productDescription||m.bio||`${m.name} is building ${m.productName||'something new'}.`,url:`https://www.rivelolabs.com/makers/${m.username}`,siteName:'Rivelo Labs'},
    twitter:{card:'summary_large_image',title:`${m.name} (@${m.username}) on the Rivelo map`,description:m.productDescription||m.bio||`${m.name} is building ${m.productName||'something new'}.`,creator:`@${m.username}`}};
}
const host=(u:string)=>{try{return new URL(u).hostname.replace(/^www\./,'');}catch{return u;}};
export default async function Page({params}:Props){
  const {username}=await params;const m=await load(username);if(!m)notFound();
  const claimed=m.status==='claimed',first=m.name.split(' ')[0];
  const funding=claimed?await makerFunding(m.id):'';
  const extras:MakerProduct[]=claimed?(await makerExtras([m.id]).catch(()=>new Map<string,MakerProduct[]>())).get(m.id)||[]:[];
  const ld={'@context':'https://schema.org','@type':'ProfilePage',url:`https://www.rivelolabs.com/makers/${m.username}`,mainEntity:{'@type':'Person',name:m.name,alternateName:`@${m.username}`,description:m.bio||undefined,image:m.avatar||undefined,sameAs:[`https://x.com/${m.username}`,...(m.website?[m.website]:[])],...(m.city?{homeLocation:{'@type':'Place',name:m.city}}:{}),...(m.productUrl?{owns:{'@type':'SoftwareApplication',name:m.productName||host(m.productUrl),url:m.productUrl}}:{})}};
  return <CommunityShell active="/makers"><main className="rc-content mk-page"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld).replace(/</g,'\\u003c')}}/>
    {!claimed&&<section className="mk-claim-banner" aria-label="Claim this page">
      <div><h2>{first}, this is your page</h2><p>Built from your X profile and the link you dropped{m.sourceAuthor?<> under <a href={m.sourcePostUrl||`https://x.com/${m.sourceAuthor}`} target="_blank" rel="noopener noreferrer">@{m.sourceAuthor}’s post</a></>:null}. Claim it to go live on the map.</p>
        {m.replyText&&<blockquote>“{m.replyText}”</blockquote>}</div>
      <MakerOwner username={m.username} mode="claim"/>
    </section>}
    <header className="mk-head">
      {/* eslint-disable-next-line @next/next/no-img-element */}<img src={xPhoto(m.avatar,m.username)} alt="" width={96} height={96} referrerPolicy="no-referrer"/>
      <div><h1>{m.name}{claimed&&<BadgeCheck size={22} aria-label="Claimed by its owner"/>}</h1><p className="mk-handle">@{m.username}{typeof m.followers==='number'&&<> · {m.followers.toLocaleString()} followers</>}</p>
        <div className="mk-chips"><a className="mk-x" href={`https://x.com/${m.username}`} target="_blank" rel="noopener noreferrer" aria-label={`@${m.username} on X`}>𝕏</a>{m.city&&<span><MapPin size={14}/> {m.city}</span>}{funding&&<span>{fundingLabel(funding)}</span>}<span className={claimed?'mk-live':'mk-unclaimed'}>{claimed?'Live on the map':'Not claimed yet'}</span></div></div>
    </header>
    <section className="mk-card"><h2>About {first}</h2>{m.bio?<p>{m.bio}</p>:<p className="mk-muted">No bio yet.</p>}
      {m.website&&<><span className="mk-label">LINKS</span><div className="mk-links"><a href={m.website} target="_blank" rel="noopener noreferrer">{host(m.website)} <ArrowUpRight size={14}/></a></div></>}
      {!claimed&&<p className="mk-muted mk-small">Read from {first}’s X profile and the link they dropped.</p>}
    </section>
    {m.productUrl&&<section className={`mk-card mk-product${claimed?'':' mk-product-dashed'}`}>
      {!claimed&&<span className="mk-label">FROM THE LINK THEY DROPPED{m.sourceAuthor?` UNDER @${m.sourceAuthor.toUpperCase()}’S POST`:''}</span>}
      <div className="mk-product-row">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={m.logo||`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host(m.productUrl))}&sz=128`} alt="" width={56} height={56}/><div><h3>{m.productName||host(m.productUrl)}</h3><a href={m.productUrl} target="_blank" rel="noopener noreferrer">{host(m.productUrl)} <ArrowUpRight size={13}/></a></div></div>
      {m.productDescription&&<p>{m.productDescription}</p>}
      <div className="mk-actions"><a className="rd-button rd-outline" href={m.productUrl} target="_blank" rel="noopener noreferrer">Visit {m.productName||host(m.productUrl)}</a>{!claimed&&<MakerOwner username={m.username} mode="claim" label="Is this yours? Claim it"/>}</div>
    </section>}
    {extras.length>0&&<section className="mk-card"><h2>More from {first}</h2><div className="mk-more">{extras.map(e=><article key={e.id} className="mk-more-item">
      <div className="mk-product-row">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={e.logo||`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host(e.url))}&sz=128`} alt="" width={48} height={48}/><div><h3>{e.name}</h3><a href={e.url} target="_blank" rel="noopener noreferrer">{host(e.url)} <ArrowUpRight size={13}/></a></div></div>
      {e.description&&<p>{e.description}</p>}</article>)}</div></section>}
    <MakerOwner username={m.username} mode="edit" extras={extras.map(e=>({id:e.id,name:e.name,url:e.url,logo:e.logo||'',description:e.description}))} initial={{funding,name:m.name,bio:m.bio||'',productName:productLabel(m.productName,''),productUrl:m.productUrl||'',productDescription:m.productDescription||'',city:m.city||'',lat:m.lat,lng:m.lng,logo:m.logo||''}}/>
    <p className="mk-report"><ShieldCheck size={14}/> Something wrong on this page, or want it removed? <a href={`mailto:hello@rivelolabs.com?subject=${encodeURIComponent(`Maker page @${m.username}`)}`}>Report it</a></p>
    <Link className="mk-map" href="/map"><MapPin size={16}/> Map</Link>
  </main></CommunityShell>;
}
