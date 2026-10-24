import {load} from 'cheerio';
import {safeFetch} from '@/lib/catalog/safe-fetch';
import {getConnection,report} from '@/lib/gsc';
import {askClaude} from './claude';
import {getSettings,saveResult,updateResult} from './tasks';

/**
 * Full site audit for Growth users:
 * 1) reads robots.txt + sitemap.xml (and sitemap indexes) to find the pages,
 * 2) loads up to 25 pages and reads every SEO key (title, description, H1, canonical, robots, Open Graph, structured data, alt text, size, speed),
 * 3) runs Google PageSpeed Insights (mobile) on the most important pages,
 * 4) joins it all with Search Console clicks / impressions / position per page,
 * 5) asks Claude for prioritised key notes grounded only in that data (one call, uses AI credit).
 * Env (optional): PAGESPEED_API_KEY for higher PageSpeed limits.
 */
export type PageAudit={url:string;status:number;ms:number;kb:number;title:string;description:string;h1:string[];canonical:string;robots:string;ogImage:boolean;ogTitle:boolean;
  schema:string[];words:number;images:number;imagesNoAlt:number;lang:string;viewport:boolean;issues:string[];gsc?:{clicks:number;impressions:number;ctr:number;position:number}|null};
export type Speed={url:string;performance:number|null;seo:number|null;accessibility:number|null;bestPractices:number|null;lcp:string;cls:string;tbt:string;fcp:string;field:{lcp?:string;inp?:string;cls?:string;rating?:string}|null;opportunities:string[];error?:string;pending?:boolean;source?:'pagespeed'|'rivelo'};
export type Audit={site:string;sitemap:{found:boolean;urls:number;source:string};robots:{found:boolean;blocksAll:boolean;aiBlocked:string[]};llmsTxt:boolean;pages:PageAudit[];speed:Speed[];
  status:'running'|'done';startedAt:string;notesError?:string;gscConnected:boolean;
  totals:{pages:number;withIssues:number;missingTitle:number;missingDescription:number;missingH1:number;noCanonical:number;slow:number};notes?:{priority:'high'|'medium'|'low';page:string;issue:string;fix:string;why:string}[];summary?:string};

const MAX_PAGES=25;
const origin=(u:string)=>{const x=new URL(u);return x.origin;};
async function text(url:string,maxBytes=2_000_000){try{const r=await safeFetch(url,{maxBytes,redirects:5});return r.status<400?{status:r.status,text:r.text,url:r.url}:null;}catch{return null;}}

