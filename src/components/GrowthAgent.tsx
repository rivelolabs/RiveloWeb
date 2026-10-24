"use client";
import {useCallback,useEffect,useState} from 'react';
import {Bot,Check,ChevronDown,Copy,FileText,LoaderCircle,Mail,MessagesSquare,Search,Settings2,Sparkles,Target,TrendingDown,TrendingUp,Users,Wand2} from 'lucide-react';
type Res<T=Record<string,unknown>>={id:string;payload:T;createdAt:string};
type Settings={productName:string;siteUrl:string;category:string;description:string;competitors:string[];questions:string[];audience:string;weeklyEmail:boolean};
type Credit={limit:number;used:number;left:number;resetsAt:string};
type Data={signedIn:boolean;growth?:boolean;configured?:boolean;setup?:string;credit?:Credit;settings?:Settings;results?:Record<string,Res[]>};
type Row={key:string;clicks:number;impressions:number;position:number;prevPosition?:number|null};
type Weekly={site:string;range:{start:string;end:string};clicks:number;prevClicks:number;impressions:number;prevImpressions:number;position:number;up:Row[];down:Row[];almost:Row[];newQueries:Row[]};
const money=(n:number)=>`$${n.toFixed(2)}`;
const when=(iso:string)=>new Date(iso).toLocaleDateString(undefined,{day:'numeric',month:'short'});
const pct=(a:number,b:number)=>b?`${a>=b?'+':''}${Math.round((a-b)/b*100)}%`:'new';

function CopyBtn({text}:{text:string}){const [ok,setOk]=useState(false);return <button type="button" className="ga-copy" onClick={()=>{navigator.clipboard.writeText(text).then(()=>{setOk(true);setTimeout(()=>setOk(false),1500);}).catch(()=>{});}}>{ok?<Check size={13}/>:<Copy size={13}/>} {ok?'Copied':'Copy'}</button>;}

