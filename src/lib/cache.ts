import {unstable_cache,revalidateTag} from 'next/cache';
import {after} from 'next/server';

/**
 * Short-lived server cache for public pages. Pages read from here instead of hitting the database on
 * every visit; any write that changes the data calls bust() so visitors see the change on the next load.
 * The revalidate window is only a safety net in case a write path forgets to bust.
 */
export type CacheTag='catalog'|'community'|'launches'|'billing'|'makers'|'profiles';
export function cached<A extends unknown[],R>(fn:(...args:A)=>Promise<R>,key:string,tags:CacheTag[],revalidate:number){
  return unstable_cache(fn,['rivelo',key],{tags,revalidate});
}
function expire(tags:CacheTag[]){for(const t of tags){try{revalidateTag(t,{expire:0});}catch{/* outside a request (scripts): nothing cached */}}}
/** Expire cached reads after the current request finishes (so the write has committed first). */
export function bust(...tags:CacheTag[]){
  try{after(()=>expire(tags));}catch{expire(tags);}
}
