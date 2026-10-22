"use client";
import {useCallback,useEffect,useState} from 'react';
import {ArrowUpRight,Copy,Download,Eye,EyeOff,LoaderCircle,Plus,Send} from 'lucide-react';
type M={id:string;username:string;name:string;bio:string|null;avatar:string|null;followers:number|null;productName:string|null;productUrl:string|null;replyText:string|null;sourceAuthor:string|null;status:'draft'|'published'|'claimed'|'hidden';invitedAt:string|null;createdAt:string;city:string|null};
const SITE='https://rivelolabs.com';
export const inviteText=(m:M)=>`Hey @${m.username}, we built your maker page on Rivelo from what you shared: ${SITE}/makers/${m.username}\n\nClaim it (sign in with X) to go live on the map and edit your details anytime.`;
/** Admin: build maker pages from replies to an X post and invite people to claim them. */
export default function MakersDesk({adminKey,notify}:{adminKey:string;notify:(ok:boolean,msg:string)=>void}){
  const [items,setItems]=useState<M[]|null>(null),[xReady,setXReady]=useState(false),[busy,setBusy]=useState(false),[post,setPost]=useState(''),[filter,setFilter]=useState<'draft'|'published'|'claimed'|'all'>('draft');
  const call=useCallback(async(body?:Record<string,unknown>)=>{const r=await fetch('/api/admin/makers',{method:body?'POST':'GET',headers:{Authorization:`Bearer ${adminKey}`,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store'});const d=await r.json();if(!r.ok)throw Error(d.error);return d;},[adminKey]);
  const load=useCallback(async()=>{try{const d=await call();setItems(d.makers);setXReady(d.xConfigured);if(d.error)notify(false,d.error);}catch(e){notify(false,(e as Error).message);setItems([]);}},[call,notify]);
  useEffect(()=>{const t=setTimeout(()=>{void load();},0);return()=>clearTimeout(t);},[load]);
  async function run(body:Record<string,unknown>,msg:string){setBusy(true);try{const d=await call(body);notify(true,typeof d.found==='number'?`Found ${d.found} people, ${d.created} new pages.`:msg);await load();}catch(e){notify(false,(e as Error).message);}finally{setBusy(false);}}
  const list=(items||[]).filter(m=>filter==='all'?m.status!=='hidden':m.status===filter);
  return <section className="dk-panel">
    <div className="dk-panel-head"><div><h2>X makers</h2><p>Post “drop your startup” on X, then paste the post link. Each reply becomes a draft maker page built from the person’s X profile and the link they dropped. Publish it, then invite them to claim it.</p></div></div>
    <form className="dk-form" onSubmit={e=>{e.preventDefault();void run({action:'import',postUrl:post},'Imported.');}}>
      <h3><Download size={16}/> Import replies from an X post</h3>
      <div className="dk-form-row"><label className="dk-grow">Post link<input value={post} onChange={e=>setPost(e.target.value)} required placeholder="https://x.com/yourname/status/1234567890"/></label></div>
      <div className="dk-actions"><button className="rd-button rd-primary dk-sm" disabled={busy||!xReady}>{busy?<LoaderCircle className="rd-spin" size={15}/>:<Download size={15}/>} Import replies</button><span className="rd-fine-print">{xReady?'Reads replies from the last 7 days via the X API.':'Set X_BEARER_TOKEN (X API Basic plan or higher) to import. Until then, add makers by hand below.'}</span></div>
    </form>
    <form className="dk-form" onSubmit={e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));void run({action:'add',...f},'Maker page added.').then(()=>(e.target as HTMLFormElement).reset());}}>
      <h3><Plus size={16}/> Add a maker by hand</h3>
      <div className="dk-form-row dk-form-row-4"><label>X username<input name="username" required placeholder="@souryaeth"/></label><label>Name<input name="name" placeholder="Souryavardhan Singh"/></label><label className="dk-grow">Link they dropped<input name="productUrl" placeholder="https://…"/></label></div>
      <div className="dk-form-row"><label className="dk-grow">Their reply text<input name="replyText" maxLength={600}/></label><label className="dk-grow">Your post link<input name="sourcePostUrl" placeholder="https://x.com/…/status/…"/></label></div>
      <div className="dk-actions"><button className="rd-button rd-outline dk-sm" disabled={busy}><Plus size={15}/> Add maker</button></div>
    </form>
    <div className="dk-panel-head" style={{marginTop:22}}><div/><div className="dk-chips">{(['draft','published','claimed','all'] as const).map(f=><button key={f} className={filter===f?'dk-chip-on':''} onClick={()=>setFilter(f)}>{f[0].toUpperCase()+f.slice(1)} <span>{(items||[]).filter(m=>f==='all'?m.status!=='hidden':m.status===f).length}</span></button>)}</div></div>
    {items===null?<p className="rd-fine-print">Loading…</p>:list.length?<div className="dk-cards">{list.map(m=><article className="dk-card" key={m.id}>
      <div className="dk-card-head">{m.avatar?/* eslint-disable-next-line @next/next/no-img-element */<img className="dk-thumb" src={m.avatar} alt="" referrerPolicy="no-referrer" style={{borderRadius:'50%'}}/>:<span className="dk-avatar">{m.name.slice(0,1)}</span>}
        <div className="dk-card-title"><h3>{m.name}</h3><p>@{m.username}{m.followers!=null&&<> · {m.followers.toLocaleString()} followers</>}{m.productUrl&&<a href={m.productUrl} target="_blank" rel="noopener noreferrer">{m.productName||m.productUrl} <ArrowUpRight size={12}/></a>}</p></div>
        <span className={`dk-status dk-status-${m.status==='claimed'?'approved':m.status==='published'?'published':'pending'}`}>{m.status}</span></div>
      {m.replyText&&<p className="dk-body">“{m.replyText}”</p>}
      <div className="dk-actions">
        {m.status==='draft'&&<button className="rd-button rd-primary dk-sm" disabled={busy} onClick={()=>run({action:'status',id:m.id,status:'published'},'Page published.')}><Eye size={15}/> Publish page</button>}
        {m.status!=='draft'&&<a className="rd-button rd-outline dk-sm" href={`/makers/${m.username}`} target="_blank" rel="noopener noreferrer">View page <ArrowUpRight size={14}/></a>}
        {m.status==='published'&&<><button className="rd-button rd-outline dk-sm" onClick={async()=>{try{await navigator.clipboard.writeText(inviteText(m));notify(true,'Invite copied. Paste it as a reply on X.');}catch{notify(false,'Copy failed.');}}}><Copy size={14}/> Copy invite</button>
          <a className="rd-button rd-outline dk-sm" href={`https://x.com/intent/post?text=${encodeURIComponent(inviteText(m))}`} target="_blank" rel="noopener noreferrer" onClick={()=>void run({action:'invited',id:m.id},'Marked as invited.')}><Send size={14}/> Post invite on X</a></>}
        {m.status!=='claimed'&&<button className="rd-button rd-outline dk-sm" disabled={busy} onClick={()=>run({action:'status',id:m.id,status:'hidden'},'Page hidden.')}><EyeOff size={14}/> Hide</button>}
        {m.invitedAt&&<span className="rd-fine-print">Invited {new Date(m.invitedAt).toLocaleDateString()}</span>}
      </div>
    </article>)}</div>:<p className="rd-fine-print">Nothing here yet.</p>}
  </section>;
}
