"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Check,LoaderCircle,MapPin,Pencil,Plus,X} from 'lucide-react';
import {genres} from '@/lib/directory';
import MediaInputs from './MediaInputs';
type M={username:string;name:string;product:string;image:string;city:string;onMap:boolean};
type L={id:string;name:string;description:string;genre:string;status:string;url:string;logoUrl:string;bannerUrl:string;fallbackImage:string;city:string;pinStatus:string|null;submittedAt:string;updatedAt:string|null};
const STATUS:Record<string,string>={pending:'In review · usually 1–2 days',published:'Live',rejected:'Not approved'};
export default function MyListings(){
  const [items,setItems]=useState<L[]|null>(null),[makers,setMakers]=useState<M[]>([]),[edit,setEdit]=useState<L|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[saved,setSaved]=useState('');
  useEffect(()=>{fetch('/api/account/listings',{cache:'no-store'}).then(r=>r.json()).then(d=>{setItems(d.listings||[]);setMakers(Array.isArray(d.makers)?d.makers:[]);}).catch(()=>setItems([]));},[]);
  async function save(e:React.FormEvent){e.preventDefault();if(!edit)return;setBusy(true);setError('');
    try{const r=await fetch('/api/account/listings',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(edit)});const d=await r.json();if(!r.ok)throw Error(d.error);setItems(list=>(list||[]).map(x=>x.id===d.listing.id?d.listing:x));setEdit(null);setSaved(d.listing.name);setTimeout(()=>setSaved(''),3000);}
    catch(err){setError(err instanceof Error?err.message:'Could not save.');}finally{setBusy(false);}}
  return <section className="rc-form ra-mylistings" aria-labelledby="my-listings-title">
    <div className="ra-mylistings-head"><div><span className="ra-eyebrow">YOUR PRODUCTS</span><h2 id="my-listings-title">My listings</h2></div><Link className="rd-button rd-outline" href="/register"><Plus size={15}/> List a product</Link></div>
    {saved&&<p className="rc-notice" role="status"><Check size={16}/> {saved} saved.</p>}
    {makers.length>0&&<ul className="ra-listing-list">{makers.map(m=><li key={m.username}><div className="ra-listing"><span className="ra-listing-logo">{m.image?/* eslint-disable-next-line @next/next/no-img-element */<img src={m.image} alt="" referrerPolicy="no-referrer"/>:m.name.slice(0,1).toUpperCase()}</span><div className="ra-listing-main"><div className="ra-listing-title"><b>{m.product}</b><span className={`ra-listing-status ${m.onMap?'ra-status-published':'ra-status-pending'}`}>{m.onMap?'On the map':'Add a location to appear on the map'}</span></div><p>Your maker page · @{m.username}</p>{m.city&&<small><MapPin size={12}/> {m.city}</small>}</div><div className="ra-listing-actions"><Link className="rd-button rd-outline" href={`/makers/${m.username}`}>View <ArrowUpRight size={14}/></Link><Link className="rd-button rd-primary" href={`/makers/${m.username}?setup=1#edit`}><Pencil size={14}/> Edit</Link></div></div></li>)}</ul>}
    {items===null?<p className="rd-fine-print">Loading your listings…</p>:items.length===0?makers.length?null:<p className="rd-fine-print">Nothing yet. Products you list or claim with this email will show up here.</p>:
    <ul className="ra-listing-list">{items.map(l=><li key={l.id}>
      {edit?.id===l.id?<form className="ra-listing-edit" onSubmit={save}>
        <div className="rd-form-row"><label>Product name<input value={edit.name} onChange={e=>setEdit({...edit,name:e.target.value})} required minLength={2} maxLength={120}/></label><label>Category<select value={edit.genre} onChange={e=>setEdit({...edit,genre:e.target.value})}>{genres.map(g=><option key={g}>{g}</option>)}</select></label></div>
        <label>Description<textarea value={edit.description} onChange={e=>setEdit({...edit,description:e.target.value})} required minLength={80} maxLength={1500} rows={5}/><small>{edit.description.trim().length}/80 characters minimum</small></label>
        <MediaInputs name={edit.name} logoUrl={edit.logoUrl} bannerUrl={edit.bannerUrl} onLogo={v=>setEdit({...edit,logoUrl:v})} onBanner={v=>setEdit({...edit,bannerUrl:v})}/>
        {error&&<p className="rd-error" role="alert">{error}</p>}
        <div className="ra-listing-actions"><button type="button" className="rd-button rd-outline" onClick={()=>{setEdit(null);setError('');}}><X size={15}/> Cancel</button><button className="rd-button rd-primary" disabled={busy}>{busy?<LoaderCircle className="rd-spin" size={15}/>:<Check size={15}/>} Save changes</button></div>
      </form>:<div className="ra-listing">
        <span className="ra-listing-logo">{l.logoUrl||l.fallbackImage?/* eslint-disable-next-line @next/next/no-img-element */<img src={l.logoUrl||l.fallbackImage} alt="" referrerPolicy="no-referrer"/>:l.name.slice(0,1).toUpperCase()}</span>
        <div className="ra-listing-main"><div className="ra-listing-title"><b>{l.name}</b><span className={`ra-listing-status ra-status-${l.status}`}>{STATUS[l.status]||l.status}</span></div><p>{l.description}</p><small>{l.genre}{l.city&&<> · <MapPin size={12}/> {l.city}</>}{l.updatedAt&&<> · edited {new Date(l.updatedAt).toLocaleDateString()}</>}</small></div>
        <div className="ra-listing-actions">{l.status==='published'&&<Link className="rd-button rd-outline" href={`/products/${l.id}`}>View <ArrowUpRight size={14}/></Link>}<button type="button" className="rd-button rd-primary" onClick={()=>{setEdit(l);setError('');}}><Pencil size={14}/> Edit</button></div>
      </div>}
    </li>)}</ul>}
  </section>;
}
