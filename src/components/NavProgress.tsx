'use client';
import {useEffect,useState} from 'react';
import {usePathname,useSearchParams} from 'next/navigation';
// Thin top bar that appears the moment an internal link is clicked, so page changes feel instant
// while the server prepares the next page.
export default function NavProgress(){
  const path=usePathname(),query=useSearchParams()?.toString();
  const [on,setOn]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setOn(false),0);return()=>clearTimeout(t);},[path,query]);
  useEffect(()=>{
    const click=(e:MouseEvent)=>{
      if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      const a=(e.target as Element|null)?.closest?.('a');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
      const url=new URL(a.href,location.href);if(url.origin!==location.origin)return;
      if(url.pathname===location.pathname&&url.search===location.search)return;
      setOn(true);
    };
    document.addEventListener('click',click,true);return()=>document.removeEventListener('click',click,true);
  },[]);
  return <div aria-hidden="true" className={`rl-nav-progress${on?' rl-nav-on':''}`}/>;
}
