import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {dbEnabled} from '@/lib/db';
import {userSubscriptions,yachtBookings} from '@/lib/db/billing';
import {promotableProducts} from '@/lib/billing/ownership';
import {billingConfigured} from '@/lib/billing/razorpay';
import {dodoConfigured,dodoMode} from '@/lib/billing/dodo';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:NextRequest){
  const takenYachts=dbEnabled()?[...(await yachtBookings().catch(()=>new Map())).keys()]:[];
  const provider=dodoConfigured()?'dodo':billingConfigured()?'razorpay':null;
  const billingReady=!!provider&&dbEnabled();const testMode=provider==='dodo'&&dodoMode()==='test';
  const user=await currentUser(request);if(!user)return NextResponse.json({signedIn:false,takenYachts,billingReady,provider,testMode},{headers:{'Cache-Control':'no-store'}});
  try{
    const [subscriptions,products]=await Promise.all([dbEnabled()?userSubscriptions(user.id):[],promotableProducts({id:user.id,email:user.email})]);
    return NextResponse.json({signedIn:true,email:user.email,subscriptions,products,takenYachts,billingReady,provider,testMode},{headers:{'Cache-Control':'no-store'}});
  }catch{return NextResponse.json({signedIn:true,email:user.email,subscriptions:[],products:[],billingReady,provider,testMode},{headers:{'Cache-Control':'no-store'}});}
}
