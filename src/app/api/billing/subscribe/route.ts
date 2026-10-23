import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {jsonBody,sameOrigin} from '@/lib/catalog/http';
import {rateLimit} from '@/lib/catalog/limit';
import {dbEnabled,upsertProfile} from '@/lib/db';
import {recordNewSubscription,yachtBookings} from '@/lib/db/billing';
import {billingConfigured,createSubscription,PLAN_IDS,type PlanId} from '@/lib/billing/razorpay';
import {ownsPublishedProduct} from '@/lib/billing/ownership';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(request:NextRequest){
  try{
    if(!sameOrigin(request))return NextResponse.json({error:'Invalid origin.'},{status:403});
    rateLimit(request,'billing',10);
    if(!dbEnabled()||!billingConfigured())return NextResponse.json({error:'Plans open soon. Please check back shortly.'},{status:503});
    const user=await currentUser(request);if(!user)return NextResponse.json({error:'Sign in to choose a plan.',signIn:true},{status:401});
    const body=await jsonBody(request,1000);const plan=body.plan as PlanId,productId=typeof body.productId==='string'?body.productId:'';
    if(!PLAN_IDS.includes(plan))return NextResponse.json({error:'Choose a plan.'},{status:400});
    if(!await ownsPublishedProduct({id:user.id,email:user.email},productId))return NextResponse.json({error:'Choose a published product that you listed or claimed with this email.'},{status:403});
    let slotIndex:number|undefined;
    // Yacht plan needs a yacht; Growth includes one free yacht if the buyer picks one.
    if(plan==='yacht'||(plan==='growth'&&body.yacht)){slotIndex=Number(body.yacht);if(!Number.isInteger(slotIndex)||slotIndex<1||slotIndex>5)return NextResponse.json({error:'Choose a yacht on the map.'},{status:400});if((await yachtBookings()).has(slotIndex))return NextResponse.json({error:`Yacht ${slotIndex} was just booked. Pick another one on the map.`},{status:409});}
    await upsertProfile(user);
    const sub=await createSubscription({plan,userId:user.id,productId,email:user.email,slotIndex});
    await recordNewSubscription({userId:user.id,plan,productId,sub,slotIndex});
    return NextResponse.json({subscriptionId:sub.id,keyId:process.env.RAZORPAY_KEY_ID,email:user.email,name:user.user_metadata?.full_name||user.user_metadata?.name||''},{headers:{'Cache-Control':'no-store'}});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not start checkout.'},{status:400});}
}
