import {createServerClient} from '@supabase/ssr';
import {NextRequest,NextResponse} from 'next/server';
import {authConfig} from './config';
export function serverAuth(request:NextRequest,response:NextResponse){const config=authConfig();if(!config)throw Error('Sign-in is not available yet.');return createServerClient(config.url,config.key,{cookies:{getAll:()=>request.cookies.getAll(),setAll:items=>{items.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});}
export function callbackOrigin(request:Request){if(process.env.NODE_ENV==='development')return new URL(request.url).origin;const url=new URL(process.env.APP_PUBLIC_URL||'https://rivelolabs.com');if(url.protocol!=='https:')throw Error('Use an HTTPS public URL.');return url.origin;}
/** Signed-in Supabase user for an API request, or null. Also keeps the rivelo.profiles row fresh. */
export async function currentUser(request:NextRequest){
  try{
    const client=serverAuth(request,NextResponse.next());
    const {data}=await client.auth.getUser();
    return data.user??null;
  }catch{return null;}
}
