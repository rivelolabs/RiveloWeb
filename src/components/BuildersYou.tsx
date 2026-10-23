"use client";
import type {UserResponse} from '@supabase/supabase-js';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ArrowRight,LoaderCircle,Plus} from 'lucide-react';
import {profileDetails} from '@/lib/auth/profile';
import {browserAuth} from '@/lib/auth/browser';
type P=ReturnType<typeof profileDetails>;
/** The personal card above the leaderboard: sign in, add yourself, or see your own rank. */
export default function BuildersYou({ranks}:{ranks:Record<string,{rank:number;points:number}>}){
  const router=useRouter();
  const [p,setP]=useState<P|undefined>(undefined),[busy,setBusy]=useState(false),[error,setError]=useState('');
  useEffect(()=>{const auth=browserAuth();if(!auth){setP(null);return;}auth.auth.getUser().then(({data}:UserResponse)=>setP(profileDetails(data.user))).catch(()=>setP(null));},[]);
  async function join(){setBusy(true);setError('');try{const r=await fetch('/api/makers/join',{method:'POST'});const d=await r.json();if(!r.ok)throw Error(d.error);router.push(`/makers/${d.username}`);}catch(e){setError(e instanceof Error?e.message:'Could not add you.');setBusy(false);}}
  if(p===undefined)return <div className="bl-you bl-you-loading" aria-hidden/>;
  const signIn=<Link className="rd-button rd-primary" href="/login?next=%2Fmakers">Sign in with X</Link>;
  if(!p)return <section className="bl-you"><div><h2>Find your people</h2><p>Sign in with X to add yourself, put your product on the map and meet builders near you or online.</p></div>{signIn}</section>;
  if(!p.handle)return <section className="bl-you"><div><h2>Builder pages use your X profile</h2><p>You’re signed in with {p.provider==='google'?'Google':'email'}. Sign in with X to add your photo, handle and product.</p></div>{signIn}</section>;
  const me=ranks[p.handle.toLowerCase()];
  if(me)return <section className="bl-you bl-you-me"><div><h2>You’re #{me.rank} of {Object.keys(ranks).length} builders</h2><p>{me.points.toLocaleString()} points. Add your city, logo and product, and post in the community to climb.</p></div><Link className="rd-button rd-outline" href={`/makers/${p.handle}`}>Your page <ArrowRight size={16}/></Link></section>;
  return <section className="bl-you"><div><h2>Add yourself, @{p.handle}</h2><p>Get a builder page with your X photo, show what you’re building and appear on the map.</p>{error&&<p className="rd-error" role="alert">{error}</p>}</div>
    <button className="rd-button rd-primary" onClick={join} disabled={busy}>{busy?<LoaderCircle className="rd-spin" size={16}/>:<Plus size={16}/>} Add yourself</button></section>;
}
