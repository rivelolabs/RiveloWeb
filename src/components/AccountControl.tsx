"use client";
import type {UserResponse,AuthChangeEvent,Session} from '@supabase/supabase-js';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {LogIn} from 'lucide-react';
import {profileDetails} from '@/lib/auth/profile';
import {browserAuth} from '@/lib/auth/browser';
type P=ReturnType<typeof profileDetails>;
export default function AccountControl(){
  const path=usePathname(),[p,setP]=useState<P>(null);
  useEffect(()=>{const auth=browserAuth();if(!auth)return;let active=true;
    auth.auth.getUser().then(({data}:UserResponse)=>{if(active)setP(profileDetails(data.user));}).catch(()=>{});
    const {data}=auth.auth.onAuthStateChange((_e:AuthChangeEvent,session:Session|null)=>{if(active)setP(profileDetails(session?.user??null));});
    return()=>{active=false;data.subscription.unsubscribe();};},[]);
  if(path==='/login')return null;
  if(!p)return <Link className="ra-account-link" aria-label="Sign in" href={`/login?next=${encodeURIComponent(path)}`}><LogIn size={17}/><span>Sign in</span></Link>;
  return <Link href="/account" className="ra-account-link ra-account-me" aria-label="Your account">
    {p.avatar?/* eslint-disable-next-line @next/next/no-img-element */<img src={p.avatar} alt="" width={28} height={28} referrerPolicy="no-referrer"/>:<span className="ra-account-initial">{p.name.slice(0,1).toUpperCase()}</span>}
    <span>{p.handle?`@${p.handle}`:p.name.split('@')[0].split(' ')[0].slice(0,18)}</span>
  </Link>;
}
