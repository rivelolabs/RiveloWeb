import type {PoolClient} from 'pg';
import {db} from './index';
import type {PlanId,RzPayment,RzSubscription} from '@/lib/billing/razorpay';

export type Plan={id:PlanId;name:string;priceCents:number;currency:string;interval:string;spotlightDays:number;aiReports:boolean;features:string[]};
export const FALLBACK_PLANS:Plan[]=[
  {id:'spotlight',name:'Spotlight',priceCents:1000,currency:'USD',interval:'month',spotlightDays:7,aiReports:false,features:['Your product in the homepage header for 7 days every month','Promoted spot in Trending','Sponsored badge on your listing','Reach real visitors discovering new apps and websites']},
  {id:'growth',name:'Growth',priceCents:2000,currency:'USD',interval:'month',spotlightDays:7,aiReports:true,features:['Everything in Spotlight','AI analysis of your product page and positioning','Agentic AI SEO suggestions you can apply','Reddit communities and threads where your users are','Monthly growth report']},
];
export async function listPlans():Promise<Plan[]>{
  const r=await db().query(`SELECT id,name,price_cents,currency,billing_interval,spotlight_days,ai_reports,features FROM rivelo.plans WHERE active ORDER BY sort_order`);
  return r.rows.map(p=>({id:p.id,name:p.name,priceCents:p.price_cents,currency:p.currency,interval:p.billing_interval,spotlightDays:p.spotlight_days,aiReports:p.ai_reports,features:p.features}));
}
const ts=(s:number|null|undefined)=>s?new Date(s*1000):null;
const STATUSES=['created','authenticated','active','pending','halted','cancelled','completed','expired'];

export async function recordNewSubscription(input:{userId:string;plan:PlanId;productId:string;sub:RzSubscription;slotIndex?:number}){
  await db().query(`INSERT INTO rivelo.subscriptions (user_id,plan_id,product_id,status,razorpay_subscription_id,razorpay_plan_id,slot_index) VALUES ($1,$2,$3,'created',$4,$5,$6)`,
    [input.userId,input.plan,input.productId,input.sub.id,input.sub.plan_id,input.slotIndex??null]);
}
async function withTx<T>(fn:(c:PoolClient)=>Promise<T>){const c=await db().connect();try{await c.query('BEGIN');const r=await fn(c);await c.query('COMMIT');return r;}catch(e){await c.query('ROLLBACK').catch(()=>{});throw e;}finally{c.release();}}

