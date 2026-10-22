import {NextRequest,NextResponse} from 'next/server';
import {serverAuth,callbackOrigin} from '@/lib/auth/server';
import {authConfig,safeNext} from '@/lib/auth/config';
import {jsonBody,sameOrigin} from '@/lib/catalog/http';
import {rateLimit} from '@/lib/catalog/limit';
export async function POST(request:NextRequest){try{if(!sameOrigin(request))return NextResponse.json({error:'Start sign-in from this website.'},{status:403});rateLimit(request,'signin',20);const body=await jsonBody(request,1500);if(!['google','x'].includes(body.provider))return NextResponse.json({error:'Choose Google or X.'},{status:400});const config=authConfig();if(!config)return NextResponse.json({error:'Sign-in will be available soon. Please try again later.'},{status:503});const settings=await fetch(config.url+'/auth/v1/settings',{headers:{apikey:config.key},cache:'no-store',signal:AbortSignal.timeout(8000)});if(!settings.ok)throw Error('Sign-in is temporarily unavailable.');const providers=await settings.json();
 // New OAuth 2 providers may be omitted from this legacy settings map.
 if(providers.external?.[body.provider]===false)return NextResponse.json({error:`${body.provider==='x'?'X':'Google'} sign-in is not enabled yet. Please try again later.`},{status:503});
 const response=NextResponse.json({});const client=serverAuth(request,response);const redirectTo=new URL('/auth/callback',callbackOrigin(request));redirectTo.searchParams.set('next',safeNext(body.next));const {data,error}=await client.auth.signInWithOAuth({provider:body.provider,options:{redirectTo:redirectTo.href,skipBrowserRedirect:true}});if(error||!data.url)throw Error('Could not start sign-in. Please try again.');const result=NextResponse.json({url:data.url},{headers:{'Cache-Control':'no-store'}});response.cookies.getAll().forEach(cookie=>result.cookies.set(cookie));return result;
 }catch{return NextResponse.json({error:'Sign-in is temporarily unavailable. Please try again.'},{status:503});}}
