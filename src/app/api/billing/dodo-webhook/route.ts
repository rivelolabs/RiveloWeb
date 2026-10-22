import {NextResponse} from 'next/server';
import {dbEnabled} from '@/lib/db';
import {claimEvent,grantDodoCycle,setDodoStatus,upsertDodoSubscription} from '@/lib/db/billing';
import {planForProduct,verifyDodoWebhook} from '@/lib/billing/dodo';
export const runtime='nodejs';export const dynamic='force-dynamic';
// Dodo dashboard → Developer → Webhooks → https://rivelolabs.com/api/billing/dodo-webhook
// Subscribe to: subscription.active, subscription.renewed, subscription.on_hold, subscription.cancelled, subscription.failed, subscription.expired
type Data={subscription_id?:string;product_id?:string;status?:string;next_billing_date?:string;previous_billing_date?:string;recurring_pre_tax_amount?:number;currency?:string;metadata?:Record<string,string>;product_cart?:{product_id:string}[]};
export async function POST(request:Request){
  const raw=await request.text();
  if(raw.length>200000||!verifyDodoWebhook(raw,request.headers))return NextResponse.json({error:'Invalid signature.'},{status:401});
  if(!dbEnabled())return NextResponse.json({error:'Database unavailable.'},{status:503});
  try{
    const body=JSON.parse(raw) as {type?:string;data?:Data};const type=body.type||'';const d=body.data||{};
    if(!await claimEvent(request.headers.get('webhook-id')||`${type}:${d.subscription_id}:${d.next_billing_date}`,type,body))return NextResponse.json({ok:true,duplicate:true});
    const subId=d.subscription_id;if(!subId)return NextResponse.json({ok:true,ignored:type});
    if(type==='subscription.active'||type==='subscription.renewed'){
      const m=d.metadata||{};const plan=planForProduct(d.product_id||d.product_cart?.[0]?.product_id)||(m.plan as never);
      if(m.user_id&&m.listing_id&&plan)await upsertDodoSubscription({subscriptionId:subId,userId:m.user_id,plan,listingId:m.listing_id,yacht:m.yacht?Number(m.yacht):null,status:'active',periodEnd:d.next_billing_date||null});
      else await setDodoStatus(subId,'active');
      // One grant per billing cycle, keyed by the cycle start date.
      await grantDodoCycle(subId,{id:`${subId}:${d.previous_billing_date||d.next_billing_date||Date.now()}`,amountCents:d.recurring_pre_tax_amount||0,currency:d.currency||'USD'});
    }else if(type.startsWith('subscription.')){
      await setDodoStatus(subId,d.status||type.split('.')[1]);
    }
    return NextResponse.json({ok:true});
  }catch(e){console.error('[rivelo] dodo webhook failed:',e instanceof Error?e.message:e);return NextResponse.json({error:'Webhook processing failed.'},{status:500});}
}
