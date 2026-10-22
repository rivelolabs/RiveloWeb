import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {jsonBody,sameOrigin} from '@/lib/catalog/http';
import {dbEnabled,upsertProfile} from '@/lib/db';
import {claimMaker,makerByUsername} from '@/lib/db/makers';
import {xIdentity} from '@/lib/x/identity';
import {rateLimit} from '@/lib/catalog/limit';
export const runtime='nodejs';export const dynamic='force-dynamic';
// Only the X account the page was built from can claim it.
export async function POST(request:NextRequest){
  try{
    if(!sameOrigin(request)||!dbEnabled())return NextResponse.json({error:'Unavailable.'},{status:403});
    rateLimit(request,'maker-claim',10);
    const user=await currentUser(request);if(!user)return NextResponse.json({error:'Sign in with X to claim your page.',signIn:true},{status:401});
    const b=await jsonBody(request,300);const maker=await makerByUsername(String(b.username||''));
    if(!maker||maker.status==='hidden')return NextResponse.json({error:'Page not found.'},{status:404});
    if(maker.status==='claimed')return NextResponse.json({error:'This page has already been claimed.'},{status:409});
    const x=xIdentity(user);
    if(!x)return NextResponse.json({error:`Sign in with X as @${maker.username} to claim this page.`,signIn:true},{status:403});
    if(x.username.toLowerCase()!==maker.username.toLowerCase())return NextResponse.json({error:`You’re signed in as @${x.username}. Only @${maker.username} can claim this page.`},{status:403});
    await upsertProfile(user);
    if(!await claimMaker(maker.id,user.id))return NextResponse.json({error:'This page can’t be claimed right now.'},{status:409});
    return NextResponse.json({success:true});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not claim.'},{status:400});}
}
