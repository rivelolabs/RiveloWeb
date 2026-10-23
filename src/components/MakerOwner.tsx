"use client";
import {useEffect,useState} from 'react';
import dynamic from 'next/dynamic';
import {Check,LoaderCircle,Pencil,Trash2} from 'lucide-react';
import LocationSearch from './LocationSearch';
const BusinessMap=dynamic(()=>import('./BusinessMap'),{ssr:false});
type Fields={name:string;bio:string;productName:string;productUrl:string;productDescription:string;city:string;lat:number|null;lng:number|null;logo:string};
/** Claim button (mode=claim) or the owner's edit panel (mode=edit, only rendered for the owner). */
export default function MakerOwner({username,mode,label,initial}:{username:string;mode:'claim'|'edit';label?:string;initial?:Fields}){
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[owner,setOwner]=useState(false),[open,setOpen]=useState(false),[f,setF]=useState<Fields|undefined>(initial),[saved,setSaved]=useState(false),[focus,setFocus]=useState<{lat:number;lng:number;zoom:number;key:number}>();
  useEffect(()=>{if(mode!=='edit')return;fetch(`/api/makers/me?username=${encodeURIComponent(username)}`,{cache:'no-store'}).then(r=>r.json()).then(d=>{setOwner(!!d.owner);
    // Right after claiming (or while not on the map yet), open the editor so the maker can add a location.
    if(d.owner&&(new URLSearchParams(window.location.search).has('setup')||initial?.lat==null))setOpen(true);}).catch(()=>{});},[mode,username,initial?.lat]);
  async function claim(){setBusy(true);setError('');
    try{const r=await fetch('/api/makers/claim',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username})});const d=await r.json();
      if(r.status===401||(d.signIn&&r.status===403)){window.location.assign(`/login?next=${encodeURIComponent(`/makers/${username}`)}`);return;}
      if(!r.ok)throw Error(d.error);window.location.assign(`/makers/${username}?setup=1#edit`);}
    catch(e){setError(e instanceof Error?e.message:'Could not claim.');setBusy(false);}}
  async function save(e:React.FormEvent){e.preventDefault();if(!f)return;setBusy(true);setError('');
    try{const r=await fetch('/api/makers/me',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,...f})});const d=await r.json();if(!r.ok)throw Error(d.error);setSaved(true);setTimeout(()=>window.location.reload(),600);}
    catch(err){setError(err instanceof Error?err.message:'Could not save.');}finally{setBusy(false);}}
  async function remove(){if(!confirm('Remove your page from Rivelo? It will disappear from the map.'))return;await fetch('/api/makers/me',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,remove:true})});window.location.assign('/map');}
  if(mode==='claim')return <div className="mk-claim"><button type="button" className="rd-button mk-claim-btn" disabled={busy} onClick={claim}>{busy?<LoaderCircle className="rd-spin" size={16}/>:null}{label||'Claim your page'}</button><small>Sign in with X as @{username}</small>{error&&<p className="rd-error" role="alert">{error}</p>}</div>;
  if(!owner||!f)return null;
  return <section className="mk-card mk-owner" id="edit">
    <div className="mk-owner-head"><div><h2>Your page</h2>{f.lat==null||f.lng==null?<p className="rd-error" role="status">You’re not on the map yet. Search your city (or tap the map) and save — your pin shows your product name and X photo.</p>:<p className="mk-muted">Edit your details, location, product link and description anytime.</p>}</div>{!open&&<button className="rd-button rd-primary" onClick={()=>setOpen(true)}><Pencil size={15}/> Edit page</button>}</div>
    {open&&<form onSubmit={save} className="mk-form">
      <div className="rd-form-row"><label>Name<input value={f.name} onChange={e=>setF({...f,name:e.target.value})} maxLength={120} required/></label><label>Product name<input value={f.productName} onChange={e=>setF({...f,productName:e.target.value})} maxLength={120}/></label></div>
      <label>Bio<textarea value={f.bio} onChange={e=>setF({...f,bio:e.target.value})} maxLength={400} rows={2}/></label>
      <label>Logo image link <small>(optional — shown on the map instead of your X photo)</small><input type="url" value={f.logo} onChange={e=>setF({...f,logo:e.target.value})} maxLength={500} placeholder="https://your-product.com/logo.png"/></label>
      <label>Product link<input type="url" value={f.productUrl} onChange={e=>setF({...f,productUrl:e.target.value})} maxLength={500} placeholder="https://your-product.com"/></label>
      <label>What are you building?<textarea value={f.productDescription} onChange={e=>setF({...f,productDescription:e.target.value})} maxLength={1500} rows={4}/></label>
      <LocationSearch value={f.city} onChange={v=>setF({...f,city:v})} onPlace={p=>{setF(x=>x&&({...x,lat:p.lat,lng:p.lng}));setFocus({lat:p.lat,lng:p.lng,zoom:p.zoom,key:Date.now()});}}/>
      <div className="rc-picker mk-picker"><BusinessMap pick={f.lat!=null&&f.lng!=null?{lat:f.lat,lng:f.lng}:undefined} onPick={p=>setF({...f,lat:p.lat,lng:p.lng})} focus={focus}/></div>
      {error&&<p className="rd-error" role="alert">{error}</p>}
      <div className="mk-actions"><button type="button" className="rd-button rd-outline" onClick={remove}><Trash2 size={15}/> Remove my page</button><span style={{flex:1}}/><button type="button" className="rd-button rd-outline" onClick={()=>setOpen(false)}>Cancel</button><button className="rd-button rd-primary" disabled={busy}>{busy?<LoaderCircle className="rd-spin" size={15}/>:<Check size={15}/>} {saved?'Saved':'Save'}</button></div>
    </form>}
  </section>;
}
