import {db} from '@/lib/db';
import {importProductHunt} from './producthunt';
import {importShowHN} from './hackernews';
import {importRiveloLaunches} from './rivelo';
import {enrichContacts} from '@/lib/catalog/contacts';

/**
 * Keeps /launches fresh without depending on a cron: when the newest outside import is older than
 * `maxAgeHours`, the next page view runs the imports in the background (one at a time per server).
 */
let running:Promise<unknown>|null=null;
export async function lastImportAt(){
  const r=await db().query(`SELECT max(fetched_at) t FROM rivelo.launches WHERE source<>'rivelo'`).catch(()=>({rows:[{t:null}]}));
  return r.rows[0]?.t?new Date(r.rows[0].t):null;
}
export async function refreshLaunchesIfStale(maxAgeHours=3){
  if(running)return running;
  const last=await lastImportAt();
  if(last&&Date.now()-last.getTime()<maxAgeHours*3600000)return null;
  running=(async()=>{const out=[];
    for(const job of [()=>importProductHunt(),()=>importShowHN(),()=>importRiveloLaunches(),()=>enrichContacts(8)]){try{out.push(await job());}catch(e){out.push({error:e instanceof Error?e.message:'failed'});}}
    return out;})().finally(()=>{setTimeout(()=>{running=null;},60000);});
  return running;
}
