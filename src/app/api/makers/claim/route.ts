import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {jsonBody,sameOrigin} from '@/lib/catalog/http';
import {db,dbEnabled,upsertProfile} from '@/lib/db';
import {claimMaker,makerByUsername,setMakerAvatar,setMakerProductUrl} from '@/lib/db/makers';
import {httpsUrl} from '@/lib/catalog/types';
import {xIdentity} from '@/lib/x/identity';
import {rateLimit} from '@/lib/catalog/limit';
export const runtime='nodejs';export const dynamic='force-dynamic';
// Only the X account the page was built from can claim it.
export async function POST(request:NextRequest){
  try{
    if(!sameOrigin(request)||!dbEnabled())return NextResponse.json({error:'Unavailable.'},{status:403});
    rateLimit(request,'maker-claim',10);
    const user=await currentUser(request,{fresh:true});if(!user)return NextResponse.json({error:'Sign in with X to claim your page.',signIn:true},{status:401});
    const b=await jsonBody(request,1000);let productUrl='';try{productUrl=b.productUrl?httpsUrl(String(b.productUrl))||'':'';}catch{productUrl='';}const maker=await makerByUsername(String(b.username||''));
    if(!maker||maker.status==='hidden')return NextResponse.json({error:'Page not found.'},{status:404});
    if(maker.status==='claimed')return NextResponse.json({error:'This page has already been claimed.'},{status:409});
    const x=xIdentity(user);
    if(!x)return NextResponse.json({error:`Sign in with X as @${maker.username} to claim this page.`,signIn:true},{status:403});
    if(x.username.toLowerCase()!==maker.username.toLowerCase())return NextResponse.json({error:`You’re signed in as @${x.username}. Only @${maker.username} can claim this page.`},{status:403});
    await upsertProfile(user);
    if(!await claimMaker(maker.id,user.id))return NextResponse.json({error:'This page can’t be claimed right now.'},{status:409});
    if(x.avatar)await setMakerAvatar(maker.id,x.avatar).catch(()=>{});
    if(productUrl)await setMakerProductUrl(maker.id,productUrl);
    const chosen=String(user.user_metadata?.display_name||'').trim().slice(0,120);
    if(chosen)await db().query(`UPDATE rivelo.maker_pages SET name=$2 WHERE id=$1`,[maker.id,chosen]).catch(()=>{});
    return NextResponse.json({success:true});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not claim.'},{status:400});}
}
