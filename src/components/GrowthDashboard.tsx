"use client";
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {ArrowDown,ArrowUp,ArrowUpRight,Bot,Check,Gauge,Link2,Search,Sparkles,Wand2} from 'lucide-react';

/* PREVIEW: sample numbers so the Growth dashboard can be reviewed before Search Console and the Claude agent are connected. */
type Day={date:string;clicks:number;impressions:number;position:number};
function sample(days:number):Day[]{
  const out:Day[]=[];const end=new Date('2026-10-22T00:00:00Z');
  for(let i=days-1;i>=0;i--){const d=new Date(end.getTime()-i*86400000);const t=days-i;
    const wave=Math.sin(t/3.2)*0.18+(d.getUTCDay()%6===0?-0.22:0);
    const clicks=Math.max(4,Math.round((18+t*0.9)*(1+wave)));
    out.push({date:d.toISOString().slice(0,10),clicks,impressions:Math.round(clicks*(34+Math.sin(t/5)*6)),position:Number((19-t*0.13+Math.sin(t/4)*0.8).toFixed(1))});}
  return out;
}
const KEYWORDS=[
  {q:'simple note taking app',clicks:212,imp:5810,pos:6.4,delta:2.1},
  {q:'notion alternative',clicks:164,imp:9320,pos:11.8,delta:3.4},
  {q:'best notes app for students',clicks:98,imp:4110,pos:9.2,delta:-0.6},
  {q:'free markdown editor',clicks:61,imp:2780,pos:14.5,delta:1.2},
  {q:'xyz notes',clicks:37,imp:1490,pos:8.1,delta:0.4},
  {q:'offline notes app android',clicks:22,imp:1980,pos:17.3,delta:4.0},
];
const AI=[{name:'Your product',share:24,you:true},{name:'Competitor A',share:41},{name:'Competitor B',share:19},{name:'Competitor C',share:11},{name:'Others',share:5}];
const PROMPTS=[
  {p:'What is the best Notion alternative?',claude:true,chatgpt:false,rank:3},
  {p:'Simple note taking apps for students',claude:true,chatgpt:true,rank:2},
  {p:'Free markdown editors',claude:false,chatgpt:false,rank:null},
  {p:'Which notes apps work offline?',claude:false,chatgpt:true,rank:5},
];
const SCORE=[58,61,61,66,72,74,81,84];
const fmt=(n:number)=>n>=1000?`${(n/1000).toFixed(1)}k`:String(n);

