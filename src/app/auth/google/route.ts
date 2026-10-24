import {NextRequest,NextResponse,after} from 'next/server';
import {serverAuth} from '@/lib/auth/server';
import {authConfig,safeNext} from '@/lib/auth/config';
import {jsonBody,sameOrigin} from '@/lib/catalog/http';
import {rateLimit} from '@/lib/catalog/limit';
import {upsertProfile} from '@/lib/db';

// Google Identity Services flow: the browser receives a Google ID token on our own
// domain (so Google's consent screen names rivelolabs.com, not the Supabase host),
// and we exchange it for a Supabase session here so the session cookies are set server-side.
export async function POST(request:NextRequest){
  try{
    if(!sameOrigin(request))return NextResponse.json({error:'Start sign-in from this website.'},{status:403});
    rateLimit(request,'signin',20);
    if(!authConfig())return NextResponse.json({error:'Sign-in will be available soon. Please try again later.'},{status:503});
    const body=await jsonBody(request,6000);
    const token=typeof body.credential==='string'?body.credential:'';
    const nonce=typeof body.nonce==='string'?body.nonce:'';
    if(!/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)||token.length>4096||!/^[a-f0-9]{64}$/.test(nonce))return NextResponse.json({error:'Google sign-in failed. Please try again.'},{status:400});
    const response=NextResponse.json({});
    const client=serverAuth(request,response);
    const {data,error}=await client.auth.signInWithIdToken({provider:'google',token,nonce});
    // Saving the profile runs after the reply, so a slow database never blocks Google sign-in.
    if(!error&&data.user){const user=data.user;after(()=>upsertProfile(user).catch(()=>{}));}
    if(error)return NextResponse.json({error:'We couldn’t complete Google sign-in. Please try again.'},{status:401});
    const result=NextResponse.json({url:safeNext(body.next)},{headers:{'Cache-Control':'no-store'}});
    response.cookies.getAll().forEach(cookie=>result.cookies.set(cookie));
    return result;
  }catch{return NextResponse.json({error:'Sign-in is temporarily unavailable. Please try again.'},{status:503});}
}
