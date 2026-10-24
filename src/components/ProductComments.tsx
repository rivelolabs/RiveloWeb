"use client";
import {useEffect,useState} from 'react';
import {ArrowUpRight,LoaderCircle,MessageCircle,Trash2} from 'lucide-react';
type C={id:string;author:string;avatar:string|null;body:string;createdAt:string;mine?:boolean;pending?:boolean};
const ago=(iso:string)=>{const s=(Date.now()-Date.parse(iso))/1000;if(s<60)return 'just now';if(s<3600)return `${Math.floor(s/60)}m ago`;if(s<86400)return `${Math.floor(s/3600)}h ago`;if(s<2592000)return `${Math.floor(s/86400)}d ago`;return new Date(iso).toLocaleDateString();};
export default function ProductComments({productId,productName}:{productId:string;productName:string}){
  const [items,setItems]=useState<C[]|null>(null),[signedIn,setSignedIn]=useState(false),[text,setText]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
  useEffect(()=>{let live=true;setItems(null);fetch(`/api/comments?productId=${encodeURIComponent(productId)}`,{cache:'no-store'}).then(r=>r.json()).then(d=>{if(live){setItems(d.comments||[]);setSignedIn(!!d.signedIn);if(d.error)setError(d.error);}}).catch(()=>live&&setItems([]));return()=>{live=false;};},[productId]);
  async function post(e:React.FormEvent){e.preventDefault();const body=text.trim();if(body.length<2||busy)return;setBusy(true);setError('');
    // Show the comment straight away; swap in the saved one when the server answers, or take it back if it fails.
    const mineBefore=(items||[]).find(c=>c.mine&&!c.pending);const temp:C={id:`pending-${Date.now()}`,author:mineBefore?.author||'You',avatar:mineBefore?.avatar||null,body,createdAt:new Date().toISOString(),mine:true,pending:true};
    setItems(c=>[temp,...(c||[])]);setText('');
    try{const r=await fetch('/api/comments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId,body})});const d=await r.json();if(r.status===401){setSignedIn(false);throw Error('Sign in to comment.');}if(!r.ok)throw Error(d.error);setItems(c=>(c||[]).map(x=>x.id===temp.id?d.comment:x));}
    catch(err){setItems(c=>(c||[]).filter(x=>x.id!==temp.id));setText(t=>t||body);setError(err instanceof Error?err.message:'Please try again.');}finally{setBusy(false);}}
  async function remove(id:string){const r=await fetch('/api/comments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({delete:id})});if(r.ok)setItems(c=>(c||[]).filter(x=>x.id!==id));}
  const next=typeof window!=='undefined'?window.location.pathname:'/';
  return <section className="rd-comments" aria-label={`Comments on ${productName}`}>
    <h3><MessageCircle size={17}/> Comments {items?.length?<span>{items.length}</span>:null}</h3>
    {signedIn?<form onSubmit={post} className="rd-comment-form">
      <textarea value={text} onChange={e=>setText(e.target.value)} maxLength={1000} rows={2} placeholder={`What do you think of ${productName}?`} aria-label="Write a comment"/>
      <button className="rd-button rd-primary" disabled={busy||text.trim().length<2}>{busy?<LoaderCircle className="rd-spin" size={15}/>:'Post'}</button>
    </form>:<a className="rd-comment-signin" href={`/login?next=${encodeURIComponent(next)}`}>Sign in to join the conversation <ArrowUpRight size={14}/></a>}
    {error&&<p className="rd-error" role="alert">{error}</p>}
    {items===null?<p className="rd-fine-print">Loading comments…</p>:items.length?<ul className="rd-comment-list">{items.map(c=><li key={c.id} style={c.pending?{opacity:.6}:undefined}>
      {c.avatar?/* eslint-disable-next-line @next/next/no-img-element */<img src={c.avatar} alt="" width={32} height={32} referrerPolicy="no-referrer"/>:<span className="rd-comment-avatar">{c.author.slice(0,1).toUpperCase()}</span>}
      <div><p className="rd-comment-meta"><b>{c.author}</b><time dateTime={c.createdAt}>{c.pending?'posting…':ago(c.createdAt)}</time>{c.mine&&!c.pending&&<button type="button" aria-label="Delete your comment" onClick={()=>remove(c.id)}><Trash2 size={13}/></button>}</p><p className="rd-comment-body">{c.body}</p></div>
    </li>)}</ul>:<p className="rd-fine-print">No comments yet. Be the first to share what you think.</p>}
  </section>;
}
