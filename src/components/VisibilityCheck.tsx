"use client";
import {useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Check,Copy,Gauge,LoaderCircle,X} from 'lucide-react';
import type {Report} from '@/lib/visibility';
const GROUPS=['Search','Social','AI search','Speed & tech'] as const;
const BADGE=`<a href="https://rivelolabs.com/?ref=badge" target="_blank" rel="noopener"><img src="https://rivelolabs.com/badge/featured-on-rivelo.svg" alt="Featured on Rivelo Labs" width="200" height="54"/></a>`;
export default function VisibilityCheck(){
  const [url,setUrl]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[report,setReport]=useState<Report|null>(null),[copied,setCopied]=useState(false);
  async function run(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');setReport(null);
    try{const r=await fetch('/api/tools/visibility',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url})});const d=await r.json();if(!r.ok)throw Error(d.error);setReport(d);setTimeout(()=>document.getElementById('vc-result')?.scrollIntoView({behavior:'smooth',block:'start'}),50);}
    catch(err){setError(err instanceof Error?err.message:'Could not check that site.');}finally{setBusy(false);}}
  const todo=report?report.checks.filter(c=>!c.ok).sort((a,b)=>b.weight-a.weight):[];
  return <div className="vc">
    <form className="vc-form" onSubmit={run}><label htmlFor="vc-url" className="rd-overline">YOUR WEBSITE</label><div className="vc-row"><input id="vc-url" inputMode="url" autoComplete="url" placeholder="your-product.com" value={url} onChange={e=>setUrl(e.target.value)} required maxLength={500}/><button className="rd-button rd-primary" disabled={busy}>{busy?<LoaderCircle className="rd-spin" size={17}/>:<Gauge size={17}/>} {busy?'Checking…':'Check visibility'}</button></div><p className="rd-fine-print">Free. No sign-up. We check Google, social previews and AI-search readiness in about 10 seconds.</p></form>
    {error&&<p className="rd-error" role="alert">{error}</p>}
    {report&&<section id="vc-result" className="vc-result" aria-live="polite">
      <div className="vc-score"><div className="vc-ring" style={{'--vc':`${report.score*3.6}deg`} as React.CSSProperties}><b>{report.score}</b><small>/100</small></div><div><span className="rd-overline">VISIBILITY SCORE</span><h2>{report.grade}</h2><p>{new URL(report.finalUrl).hostname} · answered in {report.ms} ms · {report.checks.filter(c=>c.ok).length} of {report.checks.filter(c=>c.weight>0).length} checks passed</p></div></div>
      {todo.length>0&&<div className="vc-todo"><h3>Fix these first</h3><ol>{todo.slice(0,6).map(c=><li key={c.id}><b>{c.label}</b><span>{c.fix}</span></li>)}</ol></div>}
      <div className="vc-groups">{GROUPS.map(g=><div key={g} className="vc-group"><h3>{g}</h3><ul>{report.checks.filter(c=>c.group===g&&c.weight>0).map(c=><li key={c.id} className={c.ok?'vc-ok':'vc-bad'}>{c.ok?<Check size={16}/>:<X size={16}/>}<div><b>{c.label}</b><small>{c.detail}</small></div></li>)}</ul></div>)}</div>
      <div className="vc-cta"><div><span className="rd-overline">THE FASTEST WIN</span><h3>Get a real backlink and new visitors today.</h3><p>List your product free on Rivelo Labs, pin it on the world map, and add the badge to your site. Every listing is a link search engines and AI assistants can follow.</p><div className="vc-cta-actions"><Link className="rd-button rd-primary" href="/register">List my product free <ArrowUpRight size={16}/></Link><Link className="rd-button rd-outline" href="/launch-guide">Where else to launch <ArrowUpRight size={16}/></Link></div></div>
        <div className="vc-badge">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/badge/featured-on-rivelo.svg" alt="Featured on Rivelo Labs" width={200} height={54}/><code>{BADGE}</code><button type="button" className="rd-button rd-outline" onClick={()=>{void navigator.clipboard?.writeText(BADGE);setCopied(true);setTimeout(()=>setCopied(false),2000);}}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'Copied':'Copy badge code'}</button></div></div>
    </section>}
  </div>;
}
