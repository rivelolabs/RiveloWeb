import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {jsonBody,sameOrigin} from '@/lib/catalog/http';
import {dbEnabled} from '@/lib/db';
import {recordPaymentAndGrant} from '@/lib/db/billing';
import {fetchPayment,fetchSubscription,verifyCheckoutSignature} from '@/lib/billing/razorpay';
export const runtime='nodejs';export const dynamic='force-dynamic';
// Called by Razorpay Checkout's success handler. The webhook does the same work, so either one is enough.
export async function POST(request:NextRequest){
  try{
    if(!sameOrigin(request)||!dbEnabled())return NextResponse.json({error:'Unavailable.'},{status:403});
    const user=await currentUser(request,{fresh:true});if(!user)return NextResponse.json({error:'Sign in again.'},{status:401});
    const b=await jsonBody(request,2000);
    const paymentId=String(b.razorpay_payment_id||''),subscriptionId=String(b.razorpay_subscription_id||''),signature=String(b.razorpay_signature||'');
    if(!verifyCheckoutSignature(paymentId,subscriptionId,signature))return NextResponse.json({error:'Payment could not be verified.'},{status:400});
    const [sub,payment]=await Promise.all([fetchSubscription(subscriptionId),fetchPayment(paymentId)]);
    if(sub.notes?.user_id!==user.id)return NextResponse.json({error:'Payment could not be verified.'},{status:400});
    await recordPaymentAndGrant(sub,payment);
    return NextResponse.json({success:true,status:sub.status});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Verification failed.'},{status:400});}
}
