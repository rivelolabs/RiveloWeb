import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {jsonBody,sameOrigin} from '@/lib/catalog/http';
import {dbEnabled} from '@/lib/db';
import {markCancelAtPeriodEnd,ownedSubscription,subscriptionProvider} from '@/lib/db/billing';
import {cancelDodoSubscription} from '@/lib/billing/dodo';
import {cancelSubscription} from '@/lib/billing/razorpay';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(request:NextRequest){
  try{
    if(!sameOrigin(request)||!dbEnabled())return NextResponse.json({error:'Unavailable.'},{status:403});
    const user=await currentUser(request);if(!user)return NextResponse.json({error:'Sign in again.'},{status:401});
    const b=await jsonBody(request,500);const id=String(b.id||'');
    const rz=/^[0-9a-f-]{36}$/i.test(id)?await ownedSubscription(user.id,id):undefined;if(!rz)return NextResponse.json({error:'Subscription not found.'},{status:404});
    if((await subscriptionProvider(id))?.provider==='dodo')await cancelDodoSubscription(rz);else await cancelSubscription(rz,true);
    await markCancelAtPeriodEnd(id);
    return NextResponse.json({success:true});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not cancel.'},{status:400});}
}
