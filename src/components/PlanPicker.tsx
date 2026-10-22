"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Check,LoaderCircle,Sparkles,Megaphone,Sailboat} from 'lucide-react';
import {YACHTS,YACHT_PRICE} from '@/lib/yachts';

type Plan={id:'spotlight'|'growth'|'yacht';name:string;price:string;blurb:string;features:string[]};
const PLANS:Plan[]=[
  {id:'spotlight',name:'Spotlight',price:'$10',blurb:'Put your product in front of real people discovering what’s next.',features:['Your product in the homepage header for 7 days every month','Promoted spot in Trending','Sponsored badge on your listing','Real visitors, no bots or paid clicks']},
  {id:'yacht',name:'Map yacht',price:YACHT_PRICE,blurb:'Sail your product across the Rivelo world map. Only 5 yachts exist.',features:['Your logo and name on one of 5 yachts on the world map','Every map visitor can click through to your product','Sponsored label, renews monthly, cancel anytime']},
  {id:'growth',name:'Growth',price:'$20',blurb:'Everything in Spotlight, plus an AI growth team on your side.',features:['Everything in Spotlight','AI analysis of your product page and positioning','Agentic AI SEO suggestions you can apply','Reddit communities and threads where your users are','Monthly growth report']},
];
type Me={signedIn:boolean;takenYachts?:number[];email?:string;products?:{id:string;name:string}[];subscriptions?:{id:string;plan_id:string;product_id:string;status:string;cancel_at_period_end:boolean;current_period_end:string|null}[]};
type RazorpayCtor=new(o:Record<string,unknown>)=>{open:()=>void;on:(e:string,cb:(r:{error?:{description?:string}})=>void)=>void};
declare global{interface Window{Razorpay?:RazorpayCtor}}

function loadCheckout(){return new Promise<void>((resolve,reject)=>{if(window.Razorpay)return resolve();const s=document.createElement('script');s.src='https://checkout.razorpay.com/v1/checkout.js';s.async=true;s.onload=()=>resolve();s.onerror=()=>reject(Error('Could not load checkout. Check your connection and try again.'));document.body.appendChild(s);});}

