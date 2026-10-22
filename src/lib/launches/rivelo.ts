import {readCatalog} from '@/lib/catalog/store';
import {upsertLaunches} from '@/lib/db/trending';
/** Products newly published on Rivelo also appear in the launches feed. */
export async function importRiveloLaunches(days=14){
  const since=Date.now()-days*86400000;const state=await readCatalog();
  const fresh=state.listings.filter(l=>l.status==='published'&&Date.parse(l.importedAt)>since);
  const imported=await upsertLaunches(fresh.map(l=>({source:'rivelo' as const,externalId:l.id,name:l.name,tagline:(l.editorialSummary||l.description||'').slice(0,200),url:l.sourceUrl,website:l.developerWebsite||null,image:l.image?`/api/catalog/image/${l.id}`:null,votes:0,comments:0,launchedAt:l.importedAt,topics:[l.genre]})));
  return {source:'rivelo',imported};
}
