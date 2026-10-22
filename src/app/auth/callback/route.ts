import {NextRequest,NextResponse} from 'next/server';
import {serverAuth,callbackOrigin} from '@/lib/auth/server';
import {safeNext} from '@/lib/auth/config';
import {upsertProfile} from '@/lib/db';
export async function GET(request:NextRequest){const url=new URL(request.url),origin=callbackOrigin(request);const response=NextResponse.redirect(new URL(safeNext(url.searchParams.get('next')),origin));response.headers.set('Cache-Control','private, no-store');try{const code=url.searchParams.get('code');if(code&&!url.searchParams.get('error')){const client=serverAuth(request,response);const {data,error}=await client.auth.exchangeCodeForSession(code);if(!error){if(data.user)await upsertProfile(data.user).catch(()=>{});return response;}}}catch{}return NextResponse.redirect(new URL('/login?error=signin-failed',origin));}
