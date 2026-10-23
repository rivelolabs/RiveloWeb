"use client";
import {useCallback,useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {Bell,ChevronUp,MessageCircle,MessagesSquare} from 'lucide-react';
type Notice={id:string;kind:'upvote'|'comment'|'reply';actorName:string;actorAvatar:string|null;title:string;body:string|null;href:string;read:boolean;createdAt:string};
const ago=(iso:string)=>{const s=(Date.now()-Date.parse(iso))/1000;return s<60?'just now':s<3600?`${Math.floor(s/60)}m`:s<86400?`${Math.floor(s/3600)}h`:s<604800?`${Math.floor(s/86400)}d`:new Date(iso).toLocaleDateString(undefined,{month:'short',day:'numeric'});};
const ICON={upvote:ChevronUp,comment:MessageCircle,reply:MessagesSquare};
const verb=(n:Notice)=>n.kind==='upvote'?<>upvoted <b>{n.title}</b></>:n.kind==='comment'?<>commented on <b>{n.title}</b></>:<>replied to <b>{n.title}</b></>;
/** Bell in the top bar: upvotes and comments on your products, replies to your posts. */
export default function NotificationBell(){
  const [data,setData]=useState<{signedIn:boolean;items:Notice[];unread:number}|null>(null),[open,setOpen]=useState(false);const box=useRef<HTMLDivElement>(null);
  const load=useCallback(()=>{fetch('/api/notifications',{cache:'no-store'}).then(r=>r.json()).then(setData).catch(()=>{});},[]);
  useEffect(()=>{load();const t=setInterval(load,60000);const f=()=>{if(document.visibilityState==='visible')load();};document.addEventListener('visibilitychange',f);return()=>{clearInterval(t);document.removeEventListener('visibilitychange',f);};},[load]);
  useEffect(()=>{if(!open)return;const close=(e:MouseEvent|KeyboardEvent)=>{if(e instanceof KeyboardEvent?e.key==='Escape':!box.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('mousedown',close);document.addEventListener('keydown',close);return()=>{document.removeEventListener('mousedown',close);document.removeEventListener('keydown',close);};},[open]);
  if(!data?.signedIn)return null;
  function toggle(){const next=!open;setOpen(next);if(next&&data!.unread>0){fetch('/api/notifications',{method:'POST'}).catch(()=>{});setTimeout(()=>setData(d=>d&&{...d,unread:0,items:d.items.map(i=>({...i,read:true}))}),1500);}}
  return <div className="nb" ref={box}>
    <button type="button" className="nb-btn" aria-label={`Notifications${data.unread?` (${data.unread} new)`:''}`} aria-expanded={open} onClick={toggle}><Bell size={18}/>{data.unread>0&&<span className="nb-dot">{data.unread>9?'9+':data.unread}</span>}</button>
    {open&&<div className="nb-panel" role="dialog" aria-label="Notifications"><div className="nb-head"><b>Notifications</b>{data.items.length>0&&<small>Last 30</small>}</div>
      {data.items.length?<ul>{data.items.map(n=>{const I=ICON[n.kind];return <li key={n.id} className={n.read?'':'nb-new'}><Link href={n.href} onClick={()=>setOpen(false)}>
        <span className="nb-face">{n.actorAvatar?/* eslint-disable-next-line @next/next/no-img-element */<img src={n.actorAvatar} alt="" width={36} height={36} referrerPolicy="no-referrer"/>:<span>{n.actorName.slice(0,1).toUpperCase()}</span>}<i className={`nb-kind nb-${n.kind}`}><I size={11}/></i></span>
        <span className="nb-text"><span><b>{n.actorName}</b> {verb(n)}</span>{n.body&&<q>{n.body}</q>}<small>{ago(n.createdAt)}</small></span></Link></li>;})}</ul>
      :<p className="nb-empty">Nothing yet. You’ll see it here when someone upvotes or comments on your products, or replies to your posts.</p>}
    </div>}
  </div>;
}
