import {load} from 'cheerio';
import {publicUrl,safeFetch} from '@/lib/catalog/safe-fetch';

/** One check in the free Visibility Check (SEO + social + AI-search readiness). */
export type Check={id:string;group:'Search'|'Social'|'AI search'|'Speed & tech';label:string;ok:boolean;detail:string;fix:string;weight:number};
export type Report={url:string;finalUrl:string;score:number;grade:string;title:string;description:string;ms:number;checks:Check[];checkedAt:string};

const AI_BOTS=['GPTBot','OAI-SearchBot','ClaudeBot','Claude-SearchBot','PerplexityBot','Google-Extended'];
function blockedFor(robots:string,agent:string){
  // Minimal robots.txt reader: is "/" disallowed for this agent (or for * when the agent has no group)?
  const groups:{agents:string[];rules:string[]}[]=[];let cur:{agents:string[];rules:string[]}|null=null;
  for(const raw of robots.split(/\r?\n/)){const line=raw.replace(/#.*/,'').trim();if(!line)continue;const [k,...v]=line.split(':');const key=k.trim().toLowerCase(),val=v.join(':').trim();
    if(key==='user-agent'){if(!cur||cur.rules.length){cur={agents:[],rules:[]};groups.push(cur);}cur.agents.push(val.toLowerCase());}
    else if(cur&&(key==='disallow'||key==='allow'))cur.rules.push(`${key}:${val}`);}
  const g=groups.find(x=>x.agents.includes(agent.toLowerCase()))||groups.find(x=>x.agents.includes('*'));
  return !!g&&g.rules.includes('disallow:/')&&!g.rules.some(r=>r==='allow:/');
}
async function small(url:string){try{const r=await safeFetch(url,{maxBytes:300_000});return r.status<400?r.text:null;}catch{return null;}}

export async function checkVisibility(input:string):Promise<Report>{
  const url=publicUrl(/^https?:\/\//i.test(input.trim())?input.trim():`https://${input.trim()}`);
  const started=Date.now();
  const page=await safeFetch(url,{maxBytes:3_000_000});
  const ms=Date.now()-started;
  if(page.status>=400)throw Error(page.status===403||page.status===429?`The site blocked automated checks (HTTP ${page.status}), so we couldn’t read it.`:`The site answered with HTTP ${page.status}. Check the address and try again.`);
  const final=new URL(page.url),origin=final.origin;
  const $=load(page.text);
  const [robots,sitemap,llms]=await Promise.all([small(`${origin}/robots.txt`),small(`${origin}/sitemap.xml`),small(`${origin}/llms.txt`)]);
  const title=$('title').first().text().trim(),desc=($('meta[name="description"]').attr('content')||'').trim();
  const h1=$('h1').length,imgs=$('img'),alts=imgs.filter((_,el)=>!!($(el).attr('alt')||'').trim()).length;
  const metaRobots=$('meta[name="robots"],meta[name="googlebot"]').map((_,el)=>$(el).attr('content')||'').get().join(' ').toLowerCase();
  const ld=$('script[type="application/ld+json"]').length;
  const og=(p:string)=>($(`meta[property="og:${p}"]`).attr('content')||'').trim();
  const blockedAi=robots?AI_BOTS.filter(b=>blockedFor(robots,b)):[];
  const kb=Math.round(page.body.length/1024);
  const checks:Check[]=[
    {id:'https',group:'Speed & tech',label:'Secure HTTPS address',ok:final.protocol==='https:',detail:final.protocol==='https:'?'Served over HTTPS.':'The page is not on HTTPS.',fix:'Turn on HTTPS (free with most hosts) and redirect http:// to https://.',weight:8},
    {id:'speed',group:'Speed & tech',label:'Fast first response',ok:ms<1500,detail:`Answered in ${ms} ms from our server.`,fix:'Use a CDN or static hosting and cache your HTML; aim for under 1.5 s.',weight:7},
    {id:'weight',group:'Speed & tech',label:'Light HTML',ok:kb<800,detail:`HTML is ${kb} KB.`,fix:'Trim inline scripts and data from the HTML; keep it under ~800 KB.',weight:3},
    {id:'viewport',group:'Speed & tech',label:'Mobile-friendly viewport',ok:$('meta[name="viewport"]').length>0,detail:$('meta[name="viewport"]').length?'Has a viewport tag.':'No viewport tag; phones will show a zoomed-out page.',fix:'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',weight:6},
    {id:'title',group:'Search',label:'Page title',ok:title.length>=10&&title.length<=65,detail:title?`“${title.slice(0,80)}” (${title.length} characters)`:'No <title> found.',fix:'Write a 10–65 character title that says what the product is, e.g. “Acme — Simple invoicing for freelancers”.',weight:10},
    {id:'description',group:'Search',label:'Meta description',ok:desc.length>=50&&desc.length<=170,detail:desc?`${desc.length} characters.`:'No meta description.',fix:'Add a 50–160 character description; it becomes the grey text under your link on Google.',weight:8},
    {id:'h1',group:'Search',label:'One main heading (H1)',ok:h1===1,detail:h1?`${h1} H1 heading${h1>1?'s':''} found.`:'No H1 heading.',fix:'Use exactly one <h1> that names the product and its main benefit.',weight:5},
    {id:'canonical',group:'Search',label:'Canonical link',ok:$('link[rel="canonical"]').length>0,detail:$('link[rel="canonical"]').length?'Has a canonical URL.':'No canonical URL.',fix:'Add <link rel="canonical" href="https://your-site.com/"> so search engines know the main address.',weight:4},
    {id:'indexable',group:'Search',label:'Allowed in search results',ok:!/noindex/.test(metaRobots)&&!(robots&&blockedFor(robots,'Googlebot')),detail:/noindex/.test(metaRobots)?'The page asks search engines not to index it (noindex).':robots&&blockedFor(robots,'Googlebot')?'robots.txt blocks Google.':'Search engines may index this page.',fix:'Remove “noindex” and any “Disallow: /” for Googlebot.',weight:12},
    {id:'sitemap',group:'Search',label:'XML sitemap',ok:!!sitemap&&/<urlset|<sitemapindex/i.test(sitemap)||!!robots&&/sitemap:/i.test(robots),detail:sitemap&&/<urlset|<sitemapindex/i.test(sitemap)?'Found /sitemap.xml.':'No sitemap found at /sitemap.xml.',fix:'Publish /sitemap.xml listing your pages and submit it in Google Search Console and Bing Webmaster Tools.',weight:5},
    {id:'schema',group:'Search',label:'Structured data',ok:ld>0,detail:ld?`${ld} JSON-LD block${ld>1?'s':''}.`:'No structured data.',fix:'Add JSON-LD (Organization, SoftwareApplication or Product) so Google can show rich results.',weight:5},
    {id:'alts',group:'Search',label:'Image descriptions (alt text)',ok:imgs.length===0||alts/imgs.length>=0.8,detail:imgs.length?`${alts} of ${imgs.length} images have alt text.`:'No images on the page.',fix:'Describe meaningful images with alt text; it helps Google Images and accessibility.',weight:3},
    {id:'lang',group:'Search',label:'Language set',ok:!!$('html').attr('lang'),detail:$('html').attr('lang')?`lang="${$('html').attr('lang')}"`:'No lang attribute on <html>.',fix:'Add lang="en" (or your language) to the <html> tag.',weight:2},
    {id:'og',group:'Social',label:'Share preview (Open Graph)',ok:!!og('title')&&!!og('image'),detail:og('image')?'Has og:title and og:image.':'Missing og:image or og:title; shared links show no picture.',fix:'Add og:title, og:description and a 1200×630 og:image so links look good on X, LinkedIn and WhatsApp.',weight:7},
    {id:'twitter',group:'Social',label:'X / Twitter card',ok:$('meta[name="twitter:card"]').length>0,detail:$('meta[name="twitter:card"]').length?'Has a twitter:card tag.':'No twitter:card tag.',fix:'Add <meta name="twitter:card" content="summary_large_image">.',weight:3},
    {id:'favicon',group:'Social',label:'Favicon',ok:$('link[rel~="icon"]').length>0,detail:$('link[rel~="icon"]').length?'Has a favicon.':'No favicon link.',fix:'Add a favicon; it shows next to your result on Google mobile.',weight:2},
    {id:'ai',group:'AI search',label:'Open to ChatGPT, Claude & Perplexity',ok:blockedAi.length===0,detail:blockedAi.length?`robots.txt blocks ${blockedAi.join(', ')}.`:'AI search crawlers are not blocked.',fix:'Allow GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot and PerplexityBot in robots.txt so AI assistants can read and recommend you.',weight:6},
    {id:'llms',group:'AI search',label:'llms.txt guide for AI assistants',ok:!!llms&&llms.trim().length>40&&!/<html/i.test(llms),detail:llms&&!/<html/i.test(llms)?'Found /llms.txt.':'No /llms.txt.',fix:'Publish /llms.txt: a short plain-text summary of what you do, who it is for and your key pages.',weight:4},
    {id:'listed',group:'AI search',label:'Mentioned on trusted directories',ok:false,detail:'AI assistants and Google trust products that independent sites link to.',fix:'List your product free on Rivelo Labs and add the “Featured on Rivelo Labs” badge — a real backlink and a place people discover you.',weight:0},
  ];
  const total=checks.reduce((s,c)=>s+c.weight,0),got=checks.reduce((s,c)=>s+(c.ok?c.weight:0),0);
  const score=Math.round(got/total*100);
  const grade=score>=90?'Excellent':score>=75?'Good':score>=55?'Needs work':'Hard to find';
  return {url,finalUrl:final.href,score,grade,title,description:desc,ms,checks,checkedAt:new Date().toISOString()};
}
