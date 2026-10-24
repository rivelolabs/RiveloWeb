import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {jsonBody,sameOrigin} from '@/lib/catalog/http';
import {db,dbEnabled} from '@/lib/db';
import {bust} from '@/lib/cache';
import {yachtSchedule} from '@/lib/db/availability';
export const runtime='nodejs';export const dynamic='force-dynamic';
// Pick the yacht for your own active Growth or Map yacht plan, once. After that it stays for the life of the plan.
export async function POST(request:NextRequest){
  try{
    if(!sameOrigin(request)||!dbEnabled())return NextResponse.json({error:'Unavailable.'},{status:403});
    const user=await currentUser(request);if(!user)return NextResponse.json({error:'Sign in again.'},{status:401});
    const b=await jsonBody(request,500);const yacht=Number(b.yacht);if(!Number.isInteger(yacht)||yacht<1||yacht>5)throw Error('Choose a yacht.');
    const s=await db().query(`SELECT id,slot_index FROM rivelo.subscriptions WHERE id=$1 AND user_id=$2 AND plan_id IN ('growth','yacht') AND status IN ('active','authenticated')`,[String(b.id||''),user.id]);
    const sub=s.rows[0];if(!sub)throw Error('No active plan with a yacht found.');
    if(sub.slot_index)throw Error(`Your plan already sails Yacht ${sub.slot_index}. The yacht can’t be changed.`);
    {const y=(await yachtSchedule(user.id)).find(x=>x.index===yacht);if(y&&!y.free)throw Error(`Yacht ${yacht} is taken. Pick another one.`);}
    await db().query(`UPDATE rivelo.subscriptions SET slot_index=$2 WHERE id=$1`,[sub.id,yacht]);
    // Live yacht placements of this plan move to the new yacht too.
    await db().query(`UPDATE rivelo.featured_placements SET slot_index=$2 WHERE subscription_id=$1 AND slot='yacht' AND ends_at>now()`,[sub.id,yacht]);
    bust('billing');return NextResponse.json({ok:true,yacht});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not save.'},{status:400});}
}
