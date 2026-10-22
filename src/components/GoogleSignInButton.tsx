"use client";
import {useEffect,useRef,useState} from 'react';

type GoogleId={initialize:(o:Record<string,unknown>)=>void;renderButton:(el:HTMLElement,o:Record<string,unknown>)=>void};
declare global{interface Window{google?:{accounts:{id:GoogleId}}}}

const CLIENT_ID=process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCRIPT='https://accounts.google.com/gsi/client';

function loadScript(){
  return new Promise<void>((resolve,reject)=>{
    if(window.google?.accounts?.id)return resolve();
    let s=document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
    if(!s){s=document.createElement('script');s.src=SCRIPT;s.async=true;s.defer=true;document.head.appendChild(s);}
    s.addEventListener('load',()=>resolve(),{once:true});
    s.addEventListener('error',()=>reject(Error('gsi')),{once:true});
  });
}
async function sha256Hex(text:string){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,'0')).join('');}

/** Official "Sign in with Google" button on our own origin. Calls onUnavailable if it can't be used, so the caller can fall back to the redirect flow. */
export default function GoogleSignInButton({next,disabled,onBusy,onError,onUnavailable}:{next:string;disabled?:boolean;onBusy:(busy:boolean)=>void;onError:(message:string)=>void;onUnavailable:()=>void}){
  const box=useRef<HTMLDivElement>(null);
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    if(!CLIENT_ID){onUnavailable();return;}
    let cancelled=false;
    (async()=>{
      try{
        await loadScript();
        if(cancelled||!box.current||!window.google)return;
        // Raw nonce goes to Supabase; Google gets its SHA-256 hash (Supabase hashes and compares).
        const nonce=Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b=>b.toString(16).padStart(2,'0')).join('');
        const hashed=await sha256Hex(nonce);
        window.google.accounts.id.initialize({
          client_id:CLIENT_ID,
          nonce:hashed,
          ux_mode:'popup',
          context:'signin',
          itp_support:true,
          callback:async({credential}:{credential?:string})=>{
            if(!credential){onError('Google sign-in was cancelled.');return;}
            onBusy(true);
            try{
              const response=await fetch('/auth/google',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({credential,nonce,next})});
              const data=await response.json();
              if(!response.ok)throw Error(data.error);
              window.location.assign(data.url);
            }catch(error){onError(error instanceof Error&&error.message?error.message:'Please try again.');onBusy(false);}
          },
        });
        const width=Math.min(400,Math.max(240,Math.round(box.current.getBoundingClientRect().width)||320));
        window.google.accounts.id.renderButton(box.current,{type:'standard',theme:'outline',size:'large',text:'continue_with',shape:'rectangular',logo_alignment:'left',width});
        setReady(true);
      }catch{if(!cancelled)onUnavailable();}
    })();
    return()=>{cancelled=true;};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[next]);
  return <div aria-busy={!ready} style={{minHeight:44,width:'100%',pointerEvents:disabled?'none':undefined,opacity:disabled?.6:1}} ref={box}/>;
}
