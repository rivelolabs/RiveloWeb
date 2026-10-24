import {NextRequest,NextResponse,after} from 'next/server';
import {serverAuth,callbackOrigin} from '@/lib/auth/server';
import {safeNext} from '@/lib/auth/config';
import {upsertProfile} from '@/lib/db';
export async function GET(request:NextRequest){const url=new URL(request.url),origin=callbackOrigin(request);const response=NextResponse.redirect(new URL(safeNext(url.searchParams.get('next')),origin));response.headers.set('Cache-Control','private, no-store');try{const code=url.searchParams.get('code');if(code&&!url.searchParams.get('error')){const client=serverAuth(request,response);const {data,error}=await client.auth.exchangeCodeForSession(code);
  // Saving the profile never holds up (or breaks) sign-in: it runs after the redirect is sent.
  if(!error){const user=data.user;if(user)after(()=>upsertProfile(user).catch(()=>{}));return response;}
  // The same link opened twice (double tap, link preview, back button) already used its code: if the browser is signed in anyway, carry on.
  const {data:claims}=await client.auth.getClaims().catch(()=>({data:null}));if(claims?.claims?.sub)return response;}}catch{}return NextResponse.redirect(new URL('/login?error=signin-failed',origin));}
