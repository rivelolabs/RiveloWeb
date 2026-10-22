import {NextResponse} from 'next/server';
import {dbEnabled} from '@/lib/db';
import {claimEvent,recordPaymentAndGrant,stopPlacements,syncSubscription} from '@/lib/db/billing';
import {verifyWebhookSignature,type RzPayment,type RzSubscription} from '@/lib/billing/razorpay';
export const runtime='nodejs';export const dynamic='force-dynamic';
// Razorpay Dashboard → Webhooks → URL https://rivelolabs.com/api/billing/webhook
// Events: subscription.authenticated, .activated, .charged, .pending, .halted, .cancelled, .completed, payment.failed
export async function POST(request:Request){
  const raw=await request.text();
  if(raw.length>200000||!verifyWebhookSignature(raw,request.headers.get('x-razorpay-signature')))return NextResponse.json({error:'Invalid signature.'},{status:400});
  if(!dbEnabled())return NextResponse.json({error:'Database unavailable.'},{status:503});
  try{
    const body=JSON.parse(raw);const event:string=body.event||'';
    const eventId=request.headers.get('x-razorpay-event-id')||`${event}:${body.created_at}:${body.payload?.payment?.entity?.id||body.payload?.subscription?.entity?.id}`;
    if(!await claimEvent(eventId,event,body))return NextResponse.json({ok:true,duplicate:true});
    const sub:RzSubscription|undefined=body.payload?.subscription?.entity;const payment:RzPayment|undefined=body.payload?.payment?.entity;
    if(sub){
      if(event==='subscription.charged'&&payment)await recordPaymentAndGrant(sub,payment);
      else await syncSubscription(sub);
      if(['subscription.cancelled','subscription.halted','subscription.completed'].includes(event))await stopPlacements(sub.id);
    }
    return NextResponse.json({ok:true});
  }catch{return NextResponse.json({error:'Webhook processing failed.'},{status:500});}
}
