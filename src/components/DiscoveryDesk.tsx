"use client";
import {useCallback,useMemo,useState} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowUpRight,Check,ChevronDown,Clock,Download,Inbox,LoaderCircle,Lock,MapPin,MessagesSquare,Play,Plus,RefreshCw,Send,ShieldCheck,Sparkles,UserCheck,X,History,Layers3,Mail,AtSign} from 'lucide-react';
import MakersDesk from './MakersDesk';
import {genres} from '@/lib/directory';
import type {CatalogState,Listing} from '@/lib/catalog/types';
type Desk=CatalogState&{storageConfigured:boolean;storageBackend?:string;playConfigured:boolean;mailConfigured:boolean};
type Tab='review'|'makers'|'pins'|'community'|'claims'|'invites'|'leads'|'sources'|'runs';
type Filter='pending'|'published'|'rejected'|'all';
const KIND:Record<string,string>={website:'Website','appstore':'App Store','appstore-search':'App Store search',googleplay:'Google Play'};
const host=(u:string)=>{try{return new URL(u).hostname.replace(/^www\./,'');}catch{return u;}};
function Status({value}:{value:string}){return <span className={`dk-status dk-status-${value}`}>{value.replace('-',' ')}</span>;}

export default function DiscoveryDesk(){
  const [key,setKey]=useState(''),[data,setData]=useState<Desk|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const notifyCb=useCallback((ok:boolean,msg:string)=>{if(ok){setNotice(msg);setTimeout(()=>setNotice(''),3500);}else setError(msg);},[]);
  const [tab,setTab]=useState<Tab>('review'),[filter,setFilter]=useState<Filter>('pending');
  async function refresh(){const response=await fetch('/api/catalog/admin',{headers:{Authorization:`Bearer ${key}`},cache:'no-store'});const result=await response.json();if(!response.ok)throw Error(result.error);setData(result);}
  async function connect(event:React.FormEvent){event.preventDefault();setError('');setBusy(true);try{await refresh();}catch(error){setError(error instanceof Error?error.message:'Could not connect.');}finally{setBusy(false);}}
  async function action(body:Record<string,unknown>){setBusy(true);setError('');setNotice('');try{const response=await fetch('/api/catalog/admin',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(body)});const result=await response.json();if(!response.ok)throw Error(result.error);await refresh();setNotice(body.action==='run'?'Import completed. New candidates are in the review queue.':body.action==='review'&&body.status==='published'?'Listing published.':'Changes saved.');setTimeout(()=>setNotice(''),3500);return result;}catch(error){setError(error instanceof Error?error.message:'The action failed.');}finally{setBusy(false);}}

  const counts=useMemo(()=>data?{
    pending:data.listings.filter(l=>l.status==='pending').length,published:data.listings.filter(l=>l.status==='published').length,rejected:data.listings.filter(l=>l.status==='rejected').length,
    pins:data.pins.filter(p=>p.status==='pending').length,posts:data.posts.filter(p=>p.status==='pending').length+data.posts.reduce((n,p)=>n+p.replies.filter(r=>r.status==='pending').length,0),
    claims:data.claims.filter(c=>c.status!=='approved'&&c.status!=='rejected').length,drafts:data.invites.filter(i=>i.status==='draft').length,leads:data.leads.length,
  }:null,[data]);

  if(!data||!counts)return <main className="rd-app dk">
    <header className="dk-top"><Link href="/" className="rd-product-page-brand">rivelo<span>labs.</span></Link><Link href="/" className="dk-back"><ArrowLeft size={15}/> Back to directory</Link></header>
    <form className="dk-login" onSubmit={connect}>
      <span className="dk-login-icon"><ShieldCheck size={26}/></span>
      <span className="rd-overline">PRIVATE WORKSPACE</span>
      <h1>Discovery desk</h1>
      <p>Enter the <code>CATALOG_ADMIN_KEY</code> from your server environment. It stays in this tab’s memory only.</p>
      <label>Admin key<input type="password" value={key} onChange={e=>setKey(e.target.value)} required autoComplete="off" autoFocus/></label>
      <button className="rd-button rd-primary" disabled={busy}>{busy?<LoaderCircle className="rd-spin" size={16}/>:<Lock size={16}/>} Open workspace</button>
      {error&&<p className="rd-error" role="alert">{error}</p>}
      <p className="rd-fine-print">Setup: docs/discovery.md. Never share this key with product owners.</p>
    </form>
  </main>;

  const nav:[Tab,string,typeof Inbox,number?][]=[['review','Review queue',Inbox,counts.pending],['makers','X makers',AtSign],['pins','Map pins',MapPin,counts.pins],['community','Community',MessagesSquare,counts.posts],['claims','Owner claims',UserCheck,counts.claims],['invites','Invitations',Mail,counts.drafts],['leads','Premium enquiries',Sparkles,counts.leads],['sources','Sources & imports',Layers3],['runs','Run history',History]];
  const listings=data.listings.filter(l=>filter==='all'||l.status===filter).sort((a,b)=>Number(b.id.startsWith('owner-'))-Number(a.id.startsWith('owner-'))||b.importedAt.localeCompare(a.importedAt));

  return <main className="rd-app dk">
    <header className="dk-top">
      <Link href="/" className="rd-product-page-brand">rivelo<span>labs.</span></Link>
      <span className="dk-top-title">Discovery desk</span>
      <div className="dk-top-actions">
        <span className="dk-pill"><i className={data.enabled?'dk-dot-on':'dk-dot-off'}/> Imports {data.enabled?'on':'paused'} · {data.storageBackend==='postgres'?'PostgreSQL':'Local files'}</span>
        <button className="dk-icon-btn" title="Refresh" aria-label="Refresh" disabled={busy} onClick={()=>{setBusy(true);refresh().catch(e=>setError(e.message)).finally(()=>setBusy(false));}}>{busy?<LoaderCircle className="rd-spin" size={16}/>:<RefreshCw size={16}/>}</button>
        <button className="rd-button rd-outline dk-sm" onClick={()=>{setData(null);setKey('');}}><Lock size={14}/> Lock</button>
      </div>
    </header>
    <div className="dk-shell">
      <nav className="dk-nav" aria-label="Desk sections">{nav.map(([id,label,Icon,n])=><button key={id} className={tab===id?'dk-nav-active':''} aria-current={tab===id?'page':undefined} onClick={()=>setTab(id)}><Icon size={17}/><span>{label}</span>{n?<b>{n}</b>:null}</button>)}</nav>
      <div className="dk-main">
        <div className="dk-stats">
          {[['Awaiting review',counts.pending,'review',Inbox],['Published',counts.published,'review',Check],['Pins to approve',counts.pins,'pins',MapPin],['Owner requests',counts.claims,'claims',UserCheck]].map(([label,n,t,Icon])=>{const I=Icon as typeof Inbox;return <button key={label as string} className="dk-stat" onClick={()=>{setTab(t as Tab);if(label==='Published')setFilter('published');else if(t==='review')setFilter('pending');}}><span className="dk-stat-icon"><I size={18}/></span><span>{label as string}</span><strong>{n as number}</strong></button>;})}
        </div>

        {tab==='review'&&<section className="dk-panel">
          <div className="dk-panel-head"><div><h2>Review queue</h2><p>Write an original summary and confirm rights before publishing. Owner submissions are listed first; publishing one also puts its pin on the map.</p></div>
            <div className="dk-chips" role="tablist">{(['pending','published','rejected','all'] as Filter[]).map(f=><button key={f} role="tab" aria-selected={filter===f} className={filter===f?'dk-chip-on':''} onClick={()=>setFilter(f)}>{f[0].toUpperCase()+f.slice(1)} <span>{f==='all'?data.listings.length:counts[f]}</span></button>)}</div></div>
          {filter==='pending'&&counts.pending>0&&<div className="dk-bulk"><span>Only want this week’s launches? Clear out older apps that aren’t new releases.</span><button className="rd-button rd-outline dk-sm" disabled={busy} onClick={()=>{if(confirm('Reject every pending import that was not released in the last 7 days? Owner submissions are kept.'))void action({action:'reject-stale',days:7});}}>Reject older imports</button></div>}{listings.length?<div className="dk-cards">{listings.map(l=><ListingEditor key={l.id} listing={l} pin={data.pins.find(p=>p.productId===l.id)} busy={busy} action={action}/>)}</div>:<Empty icon={Inbox} title={filter==='pending'?'All caught up':'Nothing here'} text={filter==='pending'?'New imports and owner submissions will appear here.':'Try another filter.'}/>}
        </section>}

        {tab==='makers'&&<MakersDesk adminKey={key} notify={notifyCb}/>}

        {tab==='pins'&&<section className="dk-panel"><div className="dk-panel-head"><div><h2>Business map submissions</h2><p>Check the business, location and product before a pin goes public. Pins publish automatically when their listing is published.</p></div></div>
          {data.pins.length?<div className="dk-cards">{data.pins.map(pin=>{const listing=data.listings.find(l=>l.id===pin.productId);return <article className="dk-card" key={pin.id}>
            <div className="dk-card-head"><span className="dk-avatar">{pin.name.slice(0,2).toUpperCase()}</span><div className="dk-card-title"><h3>{pin.name}</h3><p><MapPin size={13}/> {pin.city} · <a href={`https://www.openstreetmap.org/?mlat=${pin.lat}&mlon=${pin.lng}#map=15/${pin.lat}/${pin.lng}`} target="_blank" rel="noopener noreferrer">{pin.lat}, {pin.lng} <ArrowUpRight size={12}/></a></p></div><Status value={pin.status}/></div>
            <dl className="dk-meta"><div><dt>Owner email</dt><dd>{pin.email}</dd></div><div><dt>Category</dt><dd>{pin.genre}</dd></div><div><dt>Listing</dt><dd>{listing?<Status value={listing.status}/>:'Missing'}</dd></div><div><dt>Submitted</dt><dd>{new Date(pin.createdAt).toLocaleDateString()}</dd></div></dl>
            <div className="dk-actions"><button className="rd-button rd-primary dk-sm" disabled={busy||pin.status==='published'||listing?.status!=='published'} title={listing?.status!=='published'?'Publish the listing first':undefined} onClick={()=>action({action:'pin-review',id:pin.id,status:'published'})}><Check size={15}/> Approve pin</button><button className="rd-button rd-outline dk-sm" disabled={busy||pin.status==='rejected'} onClick={()=>action({action:'pin-review',id:pin.id,status:'rejected'})}><X size={15}/> Remove</button>{listing?.status!=='published'&&<button className="dk-link" onClick={()=>{setTab('review');setFilter('pending');}}>Review its listing →</button>}</div>
          </article>;})}</div>:<Empty icon={MapPin} title="No pins yet" text="Owner submissions with a location will appear here."/>}
        </section>}

        {tab==='community'&&<section className="dk-panel"><div className="dk-panel-head"><div><h2>Community moderation</h2><p>Posts and replies stay hidden until you publish them.</p></div></div>
          {data.posts.length?<div className="dk-cards">{data.posts.map(post=><article className="dk-card" key={post.id}>
            <div className="dk-card-head"><span className="dk-avatar">{post.author.slice(0,1).toUpperCase()}</span><div className="dk-card-title"><h3>{post.title}</h3><p>{post.author} · {post.email} · {post.topic}</p></div><Status value={post.status}/></div>
            <p className="dk-body">{post.body}</p>
            <div className="dk-actions"><button className="rd-button rd-primary dk-sm" disabled={busy||post.status==='published'} onClick={()=>action({action:'post-review',id:post.id,status:'published'})}>Publish</button><button className="rd-button rd-outline dk-sm" disabled={busy||post.status==='rejected'} onClick={()=>action({action:'post-review',id:post.id,status:'rejected'})}>Hide</button></div>
            {post.replies.length>0&&<div className="dk-replies">{post.replies.map(r=><div key={r.id}><p><b>{r.author}</b> {r.body}</p><Status value={r.status}/><button className="dk-link" disabled={busy||r.status==='published'} onClick={()=>action({action:'post-review',id:post.id,replyId:r.id,status:'published'})}>Approve</button><button className="dk-link" disabled={busy||r.status==='rejected'} onClick={()=>action({action:'post-review',id:post.id,replyId:r.id,status:'rejected'})}>Hide</button></div>)}</div>}
          </article>)}</div>:<Empty icon={MessagesSquare} title="Quiet in here" text="New community posts will appear for review."/>}
        </section>}

        {tab==='claims'&&<section className="dk-panel"><div className="dk-panel-head"><div><h2>Owner claims</h2><p>Owners request a claim from a product page. Verify ownership before approving.</p></div></div>
          {data.claims.length?<div className="dk-cards">{data.claims.map(claim=><form className="dk-card" key={claim.id} onSubmit={event=>{event.preventDefault();const form=new FormData(event.currentTarget);action({action:'claim-review',id:claim.id,status:'approved',manualEvidenceConfirmed:form.get('evidence')==='on'});}}>
            <div className="dk-card-head"><span className="dk-avatar"><UserCheck size={16}/></span><div className="dk-card-title"><h3>{data.listings.find(l=>l.id===claim.productId)?.name||claim.productId}</h3><p>{claim.email} · {claim.domain||'Manual store-account evidence required'}</p></div><Status value={claim.status}/></div>
            {claim.status!=='domain-verified'&&claim.status!=='approved'&&<label className="rd-checkbox"><input type="checkbox" name="evidence" required/> I have independently reviewed ownership evidence.</label>}
            <div className="dk-actions"><button className="rd-button rd-primary dk-sm" disabled={busy||claim.status==='approved'}>Approve claim</button><button type="button" className="rd-button rd-outline dk-sm" disabled={busy} onClick={()=>action({action:'claim-review',id:claim.id,status:'rejected'})}>Reject</button></div>
          </form>)}</div>:<Empty icon={UserCheck} title="No claims" text="Product owners can request a claim from a product page."/>}
        </section>}

        {tab==='invites'&&<section className="dk-panel"><div className="dk-panel-head"><div><h2>Owner invitations</h2><p>Prepare one professional invitation for a business contact. Nothing is sent automatically.</p></div></div>
          <form className="dk-form" onSubmit={event=>{event.preventDefault();const form=new FormData(event.currentTarget);action({action:'invite',productId:form.get('productId'),to:form.get('email'),businessContactConfirmed:form.get('business')==='on'});}}>
            <div className="dk-form-row"><label>Published product<select name="productId" required><option value="">Choose a product</option>{data.listings.filter(i=>i.status==='published').map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</select></label><label>Business contact email<input type="email" name="email" required/></label></div>
            <label className="rd-checkbox"><input type="checkbox" name="business" required/> I reviewed this business contact and the relevance of this invitation.</label>
            <div className="dk-actions"><button className="rd-button rd-outline dk-sm" disabled={busy}><Download size={15}/> Create draft</button><span className="rd-fine-print">Sending: {data.mailConfigured?'configured, each send needs confirmation':'disabled until the email provider and OUTREACH_ENABLED are set'}.</span></div>
          </form>
          {data.invites.length>0&&<div className="dk-cards">{data.invites.map(invite=><article className="dk-card" key={invite.id}>
            <div className="dk-card-head"><span className="dk-avatar"><Mail size={16}/></span><div className="dk-card-title"><h3>{invite.subject}</h3><p>To {invite.to}</p></div><Status value={invite.status}/></div>
            <details className="dk-details"><summary>Preview message <ChevronDown size={14}/></summary><pre>{invite.text}</pre></details>{invite.error&&<p className="rd-error">{invite.error}</p>}
            <div className="dk-actions"><button className="rd-button rd-outline dk-sm" disabled={busy||!data.mailConfigured||invite.status!=='draft'} onClick={()=>{if(window.confirm(`Send this invitation to ${invite.to}?`))action({action:'send-invite',id:invite.id,confirm:true});}}><Send size={15}/> Send</button></div>
          </article>)}</div>}
        </section>}

        {tab==='leads'&&<section className="dk-panel"><div className="dk-panel-head"><div><h2>Premium enquiries</h2><p>Messages from the growth page.</p></div></div>
          {data.leads.length?<div className="dk-cards">{data.leads.map(lead=><article className="dk-card" key={lead.id}><div className="dk-card-head"><span className="dk-avatar"><Sparkles size={16}/></span><div className="dk-card-title"><h3><a href={`mailto:${lead.email}`}>{lead.email}</a></h3><p>{new Date(lead.createdAt).toLocaleString()}</p></div></div><p className="dk-body">{lead.message}</p></article>)}</div>:<Empty icon={Sparkles} title="No enquiries yet" text="Enquiries from the growth page will appear here."/>}
        </section>}

        {tab==='sources'&&<section className="dk-panel">
          <div className="dk-panel-head"><div><h2>Sources & imports</h2><p>Each run imports one enabled source. Results stay private until reviewed. Last run: {data.lastRunAt?new Date(data.lastRunAt).toLocaleString():'never'}.</p></div>
            <div className="dk-actions"><button className="rd-button rd-outline dk-sm" disabled={busy} onClick={()=>action({action:'schedule',enabled:!data.enabled})}><Clock size={15}/> {data.enabled?'Pause daily imports':'Enable daily imports'}</button><button className="rd-button rd-primary dk-sm" disabled={busy} onClick={()=>action({action:'run'})}>{busy?<LoaderCircle className="rd-spin" size={15}/>:<Play size={15}/>} Run next source</button></div></div>
          <div className="dk-table">{data.sources.map(source=><div className="dk-row" key={source.id}>
            <span className="dk-kind">{KIND[source.kind]||source.kind}</span>
            <div className="dk-row-main"><b>{source.value}</b><small>{source.country.toUpperCase()} · {source.genre}</small></div>
            <button className={`dk-toggle${source.enabled?' dk-toggle-on':''}`} role="switch" aria-checked={source.enabled} aria-label={`${source.enabled?'Pause':'Enable'} ${source.value}`} disabled={busy} onClick={()=>action({action:'toggle-source',id:source.id,enabled:!source.enabled})}><i/></button>
            <button className="rd-button rd-outline dk-sm" disabled={busy||!source.enabled} onClick={()=>action({action:'run',sourceId:source.id})}><Download size={14}/> Import</button>
          </div>)}</div>
          <form className="dk-form" onSubmit={event=>{event.preventDefault();const fields=Object.fromEntries(new FormData(event.currentTarget));action({action:'source',...fields});event.currentTarget.reset();}}>
            <h3><Plus size={16}/> Add a source</h3>
            <div className="dk-form-row dk-form-row-4">
              <label>Type<select name="kind"><option value="website">Website</option><option value="appstore">App Store app link / ID</option><option value="appstore-search">App Store search phrase</option><option value="googleplay">Google Play link / package</option></select></label>
              <label className="dk-grow">URL, app ID or search phrase<input name="value" required maxLength={500} placeholder="https://your-product.com"/></label>
              <label>Genre<select name="genre">{genres.map(g=><option key={g}>{g}</option>)}</select></label>
              <label>Country<input name="country" defaultValue="in" minLength={2} maxLength={2} required/></label>
            </div>
            <div className="dk-actions"><button className="rd-button rd-outline dk-sm" disabled={busy}><Plus size={15}/> Add source</button><span className="rd-fine-print">Google Play {data.playConfigured?'uses SerpApi':'reads the public store page (SerpApi optional)'}. Websites need a public URL that allows crawling.</span></div>
          </form>
        </section>}

        {tab==='runs'&&<section className="dk-panel"><div className="dk-panel-head"><div><h2>Run history</h2></div></div>
          {data.runs.length?<div className="dk-table">{data.runs.map(run=><div className="dk-row" key={run.id}><Status value={run.status}/><div className="dk-row-main"><b>{run.imported} new {run.imported===1?'candidate':'candidates'}</b><small>{new Date(run.startedAt).toLocaleString()}{run.sourceId?` · ${data.sources.find(s=>s.id===run.sourceId)?.value||run.sourceId}`:''}</small>{run.errors.map(e=><small key={e} className="dk-err">{e}</small>)}</div></div>)}</div>:<Empty icon={History} title="No runs yet" text="Run a source to import your first candidates."/>}
        </section>}
      </div>
    </div>
    <div className="dk-toasts" aria-live="polite">{error&&<div className="dk-toast dk-toast-error" role="alert"><X size={16}/>{error}<button aria-label="Dismiss" onClick={()=>setError('')}><X size={14}/></button></div>}{notice&&<div className="dk-toast" role="status"><Check size={16}/>{notice}</div>}</div>
  </main>;
}