/** URLs from sitemap.xml (follows sitemap indexes, max 3 child sitemaps). */
async function sitemapUrls(base:string,robots:string){
  const listed=[...robots.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map(m=>m[1]);
  const candidates=[...new Set([...listed,`${base}/sitemap.xml`,`${base}/sitemap_index.xml`])];
  for(const sm of candidates){
    const r=await text(sm,5_000_000);if(!r||!/<(urlset|sitemapindex)/i.test(r.text))continue;
    const locs=(x:string)=>[...x.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map(m=>m[1].replace(/&amp;/g,'&'));
    if(/<sitemapindex/i.test(r.text)){const urls:string[]=[];for(const child of locs(r.text).slice(0,3)){const c=await text(child,5_000_000);if(c)urls.push(...locs(c.text));if(urls.length>500)break;}return {source:sm,urls};}
    return {source:sm,urls:locs(r.text)};
  }
  return {source:'',urls:[] as string[]};
}
function blocked(robots:string,agent:string){
  let applies=false,out=false;
  for(const raw of robots.split(/\r?\n/)){const l=raw.replace(/#.*/,'').trim();const [k,...v]=l.split(':');const key=(k||'').trim().toLowerCase(),val=v.join(':').trim();
    if(key==='user-agent')applies=val==='*'?applies||agent==='*':val.toLowerCase()===agent.toLowerCase();else if(applies&&key==='disallow'&&val==='/')out=true;}
  return out;
}
function auditPage(url:string,status:number,ms:number,html:string):PageAudit{
  const $=load(html);const meta=(n:string)=>($(`meta[name="${n}"]`).attr('content')||'').trim();
  const title=$('title').first().text().trim(),description=meta('description'),h1=$('h1').map((_,e)=>$(e).text().trim().replace(/\s+/g,' ')).get().slice(0,3);
  const canonical=$('link[rel="canonical"]').attr('href')||'',robots=meta('robots').toLowerCase();
  const imgs=$('img'),noAlt=imgs.filter((_,e)=>!($(e).attr('alt')||'').trim()).length;
  const schema=$('script[type="application/ld+json"]').map((_,e)=>{try{const j=JSON.parse($(e).text());const t=(Array.isArray(j)?j:[j]).flatMap((x:Record<string,unknown>)=>x['@graph']?(x['@graph'] as Record<string,unknown>[]).map(g=>g['@type']):[x['@type']]);return t.filter(Boolean).map(String);}catch{return [];}}).get();
  $('script,style,noscript').remove();const words=$('body').text().split(/\s+/).filter(w=>w.length>1).length;
  const p:PageAudit={url,status,ms,kb:Math.round(html.length/1024),title,description,h1,canonical,robots,ogImage:!!$('meta[property="og:image"]').attr('content'),ogTitle:!!$('meta[property="og:title"]').attr('content'),
    schema:[...new Set(schema)].slice(0,6),words,images:imgs.length,imagesNoAlt:noAlt,lang:$('html').attr('lang')||'',viewport:$('meta[name="viewport"]').length>0,issues:[]};
  const i=p.issues;
  if(status>=400)i.push(`Page returns HTTP ${status}`);
  if(!title)i.push('No <title>');else if(title.length<20)i.push(`Title is short (${title.length} chars)`);else if(title.length>65)i.push(`Title is long (${title.length} chars, cut off in Google)`);
  if(!description)i.push('No meta description');else if(description.length<70)i.push(`Meta description is short (${description.length} chars)`);else if(description.length>170)i.push(`Meta description is long (${description.length} chars)`);
  if(!h1.length)i.push('No H1 heading');else if($('h1').length>1)i.push(`${$('h1').length} H1 headings (use one)`);
  if(!canonical)i.push('No canonical link');
  if(/noindex/.test(robots))i.push('Page is set to noindex');
  if(!p.ogImage)i.push('No share image (og:image)');
  if(!schema.length)i.push('No structured data (JSON-LD)');
  if(noAlt)i.push(`${noAlt} of ${imgs.length} images have no alt text`);
  if(words<150)i.push(`Thin content (${words} words)`);
  if(!p.lang)i.push('No lang attribute on <html>');
  if(!p.viewport)i.push('No mobile viewport tag');
  if(ms>1500)i.push(`Slow server response (${ms} ms)`);
  if(p.kb>800)i.push(`Heavy HTML (${p.kb} KB)`);
  return p;
}
/** Google PageSpeed Insights, mobile. Never throws. */
async function pageSpeed(url:string):Promise<Speed>{
  const empty:Speed={url,performance:null,seo:null,accessibility:null,bestPractices:null,lcp:'',cls:'',tbt:'',fcp:'',field:null,opportunities:[]};
  try{
    const q=new URLSearchParams({url,strategy:'mobile'});for(const c of ['performance','seo','accessibility','best-practices'])q.append('category',c);if(process.env.PAGESPEED_API_KEY)q.set('key',process.env.PAGESPEED_API_KEY);
    const r=await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`,{signal:AbortSignal.timeout(180000),cache:'no-store'});
    if(!r.ok){const e=await r.json().catch(()=>null);const quota=/quota/i.test(String(e?.error?.message||''));return {...empty,error:quota?'Google PageSpeed daily limit reached':'Google PageSpeed could not test this page'};}
    const d=await r.json();const L=d.lighthouseResult||{},cat=L.categories||{},a=L.audits||{};const sc=(k:string)=>cat[k]?.score!=null?Math.round(cat[k].score*100):null;
    const fm=d.loadingExperience?.metrics||{};const f=(k:string)=>fm[k]?.percentile!=null?String(fm[k].percentile):undefined;
    const opps=Object.values(a as Record<string,{score:number|null;title:string;details?:{type?:string;overallSavingsMs?:number}}>).filter(x=>x.details?.type==='opportunity'&&(x.details.overallSavingsMs||0)>300&&(x.score??1)<0.9).sort((x,y)=>(y.details!.overallSavingsMs||0)-(x.details!.overallSavingsMs||0)).slice(0,4).map(x=>`${x.title} (~${Math.round((x.details!.overallSavingsMs||0)/100)/10}s)`);
    return {source:'pagespeed',url,performance:sc('performance'),seo:sc('seo'),accessibility:sc('accessibility'),bestPractices:sc('best-practices'),lcp:a['largest-contentful-paint']?.displayValue||'',cls:a['cumulative-layout-shift']?.displayValue||'',tbt:a['total-blocking-time']?.displayValue||'',fcp:a['first-contentful-paint']?.displayValue||'',
      field:Object.keys(fm).length?{lcp:f('LARGEST_CONTENTFUL_PAINT_MS')?`${f('LARGEST_CONTENTFUL_PAINT_MS')} ms`:undefined,inp:f('INTERACTION_TO_NEXT_PAINT')?`${f('INTERACTION_TO_NEXT_PAINT')} ms`:undefined,cls:f('CUMULATIVE_LAYOUT_SHIFT_SCORE')?String(Number(f('CUMULATIVE_LAYOUT_SHIFT_SCORE'))/100):undefined,rating:d.loadingExperience?.overall_category}:null,opportunities:opps};
  }catch{return {...empty,error:'Google PageSpeed timed out'};}
}

export async function runAudit(userId:string,opts:{background?:(fn:()=>Promise<void>)=>void}={}){
  const s=await getSettings(userId);const conn=await getConnection(userId).catch(()=>null);
  const fromGsc=conn?.siteUrl?(conn.siteUrl.startsWith('sc-domain:')?`https://${conn.siteUrl.slice(10)}`:conn.siteUrl):'';
  const start=(/^https?:\/\//.test(s.siteUrl)&&!/play\.google|apps\.apple/.test(s.siteUrl)?s.siteUrl:'')||fromGsc;
  if(!start)throw Error('Add your website in Agent settings (or connect Search Console) to run a site audit.');
  const home=await text(start);if(!home)throw Error('We couldn’t load your website. Check the address and that it is public.');
  const base=origin(home.url);
  const [robotsR,llms]=await Promise.all([text(`${base}/robots.txt`,300_000),text(`${base}/llms.txt`,300_000)]);
  const robots=robotsR?.text||'';const sm=await sitemapUrls(base,robots);

  // Search Console per page, to rank pages by importance and to show the real traffic next to each issue.
  const gsc=new Map<string,{clicks:number;impressions:number;ctr:number;position:number}>();
  if(conn?.siteUrl){try{const r=await report(userId,conn.siteUrl,28);for(const p of r.pages)gsc.set(p.key.replace(/\/$/,''),{clicks:p.clicks,impressions:p.impressions,ctr:p.ctr,position:p.position});}catch{}}
  const sameSite=(u:string)=>{try{return new URL(u).origin===base;}catch{return false;}};
  const ranked=[...new Set([home.url,...[...gsc.keys()].filter(sameSite),...sm.urls.filter(sameSite)])].slice(0,MAX_PAGES);

  const pages:PageAudit[]=[];
  for(let i=0;i<ranked.length;i+=5){
    pages.push(...await Promise.all(ranked.slice(i,i+5).map(async url=>{const t0=Date.now();
      try{const r=await safeFetch(url,{maxBytes:3_000_000,redirects:5});const p=auditPage(url,r.status,Date.now()-t0,r.text);p.gsc=gsc.get(url.replace(/\/$/,''))||null;return p;}
      catch(e){return {...auditPage(url,0,Date.now()-t0,''),issues:[`Could not load: ${(e as Error).message}`]};}})));
  }
  // PageSpeed on the home page + the 3 pages with the most Google impressions.
  const byTraffic=pages.filter(p=>p.gsc&&p.url!==home.url).sort((a,b)=>b.gsc!.impressions-a.gsc!.impressions).map(p=>p.url);
  const speedUrls=[...new Set([home.url,...byTraffic,...pages.map(p=>p.url)])].slice(0,4);
  const speed:Speed[]=speedUrls.map(url=>({url,performance:null,seo:null,accessibility:null,bestPractices:null,lcp:'',cls:'',tbt:'',fcp:'',field:null,opportunities:[],pending:true}));

  // Duplicate titles / descriptions across pages.
  const dup=(k:'title'|'description')=>{const m=new Map<string,number>();for(const p of pages)if(p[k])m.set(p[k],(m.get(p[k])||0)+1);for(const p of pages)if(p[k]&&(m.get(p[k])||0)>1)p.issues.push(`Same ${k==='title'?'title':'meta description'} as ${m.get(p[k])!-1} other page(s)`);};dup('title');dup('description');
  const aiBots=['GPTBot','OAI-SearchBot','ClaudeBot','Claude-SearchBot','PerplexityBot','Google-Extended'].filter(b=>blocked(robots,b));
  const audit:Audit={status:'running',startedAt:new Date().toISOString(),gscConnected:gsc.size>0,site:base,sitemap:{found:sm.urls.length>0,urls:sm.urls.length,source:sm.source},robots:{found:!!robotsR,blocksAll:blocked(robots,'*'),aiBlocked:aiBots},llmsTxt:!!llms&&!/<html/i.test(llms.text),pages,speed,
    totals:{pages:pages.length,withIssues:pages.filter(p=>p.issues.length).length,missingTitle:pages.filter(p=>!p.title).length,missingDescription:pages.filter(p=>!p.description).length,missingH1:pages.filter(p=>!p.h1.length).length,noCanonical:pages.filter(p=>!p.canonical).length,slow:speed.filter(x=>x.performance!=null&&x.performance<50).length}};

  // Save the crawl now; PageSpeed (2–4 minutes for several pages) and the key notes finish in the background.
  const saved=await saveResult(userId,'audit',audit);
  const finish=()=>finishAudit(userId,saved.id,audit,s,base);
  if(opts.background)opts.background(finish);else await finish();
  return {...saved,payload:audit};
}

async function finishAudit(userId:string,id:string,audit:Audit,s:Awaited<ReturnType<typeof getSettings>>,base:string){
  const pages=audit.pages,aiBots=audit.robots.aiBlocked;
  // Google PageSpeed first; if it fails (daily limit, timeout), Rivelo's own lighter speed check of the same page.
  audit.speed=await Promise.all(audit.speed.map(async x=>{const g=await pageSpeed(x.url);if(g.performance!=null)return g;const own=await quickSpeed(x.url);return {...own,error:g.error?`${g.error}, so this is Rivelo’s own speed check.`:own.error};}));
  const speed=audit.speed;audit.totals.slow=speed.filter(x=>x.performance!=null&&x.performance<50).length;
  // Claude turns the raw data into a short, prioritised to-do list (only from these facts).
  const compact=pages.map(p=>`${p.url.replace(base,'')||'/'} | GSC: ${p.gsc?`${p.gsc.clicks} clicks, ${p.gsc.impressions} impr, pos ${p.gsc.position}, CTR ${(p.gsc.ctr*100).toFixed(1)}%`:'no data'} | title(${p.title.length}): ${p.title.slice(0,70)} | issues: ${p.issues.join('; ')||'none'}`).join('\n');
  const sp=speed.map(x=>`${x.url.replace(base,'')||'/'} perf ${x.performance} seo ${x.seo} LCP ${x.lcp} CLS ${x.cls} TBT ${x.tbt}${x.field?.rating?` field ${x.field.rating}`:''} | ${x.opportunities.join('; ')}`).join('\n');
  try{
    const {json}=await askClaude(userId,'audit',{maxTokens:2200,prompt:`<product>\nName: ${s.productName}\nWhat it does: ${s.description}\n</product>\n<data>\nSite: ${base}\nSitemap: ${audit.sitemap.found?`${audit.sitemap.urls} URLs`:'not found'} · robots.txt: ${audit.robots.found?'found':'missing'}${audit.robots.blocksAll?' (blocks all crawlers!)':''} · AI crawlers blocked: ${aiBots.join(', ')||'none'} · llms.txt: ${audit.llmsTxt?'yes':'no'}\nPages (path | Search Console last 28 days | title | issues):\n${compact}\nPageSpeed (mobile):\n${sp}\n</data>\nYou are auditing this website for SEO and AI-search visibility. Using ONLY the data above, write the key notes the owner should act on, most valuable first. Prefer fixes on pages that already get impressions in Search Console (low CTR with good position = rewrite title/description; position 8-20 = improve content). Return {"summary":"2 sentences on the site's overall state","notes":[{"priority":"high|medium|low","page":"path or 'whole site'","issue":"","fix":"specific action","why":"which number in the data shows this matters"}] (6 to 10 notes)}.`});
    audit.notes=(Array.isArray(json.notes)?json.notes:[]) as Audit['notes'];audit.summary=String(json.summary||'');
  }catch(e){audit.notesError=(e as Error).message;}
  audit.status='done';
  await updateResult(userId,id,audit).catch(()=>{});
}

/**
 * Fallback speed check without a browser (when Google PageSpeed is unavailable): server response time, page weight,
 * render-blocking scripts and styles, uncompressed / uncached files and heavy images. The score is an estimate.
 */
async function quickSpeed(url:string):Promise<Speed>{
  const out:Speed={source:'rivelo',url,performance:null,seo:null,accessibility:null,bestPractices:null,lcp:'',cls:'',tbt:'',fcp:'',field:null,opportunities:[]};
  try{
    const t0=Date.now();const page=await safeFetch(url,{maxBytes:3_000_000,redirects:5});const ttfb=Date.now()-t0;
    const $=load(page.text);const abs=(u?:string)=>{try{return u?new URL(u,page.url).href:'';}catch{return '';}};
    const scripts=$('script[src]').map((_,e)=>({src:abs($(e).attr('src')),blocking:!$(e).attr('async')&&$(e).attr('defer')===undefined&&$(e).attr('type')!=='module'&&$(e).parents('head').length>0})).get().filter(x=>x.src);
    const styles=$('link[rel="stylesheet"]').map((_,e)=>abs($(e).attr('href'))).get().filter(Boolean);
    const imgs=$('img').map((_,e)=>({src:abs($(e).attr('src')),lazy:$(e).attr('loading')==='lazy',sized:!!$(e).attr('width')&&!!$(e).attr('height')})).get().filter(x=>x.src&&!x.src.startsWith('data:'));
    const res=[...scripts.map(x=>({u:x.src,k:'js'})),...styles.map(u=>({u,k:'css'})),...imgs.slice(0,8).map(x=>({u:x.src,k:'img'}))].slice(0,20);
    const sizes=await Promise.all(res.map(async r=>{try{const f=await safeFetch(r.u,{maxBytes:5_000_000,redirects:3,headers:{'Accept-Encoding':'gzip, br'}});
      return {...r,kb:Math.round(f.body.length/1024),zip:!!f.headers['content-encoding'],cache:Number(/max-age=(\d+)/.exec(String(f.headers['cache-control']||''))?.[1]||0),type:String(f.headers['content-type']||'')};}catch{return {...r,kb:0,zip:true,cache:99999,type:''};}}));
    const total=Math.round(page.text.length/1024)+sizes.reduce((n,x)=>n+x.kb,0),jsKb=sizes.filter(x=>x.k==='js').reduce((n,x)=>n+x.kb,0);
    const blocking=scripts.filter(x=>x.blocking).length+styles.length;
    const heavy=sizes.filter(x=>x.k==='img'&&x.kb>150),oldFmt=sizes.filter(x=>x.k==='img'&&/jpe?g|png/.test(x.type)&&x.kb>60);
    const noZip=sizes.filter(x=>x.k!=='img'&&x.kb>20&&!x.zip),noCache=sizes.filter(x=>x.cache<3600),unsized=imgs.filter(x=>!x.sized).length;
    let score=100;score-=Math.min(30,Math.max(0,(ttfb-600)/50));score-=Math.min(25,Math.max(0,(total-1500)/150));score-=Math.min(20,Math.max(0,(jsKb-300)/40));score-=Math.min(15,blocking*3);score-=Math.min(10,heavy.length*3);
    out.performance=Math.max(5,Math.round(score));
    out.fcp=`server ${ttfb} ms`;out.lcp=`${total} KB page weight`;out.tbt=`${jsKb} KB JavaScript`;out.cls=unsized?`${unsized} unsized images`:'images sized';
    const o:string[]=[];
    if(ttfb>800)o.push(`Slow server response (${ttfb} ms): cache the HTML or use a CDN`);
    if(blocking)o.push(`${blocking} render-blocking script/style file(s): add defer/async or inline critical CSS`);
    if(jsKb>300)o.push(`${jsKb} KB of JavaScript: split or remove unused code`);
    if(heavy.length)o.push(`${heavy.length} image(s) over 150 KB: compress them`);
    if(oldFmt.length)o.push(`${oldFmt.length} JPEG/PNG image(s): serve WebP or AVIF`);
    if(noZip.length)o.push(`${noZip.length} text file(s) without gzip/brotli compression`);
    if(noCache.length>3)o.push(`${noCache.length} files with short or no browser caching`);
    if(unsized)o.push(`${unsized} image(s) without width/height (layout shift)`);
    out.opportunities=o.slice(0,5);
  }catch(e){out.error=`Speed check failed: ${(e as Error).message}`;}
  return out;
}
