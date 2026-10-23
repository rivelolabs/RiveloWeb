import type {User} from '@supabase/supabase-js';
/** The X account behind a Supabase session, if the person signed in with X. */
export function xIdentity(user:User){
  const ident=user.identities?.find(i=>i.provider==='x'||i.provider==='twitter');
  const meta={...(ident?.identity_data||{}),...(user.user_metadata||{})} as Record<string,unknown>;
  const viaX=!!ident||user.app_metadata?.provider==='x'||user.app_metadata?.provider==='twitter';
  if(!viaX)return null;
  const username=String(meta.user_name||meta.preferred_username||'').replace(/^@/,'');
  const id=String(ident?.id||meta.provider_id||meta.sub||'');
  const avatar=String(meta.avatar_url||meta.picture||'').replace(/_normal(\.\w+)$/,'_400x400$1')||null;
  return {username,id,avatar};
}
