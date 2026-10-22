import {randomUUID} from 'node:crypto';
import {updateCatalog,readCatalog} from './store';
import {importSource} from './importer';
export async function runDiscovery(force=false,sourceId?:string){
  const now=Date.now(),id=randomUUID();
  const source=await updateCatalog(state=>{
    if(state.lease&&state.lease.expiresAt>now)throw Error('A discovery run is already active.');
    if(!force&&!state.enabled)return null;
    if(!force&&state.lastRunAt&&now-Date.parse(state.lastRunAt)<23*60*60*1000)return null;
    const sources=state.sources.filter(item=>item.enabled&&(!sourceId||item.id===sourceId));if(!sources.length)throw Error('Add or enable a source first.');
    const chosen=sources[sourceId?0:state.cursor%sources.length];state.cursor++;state.lease={id,expiresAt:now+120000};state.lastRunAt=new Date(now).toISOString();
    state.runs.unshift({id,startedAt:new Date(now).toISOString(),sourceId:chosen.id,imported:0,errors:[],status:'running'});state.runs=state.runs.slice(0,30);return chosen;
  });
  if(!source)return {skipped:true};
  try{
    const found=await importSource(source);
    await updateCatalog(state=>{if(state.lease?.id!==id)throw Error('Discovery lease expired.');let added=0;
      for(const listing of found){const prior=state.listings.find(item=>item.sourceKey===listing.sourceKey);if(prior){if(prior.status==='pending')Object.assign(prior,{name:listing.name,description:listing.description,image:listing.image,importedAt:listing.importedAt});}else if(state.listings.length<1000){state.listings.push(listing);added++;}}
      const run=state.runs.find(run=>run.id===id)!;run.imported=added;run.status='complete';run.finishedAt=new Date().toISOString();delete state.lease;
    });
    return {success:true,found:found.length,runId:id};
  }catch(error){const message=error instanceof Error?error.message:'Import failed.';await updateCatalog(state=>{const run=state.runs.find(run=>run.id===id);if(run){run.status='failed';run.errors=[message];run.finishedAt=new Date().toISOString();}if(state.lease?.id===id)delete state.lease;});throw Error(message);}
}
export async function scheduleStatus(){const state=await readCatalog();return {enabled:state.enabled,lastRunAt:state.lastRunAt,nextEligibleAt:state.lastRunAt?new Date(Date.parse(state.lastRunAt)+24*60*60*1000).toISOString():null};}
