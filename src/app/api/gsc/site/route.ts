import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {jsonBody,sameOrigin} from '@/lib/catalog/http';
import {listSites,setSite} from '@/lib/gsc';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(request:NextRequest){
  try{
    if(!sameOrigin(request))return NextResponse.json({error:'Invalid origin.'},{status:403});
    const user=await currentUser(request);if(!user)return NextResponse.json({error:'Sign in again.'},{status:401});
    const b=await jsonBody(request,1000);const siteUrl=String(b.siteUrl||'');
    if(!(await listSites(user.id)).some(s=>s.siteUrl===siteUrl))return NextResponse.json({error:'Choose one of your Search Console properties.'},{status:400});
    await setSite(user.id,siteUrl);return NextResponse.json({success:true});
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Could not save.'},{status:400});}
}