function LineChart({data,metric,label,invert}:{data:Day[];metric:'clicks'|'impressions'|'position';label:string;invert?:boolean}){
  const [hover,setHover]=useState<number|null>(null);
  const W=640,H=200,P={l:40,r:12,t:12,b:26};
  const vals=data.map(d=>d[metric]);const min=Math.min(...vals),max=Math.max(...vals);const lo=invert?Math.floor(min-1):0,hi=Math.ceil(max*(invert?1:1.1))+(invert?1:0);
  const x=(i:number)=>P.l+i*(W-P.l-P.r)/(data.length-1);
  const y=(v:number)=>{const f=(v-lo)/(hi-lo||1);return invert?P.t+f*(H-P.t-P.b):H-P.b-f*(H-P.t-P.b);};
  const path=vals.map((v,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  const ticks=[0,0.5,1].map(f=>Math.round(lo+(hi-lo)*f));
  const h=hover!=null?data[hover]:null;
  return <div className="gd-chart">
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label} over the last ${data.length} days`} onMouseLeave={()=>setHover(null)}
      onMouseMove={e=>{const r=(e.currentTarget as SVGSVGElement).getBoundingClientRect();const px=(e.clientX-r.left)/r.width*W;setHover(Math.max(0,Math.min(data.length-1,Math.round((px-P.l)/((W-P.l-P.r)/(data.length-1))))));}}>
      {ticks.map(t=><g key={t}><line x1={P.l} x2={W-P.r} y1={y(t)} y2={y(t)} className="gd-grid"/><text x={P.l-8} y={y(t)+4} className="gd-axis" textAnchor="end">{fmt(t)}</text></g>)}
      {[0,Math.floor(data.length/2),data.length-1].map(i=><text key={i} x={x(i)} y={H-6} className="gd-axis" textAnchor={i===0?'start':i===data.length-1?'end':'middle'}>{new Date(data[i].date).toLocaleDateString('en',{month:'short',day:'numeric'})}</text>)}
      {!invert&&<path d={`${path}L${x(data.length-1)},${H-P.b}L${P.l},${H-P.b}Z`} className="gd-area"/>}
      <path d={path} className="gd-line"/>
      {h&&hover!=null&&<g><line x1={x(hover)} x2={x(hover)} y1={P.t} y2={H-P.b} className="gd-cross"/><circle cx={x(hover)} cy={y(h[metric])} r={5} className="gd-dot"/></g>}
    </svg>
    {h&&hover!=null&&<div className="gd-tip" style={{left:`${x(hover)/W*100}%`}}><b>{metric==='position'?h.position:fmt(h[metric])}</b> {label.toLowerCase()}<small>{new Date(h.date).toLocaleDateString('en',{weekday:'short',month:'short',day:'numeric'})}</small></div>}
  </div>;
}

type Row={key:string;clicks:number;impressions:number;position:number;ctr?:number;prevPosition?:number|null};
type View={daily:Day[];totals:{clicks:number;impressions:number;ctr:number;position:number};prev:{clicks:number;impressions:number;position:number};queries:Row[];pages:Row[]};
type Status={signedIn:boolean;configured:boolean;growth:boolean;connection:{googleEmail:string;siteUrl:string|null}|null;sites:{siteUrl:string}[]};
function sampleView(days:number):View{
  const daily=sample(days),half=Math.floor(days/2),cur=daily.slice(half),prev=daily.slice(0,half);
  const sum=(d:Day[],k:'clicks'|'impressions')=>d.reduce((s,x)=>s+x[k],0)*2;
  const clicks=sum(cur,'clicks'),impressions=sum(cur,'impressions');
  return {daily,totals:{clicks,impressions,ctr:clicks/impressions,position:17.2},prev:{clicks:sum(prev,'clicks'),impressions:sum(prev,'impressions'),position:20.3},
    queries:KEYWORDS.map(k=>({key:k.q,clicks:k.clicks,impressions:k.imp,position:k.pos,prevPosition:Number((k.pos+k.delta).toFixed(1))})),pages:[]};
}
const siteName=(u:string)=>u.replace(/^sc-domain:/,'').replace(/^https?:\/\//,'').replace(/\/$/,'');
const pct=(a:number,b:number)=>b?Math.round((a-b)/b*100):null;

const brandOf=(site:string)=>siteName(site).split('.')[0].toLowerCase().replace(/[^a-z0-9]/g,'');
const isBrand=(q:string,brand:string)=>brand.length>=3&&q.toLowerCase().replace(/[^a-z0-9]/g,'').includes(brand);
function BrandSplit({rows,site}:{rows:Row[];site:string}){
  const brand=brandOf(site),b=rows.filter(r=>isBrand(r.key,brand)),o=rows.filter(r=>!isBrand(r.key,brand));
  const bc=b.reduce((s,r)=>s+r.clicks,0),oc=o.reduce((s,r)=>s+r.clicks,0),t=bc+oc||1;
  return <div className="gd-brand"><p className="gd-muted">Among your top {rows.length} keywords, “brand” searches contain “{brand}”. Growth comes from the other kind: people who didn’t know you yet.</p>
    <div className="gd-split"><i style={{width:`${bc/t*100}%`}}/><i style={{width:`${oc/t*100}%`}}/></div>
    <div className="gd-split-legend"><span><b>{Math.round(bc/t*100)}%</b> brand · {fmt(bc)} clicks</span><span><b>{Math.round(oc/t*100)}%</b> discovery · {fmt(oc)} clicks</span></div>
    <h3 className="gd-subhead">Best discovery keywords</h3><ul className="gd-mini">{o.slice(0,6).map(r=><li key={r.key}><span>{r.key}</span><b>{fmt(r.clicks)}</b></li>)}</ul></div>;
}
type Opp={title:string;body:string;kind:'win'|'ctr'|'rise'|'page'};
function opportunities(view:View):Opp[]{
  const out:Opp[]=[];const q=view.queries;
  const near=q.filter(k=>k.position>=8&&k.position<=20).sort((a,b)=>b.impressions-a.impressions)[0];
  if(near)out.push({kind:'win',title:`“${near.key}” is almost on page 1`,body:`Position ${near.position} with ${fmt(near.impressions)} impressions. Put the phrase in a page title and H1, and link to that page from your home page.`});
  const ctr=q.filter(k=>k.position<=10&&k.impressions>=150&&(k.ctr??k.clicks/k.impressions)<0.03).sort((a,b)=>b.impressions-a.impressions)[0];
  if(ctr)out.push({kind:'ctr',title:`People see “${ctr.key}” but rarely click`,body:`You rank ${ctr.position} but only ${((ctr.ctr??ctr.clicks/ctr.impressions)*100).toFixed(1)}% click. A clearer title and description for that result could win more visits.`});
  const rise=q.filter(k=>k.prevPosition!=null&&k.prevPosition-k.position>=3).sort((a,b)=>(b.prevPosition!-b.position)-(a.prevPosition!-a.position))[0];
  if(rise)out.push({kind:'rise',title:`Rising: “${rise.key}”`,body:`Up ${(rise.prevPosition!-rise.position).toFixed(1)} places to ${rise.position}. Keep that page fresh and add a short FAQ to hold the gain.`});
  const far=q.filter(k=>k.position>20&&k.impressions>=300).sort((a,b)=>b.impressions-a.impressions)[0];
  if(far)out.push({kind:'page',title:`Demand you’re missing: “${far.key}”`,body:`${fmt(far.impressions)} impressions while you sit at ${far.position}. A dedicated page for this search could rank much higher.`});
  return out;
}
function Opportunities({view,site,range}:{view:View;site:string;range:number}){
  const opps=opportunities(view);if(!opps.length)return null;
  return <section className="gd-card"><div className="gd-card-head"><h2><Sparkles size={17}/> Quick wins</h2><span className="gd-muted">Found in your last {range} days of {siteName(site)} data</span></div>
    <div className="gd-opps">{opps.map(o=><article key={o.title} className={`gd-opp gd-opp-${o.kind}`}><span>{o.kind==='win'?'Almost page 1':o.kind==='ctr'?'Low click rate':o.kind==='rise'?'Rising':'New page idea'}</span><h3>{o.title}</h3><p>{o.body}</p></article>)}</div></section>;
}
function Moves({view}:{view:View}){
  const opps=opportunities(view).slice(0,3);
  return <ol className="gd-moves">{opps.map(o=><li key={o.title}><b>{o.title}.</b> {o.body}</li>)}{opps.length<3&&<li><b>Get listed on more directories.</b> Products that independent sites link to get recommended more by Google and AI assistants. Start with the <a href="/launch-guide">launch guide</a>.</li>}</ol>;
}

export default function GrowthDashboard(){
  const [range,setRange]=useState<28|90>(28),[kwTab,setKwTab]=useState<'all'|'wins'|'brand'>('all'),[metric,setMetric]=useState<'clicks'|'impressions'|'position'>('clicks');
  const [status,setStatus]=useState<Status|null>(null),[real,setReal]=useState<View|null>(null),[loading,setLoading]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  useEffect(()=>{
    const q=new URLSearchParams(window.location.search).get('gsc');
    const msg:Record<string,string>={connected:'Search Console connected. Your real data is below.',nosites:'Connected, but this Google account has no verified Search Console properties. Add your site in Search Console, then reconnect.',cancelled:'Connection cancelled.',expired:'That sign-in expired. Please connect again.',failed:'Google didn’t finish connecting. Please try again.',upgrade:'Search Console data is part of the Growth plan.',unavailable:'Search Console connection isn’t switched on yet.'};
    if(q&&msg[q]){const t=setTimeout(()=>setNotice(msg[q]),0);window.history.replaceState(null,'','/growth');return()=>clearTimeout(t);}
  },[]);
  useEffect(()=>{fetch('/api/gsc/status',{cache:'no-store'}).then(r=>r.json()).then(setStatus).catch(()=>setStatus(null));},[]);
  const site=status?.connection?.siteUrl||null;
  useEffect(()=>{
    if(!site||!status?.growth)return;let live=true;
    const t=setTimeout(()=>{setLoading(true);setError('');
      fetch(`/api/gsc/data?days=${range}`,{cache:'no-store'}).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error);return d;})
        .then(d=>{if(live)setReal({daily:d.daily,totals:d.totals,prev:d.prev,queries:d.queries,pages:d.pages});})
        .catch(e=>{if(live)setError(e instanceof Error?e.message:'Could not load Search Console data.');})
        .finally(()=>{if(live)setLoading(false);});},0);
    return()=>{live=false;clearTimeout(t);};
  },[site,range,status?.growth]);
  async function chooseSite(siteUrl:string){const r=await fetch('/api/gsc/site',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({siteUrl})});if(r.ok){setReal(null);setStatus(s=>s&&s.connection?{...s,connection:{...s.connection,siteUrl}}:s);}}
  async function disconnect(){if(!confirm('Disconnect Google Search Console?'))return;await fetch('/api/gsc/disconnect',{method:'POST'});setReal(null);setStatus(s=>s&&{...s,connection:null,sites:[]});}
  const isReal=!!real;
  const view=useMemo(()=>real||sampleView(range),[real,range]);
  const data=view.daily;
  const cClicks=pct(view.totals.clicks,view.prev.clicks),cImpr=pct(view.totals.impressions,view.prev.impressions);
  const posDelta=view.prev.position&&view.totals.position?Number((view.prev.position-view.totals.position).toFixed(1)):null;
  const credit={used:1.8,total:5};
  const connectBtn=<a className="rd-button rd-primary" href="/api/gsc/connect"><Search size={15}/> Connect Google Search Console</a>;
  return <div className="gd">
    {notice&&<p className="rc-notice" role="status"><Check size={16}/> {notice}</p>}
    {!isReal&&<div className="gd-preview"><Sparkles size={16}/><span>{status?.growth&&status.configured?(status.connection?<><b>Choose your website below</b> to load your real Search Console data.</>:<><b>Connect Google Search Console</b> to replace this sample data with your real clicks, impressions and keywords. Read-only access; disconnect anytime.</>):<><b>Preview with sample data.</b> {status?.signedIn?'Connect Google Search Console for free to see your real clicks, keywords and quick wins.':'Sign in and connect Google Search Console for free to see your real clicks, keywords and quick wins.'} The Claude SEO agent and AI-search tracking come with Growth and are set up within 2–6 hours during working hours.</>}</span>{!status?.connection&&(status?.signedIn?connectBtn:<a className="rd-button rd-primary" href="/login?next=/growth">Sign in to connect</a>)}</div>}
    {status?.connection&&!site&&<div className="gd-card gd-pick"><h2>Which website?</h2><p className="gd-muted">Signed in to Google as {status.connection.googleEmail||'your account'}. Pick the Search Console property to show.</p>{status.sites.length?<div className="gd-pick-list">{status.sites.map(s=><button key={s.siteUrl} className="rd-button rd-outline" onClick={()=>chooseSite(s.siteUrl)}>{siteName(s.siteUrl)}{s.siteUrl.startsWith('sc-domain:')&&<small> · whole domain</small>}</button>)}</div>:<p>No verified properties on this Google account. <a href="https://search.google.com/search-console" target="_blank" rel="noopener">Add your site in Search Console</a>, then reconnect.</p>}</div>}
    {error&&<p className="rd-error" role="alert">{error}</p>}
    <div className="gd-toolbar"><div className="gd-site"><span className="gd-site-dot" style={isReal?undefined:{background:'#9aa3ad'}}/> {site?siteName(site):'xyz.app'} <small>{isReal?`Search Console · ${status?.connection?.googleEmail||'Connected'}`:loading?'Loading Search Console…':'Sample data'}</small>{status?.connection&&<button type="button" className="gd-link" onClick={disconnect}>Disconnect</button>}{status?.connection&&status.sites.length>1&&site&&<select className="gd-site-select" value={site} onChange={e=>chooseSite(e.target.value)} aria-label="Switch website">{status.sites.map(s=><option key={s.siteUrl} value={s.siteUrl}>{siteName(s.siteUrl)}</option>)}</select>}</div><div className="gd-seg" role="group" aria-label="Date range">{([28,90] as const).map(r=><button key={r} aria-pressed={range===r} onClick={()=>setRange(r)}>Last {r} days</button>)}</div></div>

    <section className={`gd-kpis${loading?' gd-loading':''}`} aria-label="Search performance">
      {([['clicks','Clicks',fmt(view.totals.clicks),cClicks],['impressions','Impressions',fmt(view.totals.impressions),cImpr],['ctr','Click-through rate',`${(view.totals.ctr*100).toFixed(1)}%`,null],['position','Average position',view.totals.position?String(view.totals.position):'—',null]] as const).map(([k,l,v,c])=>
        <button key={k} className={`gd-kpi${metric===k?' gd-kpi-on':''}`} onClick={()=>k!=='ctr'&&setMetric(k)} disabled={k==='ctr'}><span>{l}</span><b>{v}</b>{c!=null&&<small className={c>=0?'gd-up':'gd-down'}>{c>=0?<ArrowUp size={13}/>:<ArrowDown size={13}/>} {Math.abs(c)}% vs previous {range} days</small>}{k==='position'&&posDelta!=null&&posDelta!==0&&<small className={posDelta>0?'gd-up':'gd-down'}>{posDelta>0?<ArrowUp size={13}/>:<ArrowDown size={13}/>} {Math.abs(posDelta)} places {posDelta>0?'better':'worse'}</small>}</button>)}
    </section>
    <section className="gd-card"><div className="gd-card-head"><h2>{metric==='clicks'?'Clicks from Google':metric==='impressions'?'Impressions on Google':'Average position (lower is better)'}</h2><span className="gd-muted">Daily · {isReal?'from your Google Search Console':'sample data'}</span></div>{data.some(d=>d[metric]>0)?<LineChart data={data} metric={metric} label={metric==='clicks'?'Clicks':metric==='impressions'?'Impressions':'Position'} invert={metric==='position'}/>:<p className="gd-muted">No data for this period yet. New sites can take a few days to appear in Search Console.</p>}</section>

    {isReal&&<Opportunities view={view} site={site||''} range={range}/>}

    <div className="gd-two">
      <section className="gd-card"><div className="gd-card-head"><h2><Search size={17}/> Keywords</h2><div className="gd-tabs" role="tablist">{(['all','wins','brand'] as const).map(t=><button key={t} role="tab" aria-selected={kwTab===t} onClick={()=>setKwTab(t)}>{t==='all'?'Top':t==='wins'?'Almost page 1':'Brand vs other'}</button>)}</div></div>
        {kwTab==='brand'?<BrandSplit rows={view.queries} site={site||'xyz.app'}/>:(()=>{const rows=(kwTab==='wins'?view.queries.filter(k=>k.position>=8&&k.position<=20).sort((a,b)=>b.impressions-a.impressions):view.queries).slice(0,isReal?15:6);
          return rows.length?<table className="gd-table"><thead><tr><th>Keyword</th><th>Clicks</th><th>Impr.</th><th>CTR</th><th>Position</th></tr></thead><tbody>{rows.map(k=>{const d=k.prevPosition!=null?Number((k.prevPosition-k.position).toFixed(1)):null;const ctr=k.ctr??(k.impressions?k.clicks/k.impressions:0);return <tr key={k.key}><td>{k.key}</td><td>{fmt(k.clicks)}</td><td>{fmt(k.impressions)}</td><td>{(ctr*100).toFixed(1)}%</td><td><span className={`gd-pos ${k.position<=3?'gd-pos-top':k.position<=10?'gd-pos-p1':k.position<=20?'gd-pos-p2':'gd-pos-far'}`}>{k.position}</span>{d!=null&&Math.abs(d)>=0.5&&<span className={d>0?'gd-up':'gd-down'}>{d>0?<ArrowUp size={12}/>:<ArrowDown size={12}/>}{Math.abs(d)}</span>}</td></tr>;})}</tbody></table>:<p className="gd-muted">{kwTab==='wins'?'No keywords between positions 8 and 20 right now.':'No keywords yet for this period.'}</p>;})()}
        <p className="gd-legend"><span className="gd-pos gd-pos-top">1–3</span><span className="gd-pos gd-pos-p1">4–10</span><span className="gd-pos gd-pos-p2">11–20</span><span className="gd-pos gd-pos-far">20+</span> Google position · arrows show change vs previous {range} days</p></section>
      <section className="gd-card"><div className="gd-card-head"><h2><Link2 size={17}/> Top pages</h2><span className="gd-muted">Where Google sends people</span></div>
        {isReal&&view.pages.length>0?(()=>{const max=Math.max(...view.pages.map(p=>p.clicks),1);return <ul className="gd-pages">{view.pages.slice(0,10).map(pg=><li key={pg.key}><div className="gd-page-top"><span className="gd-url" title={pg.key}>{pg.key.replace(/^https?:\/\/[^/]+/,'')||'/'}</span><b>{fmt(pg.clicks)}</b></div><div className="gd-page-bar"><i style={{width:`${pg.clicks/max*100}%`}}/></div><small>{fmt(pg.impressions)} impressions · {(pg.impressions?pg.clicks/pg.impressions*100:0).toFixed(1)}% CTR · position {pg.position}</small></li>)}</ul>;})():<p className="gd-muted">Connect Search Console to see which pages bring visitors.</p>}</section>
    </div>

    <div className="gd-two">
      <section className="gd-card gd-agent"><div className="gd-card-head"><h2><Wand2 size={17}/> Claude SEO agent</h2>{isReal?<span className="gd-tag">Activates within 2–6 hours</span>:<span className="gd-credit" title="Resets on your billing date">AI credit <b>${(credit.total-credit.used).toFixed(2)}</b> of ${credit.total.toFixed(2)} left</span>}</div>
        {!isReal&&<div className="gd-meter" aria-label={`$${credit.used} of $${credit.total} AI credit used`}><i style={{width:`${credit.used/credit.total*100}%`}}/></div>}
        <h3>{isReal?'Your top moves, from your Search Console data':'This week’s top 3 moves'}</h3>
        {isReal?<Moves view={view}/>:<ol className="gd-moves"><li><b>Target “notion alternative” on your home page.</b> You rank #11.8 with 9.3k impressions; adding it to your title and H1 could move you onto page 1.</li><li><b>Add an FAQ section.</b> Questions like “Does it work offline?” appear in 3 of the AI answers where you are missing.</li><li><b>Get listed on 2 more directories.</b> Competitor A is mentioned by AI assistants because AlternativeTo and Product Hunt both link to it.</li></ol>}
        <div className="gd-actions"><button className="rd-button rd-primary" type="button" disabled={isReal} title={isReal?'Activates within 2–6 hours of subscribing':undefined}><Sparkles size={15}/> Rewrite my title &amp; description</button><button className="rd-button rd-outline" type="button" disabled={isReal}>Suggest new keywords</button><button className="rd-button rd-outline" type="button" disabled={isReal}>Write an article outline</button></div>
        <p className="gd-muted gd-small">Activated within 2–6 hours of subscribing (during working hours). Each run uses a few cents of credit; weekly audits run automatically.</p></section>
      <section className="gd-card"><div className="gd-card-head"><h2><Bot size={17}/> AI search share of voice</h2>{isReal?<span className="gd-tag">Preview · tracking starts soon</span>:<span className="gd-muted">How often AI assistants mention you for 20 buyer questions</span>}</div>
        <div className={isReal?'gd-dim':''}><ul className="gd-bars">{AI.map(a=><li key={a.name} className={'you' in a?'gd-you':''}><span>{a.name}</span><div><i style={{width:`${a.share*2}%`}}/></div><b>{a.share}%</b></li>)}</ul>
        <table className="gd-table gd-prompts"><thead><tr><th>Buyer question</th><th>Claude</th><th>ChatGPT</th></tr></thead><tbody>{PROMPTS.map(p=><tr key={p.p}><td>{p.p}</td><td>{p.claude?<span className="gd-yes"><Check size={13}/>{p.rank?` #${p.rank}`:''}</span>:<span className="gd-no">Not mentioned</span>}</td><td>{p.chatgpt?<span className="gd-yes"><Check size={13}/></span>:<span className="gd-no">Not mentioned</span>}</td></tr>)}</tbody></table></div></section>
      <section className="gd-card"><div className="gd-card-head"><h2><Gauge size={17}/> Visibility score</h2>{isReal?<span className="gd-tag">Preview · weekly checks start soon</span>:<span className="gd-muted">Checked every week</span>}</div>
        <div className="gd-score"><b>{SCORE[SCORE.length-1]}</b><small>/100 · up {SCORE[SCORE.length-1]-SCORE[0]} since you joined</small></div>
        <svg viewBox="0 0 300 70" className="gd-spark" role="img" aria-label="Visibility score trend"><path d={SCORE.map((s,i)=>`${i?'L':'M'}${(i*300/(SCORE.length-1)).toFixed(1)},${(66-(s-50)*1.2).toFixed(1)}`).join('')} className="gd-line"/></svg>
        <ul className="gd-checks"><li className="gd-ok"><Check size={14}/> Share preview image added</li><li className="gd-ok"><Check size={14}/> Sitemap found</li><li className="gd-warn">! No llms.txt yet</li></ul>
        <div className="gd-sub"><Link2 size={15}/> Your Rivelo backlink is live · <Link href="/tools/visibility-check">Run a check now <ArrowUpRight size={13}/></Link></div></section>
    </div>
  </div>;
}
