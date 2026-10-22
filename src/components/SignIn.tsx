"use client";
import {useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Compass,LoaderCircle,ShieldCheck} from 'lucide-react';
import styles from './SignIn.module.css';
import GoogleSignInButton from './GoogleSignInButton';
function XLogo(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-7.4L5.5 22H2.3l7.9-9L1 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L6.5 3.9H4.7L17.8 20Z"/></svg>;}
function GoogleLogo(){return <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.41l-3.23-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.41 13.92a6 6 0 0 1 0-3.84V7.49H3.07a10 10 0 0 0 0 9.02l3.34-2.59Z"/><path fill="#EA4335" d="M12 5.96c1.47 0 2.79.5 3.83 1.5l2.88-2.88A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.93 5.49l3.34 2.59C7.2 7.72 9.4 5.96 12 5.96Z"/></svg>;}
export default function SignIn({next,failed}:{next:string;failed:boolean}){
  const [busy,setBusy]=useState(''),[googleFallback,setGoogleFallback]=useState(false),[error,setError]=useState(failed?'We couldn’t complete sign-in. Please try again.':'');
  async function signIn(provider:'google'|'x'){
    setBusy(provider);setError('');
    try{const response=await fetch('/auth/sign-in',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({provider,next})});const data=await response.json();if(!response.ok)throw Error(data.error);window.location.assign(data.url);}
    catch(error){setError(error instanceof Error?error.message:'Please try again.');setBusy('');}
  }
  return <section className={styles.card} aria-label="Sign in to Rivelo">
    <div className={styles.story}>
      <span className={styles.eyebrow}>A home for independent ideas</span>
      <h1>Good ideas.<br/><em>Great company.</em></h1>
      <p>Meet the people behind the products. Share what you’re building. Find your next connection.</p>
      <div className={styles.art} aria-hidden="true"><div className={styles.orbit}><i/><i/></div><span className={styles.brandTile}>r.</span><span className={styles.artCaption}>A little curiosity goes a long way. ↗</span></div>
      <span className={styles.storyFooter}><Compass size={15}/> Built to be found. Better together.</span>
    </div>
    <div className={styles.form}>
      <span className={styles.eyebrow}>Your Rivelo space</span>
      <h2>Welcome to the good company.</h2>
      <p className={styles.intro}>Sign in or create your account. There’s a place for you here.</p>
      <button className={`${styles.button} ${styles.primary}`} disabled={!!busy} onClick={()=>signIn('x')}>{busy==='x'?<LoaderCircle className="rd-spin" size={20}/>:<XLogo/>}<span>{busy==='x'?'Connecting to X…':'Continue with X'}</span><ArrowUpRight size={16}/></button>
      <div className={styles.separator}>or use your Google account</div>
      {googleFallback?<button className={styles.button} disabled={!!busy} onClick={()=>signIn('google')}>{busy==='google'?<LoaderCircle className="rd-spin" size={20}/>:<GoogleLogo/>}<span>{busy==='google'?'Connecting to Google…':'Continue with Google'}</span><ArrowUpRight size={16}/></button>:<GoogleSignInButton next={next} disabled={!!busy} onBusy={b=>{setBusy(b?'google':'');if(b)setError('');}} onError={setError} onUnavailable={()=>setGoogleFallback(true)}/>}{busy==='google'&&!googleFallback&&<p className={styles.intro} role="status" style={{marginTop:10}}><LoaderCircle className="rd-spin" size={14}/> Signing you in…</p>}
      {error&&<p className={styles.error} role="alert">{error}</p>}
      <p className={styles.privacy}><ShieldCheck size={16}/> Your space, your choice. We never post to your social accounts. By continuing, you agree to our <Link href="/legal/terms">Terms of Service</Link> and <Link href="/legal/privacy">Privacy Policy</Link>.</p>
      <Link href="/map" className={styles.browse}>Just looking around? Explore the map <ArrowUpRight size={15}/></Link>
    </div>
  </section>;
}
