import type {User} from '@supabase/supabase-js';
export function displayName(user:User|null){if(!user)return '';// display_name is the name the person set on their account page (X / Google refresh full_name on every sign-in).
  const name=user.user_metadata?.display_name||user.user_metadata?.full_name||user.user_metadata?.name;return (typeof name==='string'&&name.trim()?name:user.email||'Builder').slice(0,120);}
/** Avatar, handle and provider from the X or Google profile Supabase stored at sign-in. */
export function profileDetails(user:User|null){
  if(!user)return null;
  const m=user.user_metadata||{};
  const provider=(user.app_metadata?.provider==='twitter'?'x':user.app_metadata?.provider)||user.identities?.[0]?.provider||'email';
  const pick=(...k:string[])=>{for(const key of k){const v=m[key];if(typeof v==='string'&&v.trim())return v.trim();}return '';};
  const avatar=pick('avatar_url','picture').replace('_normal.','_400x400.');
  const handle=pick('user_name','preferred_username');
  return {name:displayName(user),email:user.email||'',avatar:avatar||null,handle:provider==='x'&&handle?handle:'',provider:provider as string,since:user.created_at};
}
