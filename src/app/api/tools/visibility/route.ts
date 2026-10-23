import {NextResponse} from 'next/server';
import {jsonBody,sameOrigin} from '@/lib/catalog/http';
import {rateLimit} from '@/lib/catalog/limit';
import {checkVisibility} from '@/lib/visibility';
export const runtime='nodejs';export const dynamic='force-dynamic';export const maxDuration=30;
export async function POST(request:Request){
  try{
    if(!sameOrigin(request))return NextResponse.json({error:'Invalid origin.'},{status:403});
    rateLimit(request,'visibility',8);
    const b=await jsonBody(request,1000);const url=String(b.url||'').trim().slice(0,500);
    if(!url||!/\./.test(url))return NextResponse.json({error:'Enter your website address, like your-product.com.'},{status:400});
    return NextResponse.json(await checkVisibility(url),{headers:{'Cache-Control':'no-store'}});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not check that site.'},{status:400});}
}