/** Sync status/period from Razorpay's subscription entity. Returns our row (or null if unknown). */
export async function syncSubscription(sub:RzSubscription,c?:PoolClient){
  const status=STATUSES.includes(sub.status)?sub.status:'pending';
  const r=await (c||db()).query(`UPDATE rivelo.subscriptions SET status=$2,current_period_start=COALESCE($3,current_period_start),current_period_end=COALESCE($4,current_period_end) WHERE razorpay_subscription_id=$1 RETURNING id,user_id,plan_id,product_id,slot_index`,
    [sub.id,status,ts(sub.current_start),ts(sub.current_end)]);
  return r.rows[0] as {id:string;user_id:string;plan_id:PlanId;product_id:string;slot_index:number|null}|undefined;
}
/** Record a captured payment and grant that cycle's homepage header week. Idempotent per payment id. */
export async function recordPaymentAndGrant(sub:RzSubscription,payment:RzPayment){
  return withTx(async c=>{
    const row=await syncSubscription(sub,c);if(!row)return false;
    await c.query(`INSERT INTO rivelo.payments (user_id,subscription_id,razorpay_payment_id,razorpay_invoice_id,amount_cents,currency,status) VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (razorpay_payment_id) DO UPDATE SET status=EXCLUDED.status`,[row.user_id,row.id,payment.id,payment.invoice_id||null,payment.amount,payment.currency,payment.status]);
    if(payment.status!=='captured'&&payment.status!=='authorized')return false;
    const plan=await c.query(`SELECT spotlight_days,placement_slot FROM rivelo.plans WHERE id=$1`,[row.plan_id]);
    const days=plan.rows[0]?.spotlight_days||0,slot=plan.rows[0]?.placement_slot||'header';if(!days)return true;
    // Start now, or right after this subscription's previous week if it is still running.
    const last=await c.query(`SELECT max(ends_at) e FROM rivelo.featured_placements WHERE subscription_id=$1 AND status='scheduled'`,[row.id]);
    const start=new Date(Math.max(Date.now(),last.rows[0]?.e?new Date(last.rows[0].e).getTime():0));
    await c.query(`INSERT INTO rivelo.featured_placements (user_id,subscription_id,payment_id,product_id,slot,slot_index,starts_at,ends_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (payment_id) DO NOTHING`,
      [row.user_id,row.id,payment.id,row.product_id,slot,row.slot_index,start,new Date(start.getTime()+days*86400000)]);
    if(row.plan_id==='growth')await c.query(`INSERT INTO rivelo.ai_reports (user_id,subscription_id,product_id,kind) SELECT $1,$2,$3,'monthly' WHERE NOT EXISTS (SELECT 1 FROM rivelo.ai_reports WHERE subscription_id=$2 AND kind='monthly' AND created_at>now()-interval '20 days')`,[row.user_id,row.id,row.product_id]);
    return true;
  });
}
/** Store each webhook once; returns false if it was already processed. */
export async function claimEvent(id:string,event:string,payload:unknown){
  const r=await db().query(`INSERT INTO rivelo.billing_events (id,event,payload) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING RETURNING id`,[id,event,JSON.stringify(payload)]);
  return r.rowCount===1;
}
export async function stopPlacements(razorpaySubscriptionId:string){
  // Keep the already-paid week; cancel only future, unstarted placements.
  await db().query(`UPDATE rivelo.featured_placements f SET status='cancelled' FROM rivelo.subscriptions s WHERE f.subscription_id=s.id AND s.razorpay_subscription_id=$1 AND f.starts_at>now()`,[razorpaySubscriptionId]);
}
export async function userSubscriptions(userId:string){
  const r=await db().query(`SELECT s.id,s.plan_id,s.product_id,s.status,s.razorpay_subscription_id,s.current_period_end,s.cancel_at_period_end,
      (SELECT json_agg(json_build_object('startsAt',f.starts_at,'endsAt',f.ends_at,'status',f.status) ORDER BY f.starts_at DESC) FROM rivelo.featured_placements f WHERE f.subscription_id=s.id) placements
    FROM rivelo.subscriptions s WHERE s.user_id=$1 AND s.status<>'created' ORDER BY s.created_at DESC`,[userId]);
  return r.rows;
}
export async function ownedSubscription(userId:string,id:string){
  const r=await db().query(`SELECT razorpay_subscription_id FROM rivelo.subscriptions WHERE id=$1 AND user_id=$2`,[id,userId]);return r.rows[0]?.razorpay_subscription_id as string|undefined;
}
export async function markCancelAtPeriodEnd(id:string){await db().query(`UPDATE rivelo.subscriptions SET cancel_at_period_end=true WHERE id=$1`,[id]);}
/** Header placements live right now (homepage hero). */
export async function liveSpotlights(limit=5){
  const r=await db().query(`SELECT id,product_id,headline,image_url,ends_at FROM rivelo.featured_placements WHERE slot='header' AND status='scheduled' AND now() BETWEEN starts_at AND ends_at ORDER BY starts_at LIMIT $1`,[limit]);
  return r.rows.map(x=>({id:x.id as string,productId:x.product_id as string,headline:x.headline as string|null,image:x.image_url as string|null}));
}
export async function countSpotlightImpressions(ids:string[]){if(ids.length)await db().query(`UPDATE rivelo.featured_placements SET impressions=impressions+1 WHERE id=ANY($1::uuid[])`,[ids]).catch(()=>{});}

/** Which yachts are taken right now (live placement or an active booking), and by which product. */
export async function yachtBookings(){
  const r=await db().query(`SELECT slot_index,product_id FROM rivelo.featured_placements WHERE slot='yacht' AND status='scheduled' AND now() BETWEEN starts_at AND ends_at
    UNION SELECT slot_index,product_id FROM rivelo.subscriptions WHERE plan_id='yacht' AND status IN ('authenticated','active','pending')`);
  const map=new Map<number,string>();for(const x of r.rows)if(x.slot_index&&!map.has(x.slot_index))map.set(x.slot_index,x.product_id);return map;
}
