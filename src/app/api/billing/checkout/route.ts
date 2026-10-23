import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {jsonBody,sameOrigin} from '@/lib/catalog/http';
import {rateLimit} from '@/lib/catalog/limit';
import {dbEnabled,upsertProfile} from '@/lib/db';
import {yachtBookings} from '@/lib/db/billing';
import {PLAN_IDS,type PlanId} from '@/lib/billing/razorpay';
import {checkoutUrl,dodoConfigured} from '@/lib/billing/dodo';
import {ownsPublishedProduct} from '@/lib/billing/ownership';
export const runtime='nodejs';export const dynamic='force-dynamic';
// Starts a Dodo hosted checkout for a plan. Payment confirmation arrives later via /api/billing/dodo-webhook.
export async function POST(request:NextRequest){
  try{
    if(!sameOrigin(request))return NextResponse.json({error:'Invalid origin.'},{status:403});
    rateLimit(request,'billing',10);
    if(!dbEnabled()||!dodoConfigured())return NextResponse.json({error:'Plans open soon. Please check back shortly.'},{status:503});
    const user=await currentUser(request);if(!user)return NextResponse.json({error:'Sign in to choose a plan.',signIn:true},{status:401});
    const body=await jsonBody(request,1000);const plan=body.plan as PlanId,listingId=typeof body.productId==='string'?body.productId:'';
    if(!PLAN_IDS.includes(plan))return NextResponse.json({error:'Choose a plan.'},{status:400});
    if(!await ownsPublishedProduct({id:user.id,email:user.email},listingId))return NextResponse.json({error:'Choose a published product that you listed or claimed with this email.'},{status:403});
    let yacht:number|undefined;
    if(plan==='yacht'||(plan==='growth'&&body.yacht)){yacht=Number(body.yacht);if(!Number.isInteger(yacht)||yacht<1||yacht>5)return NextResponse.json({error:'Choose a yacht.'},{status:400});if((await yachtBookings()).has(yacht))return NextResponse.json({error:`Yacht ${yacht} was just booked. Pick another one.`},{status:409});}
    await upsertProfile(user);
    // On localhost, come back to localhost after checkout; in production use the public site URL.
    const origin=process.env.NODE_ENV==='development'?new URL(request.url).origin:(process.env.APP_PUBLIC_URL||new URL(request.url).origin);
    const url=checkoutUrl({plan,email:user.email,name:typeof user.user_metadata?.full_name==='string'?user.user_metadata.full_name:null,userId:user.id,listingId,yacht,returnUrl:`${origin}/premium?paid=${plan}`});
    return NextResponse.json({url},{headers:{'Cache-Control':'no-store'}});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not start checkout.'},{status:400});}
}
