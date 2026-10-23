import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {sameOrigin} from '@/lib/catalog/http';
import {dbEnabled} from '@/lib/db';
import {markRead,myNotifications} from '@/lib/db/notifications';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:NextRequest){
  if(!dbEnabled())return NextResponse.json({signedIn:false,items:[],unread:0});
  const user=await currentUser(request);if(!user)return NextResponse.json({signedIn:false,items:[],unread:0});
  try{return NextResponse.json({signedIn:true,...await myNotifications(user.id)},{headers:{'Cache-Control':'no-store'}});}
  catch{return NextResponse.json({signedIn:true,items:[],unread:0,setup:'Run db/migrations/015_notifications.sql'});}
}
/** Mark everything as read (when the bell is opened). */
export async function POST(request:NextRequest){
  if(!sameOrigin(request)||!dbEnabled())return NextResponse.json({error:'Unavailable.'},{status:403});
  const user=await currentUser(request);if(!user)return NextResponse.json({error:'Sign in again.'},{status:401});
  await markRead(user.id).catch(()=>{});return NextResponse.json({ok:true});
}
