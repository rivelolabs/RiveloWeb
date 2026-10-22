import {createHmac,timingSafeEqual} from 'node:crypto';

export type PlanId='spotlight'|'growth'|'yacht';
export const PLAN_IDS:PlanId[]=['spotlight','growth','yacht'];

/** Razorpay plan ids are created once in the Razorpay dashboard (USD, monthly) and set in env. */
export function razorpayPlanId(plan:PlanId){return plan==='spotlight'?process.env.RAZORPAY_PLAN_SPOTLIGHT:plan==='growth'?process.env.RAZORPAY_PLAN_GROWTH:process.env.RAZORPAY_PLAN_YACHT;}
export function billingConfigured(){return !!(process.env.RAZORPAY_KEY_ID&&process.env.RAZORPAY_KEY_SECRET&&process.env.RAZORPAY_PLAN_SPOTLIGHT&&process.env.RAZORPAY_PLAN_GROWTH);}

async function call<T>(method:'GET'|'POST',path:string,body?:unknown):Promise<T>{
  const auth=Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
  const response=await fetch(`https://api.razorpay.com/v1${path}`,{method,headers:{Authorization:`Basic ${auth}`,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,cache:'no-store',signal:AbortSignal.timeout(15000)});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw Error(data?.error?.description||'Payment provider error.');
  return data as T;
}
export type RzSubscription={id:string;plan_id:string;status:string;current_start:number|null;current_end:number|null;notes?:Record<string,string>;short_url?:string};
export type RzPayment={id:string;amount:number;currency:string;status:string;invoice_id?:string|null};

export function createSubscription(input:{plan:PlanId;userId:string;productId:string;email?:string|null;slotIndex?:number}){
  const plan_id=razorpayPlanId(input.plan);if(!plan_id)throw Error('This plan is not available yet.');
  // 120 monthly cycles ≈ "until cancelled".
  return call<RzSubscription>('POST','/subscriptions',{plan_id,total_count:120,quantity:1,customer_notify:1,notes:{user_id:input.userId,plan:input.plan,product_id:input.productId,email:input.email||'',slot_index:String(input.slotIndex||'')}});
}
export function fetchSubscription(id:string){return call<RzSubscription>('GET',`/subscriptions/${encodeURIComponent(id)}`);}
export function fetchPayment(id:string){return call<RzPayment>('GET',`/payments/${encodeURIComponent(id)}`);}
export function cancelSubscription(id:string,atCycleEnd=true){return call<RzSubscription>('POST',`/subscriptions/${encodeURIComponent(id)}/cancel`,{cancel_at_cycle_end:atCycleEnd?1:0});}

function safeEqualHex(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);}
/** Checkout success handler signature: HMAC_SHA256(payment_id|subscription_id, key_secret). */
export function verifyCheckoutSignature(paymentId:string,subscriptionId:string,signature:string){
  const secret=process.env.RAZORPAY_KEY_SECRET;if(!secret)return false;
  return safeEqualHex(createHmac('sha256',secret).update(`${paymentId}|${subscriptionId}`).digest('hex'),signature);
}
/** Webhook signature: HMAC_SHA256(raw body, webhook secret). */
export function verifyWebhookSignature(rawBody:string,signature:string|null){
  const secret=process.env.RAZORPAY_WEBHOOK_SECRET;if(!secret||!signature)return false;
  return safeEqualHex(createHmac('sha256',secret).update(rawBody).digest('hex'),signature);
}
