"use client";
import {useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Bookmark,Check,Globe2,Link2,Smartphone,Tag,CalendarDays,Store} from 'lucide-react';
import type {Product} from '@/lib/directory';
import ProductComments from './ProductComments';
import {UpvoteButton,type Votes} from './Trending';

const host=(u?:string)=>{try{return u?new URL(u).hostname.replace(/^www\./,''):'';}catch{return '';}};
const source=(p:Product)=>p.sourceKind==='googleplay'?'Google Play':p.sourceKind?.startsWith('appstore')?'App Store':host(p.url)||'Web';

/** Product popup: banner + logo header, one clear description, actions, details and comments. */
export default function ProductDetail({product:p,saved,onSave,votes,onVote,icon}:{product:Product;saved:boolean;onSave:()=>void;votes:Votes;onVote:(id:string)=>void;icon:React.ReactNode}){
  const [copied,setCopied]=useState(false),[imgOk,setImgOk]=useState(true),[logoOk,setLogoOk]=useState(true);
  // Owner logo + banner when given; otherwise an imported store icon is the logo and there is no banner.
  const logo=p.logo&&logoOk?p.logo:!p.logo&&p.image&&p.imported?p.image:undefined;
  const banner=p.logo&&p.image&&imgOk?p.image:undefined;
  const tagline=p.tagline&&!p.description.startsWith(p.tagline.replace(/…$/,'').slice(0,60))?p.tagline:'';
  const added=p.importedAt?new Date(p.importedAt).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}):'';
  async function share(){const url=`${location.origin}${p.id.startsWith('maker:')?`/makers/${p.id.slice(6).split("/")[0]}`:`/products/${p.id}`}`;try{if(navigator.share)await navigator.share({title:p.name,url});else{await navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),1800);}}catch{}}
  return <article className="pd">
    <div className={`pd-banner rd-${p.color}`}>{banner?/* eslint-disable-next-line @next/next/no-img-element */<img src={banner} alt="" referrerPolicy="no-referrer" onError={()=>setImgOk(false)}/>:<span className="pd-banner-art" aria-hidden="true"/>}</div>
    <header className="pd-head">
      <span className={`pd-logo rd-${p.color}`}>{logo?/* eslint-disable-next-line @next/next/no-img-element */<img src={logo} alt="" referrerPolicy="no-referrer" onError={()=>setLogoOk(false)}/>:icon}</span>
      <div className="pd-title">
        <h2>{p.name}</h2>
        <div className="pd-chips"><span><Tag size={13}/>{p.genre}</span><span>{p.type==='App'?<Smartphone size={13}/>:<Globe2 size={13}/>}{p.platforms.join(' + ')}</span>{p.claimed&&<span className="pd-verified"><Check size={13}/>Verified owner</span>}{p.sponsored&&<span className="pd-sponsored">Sponsored</span>}</div>
      </div>
      <UpvoteButton productId={p.id} votes={votes} onVote={onVote}/>
    </header>
    <div className="pd-actions">
      {p.url?<a className="rd-button rd-primary pd-visit" href={p.url} target="_blank" rel={p.sponsored?'sponsored noopener noreferrer':'noopener noreferrer'}>{p.type==='App'?'Get the app':'Visit website'} <ArrowUpRight size={16}/></a>:<span className="rd-fine-print">Store links will be added when available.</span>}
      <button type="button" className={`rd-button rd-outline${saved?' pd-on':''}`} onClick={onSave}><Bookmark size={15} fill={saved?'currentColor':'none'}/>{saved?'Saved':'Save'}</button>
      <button type="button" className="rd-button rd-outline" onClick={share}><Link2 size={15}/>{copied?'Link copied':'Share'}</button>
    </div>
    <section className="pd-body">
      {tagline&&<p className="pd-tagline">{tagline}</p>}
      <p className="pd-desc">{p.description}</p>
      <dl className="pd-meta">
        <div><dt><Store size={13}/> Source</dt><dd>{p.url?<a href={p.url} target="_blank" rel="noopener noreferrer">{source(p)} <ArrowUpRight size={12}/></a>:source(p)}</dd></div>
        <div><dt><Tag size={13}/> Category</dt><dd>{p.genre}</dd></div>
        {added&&<div><dt><CalendarDays size={13}/> Added</dt><dd>{added}</dd></div>}
      </dl>
      {p.policies&&<div className="rd-policy-links">{p.policies.map(link=><a key={link.href} href={link.href}>{link.name}<ArrowUpRight size={10}/></a>)}</div>}
      <Link className="pd-more" href={p.id.startsWith('maker:')?`/makers/${p.id.slice(6).split("/")[0]}`:`/products/${p.id}`}>Open full page <ArrowUpRight size={14}/></Link>
      <ProductComments productId={p.id} productName={p.name}/>
    </section>
  </article>;
}
