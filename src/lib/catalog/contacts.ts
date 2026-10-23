import {load} from 'cheerio';
import {robotsAllows,safeFetch} from './safe-fetch';
import {updateCatalog,readCatalog} from './store';
import type {Listing} from './types';

/**
 * Finds a publicly listed business contact for an imported product, from the product's own website only
 * (homepage, /contact, /about). Respects robots.txt. Personal, security, legal and no-reply addresses are skipped.
 * Nothing is emailed here: results go to the Discovery desk, where a person reviews them and drafts an invitation.
 */
const SKIP=/^(no-?reply|do-?not-?reply|privacy|abuse|security|legal|dpo|gdpr|postmaster|webmaster|mailer-daemon|bounce|unsubscribe|dmca|careers|jobs|hr|billing|invoices?)\b/i;
const GOOD=['hello','hi','contact','team','founders','founder','info','partners','partnerships','press','media','marketing','business','support','help'];
const FAKE=/(example\.(com|org)|sentry|wixpress|domain\.com|email\.com|yourdomain|@2x|\.(png|jpe?g|gif|svg|webp)$)/i;
const EMAIL=/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,24}/gi;
const base=(h:string)=>h.replace(/^www\./,'').split('.').slice(-2).join('.');

export type FoundContact={email:string;foundOn:string;website:string};
function score(email:string,siteHost:string){
  const [local,domain]=email.toLowerCase().split('@');
  if(SKIP.test(local)||FAKE.test(email))return -1;
  let s=base(domain)===base(siteHost)?100:20;               // the product's own domain first
  const i=GOOD.findIndex(g=>local===g||local.startsWith(g+'.')||local.startsWith(g+'-'));
  s+=i>=0?50-i*2:0;                                          // role inboxes over personal names
  return s;
}
export async function findPublicContact(website:string):Promise<FoundContact|null>{
  const first=await safeFetch(website,{maxBytes:1_500_000,redirects:5});
  if(first.status>=400)throw Error(`Website answered HTTP ${first.status}.`);
  const origin=new URL(first.url).origin,host=new URL(first.url).hostname;
  if(/(^|\.)producthunt\.com$/.test(host))throw Error('Could not resolve the product website.');
  let robots='';try{const r=await safeFetch(`${origin}/robots.txt`,{maxBytes:200_000});if(r.status<400)robots=r.text;}catch{}
  const pages:[string,string][]=[[first.url,first.text]];
  for(const path of ['/contact','/about']){
    if(robots&&!robotsAllows(robots,path))continue;
    try{const r=await safeFetch(origin+path,{maxBytes:1_000_000});if(r.status<400&&/html/i.test(String(r.headers['content-type']||'')))pages.push([r.url,r.text]);}catch{}
  }
  const seen=new Map<string,{score:number;foundOn:string}>();
  for(const [url,html] of pages){
    const $=load(html);
    const found=[...$('a[href^="mailto:"]').map((_,a)=>decodeURIComponent(($(a).attr('href')||'').slice(7).split('?')[0])).get(),...($('body').text().match(EMAIL)||[])];
    for(const raw of found){const email=raw.trim().toLowerCase().replace(/^[.]+|[.]+$/g,'');if(!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(email))continue;
      const s=score(email,host);if(s>0&&(!seen.has(email)||seen.get(email)!.score<s))seen.set(email,{score:s,foundOn:url});}
  }
  const best=[...seen.entries()].sort((a,b)=>b[1].score-a[1].score)[0];
  return best?{email:best[0],foundOn:best[1].foundOn,website:origin}:null;
}

const needsLookup=(l:Listing)=>!!l.developerWebsite&&!l.contactCheckedAt&&l.status!=='rejected'&&/^(producthunt|showhn|hackernews|hn):/.test(l.sourceKey);
/** Looks up contacts for imported listings that haven't been checked yet (small batches, ~25 s budget). */
export async function enrichContacts(limit=12,ids?:string[]){
  const state=await readCatalog();
  const todo=state.listings.filter(l=>ids?ids.includes(l.id)&&!!l.developerWebsite:needsLookup(l)).slice(0,limit);
  const results:{id:string;email?:string;foundOn?:string;website?:string;error?:string}[]=[];
  const started=Date.now();
  for(let i=0;i<todo.length&&Date.now()-started<25000;i+=4){
    results.push(...await Promise.all(todo.slice(i,i+4).map(async l=>{
      try{const c=await findPublicContact(l.developerWebsite!);return {id:l.id,email:c?.email,foundOn:c?.foundOn,website:c?.website};}
      catch(e){return {id:l.id,error:e instanceof Error?e.message.slice(0,140):'Lookup failed.'};}
    })));
  }
  await updateCatalog(s=>{for(const r of results){const l=s.listings.find(x=>x.id===r.id);if(!l)continue;
    l.contactCheckedAt=new Date().toISOString();
    if(r.website&&/producthunt\.com/.test(l.developerWebsite||''))l.developerWebsite=r.website;
    if(r.email){l.contactEmail=r.email;l.contactFoundOn=r.foundOn;delete l.contactError;}else{delete l.contactEmail;delete l.contactFoundOn;l.contactError=r.error||'No public business email on the website.';}}});
  return {checked:results.length,found:results.filter(r=>r.email).length};
}
