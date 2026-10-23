import {db} from './index';
/**
 * What is free right now, and until when things are booked.
 * - Yachts (5): busy while a placement runs, while a yacht/Growth subscription is active (until its period ends),
 *   or while another person holds it in checkout (45 minutes).
 * - Spotlight: the homepage header shows SPOTLIGHT_SLOTS products at once (default 5), shared by Spotlight and Growth.
 * Pass the current user's id so their own checkout hold never blocks them.
 */
const HOLD_MINUTES=45;
export type YachtState={index:number;free:boolean;until:string|null;reserved:boolean};
export async function yachtSchedule(userId?:string):Promise<YachtState[]>{
  const r=await db().query(`
    SELECT slot_index, max(until) until, bool_and(reserved) reserved FROM (
      SELECT slot_index, ends_at until, false reserved FROM rivelo.featured_placements WHERE slot='yacht' AND status='scheduled' AND ends_at>now()
      UNION ALL SELECT slot_index, COALESCE(current_period_end, now()+interval '7 days'), false FROM rivelo.subscriptions WHERE slot_index IS NOT NULL AND plan_id IN ('yacht','growth') AND status IN ('authenticated','active','pending')
      UNION ALL SELECT slot_index, expires_at, true FROM rivelo.slot_holds WHERE kind='yacht' AND expires_at>now() AND ($1::uuid IS NULL OR user_id<>$1::uuid)
    ) b WHERE slot_index BETWEEN 1 AND 5 GROUP BY slot_index`,[userId||null]).catch(async e=>{
      // Before migration 013 runs: same query without holds.
      if(!/slot_holds/.test(String(e?.message)))throw e;
      return db().query(`SELECT slot_index, max(until) until, false reserved FROM (SELECT slot_index, ends_at until FROM rivelo.featured_placements WHERE slot='yacht' AND status='scheduled' AND ends_at>now() UNION ALL SELECT slot_index, COALESCE(current_period_end, now()+interval '7 days') FROM rivelo.subscriptions WHERE slot_index IS NOT NULL AND plan_id IN ('yacht','growth') AND status IN ('authenticated','active','pending')) b WHERE slot_index BETWEEN 1 AND 5 GROUP BY slot_index`);});
  const busy=new Map(r.rows.map(x=>[Number(x.slot_index),{until:new Date(x.until).toISOString(),reserved:!!x.reserved}]));
  return [1,2,3,4,5].map(i=>({index:i,free:!busy.has(i),until:busy.get(i)?.until||null,reserved:busy.get(i)?.reserved||false}));
}
export const spotlightCapacity=()=>Math.max(1,Math.min(20,Number(process.env.SPOTLIGHT_SLOTS)||5));
export type SpotlightState={capacity:number;used:number;open:number;nextOpening:string|null};
export async function spotlightAvailability(userId?:string):Promise<SpotlightState>{
  const capacity=spotlightCapacity();
  const live=await db().query(`SELECT max(ends_at) until FROM rivelo.featured_placements WHERE slot='header' AND status='scheduled' AND now() BETWEEN starts_at AND ends_at GROUP BY product_id`);
  const holds=await db().query(`SELECT expires_at until FROM rivelo.slot_holds WHERE kind='spotlight' AND expires_at>now() AND ($1::uuid IS NULL OR user_id<>$1::uuid)`,[userId||null]).catch(()=>({rows:[]}));
  const ends=[...live.rows,...holds.rows].map(x=>new Date(x.until).getTime()).sort((a,b)=>a-b);
  return {capacity,used:Math.min(capacity,ends.length),open:Math.max(0,capacity-ends.length),nextOpening:ends.length>=capacity?new Date(ends[ends.length-capacity]).toISOString():null};
}
/** Hold a yacht and/or a Spotlight spot for this user while they pay. */
export async function holdSlots(userId:string,o:{yacht?:number;spotlight?:boolean}){
  const q=(kind:string,slot:number|null)=>db().query(`INSERT INTO rivelo.slot_holds (kind,slot_index,user_id,expires_at) VALUES ($1,$2,$3,now()+make_interval(mins=>$4))`,[kind,slot,userId,HOLD_MINUTES]).catch(()=>{});
  await Promise.all([o.yacht?q('yacht',o.yacht):null,o.spotlight?q('spotlight',null):null]);
}
