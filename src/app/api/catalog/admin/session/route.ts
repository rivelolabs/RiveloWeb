import {NextResponse} from 'next/server';
import {DESK_COOKIE,DESK_TTL,deskToken,jsonBody,sameOrigin,sameSecret} from '@/lib/catalog/http';
import {rateLimit} from '@/lib/catalog/limit';
export const runtime='nodejs';export const dynamic='force-dynamic';
const cookie=(value:string,maxAge:number)=>`${DESK_COOKIE}=${encodeURIComponent(value)}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${process.env.NODE_ENV==='production'?'; Secure':''}`;
// Enter the admin key once; stay signed in to the Discovery desk for 24 hours (httpOnly cookie, the key itself is never stored).
export async function POST(request:Request){
  try{
    if(!sameOrigin(request))return NextResponse.json({error:'Invalid origin.'},{status:403});
    rateLimit(request,'desk-login',10);
    const b=await jsonBody(request,1000);const key=process.env.CATALOG_ADMIN_KEY;
    if(!sameSecret(String(b.key||''),key))return NextResponse.json({error:'That admin key is not correct.'},{status:401});
    const res=NextResponse.json({ok:true});res.headers.set('Set-Cookie',cookie(deskToken(),DESK_TTL));return res;
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Could not sign in.'},{status:400});}
}
export async function DELETE(request:Request){
  if(!sameOrigin(request))return NextResponse.json({error:'Invalid origin.'},{status:403});
  const res=NextResponse.json({ok:true});res.headers.set('Set-Cookie',cookie('',0));return res;
}
