import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {jsonBody,sameOrigin} from '@/lib/catalog/http';
import {dbEnabled} from '@/lib/db';
import {grantDodoCycle,upsertDodoSubscription} from '@/lib/db/billing';
import {fetchDodoSubscription,listDodoSubscriptions,planForProduct} from '@/lib/billing/dodo';
export const runtime='nodejs';export const dynamic='force-dynamic';
// When the buyer comes back from Dodo checkout (?subscription_id=…), confirm the subscription straight from
// Dodo's API instead of waiting for the webhook. Needed on localhost, where webhooks can't reach; harmless in
// production (the webhook does the same idempotent work).
export async function POST(request:NextRequest){
  try{
    if(!sameOrigin(request)||!dbEnabled())return NextResponse.json({error:'Unavailable.'},{status:403});
    const user=await currentUser(request);if(!user)return NextResponse.json({error:'Sign in again.'},{status:401});
    const b=await jsonBody(request,500);const given=String(b.subscriptionId||'');
    // No id in the return URL: look up this user's own recent subscriptions on Dodo (by our metadata).
    const ids=/^sub_[A-Za-z0-9]{6,60}$/.test(given)?[given]:(await listDodoSubscriptions()).filter(x=>x.metadata?.user_id===user.id&&x.status==='active').map(x=>x.subscription_id).slice(0,10);
    if(!ids.length)return NextResponse.json({status:'pending'});
    const results=[];for(const id of ids)results.push(await confirmOne(id,user.id));
    const ok=results.find(r=>r.status==='active');return NextResponse.json(ok||results[0]);
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not confirm.'},{status:400});}
}
async function confirmOne(id:string,userId:string):Promise<{status:string;plan?:string;error?:string}>{
  {const d=await fetchDodoSubscription(id);const m=d.metadata||{};const user={id:userId};
    if(m.user_id!==user.id)return {status:'forbidden',error:'This subscription belongs to another account.'};
    const plan=planForProduct(d.product_id)||(m.plan as never);
    if(d.status!=='active')return {status:d.status||'pending'};
    if(!plan||!m.listing_id)return {status:'invalid',error:'Subscription is missing plan details.'};
    await upsertDodoSubscription({subscriptionId:id,userId:user.id,plan,listingId:m.listing_id,yacht:m.yacht?Number(m.yacht):null,status:'active',periodEnd:d.next_billing_date||null});
    await grantDodoCycle(id,{id:`${id}:${d.previous_billing_date||d.next_billing_date||'first'}`,amountCents:d.recurring_pre_tax_amount||0,currency:d.currency||'USD'});
    return {status:'active',plan};
  }
}