export default function PlanPicker(){
  const [me,setMe]=useState<Me|null>(null),[yacht,setYacht]=useState(0),[product,setProduct]=useState(''),[busy,setBusy]=useState(''),[error,setError]=useState(''),[done,setDone]=useState('');
  async function refresh(){try{const r=await fetch('/api/billing/me',{cache:'no-store'});const d:Me=await r.json();setMe(d);setProduct(p=>p||d.products?.[0]?.id||'');}catch{setMe({signedIn:false});}}
  useEffect(()=>{void refresh();const n=Number(new URLSearchParams(window.location.search).get('yacht'));if(n>=1&&n<=5)setYacht(n);},[]);
  const taken=me?.takenYachts||[];
  async function choose(plan:Plan){
    setError('');setDone('');
    if(!me?.signedIn){window.location.assign('/login?next=/premium');return;}
    if(!product){setError('List or claim a product first, then choose a plan for it.');return;}
    if(plan.id==='yacht'&&(!yacht||taken.includes(yacht))){setError('Choose an available yacht first.');return;}
    setBusy(plan.id);
    try{
      const r=await fetch('/api/billing/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan:plan.id,productId:product,yacht:plan.id==='yacht'?yacht:undefined})});
      const d=await r.json();if(!r.ok)throw Error(d.error);
      await loadCheckout();if(!window.Razorpay)throw Error('Checkout is unavailable.');
      const rz=new window.Razorpay({key:d.keyId,subscription_id:d.subscriptionId,name:'Rivelo Labs',description:`${plan.name} plan · ${plan.price}/month`,prefill:{email:d.email,name:d.name},theme:{color:'#1f2a37'},
        modal:{ondismiss:()=>setBusy('')},
        handler:async(resp:Record<string,string>)=>{
          try{const v=await fetch('/api/billing/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(resp)});const vd=await v.json();if(!v.ok)throw Error(vd.error);setDone(`You’re on ${plan.name}. Your homepage spotlight week has started.`);await refresh();}
          catch(e){setError(e instanceof Error?e.message:'Payment received; we’ll confirm it shortly.');}
          finally{setBusy('');}
        }});
      rz.on('payment.failed',r2=>{setError(r2.error?.description||'Payment failed. You have not been charged.');setBusy('');});
      rz.open();
    }catch(e){setError(e instanceof Error?e.message:'Please try again.');setBusy('');}
  }
  async function cancel(id:string){if(!confirm('Cancel at the end of this billing period?'))return;const r=await fetch('/api/billing/cancel',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});const d=await r.json();if(!r.ok)setError(d.error);else await refresh();}
  const active=(me?.subscriptions||[]).filter(s=>['active','authenticated','pending'].includes(s.status));
  return <section className="rc-plans" aria-labelledby="rc-plans-title">
    <div className="rc-plans-head"><span className="rd-overline">SIMPLE MONTHLY PLANS</span><h2 id="rc-plans-title">Get seen by people who are looking.</h2><p>Billed monthly in USD. Cancel anytime. Paid placements are always labelled Sponsored.</p></div>
    {me?.signedIn&&<div className="rc-plan-product">{me.products?.length?<label>Promote<select value={product} onChange={e=>setProduct(e.target.value)}>{me.products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>:<p>No published products on <b>{me.email}</b> yet. <Link href="/register">List your product</Link> or <Link href="/claim">claim an existing one</Link> first.</p>}</div>}
    <div className="rc-plan-grid">{PLANS.map(plan=><article key={plan.id} className={`rc-plan${plan.id==='growth'?' rc-plan-featured':''}`}>
      <div className="rc-plan-top">{plan.id==='growth'?<Sparkles size={22}/>:plan.id==='yacht'?<Sailboat size={22}/>:<Megaphone size={22}/>}{plan.id==='growth'&&<span className="rc-plan-tag">MOST VALUE</span>}</div>
      <h3>{plan.name}</h3><p className="rc-plan-price"><b>{plan.price}</b> / month</p><p className="rc-plan-blurb">{plan.blurb}</p>
      <ul>{plan.features.map(f=><li key={f}><Check size={15}/>{f}</li>)}</ul>{plan.id==='yacht'&&<label className="rc-yacht-pick">Choose your yacht<select value={yacht} onChange={e=>setYacht(Number(e.target.value))}><option value={0}>Pick a yacht…</option>{YACHTS.map(y=><option key={y.index} value={y.index} disabled={taken.includes(y.index)}>Yacht {y.index} · {y.sea}{taken.includes(y.index)?' (booked)':''}</option>)}</select><a href="/map">See them on the map ↗</a></label>}
      <button type="button" className={`rd-button ${plan.id==='growth'?'rd-primary':'rd-dark'}`} disabled={!!busy||!me} onClick={()=>choose(plan)}>{busy===plan.id?<><LoaderCircle className="rd-spin" size={15}/> Opening checkout…</>:me?.signedIn?<>Choose {plan.name} <ArrowUpRight size={15}/></>:<>Sign in to choose <ArrowUpRight size={15}/></>}</button>
    </article>)}</div>
    {done&&<p className="rc-notice" role="status"><Check size={17}/> {done}</p>}
    {error&&<p className="rd-error" role="alert">{error}</p>}
    {active.length>0&&<div className="rc-plan-current"><h3>Your plans</h3>{active.map(s=><p key={s.id}><b>{s.plan_id==='growth'?'Growth':s.plan_id==='yacht'?'Map yacht':'Spotlight'}</b> · {me?.products?.find(p=>p.id===s.product_id)?.name||s.product_id} · {s.cancel_at_period_end?'ends':'renews'} {s.current_period_end?new Date(s.current_period_end).toLocaleDateString():'soon'} {!s.cancel_at_period_end&&<button type="button" className="rc-text-button" onClick={()=>cancel(s.id)}>Cancel</button>}</p>)}</div>}
    <p className="rd-fine-print">Search rankings, traffic and third-party results are not guaranteed. See our <Link href="/legal/terms">Terms</Link>.</p>
  </section>;
}
