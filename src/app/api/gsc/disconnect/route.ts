import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {sameOrigin} from '@/lib/catalog/http';
import {disconnect} from '@/lib/gsc';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(request:NextRequest){
  if(!sameOrigin(request))return NextResponse.json({error:'Invalid origin.'},{status:403});
  const user=await currentUser(request);if(!user)return NextResponse.json({error:'Sign in again.'},{status:401});
  await disconnect(user.id);return NextResponse.json({success:true});
}
