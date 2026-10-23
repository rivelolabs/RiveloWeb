"use client";
import {useEffect,useState} from 'react';
import dynamic from 'next/dynamic';
import {Check,LoaderCircle,Pencil,Plus,Trash2,X} from 'lucide-react';
import LocationSearch from './LocationSearch';
const BusinessMap=dynamic(()=>import('./BusinessMap'),{ssr:false});
type Extra={id?:string;name:string;url:string;logo:string;description:string};
type Fields={name:string;bio:string;productName:string;productUrl:string;productDescription:string;city:string;lat:number|null;lng:number|null;logo:string};
/** Claim button (mode=claim) or the owner's edit panel (mode=edit, only rendered for the owner). */
export default function MakerOwner({username,mode,label,initial,extras:startExtras=[]}:{username:string;mode:'claim'|'edit';label?:string;initial?:Fields;extras?:Extra[]}){
  const [extras,setExtras]=useState<Extra[]>(startExtras);
  const setExtra=(i:number,patch:Partial<Extra>)=>setExtras(list=>list.map((e,j)=>j===i?{...e,...patch}:e));
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[owner,setOwner]=useState(false),[open,setOpen]=useState(false),[f,setF]=useState<Fields|undefined>(initial),[saved,setSaved]=useState(false),[focus,setFocus]=useState<{lat:number;lng:number;zoom:number;key:number}>();
  useEffect(()=>{if(mode!=='edit')return;fetch(`/api/makers/me?username=${encodeURIComponent(username)}`,{cache:'no-store'}).then(r=>r.json()).then(d=>{setOwner(!!d.owner);
    // Right after claiming (or while not on the map yet), open the editor so the maker can add a location.
    if(d.owner&&(new URLSearchParams(window.location.search).has('setup')||initial?.lat==null))setOpen(true);}).catch(()=>{});},[mode,username,initial?.lat]);
  async function claim(e?:React.FormEvent){e?.preventDefault();setBusy(true);setError('');
    try{const r=await fetch('/api/makers/claim',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username})});const d=await r.json();
      if(r.status===401||(d.signIn&&r.status===403)){window.location.assign(`/login?next=${encodeURIComponent(`/makers/${username}`)}`);return;}
      if(!r.ok)throw Error(d.error);window.location.assign(`/makers/${username}?setup=1#edit`);}
    catch(e){setError(e instanceof Error?e.message:'Could not claim.');setBusy(false);}}
  async function save(e:React.FormEvent){e.preventDefault();if(!f)return;setBusy(true);setError('');
    try{const r=await fetch('/api/makers/me',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,...f,extras})});const d=await r.json();if(!r.ok)throw Error(d.error);setSaved(true);setTimeout(()=>window.location.reload(),600);}
    catch(err){setError(err instanceof Error?err.message:'Could not save.');}finally{setBusy(false);}}
  async function remove(){if(!confirm('Remove your page from Rivelo? It will disappear from the map.'))return;await fetch('/api/makers/me',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,remove:true})});window.location.assign('/map');}
  if(mode==='claim')return <form className="mk-claim" onSubmit={claim}><button type="submit" className="rd-button mk-claim-btn" disabled={busy}>{busy?<LoaderCircle className="rd-spin" size={16}/>:null}{label||'Claim your page'}</button><small>Sign in with X as @{username}</small>{error&&<p className="rd-error" role="alert">{error}</p>}</form>;
  if(!owner||!f)return null;
  return <section className="mk-card mk-owner" id="edit">
    <div className="mk-owner-head"><div><h2>Your page</h2>{f.lat==null||f.lng==null?<p className="rd-error" role="status">You’re not on the map yet. Search your city (or tap the map) and save — your pin shows your product name and X photo.</p>:<p className="mk-muted">Edit your details, location, product link and description anytime.</p>}</div>{!open&&<button className="rd-button rd-primary" onClick={()=>setOpen(true)}><Pencil size={15}/> Edit page</button>}</div>
    {open&&<form onSubmit={save} className="mk-form">
      {!initial?.productUrl&&<label className="mk-url-box"><span>Your app or website <b>*</b></span><input type="url" required autoFocus value={f.productUrl} onChange={e=>setF({...f,productUrl:e.target.value})} maxLength={500} placeholder="https://your-product.com"/></label>}
      <div className="rd-form-row"><label>Name<input value={f.name} onChange={e=>setF({...f,name:e.target.value})} maxLength={120} required/></label><label>Product name<input value={f.productName} onChange={e=>setF({...f,productName:e.target.value})} maxLength={120}/></label></div>
      <label>Bio<textarea value={f.bio} onChange={e=>setF({...f,bio:e.target.value})} maxLength={400} rows={2}/></label>
      <label>Logo image link <small>(optional — shown on the map instead of your X photo)</small><input type="url" value={f.logo} onChange={e=>setF({...f,logo:e.target.value})} maxLength={500} placeholder="https://your-product.com/logo.png"/></label>
      {initial?.productUrl&&<label>App or website link<input type="url" required value={f.productUrl} onChange={e=>setF({...f,productUrl:e.target.value})} maxLength={500}/></label>}
      <label>What are you building?<textarea value={f.productDescription} onChange={e=>setF({...f,productDescription:e.target.value})} maxLength={1500} rows={4}/></label>
      <div className="mk-extras"><span className="mk-label">MORE PRODUCTS</span>
        {extras.map((e,i)=><div key={e.id||`new-${i}`} className="mk-extra">
          <div className="mk-extra-head"><span>Product {i+2}</span><button type="button" className="rc-text-button" aria-label={`Remove product ${i+2}`} onClick={()=>setExtras(list=>list.filter((_,j)=>j!==i))}><X size={15}/> Remove</button></div>
          <div className="rd-form-row"><label>Product name<input required value={e.name} onChange={ev=>setExtra(i,{name:ev.target.value})} maxLength={120}/></label><label>App or website link<input type="url" required value={e.url} onChange={ev=>setExtra(i,{url:ev.target.value})} maxLength={500} placeholder="https://"/></label></div>
          <label>Logo image link <small>(optional)</small><input type="url" value={e.logo} onChange={ev=>setExtra(i,{logo:ev.target.value})} maxLength={500} placeholder="https://your-product.com/logo.png"/></label>
          <label>What is it?<textarea value={e.description} onChange={ev=>setExtra(i,{description:ev.target.value})} maxLength={1500} rows={3}/></label>
        </div>)}
        {extras.length<5&&<button type="button" className="rd-button rd-outline mk-add-product" onClick={()=>setExtras(list=>[...list,{name:'',url:'',logo:'',description:''}])}><Plus size={15}/> Add another product</button>}
      </div>
      <LocationSearch value={f.city} onChange={v=>setF({...f,city:v})} onPlace={p=>{setF(x=>x&&({...x,lat:p.lat,lng:p.lng}));setFocus({lat:p.lat,lng:p.lng,zoom:p.zoom,key:Date.now()});}}/>
      <div className="rc-picker mk-picker"><BusinessMap pick={f.lat!=null&&f.lng!=null?{lat:f.lat,lng:f.lng}:undefined} onPick={p=>setF({...f,lat:p.lat,lng:p.lng})} focus={focus}/></div>
      {error&&<p className="rd-error" role="alert">{error}</p>}
      <div className="mk-actions"><button type="button" className="rd-button rd-outline" onClick={remove}><Trash2 size={15}/> Remove my page</button><span style={{flex:1}}/><button type="button" className="rd-button rd-outline" onClick={()=>setOpen(false)}>Cancel</button><button className="rd-button rd-primary" disabled={busy}>{busy?<LoaderCircle className="rd-spin" size={15}/>:<Check size={15}/>} {saved?'Saved':'Save'}</button></div>
    </form>}
  </section>;
}
