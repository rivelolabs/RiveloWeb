import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {dbEnabled} from '@/lib/db';
import {userSubscriptions,yachtBookings} from '@/lib/db/billing';
import {promotableProducts} from '@/lib/billing/ownership';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:NextRequest){
  const takenYachts=dbEnabled()?[...(await yachtBookings().catch(()=>new Map())).keys()]:[];
  const user=await currentUser(request);if(!user)return NextResponse.json({signedIn:false,takenYachts},{headers:{'Cache-Control':'no-store'}});
  try{
    const [subscriptions,products]=await Promise.all([dbEnabled()?userSubscriptions(user.id):[],promotableProducts(user.email)]);
    return NextResponse.json({signedIn:true,email:user.email,subscriptions,products,takenYachts},{headers:{'Cache-Control':'no-store'}});
  }catch{return NextResponse.json({signedIn:true,email:user.email,subscriptions:[],products:[]},{headers:{'Cache-Control':'no-store'}});}
}