function Empty({icon:Icon,title,text}:{icon:typeof Inbox;title:string;text:string}){return <div className="dk-empty"><span><Icon size={22}/></span><h3>{title}</h3><p>{text}</p></div>;}

function ListingEditor({listing,pin,busy,action}:{listing:Listing;pin?:CatalogState['pins'][number];busy:boolean;action:(body:Record<string,unknown>)=>Promise<unknown>}){
  const owner=listing.id.startsWith('owner-');
  const [summary,setSummary]=useState(listing.editorialSummary&&(owner||listing.editorialSummary!==listing.description)?listing.editorialSummary:'');
  const [more,setMore]=useState(false);
  const short=summary.trim().length<80;
  return <form className={`dk-card dk-listing${owner?' dk-listing-owner':''}`} onSubmit={event=>{event.preventDefault();const form=new FormData(event.currentTarget);action({action:'review',id:listing.id,status:'published',summary,genre:form.get('genre'),rightsConfirmed:form.get('rights')==='on'});}}>
    <div className="dk-card-head">
      {listing.image?/* eslint-disable-next-line @next/next/no-img-element */<img className="dk-thumb" src={listing.image} alt="" referrerPolicy="no-referrer" loading="lazy"/>:<span className="dk-avatar dk-thumb">{listing.name.slice(0,1)}</span>}
      <div className="dk-card-title"><h3>{listing.name}</h3><p><span className="dk-kind">{KIND[listing.sourceKind]||listing.sourceKind}</span>{owner&&<span className="dk-kind dk-kind-owner">Owner submission</span>}<a href={listing.sourceUrl} target="_blank" rel="noopener noreferrer">{host(listing.sourceUrl)} <ArrowUpRight size={12}/></a></p></div>
      <Status value={listing.status}/>
    </div>
    {(listing.releasedAt||listing.developerName)&&<p className="dk-release">{listing.developerName&&<>By <b>{listing.developerName}</b></>}{listing.releasedAt&&<span className={Date.now()-Date.parse(listing.releasedAt)<8*86400000?'dk-new':''}>Released {ago(listing.releasedAt)}</span>}{listing.developerWebsite&&<a href={listing.developerWebsite} target="_blank" rel="noopener noreferrer">Developer site <ArrowUpRight size={11}/></a>}</p>}{pin&&<p className="dk-pin-note"><MapPin size={14}/> Map pin: {pin.city} · {pin.email} · <Status value={pin.status}/></p>}
    <div className="dk-source-text"><span className="dk-label">Source description</span><p className={more?'':'dk-clamp'}>{listing.description}</p>{listing.description.length>260&&<button type="button" className="dk-link" onClick={()=>setMore(m=>!m)}>{more?'Show less':'Show more'}</button>}</div>
    <div className="dk-form-row">
      <label className="dk-grow">Editorial summary <span className={`dk-count${short?' dk-count-low':''}`}>{summary.trim().length}/80 min</span>
        <textarea value={summary} onChange={e=>setSummary(e.target.value)} minLength={80} maxLength={1500} required rows={4} placeholder="Who is it for and what makes it useful? Use your own words, not the store copy."/></label>
      <label className="dk-genre">Genre<select name="genre" defaultValue={listing.genre}>{genres.map(g=><option key={g}>{g}</option>)}</select></label>
    </div>
    <div className="dk-listing-foot">
      <label className="rd-checkbox"><input type="checkbox" name="rights" required/> I checked the info, source attribution and image rights.{listing.image&&<> <a href={listing.image} target="_blank" rel="noopener noreferrer">View image <ArrowUpRight size={11}/></a></>}</label>
      <div className="dk-actions"><button type="button" className="rd-button rd-outline dk-sm" disabled={busy||listing.status==='rejected'} onClick={()=>action({action:'review',id:listing.id,status:'rejected'})}>{listing.status==='published'?'Unpublish':'Reject'}</button><button className="rd-button rd-primary dk-sm" disabled={busy||short}><Check size={15}/> {listing.status==='published'?'Update':'Publish'}{owner&&pin&&listing.status!=='published'?' + pin':''}</button></div>
    </div>
    {listing.status==='published'&&!owner&&<ClaimOutreach listing={listing}/>}
  </form>;
}