/** Growth plan: Claude agent (SEO + GEO only, $5/month cap), weekly SEO report, AI-visibility tracking and the sales agent. */
export default function GrowthAgent(){
  const [d,setD]=useState<Data|null>(null),[busy,setBusy]=useState(''),[error,setError]=useState(''),[s,setS]=useState<Settings|null>(null),[open,setOpen]=useState(false);
  const [weekly,setWeekly]=useState<Weekly|null>(null),[keyword,setKeyword]=useState(''),[lead,setLead]=useState('');
  const load=useCallback(()=>fetch('/api/agent',{cache:'no-store'}).then(r=>r.json()).then((x:Data)=>{setD(x);if(x.settings){setS(x.settings);if(!x.settings.productName)setOpen(true);}const w=x.results?.weekly?.[0];if(w)setWeekly(w.payload as unknown as Weekly);}).catch(()=>setD({signedIn:false})),[]);
  useEffect(()=>{void load();},[load]);
  if(!d?.growth)return null;
  if(d.setup)return <section className="gd-card ga"><h2><Bot size={17}/> Claude growth agent</h2><p className="rd-error">{d.setup}</p></section>;
  const latest=<T,>(k:string)=>(d.results?.[k]?.[0] as Res<T>|undefined);
  async function post(body:Record<string,unknown>,label:string){setBusy(label);setError('');
    try{const r=await fetch('/api/agent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const x=await r.json();if(!r.ok)throw Error(x.error);
      if(body.task==='weekly')setWeekly(x.payload);else await load();return x;}
    catch(e){setError(e instanceof Error?e.message:'Something went wrong.');}finally{setBusy('');}}
  const run=(task:string,input?:Record<string,unknown>)=>post({task,input},task);
  const c=d.credit!;const B=({task,label,Icon,input,disabled}:{task:string;label:string;Icon:typeof Wand2;input?:Record<string,unknown>;disabled?:boolean})=>
    <button type="button" className="rd-button rd-outline ga-btn" disabled={!!busy||!d.configured||disabled} onClick={()=>run(task,input)}>{busy===task?<LoaderCircle className="rd-spin" size={15}/>:<Icon size={15}/>} {label}</button>;
  const vis=latest<{rows:{question:string;recommended:string[];rank:number|null}[];share:{name:string;share:number;you:boolean}[];mentioned:number;asked:number}>('visibility');
  const rewrite=latest<{title:string;metaDescription:string;h1:string;storeShortDescription:string;why:string}>('rewrite');
  const kws=latest<{keywords:{keyword:string;intent:string;why:string;pageIdea:string}[]}>('keywords');
  const outline=latest<{keyword:string;title:string;metaDescription:string;sections:{heading:string;points:string[]}[];faq:{q:string;a:string}[]}>('outline');
  const llms=latest<{llmsTxt:string}>('llms');
  const leads=latest<{leads:{name:string;website:string;whyFit:string;foundOn:string;contactPage:string}[]}>('leads');
  const convo=latest<{threads:{title:string;url:string;source:string;why:string;reply:string;date:string}[]}>('conversations');
  const email=latest<{lead:string;subject:string;body:string}>('email');

  return <div className="ga">
    <section className="gd-card ga-head">
      <div><h2><Bot size={18}/> Claude growth agent</h2><p className="gd-muted">SEO and AI-search (GEO) help for your product, plus a sales agent. Works only on growing your product — not for coding or other tasks.</p></div>
      <div className="ga-credit"><span>AI credit this month</span><b>{money(c.used)} <small>of {money(c.limit)} used</small></b><div className="gd-meter"><i style={{width:`${Math.min(100,c.used/c.limit*100)}%`}}/></div><small>{money(c.left)} left · resets {when(c.resetsAt)}</small></div>
      {!d.configured&&<p className="ga-note">{process.env.NODE_ENV==='production'?'The AI tools are being switched on for your account and will be ready shortly. Your weekly search report already works.':'Dev: set ANTHROPIC_API_KEY in .env.local to turn the AI tools on.'}</p>}
      {error&&<p className="rd-error" role="alert">{error}</p>}
    </section>

    <section className="gd-card"><button type="button" className="ga-toggle" onClick={()=>setOpen(!open)} aria-expanded={open}><Settings2 size={16}/> Agent settings — {s?.productName||'tell the agent about your product'} <ChevronDown size={15}/></button>
      {open&&s&&<form className="ga-form" onSubmit={e=>{e.preventDefault();void post({settings:s},'settings').then(x=>{if(x)setOpen(false);});}}>
        <div className="rd-form-row"><label>Product name<input required value={s.productName} onChange={e=>setS({...s,productName:e.target.value})} maxLength={120}/></label><label>Website or store link<input value={s.siteUrl} onChange={e=>setS({...s,siteUrl:e.target.value})} maxLength={300} placeholder="https://"/></label></div>
        <div className="rd-form-row"><label>Category<input value={s.category} onChange={e=>setS({...s,category:e.target.value})} maxLength={120} placeholder="e.g. note taking app"/></label><label>Ideal customer<input value={s.audience} onChange={e=>setS({...s,audience:e.target.value})} maxLength={600} placeholder="e.g. indie SaaS founders in India"/></label></div>
        <label>What it does<textarea required rows={3} value={s.description} onChange={e=>setS({...s,description:e.target.value})} maxLength={1200}/></label>
        <div className="rd-form-row"><label>Competitors <small>(one per line, up to 5)</small><textarea rows={4} value={s.competitors.join('\n')} onChange={e=>setS({...s,competitors:e.target.value.split('\n')})}/></label>
          <label>Buyer questions for AI tracking <small>(one per line, up to 10)</small><textarea rows={4} value={s.questions.join('\n')} onChange={e=>setS({...s,questions:e.target.value.split('\n')})}/></label></div>
        <label className="rd-checkbox"><input type="checkbox" checked={s.weeklyEmail} onChange={e=>setS({...s,weeklyEmail:e.target.checked})}/> Email me the weekly search report</label>
        <div className="gd-actions"><button className="rd-button rd-primary" disabled={!!busy}>{busy==='settings'?<LoaderCircle className="rd-spin" size={15}/>:<Check size={15}/>} Save settings</button>
          <button type="button" className="rd-button rd-outline" disabled={!!busy||!d.configured||!s.productName||!s.description} onClick={async()=>{const x=await post({settings:s},'settings');if(!x)return;const r=await post({task:'setup'},'setup');const p=r?.result?.payload;if(p)setS({...s,questions:(p.questions||[]).slice(0,10),competitors:s.competitors.filter(Boolean).length?s.competitors:(p.competitors||[]).slice(0,5)});}}>{busy==='setup'?<LoaderCircle className="rd-spin" size={15}/>:<Sparkles size={15}/>} Suggest questions &amp; competitors</button></div>
      </form>}
    </section>

    <div className="gd-two">
      <section className="gd-card"><div className="gd-card-head"><h2><FileText size={17}/> Weekly search report</h2><span className="gd-muted">Free · from Search Console</span></div>
        {weekly?<>
          <div className="ga-kpis"><div><small>Clicks</small><b>{weekly.clicks}</b><em className={weekly.clicks>=weekly.prevClicks?'ga-up':'ga-down'}>{pct(weekly.clicks,weekly.prevClicks)}</em></div><div><small>Impressions</small><b>{weekly.impressions.toLocaleString()}</b><em className={weekly.impressions>=weekly.prevImpressions?'ga-up':'ga-down'}>{pct(weekly.impressions,weekly.prevImpressions)}</em></div><div><small>Avg position</small><b>{weekly.position}</b></div></div>
          {weekly.up.length>0&&<><h3 className="ga-h3"><TrendingUp size={14}/> Moving up</h3><ul className="ga-list">{weekly.up.map(q=><li key={q.key}><span>{q.key}</span><b>{q.prevPosition} → {q.position}</b></li>)}</ul></>}
          {weekly.down.length>0&&<><h3 className="ga-h3"><TrendingDown size={14}/> Slipping</h3><ul className="ga-list">{weekly.down.map(q=><li key={q.key}><span>{q.key}</span><b>{q.prevPosition} → {q.position}</b></li>)}</ul></>}
          {weekly.almost.length>0&&<><h3 className="ga-h3"><Target size={14}/> Almost on page 1</h3><ul className="ga-list">{weekly.almost.map(q=><li key={q.key}><span>{q.key}</span><b>#{q.position} · {q.impressions} impr.</b></li>)}</ul></>}
          <p className="gd-muted gd-small">{weekly.range.start} – {weekly.range.end}. Sent by email every Monday{s?.weeklyEmail===false?' (turned off)':''}.</p></>
          :<p className="gd-muted">Your report for the last 7 days vs the week before: what moved up, what slipped and what is almost on page 1.</p>}
        <div className="gd-actions"><button type="button" className="rd-button rd-outline ga-btn" disabled={!!busy} onClick={()=>post({task:'weekly'},'weekly')}>{busy==='weekly'?<LoaderCircle className="rd-spin" size={15}/>:<FileText size={15}/>} {weekly?'Refresh report':'Build my report'}</button></div>
      </section>

      <section className="gd-card"><div className="gd-card-head"><h2><Bot size={17}/> AI search visibility</h2><span className="gd-muted">Checked weekly · uses credit</span></div>
        {vis?<>
          <p className="ga-big"><b>{vis.payload.mentioned}</b> of {vis.payload.asked} buyer questions mention <b>{s?.productName}</b></p>
          <ul className="gd-bars">{vis.payload.share.map(a=><li key={a.name} className={a.you?'gd-you':''}><span>{a.name}</span><div><i style={{width:`${Math.max(2,a.share)}%`}}/></div><b>{a.share}%</b></li>)}</ul>
          <table className="gd-table gd-prompts"><thead><tr><th>Buyer question</th><th>Claude</th></tr></thead><tbody>{vis.payload.rows.map(r=><tr key={r.question}><td title={r.recommended.join(', ')}>{r.question}</td><td>{r.rank?<span className="gd-yes"><Check size={13}/> #{r.rank}</span>:<span className="gd-no">Not mentioned</span>}</td></tr>)}</tbody></table>
          {(d.results?.visibility?.length||0)>1&&<p className="gd-muted gd-small">History: {(d.results!.visibility as Res<{mentioned:number;asked:number}>[]).slice(0,6).reverse().map(v=>`${when(v.createdAt)} ${v.payload.mentioned}/${v.payload.asked}`).join(' · ')}</p>}
        </>:<p className="gd-muted">We ask Claude your buyer questions the way a shopper would and count who it recommends. Add questions in Agent settings first.</p>}
        <div className="gd-actions"><B task="visibility" label="Run a check now" Icon={Search} disabled={(s?.questions.filter(Boolean).length||0)<3}/></div>
      </section>
    </div>

    <section className="gd-card"><div className="gd-card-head"><h2><Wand2 size={17}/> SEO &amp; GEO tools</h2><span className="gd-muted">A few cents of credit per run</span></div>
      <div className="gd-actions ga-wrap"><B task="rewrite" label="Rewrite my title & description" Icon={Sparkles}/><B task="keywords" label="Keyword ideas" Icon={Target}/><B task="llms" label="Write my llms.txt" Icon={Bot}/>
        <span className="ga-inline"><input value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="Keyword for an article" maxLength={100}/><B task="outline" label="Article outline" Icon={FileText} input={{keyword}} disabled={keyword.trim().length<3}/></span></div>
      <div className="ga-results">
        {rewrite&&<article><h3>Title &amp; description <small>{when(rewrite.createdAt)}</small></h3><dl><dt>Title</dt><dd>{rewrite.payload.title} <CopyBtn text={rewrite.payload.title}/></dd><dt>Meta description</dt><dd>{rewrite.payload.metaDescription} <CopyBtn text={rewrite.payload.metaDescription}/></dd><dt>H1</dt><dd>{rewrite.payload.h1}</dd><dt>Store short text</dt><dd>{rewrite.payload.storeShortDescription}</dd></dl><p className="gd-muted gd-small">{rewrite.payload.why}</p></article>}
        {kws&&<article><h3>Keyword ideas <small>{when(kws.createdAt)}</small></h3><table className="gd-table"><thead><tr><th>Keyword</th><th>Intent</th><th>Page to create</th></tr></thead><tbody>{(kws.payload.keywords||[]).map(k=><tr key={k.keyword}><td title={k.why}>{k.keyword}</td><td>{k.intent}</td><td>{k.pageIdea}</td></tr>)}</tbody></table></article>}
        {outline&&<article><h3>Outline: “{outline.payload.keyword}” <small>{when(outline.createdAt)}</small></h3><p><b>{outline.payload.title}</b></p><ol>{(outline.payload.sections||[]).map(x=><li key={x.heading}><b>{x.heading}</b><ul>{x.points.map(p=><li key={p}>{p}</li>)}</ul></li>)}</ol>{(outline.payload.faq||[]).length>0&&<><p><b>FAQ</b></p><ul>{outline.payload.faq.map(f=><li key={f.q}><b>{f.q}</b> {f.a}</li>)}</ul></>}</article>}
        {llms&&<article><h3>llms.txt <small>{when(llms.createdAt)}</small> <CopyBtn text={llms.payload.llmsTxt}/></h3><pre className="ga-pre">{llms.payload.llmsTxt}</pre><p className="gd-muted gd-small">Save it as /llms.txt at the root of your website.</p></article>}
      </div>
    </section>

    <section className="gd-card"><div className="gd-card-head"><h2><Users size={17}/> Sales agent</h2><span className="gd-muted">You approve and send every message yourself</span></div>
      <div className="gd-actions ga-wrap"><B task="leads" label="Find leads" Icon={Users} disabled={!s?.audience}/><B task="conversations" label="Conversations to join" Icon={MessagesSquare}/></div>
      {!s?.audience&&<p className="gd-muted gd-small">Add your ideal customer in Agent settings to find leads.</p>}
      <div className="ga-results">
        {leads&&<article><h3>Leads <small>{when(leads.createdAt)} · from public web pages</small></h3><ul className="ga-leads">{(leads.payload.leads||[]).map(l=><li key={l.name+l.website}><div><b>{l.name}</b> {l.website&&<a href={l.website} target="_blank" rel="noopener noreferrer">{l.website.replace(/^https?:\/\/(www\.)?/,'').replace(/\/$/,'')}</a>}<p>{l.whyFit}</p><small>{l.foundOn&&<a href={l.foundOn} target="_blank" rel="noopener noreferrer">Source</a>}{l.contactPage&&<> · <a href={l.contactPage} target="_blank" rel="noopener noreferrer">Contact page</a></>}</small></div>
          <button type="button" className="rd-button rd-outline ga-btn" disabled={!!busy||!d.configured} onClick={()=>{setLead(l.name);void run('email',{lead:`${l.name} (${l.website})`,notes:l.whyFit});}}>{busy==='email'&&lead===l.name?<LoaderCircle className="rd-spin" size={14}/>:<Mail size={14}/>} Draft email</button></li>)}</ul></article>}
        {email&&<article><h3>Draft email to {email.payload.lead} <small>{when(email.createdAt)}</small></h3><p><b>Subject:</b> {email.payload.subject}</p><pre className="ga-pre">{email.payload.body}</pre>
          <div className="gd-actions"><CopyBtn text={`Subject: ${email.payload.subject}\n\n${email.payload.body}`}/><a className="ga-copy" href={`mailto:?subject=${encodeURIComponent(email.payload.subject)}&body=${encodeURIComponent(email.payload.body)}`}><Mail size={13}/> Open in my email</a></div>
          <p className="gd-muted gd-small">Use the contact the company publishes on its site, check the draft, then send it yourself. Only email businesses that are a real fit.</p></article>}
        {convo&&<article><h3>Conversations to join <small>{when(convo.createdAt)}</small></h3><ul className="ga-convos">{(convo.payload.threads||[]).map(t=><li key={t.url}><a href={t.url} target="_blank" rel="noopener noreferrer"><b>{t.title}</b></a><small>{t.source} · {when(t.date)}</small><p className="gd-muted">{t.why}</p><details><summary>Suggested reply</summary><pre className="ga-pre">{t.reply}</pre><CopyBtn text={t.reply}/></details></li>)}</ul>
          <p className="gd-muted gd-small">Read each thread first and follow the community’s rules on self-promotion.</p></article>}
      </div>
    </section>
  </div>;
}
