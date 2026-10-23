import {createHash} from 'node:crypto';
import {upsertLaunches} from '@/lib/db/trending';
import {updateCatalog} from '@/lib/catalog/store';
import type {Genre} from '@/lib/directory';
// Hacker News "Show HN" posts via the free, public Algolia HN API (no key needed).
// Every launch links back to its Hacker News discussion.
type Hit={objectID:string;title:string;url:string|null;points:number;num_comments:number;created_at:string;author:string};
const host=(u:string)=>{try{return new URL(u).hostname.replace(/^www\./,'');}catch{return '';}};
function split(title:string){
  const t=title.replace(/^Show HN:\s*/i,'').trim();
  const m=t.match(/^(.{2,60}?)\s+[–—-]\s+(.{8,})$/)||t.match(/^(.{2,60}?):\s+(.{8,})$/)||t.match(/^(.{2,60}?),\s+(an?\s.{8,})$/i);
  return m?{name:m[1].trim(),tagline:m[2].trim()}:{name:'',tagline:t};
}
function genreOf(text:string):Genre{
  const s=text.toLowerCase();
  return /\bgame|puzzle|play\b/.test(s)?'Games':/fitness|health|workout|sleep|habit|meditat/.test(s)?'Health & fitness':/social|community|friends|chat|dating|forum/.test(s)?'Social & community':/note|todo|task|calendar|email|productiv|focus|budget|finance|invoice/.test(s)?'Productivity':'AI & developer tools';
}
export async function importShowHN(days=2,minPoints=8){
  const since=Math.floor((Date.now()-days*86400000)/1000);
  const url=`https://hn.algolia.com/api/v1/search_by_date?tags=show_hn&hitsPerPage=100&numericFilters=${encodeURIComponent(`created_at_i>${since},points>=${minPoints}`)}`;
  const r=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(15000)});
  if(!r.ok)throw Error('Show HN import failed: '+r.status);
  const hits:Hit[]=((await r.json())?.hits||[]).filter((h:Hit)=>h.url&&/^https?:\/\//.test(h.url)&&!/github\.com|news\.ycombinator/.test(h.url));
  const items=hits.map(h=>{const {name,tagline}=split(h.title);const site=host(h.url!);const full=h.title.replace(/^Show HN:\s*/i,'').trim();
    // Titles without a "Name – tagline" shape keep the whole title as the name (not the bare domain).
    return {h,name:(name||full).slice(0,120),tagline:(name?tagline:'').slice(0,300),desc:(tagline||full).slice(0,300),site};}).filter(x=>x.name.length>=2);
  const logo=(site:string)=>`https://www.google.com/s2/favicons?domain=${encodeURIComponent(site)}&sz=256`;
  let imported=0;
  try{imported=await upsertLaunches(items.map(({h,name,tagline,site})=>({source:'hackernews' as const,externalId:h.objectID,name,tagline,url:`https://news.ycombinator.com/item?id=${h.objectID}`,website:h.url,image:logo(site),votes:h.points||0,comments:h.num_comments||0,launchedAt:h.created_at,topics:['Show HN']})));}
  catch{/* run db/migrations/009_hackernews_launches.sql to show these on /launches */}
  const queued=await updateCatalog(state=>{let added=0;
    for(const {h,name,desc,site} of items){
      const key='hackernews:'+h.objectID;if(state.listings.some(l=>l.sourceKey===key||(l.developerWebsite&&host(l.developerWebsite)===site)))continue;
      state.listings.push({id:'import-'+createHash('sha256').update(key).digest('hex').slice(0,20),sourceKey:key,sourceKind:'website',sourceUrl:h.url!,name,description:desc,image:logo(site),logoUrl:logo(site),developerWebsite:h.url!,genre:genreOf(`${name} ${desc}`),type:'Website',platforms:['Web'],importedAt:new Date().toISOString(),releasedAt:h.created_at,status:'pending'});added++;
    }return added;}).catch(()=>0);
  return {source:'hackernews',found:items.length,imported,queued};
}
