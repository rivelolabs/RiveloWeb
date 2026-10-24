import {createServerClient} from '@supabase/ssr';
import type {User} from '@supabase/supabase-js';
import {NextRequest,NextResponse} from 'next/server';
import {authConfig} from './config';
export function serverAuth(request:NextRequest,response:NextResponse){const config=authConfig();if(!config)throw Error('Sign-in is not available yet.');return createServerClient(config.url,config.key,{cookies:{getAll:()=>request.cookies.getAll(),setAll:items=>{items.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});}
export function callbackOrigin(request:Request){if(process.env.NODE_ENV==='development')return new URL(request.url).origin;const url=new URL(process.env.APP_PUBLIC_URL||'https://rivelolabs.com');if(url.protocol!=='https:')throw Error('Use an HTTPS public URL.');return url.origin;}
/** A Supabase-style user built from verified access-token claims (no network call). */
function claimsUser(c:Record<string,unknown>):User{
  return {id:String(c.sub),email:typeof c.email==='string'?c.email:undefined,phone:typeof c.phone==='string'?c.phone:undefined,aud:String(c.aud||'authenticated'),role:typeof c.role==='string'?c.role:undefined,
    user_metadata:(c.user_metadata as User['user_metadata'])||{},app_metadata:(c.app_metadata as User['app_metadata'])||{},is_anonymous:c.is_anonymous===true,created_at:''} as User;
}
/** Signed-in Supabase user for an API request, or null.
 *  By default the session token is verified locally against the project's public signing key (fast, no Auth round trip).
 *  Pass {fresh:true} where the latest profile data matters (renames, billing, claims): that asks the Auth server. */
export async function currentUser(request:NextRequest,opts?:{fresh?:boolean}):Promise<User|null>{
  try{
    const client=serverAuth(request,NextResponse.next());
    if(!opts?.fresh){
      const {data,error}=await client.auth.getClaims();
      if(!error){const c=data?.claims as Record<string,unknown>|undefined;return c?.sub?claimsUser(c):null;}
    }
    const {data}=await client.auth.getUser();
    return data.user??null;
  }catch{return null;}
}
