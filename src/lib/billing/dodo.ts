import {createHmac,timingSafeEqual} from 'node:crypto';
import type {PlanId} from './razorpay';

// Dodo Payments (merchant of record). Checkout uses Dodo's hosted payment link for each product;
// the webhook tells us when a subscription becomes active, renews, or is cancelled.
export function dodoMode(){return process.env.DODO_MODE==='live'?'live':'test';}
const PRODUCTS:Record<PlanId,string|undefined>={spotlight:process.env.DODO_PRODUCT_SPOTLIGHT,yacht:process.env.DODO_PRODUCT_YACHT,growth:process.env.DODO_PRODUCT_GROWTH};
export function dodoConfigured(){return !!(PRODUCTS.spotlight&&PRODUCTS.yacht&&PRODUCTS.growth&&process.env.DODO_WEBHOOK_SECRET);}
export function planForProduct(productId:string|undefined):PlanId|null{if(!productId)return null;const hit=(Object.entries(PRODUCTS) as [PlanId,string|undefined][]).find(([,id])=>id===productId);return hit?hit[0]:null;}

/** Hosted checkout link; our ids travel as metadata and come back in the webhook. */
export function checkoutUrl(input:{plan:PlanId;email?:string|null;name?:string|null;userId:string;listingId:string;yacht?:number;returnUrl:string}){
  const product=PRODUCTS[input.plan];if(!product)throw Error('This plan is not available yet.');
  const base=dodoMode()==='live'?'https://checkout.dodopayments.com':'https://test.checkout.dodopayments.com';
  const q=new URLSearchParams({quantity:'1',redirect_url:input.returnUrl,metadata_user_id:input.userId,metadata_listing_id:input.listingId,metadata_plan:input.plan});
  if(input.yacht)q.set('metadata_yacht',String(input.yacht));
  if(input.email)q.set('email',input.email);
  if(input.name)q.set('fullName',input.name);
  return `${base}/buy/${encodeURIComponent(product)}?${q}`;
}

/** Standard Webhooks signature: base64(HMAC_SHA256(secret, `${id}.${timestamp}.${body}`)), secret given as whsec_<base64>. */
export function verifyDodoWebhook(raw:string,headers:Headers){
  const secret=process.env.DODO_WEBHOOK_SECRET;const id=headers.get('webhook-id'),ts=headers.get('webhook-timestamp'),sig=headers.get('webhook-signature');
  if(!secret||!id||!ts||!sig)return false;
  if(Math.abs(Date.now()/1000-Number(ts))>600)return false;
  const key=Buffer.from(secret.replace(/^whsec_/,''),'base64');
  const expected=createHmac('sha256',key).update(`${id}.${ts}.${raw}`).digest('base64');
  return sig.split(' ').some(part=>{const v=part.includes(',')?part.split(',')[1]:part;const a=Buffer.from(v),b=Buffer.from(expected);return a.length===b.length&&timingSafeEqual(a,b);});
}

/** Cancel at the end of the current period (needs DODO_API_KEY). */
export async function cancelDodoSubscription(subscriptionId:string){
  const key=process.env.DODO_API_KEY;if(!key)throw Error('To cancel, email hello@rivelolabs.com or use the “Manage subscription” link in your Dodo receipt.');
  const base=dodoMode()==='live'?'https://live.dodopayments.com':'https://test.dodopayments.com';
  const r=await fetch(`${base}/subscriptions/${encodeURIComponent(subscriptionId)}`,{method:'PATCH',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({cancel_at_next_billing_date:true}),cache:'no-store',signal:AbortSignal.timeout(15000)});
  if(!r.ok){const d=await r.json().catch(()=>({}));throw Error(d?.message||'Could not cancel. Email hello@rivelolabs.com and we’ll do it for you.');}
}