const ago=(iso:string)=>{const d=Math.floor((Date.now()-Date.parse(iso))/86400000);return d<=0?'today':d===1?'yesterday':d<30?`${d} days ago`:new Date(iso).toLocaleDateString();};
/** Ways to let the maker of an imported product know it's listed, so they can claim it. */
function ClaimOutreach({listing}:{listing:Listing}){
  const [copied,setCopied]=useState('');
  const link=`https://rivelolabs.com/claim?product=${encodeURIComponent(listing.id)}`;
  const post=`We featured ${listing.name} on Rivelo, a home for new apps and websites. Are you the maker? Claim your listing to edit it and put it on the map: ${link}`;
  const email=`Hi${listing.developerName?` ${listing.developerName} team`:''},\n\nWe featured ${listing.name} on Rivelo (rivelolabs.com), a directory and map of new independent apps and websites.\n\nIf you’re the maker, you can claim the listing for free to edit the description, logo and location: ${link}\n\nIf you’d rather not be listed, just reply and we’ll remove it.\n\nThanks,\nRivelo Labs`;
  const copy=async(text:string,label:string)=>{try{await navigator.clipboard.writeText(text);setCopied(label);setTimeout(()=>setCopied(''),2000);}catch{}};
  return <div className="dk-outreach"><span className="dk-label">Invite the maker to claim</span><div className="dk-actions">
    <button type="button" className="rd-button rd-outline dk-sm" onClick={()=>copy(link,'link')}>{copied==='link'?'Copied':'Copy claim link'}</button>
    <a className="rd-button rd-outline dk-sm" href={`https://x.com/intent/post?text=${encodeURIComponent(post)}`} target="_blank" rel="noopener noreferrer">Post on X</a>
    <button type="button" className="rd-button rd-outline dk-sm" onClick={()=>copy(email,'email')}>{copied==='email'?'Copied':'Copy email text'}</button>
    {listing.developerWebsite&&<a className="dk-link" href={listing.developerWebsite} target="_blank" rel="noopener noreferrer">Find their contact page →</a>}
  </div></div>;
}
