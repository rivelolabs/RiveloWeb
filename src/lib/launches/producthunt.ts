import {upsertLaunches} from '@/lib/db/trending';
import {updateCatalog} from '@/lib/catalog/store';
import {createHash} from 'node:crypto';
import type {Genre} from '@/lib/directory';
// Product Hunt API v2. Create a token at https://www.producthunt.com/v2/oauth/applications
// ("Developer token") and set PRODUCTHUNT_TOKEN. Commercial use of the API needs Product Hunt's
// permission (hello@producthunt.com); always link back to the Product Hunt launch page.
const QUERY=`query($after:DateTime!){posts(order:VOTES,postedAfter:$after,first:30){edges{node{id name tagline description url website votesCount commentsCount createdAt thumbnail{url} topics(first:3){edges{node{name}}}}}}}`;
type Node={id:string;name:string;tagline:string;description?:string|null;url:string;website:string|null;votesCount:number;commentsCount:number;createdAt:string;thumbnail?:{url:string}|null;topics?:{edges:{node:{name:string}}[]}};
export function productHuntConfigured(){return !!process.env.PRODUCTHUNT_TOKEN;}
export async function importProductHunt(days=2){
  if(!productHuntConfigured())return {source:'producthunt',imported:0,skipped:'Set PRODUCTHUNT_TOKEN to import Product Hunt launches.'};
  const after=new Date(Date.now()-days*86400000).toISOString();
  const response=await fetch('https://api.producthunt.com/v2/api/graphql',{method:'POST',headers:{Authorization:`Bearer ${process.env.PRODUCTHUNT_TOKEN}`,'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({query:QUERY,variables:{after}}),cache:'no-store',signal:AbortSignal.timeout(15000)});
  const data=await response.json().catch(()=>null);
  if(!response.ok||data?.errors)throw Error('Product Hunt import failed: '+(data?.errors?.[0]?.message||response.status));
  const nodes:Node[]=(data?.data?.posts?.edges||[]).map((e:{node:Node})=>e.node);
  const imported=await upsertLaunches(nodes.filter(n=>n.url&&n.name).map(n=>({source:'producthunt' as const,externalId:n.id,name:n.name,tagline:n.tagline||'',url:n.url,website:n.website,image:n.thumbnail?.url||null,votes:n.votesCount||0,comments:n.commentsCount||0,launchedAt:n.createdAt,topics:(n.topics?.edges||[]).map(t=>t.node.name)})));
  // New launches also go into the Discovery desk review queue as website listings (with logo + description).
  const queued=await updateCatalog(state=>{let added=0;
    for(const n of nodes){
      const key='producthunt:'+n.id;if(state.listings.some(l=>l.sourceKey===key))continue;
      const desc=[n.tagline,n.description].filter(Boolean).join(' — ').replace(/\s+/g,' ').trim().slice(0,800);
      if(!n.name||desc.length<20||!n.thumbnail?.url)continue;
      const topic=(n.topics?.edges||[]).map(t=>t.node.name.toLowerCase()).join(' ');
      const genre:Genre=/game/.test(topic)?'Games':/health|fitness/.test(topic)?'Health & fitness':/productiv/.test(topic)?'Productivity':/social|community/.test(topic)?'Social & community':'AI & developer tools';
      state.listings.push({id:'import-'+createHash('sha256').update(key).digest('hex').slice(0,20),sourceKey:key,sourceKind:'website',sourceUrl:n.url,name:n.name.slice(0,120),description:desc,image:n.thumbnail.url,developerWebsite:n.website||undefined,genre,type:'Website',platforms:['Web'],importedAt:new Date().toISOString(),releasedAt:n.createdAt,status:'pending'});added++;
    }return added;}).catch(()=>0);
  return {source:'producthunt',imported,queued};
}
