"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,LoaderCircle} from 'lucide-react';
type Sub={id:string;plan_id:string;product_id:string;status:string;cancel_at_period_end:boolean;current_period_end:string|null};
type Me={signedIn:boolean;products?:{id:string;name:string}[];subscriptions?:Sub[]};
const PLAN:Record<string,string>={growth:'Growth',yacht:'Map yacht',spotlight:'Spotlight'};
/** Account page: the signed-in user's paid plans, with cancel. */
export default function MyPlans(){
  const [me,setMe]=useState<Me|null>(null),[busy,setBusy]=useState(''),[error,setError]=useState('');
  async function refresh(){try{const r=await fetch('/api/billing/me',{cache:'no-store'});setMe(await r.json());}catch{setMe({signedIn:false});}}
  useEffect(()=>{void refresh();},[]);
  async function cancel(id:string){if(!confirm('Cancel at the end of this billing period? Your placement stays live until then.'))return;setBusy(id);setError('');
    try{const r=await fetch('/api/billing/cancel',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});const d=await r.json();if(!r.ok)throw Error(d.error);await refresh();}
    catch(e){setError(e instanceof Error?e.message:'Could not cancel.');}finally{setBusy('');}}
  if(!me?.signedIn)return null;
  const active=(me.subscriptions||[]).filter(s=>['active','authenticated','pending'].includes(s.status));
  const name=(id:string)=>{const n=me.products?.find(p=>p.id===id)?.name;return n||(id.startsWith('maker:')?`@${id.slice(6).split('/')[0]}`:id);};
  const day=(d:string|null)=>d?new Date(d).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}):'soon';
  return <section className="rc-form ra-plans"><div className="ra-plans-head"><h2>Your plans</h2><Link href="/premium">See plans <ArrowUpRight size={15}/></Link></div>
    {active.length?<ul>{active.map(s=><li key={s.id}>
      <div><b>{PLAN[s.plan_id]||s.plan_id}</b><span>{name(s.product_id)}</span></div>
      <small>{s.cancel_at_period_end?`Ends ${day(s.current_period_end)}`:`Renews ${day(s.current_period_end)}`}</small>
      {!s.cancel_at_period_end&&<button type="button" className="rd-button rd-outline dk-sm" disabled={!!busy} onClick={()=>cancel(s.id)}>{busy===s.id?<LoaderCircle className="rd-spin" size={14}/>:null}Cancel</button>}
    </li>)}</ul>:<p className="rd-fine-print">No paid plans yet. Spotlight pins your product at the top of Trending this week.</p>}
    {error&&<p className="rd-error" role="alert">{error}</p>}
  </section>;
}
