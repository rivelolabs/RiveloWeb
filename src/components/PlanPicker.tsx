"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Check,LoaderCircle,Sparkles,Megaphone,Sailboat} from 'lucide-react';
import {YACHTS} from '@/lib/yachts';

type Plan={id:'spotlight'|'growth'|'yacht';name:string;price:string;per:string;blurb:string;features:string[]};
const PLANS:Plan[]=[
  {id:'spotlight',name:'Spotlight',price:'$15',per:'/ week',blurb:'Put your product in front of real people discovering what’s next.',features:['Your product in the homepage header all week','Promoted spot in Trending','Sponsored badge on your listing','Real visitors, no bots or paid clicks','Renews weekly, cancel anytime']},
  {id:'yacht',name:'Map yacht',price:'$20',per:'/ week',blurb:'Sail your product across the Rivelo world map. Only 5 yachts exist.',features:['Your logo and name on one of 5 premium yachts on the world map','Every map visitor can click through to your product','Sponsored label, renews weekly, cancel anytime']},
  {id:'growth',name:'Growth',price:'$50',per:'/ month',blurb:'Everything in Spotlight, a free yacht, and an AI growth team on your side.',features:['More on-demand SEO checks','Everything in Spotlight (7 days in the homepage header every month)','1 map yacht free all month','AI analysis of your product page and positioning','SEO tracking, monitored for you, with AI suggestions you can apply','Reddit communities and threads where your users are','Monthly growth report']},
];
type Me={signedIn:boolean;takenYachts?:number[];yachts?:{index:number;free:boolean;until:string|null;reserved:boolean}[];spotlight?:{capacity:number;used:number;open:number;nextOpening:string|null}|null;billingReady?:boolean;provider?:'dodo'|'razorpay'|null;testMode?:boolean;email?:string;products?:{id:string;name:string}[];subscriptions?:{id:string;plan_id:string;product_id:string;status:string;cancel_at_period_end:boolean;current_period_end:string|null}[]};
type RazorpayCtor=new(o:Record<string,unknown>)=>{open:()=>void;on:(e:string,cb:(r:{error?:{description?:string}})=>void)=>void};
declare global{interface Window{Razorpay?:RazorpayCtor}}

function loadCheckout(){return new Promise<void>((resolve,reject)=>{if(window.Razorpay)return resolve();const s=document.createElement('script');s.src='https://checkout.razorpay.com/v1/checkout.js';s.async=true;s.onload=()=>resolve();s.onerror=()=>reject(Error('Could not load checkout. Check your connection and try again.'));document.body.appendChild(s);});}

export default function PlanPicker(){
  const [me,setMe]=useState<Me|null>(null),[waitFor,setWaitFor]=useState<Plan|null>(null),[yacht,setYacht]=useState(0),[product,setProduct]=useState(''),[busy,setBusy]=useState(''),[error,setError]=useState(''),[done,setDone]=useState('');
  async function refresh(){try{const r=await fetch('/api/billing/me',{cache:'no-store'});const d:Me=await r.json();setMe(d);setProduct(p=>p||d.products?.[0]?.id||'');}catch{setMe({signedIn:false});}}
  useEffect(()=>{const paid=new URLSearchParams(window.location.search).get('paid');if(paid){setDone('Payment received. Your plan switches on within a minute; this page updates automatically.');let n=0;const t=setInterval(()=>{n++;void refresh();if(n>=12)clearInterval(t);},5000);return()=>clearInterval(t);}},[]);
  useEffect(()=>{void refresh();const n=Number(new URLSearchParams(window.location.search).get('yacht'));if(n>=1&&n<=5)setYacht(n);},[]);
  const taken=me?.takenYachts||[];
  const day=(iso:string|null)=>iso?new Date(iso).toLocaleDateString('en',{weekday:'short',month:'short',day:'numeric'}):'';
  const yachtInfo=(i:number)=>me?.yachts?.find(y=>y.index===i);
  const spot=me?.spotlight||null,spotFull=!!spot&&spot.open<=0;
  const ready=!!me?.billingReady;
  async function choose(plan:Plan){
    setError('');setDone('');
    if(!ready){setWaitFor(plan);return;}
    if(!me?.signedIn){window.location.assign('/login?next=/premium');return;}
    if(!product){setError('List or claim a product first, then choose a plan for it.');return;}
    if((plan.id==='spotlight'||plan.id==='growth')&&spotFull){setError(`All ${spot!.capacity} homepage Spotlight spots are taken. The next one opens ${day(spot!.nextOpening)||'soon'}.`);return;}
    if(plan.id==='yacht'&&(!yacht||taken.includes(yacht))){setError('Choose an available yacht first.');return;}
    if(plan.id==='growth'&&yacht&&taken.includes(yacht)){setError('That yacht is booked. Pick another free one.');return;}
    setBusy(plan.id);
    if(me?.provider==='dodo'){
      try{const r=await fetch('/api/billing/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan:plan.id,productId:product,yacht:plan.id!=='spotlight'&&yacht?yacht:undefined})});const d=await r.json();if(r.status===401){window.location.assign('/login?next=/premium');return;}if(!r.ok)throw Error(d.error);window.location.assign(d.url);}
      catch(e){setError(e instanceof Error?e.message:'Please try again.');setBusy('');}
      return;
    }
    try{
      const r=await fetch('/api/billing/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan:plan.id,productId:product,yacht:plan.id!=='spotlight'&&yacht?yacht:undefined})});
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
  return <section className="rc-plans" aria-labelledby="rc-plans-title">{me?.testMode&&<p className="rc-notice" role="note">Test mode: payments use Dodo test checkout. Use card 4242 4242 4242 4242, any future date and any CVC. No real money is charged.</p>}
    <div className="rc-plans-head"><span className="rd-overline">SIMPLE MONTHLY PLANS</span><h2 id="rc-plans-title">Get seen by people who are looking.</h2><p>Billed in USD. Cancel anytime. Paid placements are always labelled Sponsored.</p>{me&&!ready&&<p className="rc-plans-soon"><span>Coming soon</span> Paid plans open shortly. Join the waitlist and we’ll email you the day they go live. Listing your product is free right now.</p>}</div>
    {me?.signedIn&&<div className="rc-plan-product">{me.products?.length?<label>Promote<select value={product} onChange={e=>setProduct(e.target.value)}>{me.products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>:<p>No published products on <b>{me.email}</b> yet. <Link href="/register">List your product</Link> or <Link href="/claim">claim an existing one</Link> first.</p>}</div>}
    <div className="rc-plan-grid">{PLANS.map(plan=><article key={plan.id} id={`plan-${plan.id}`} className={`rc-plan${plan.id==='growth'?' rc-plan-featured':''}`}>
      <div className="rc-plan-top">{plan.id==='growth'?<Sparkles size={22}/>:plan.id==='yacht'?<Sailboat size={22}/>:<Megaphone size={22}/>}{plan.id==='growth'&&<span className="rc-plan-tag">MOST VALUE</span>}</div>
      <h3>{plan.name}</h3><p className="rc-plan-price"><b>{plan.price}</b> {plan.per}</p><p className="rc-plan-blurb">{plan.blurb}</p>
      <ul>{plan.features.map(f=><li key={f}><Check size={15}/>{f}</li>)}</ul>
      {(plan.id==='spotlight'||plan.id==='growth')&&spot&&<p className={`rc-avail${spotFull?' rc-avail-full':''}`}><span/>{spotFull?<>Homepage fully booked · next spot opens <b>{day(spot.nextOpening)}</b></>:<><b>{spot.open} of {spot.capacity}</b> homepage spots open now</>}</p>}
      {plan.id==='yacht'&&me?.yachts&&<p className={`rc-avail${me.yachts.every(y=>!y.free)?' rc-avail-full':''}`}><span/>{me.yachts.every(y=>!y.free)?<>All 5 yachts booked · next free <b>{day(me.yachts.map(y=>y.until||'').sort()[0]||null)}</b></>:<><b>{me.yachts.filter(y=>y.free).length} of 5</b> yachts available now</>}</p>}
      {plan.id==='spotlight'&&<ol className="rc-steps"><li>Pick the product to promote</li><li>Pay securely with Dodo Payments</li><li>Goes live on the homepage within minutes, for 7 days</li></ol>}{plan.id!=='spotlight'&&<label className="rc-yacht-pick">{plan.id==='growth'?'Choose your free yacht':'Choose your yacht'}<select value={yacht} onChange={e=>setYacht(Number(e.target.value))}><option value={0}>Pick a yacht…</option>{YACHTS.map(y=><option key={y.index} value={y.index} disabled={taken.includes(y.index)}>Yacht {y.index} · {y.sea} — {!taken.includes(y.index)?'available now':yachtInfo(y.index)?.reserved?'being booked right now':`booked until ${day(yachtInfo(y.index)?.until||null)||'later'}`}</option>)}</select><a href="/map">See them on the map ↗</a></label>}
      <button type="button" className={`rd-button ${plan.id==='growth'?'rd-primary':'rd-dark'}`} disabled={!!busy||!me} onClick={()=>choose(plan)}>{busy===plan.id?<><LoaderCircle className="rd-spin" size={15}/> Opening checkout…</>:!ready&&me?<>Join the waitlist <ArrowUpRight size={15}/></>:me?.signedIn?<>Choose {plan.name} <ArrowUpRight size={15}/></>:<>Sign in to choose <ArrowUpRight size={15}/></>}</button>
    </article>)}</div>
    {waitFor&&<Waitlist plan={waitFor} email={me?.email||''} yacht={waitFor.id!=='spotlight'?yacht:0} onClose={()=>setWaitFor(null)} onDone={msg=>{setWaitFor(null);setDone(msg);}}/>}
    {done&&<p className="rc-notice" role="status"><Check size={17}/> {done}</p>}
    {error&&<p className="rd-error" role="alert">{error}</p>}
    {active.length>0&&<div className="rc-plan-current"><h3>Your plans</h3>{active.map(s=><p key={s.id}><b>{s.plan_id==='growth'?'Growth':s.plan_id==='yacht'?'Map yacht':'Spotlight'}</b> · {me?.products?.find(p=>p.id===s.product_id)?.name||s.product_id} · {s.cancel_at_period_end?'ends':'renews'} {s.current_period_end?new Date(s.current_period_end).toLocaleDateString():'soon'} {!s.cancel_at_period_end&&<button type="button" className="rc-text-button" onClick={()=>cancel(s.id)}>Cancel</button>}</p>)}</div>}
    <p className="rd-fine-print">Search rankings, traffic and third-party results are not guaranteed. Payments are processed securely by Dodo Payments. Cancel anytime. See our <Link href="/legal/terms">Terms</Link> and <Link href="/legal/refunds">Refund Policy</Link>.</p>
  </section>;
}

/** While payments are off, plan buttons collect a waitlist email (stored as a premium enquiry in the Discovery desk). */
function Waitlist({plan,email:initial,yacht,onClose,onDone}:{plan:Plan;email:string;yacht:number;onClose:()=>void;onDone:(m:string)=>void}){
  const [email,setEmail]=useState(initial),[site,setSite]=useState(''),[busy,setBusy]=useState(false),[err,setErr]=useState('');
  async function send(e:React.FormEvent){e.preventDefault();setBusy(true);setErr('');
    try{const r=await fetch('/api/catalog/growth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,website:'',message:`Waitlist: ${plan.name} plan (${plan.price} ${plan.per})${yacht?` · yacht ${yacht}`:''}${site?` · product: ${site}`:''}`})});const d=await r.json();if(!r.ok)throw Error(d.error);onDone(`You’re on the ${plan.name} waitlist. We’ll email ${email} when plans open.`);}
    catch(x){setErr(x instanceof Error?x.message:'Please try again.');}finally{setBusy(false);}}
  return <form className="rc-waitlist" onSubmit={send}>
    <div><b>Join the {plan.name} waitlist</b><span>{plan.price} {plan.per} when plans open. No payment now.</span></div>
    <label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@your-product.com"/></label>
    <label>Your product link <small>(optional)</small><input type="url" value={site} onChange={e=>setSite(e.target.value)} placeholder="https://"/></label>
    {err&&<p className="rd-error" role="alert">{err}</p>}
    <div className="rc-waitlist-actions"><button type="button" className="rd-button rd-outline" onClick={onClose}>Cancel</button><button className="rd-button rd-primary" disabled={busy}>{busy?<LoaderCircle className="rd-spin" size={15}/>:<Check size={15}/>} Notify me</button></div>
  </form>;
}
