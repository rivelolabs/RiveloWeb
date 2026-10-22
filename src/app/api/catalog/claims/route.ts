import {rateLimit} from '@/lib/catalog/limit';
import {NextResponse} from 'next/server';
import {randomUUID,randomBytes} from 'node:crypto';
import {publicProducts,updateCatalog,readCatalog} from '@/lib/catalog/store';
import {jsonBody,sameOrigin,validEmail,sameSecret,shortText} from '@/lib/catalog/http';
import {safeFetch} from '@/lib/catalog/safe-fetch';
export const runtime='nodejs';
export async function POST(request:Request){if(!sameOrigin(request))return NextResponse.json({error:'Submit through the claim form.'},{status:403});try{rateLimit(request,'claims');const body=await jsonBody(request,4000);if(body.website!=='')throw Error('Please submit the claim form.');
  if(body.action==='request'){
    if(!validEmail(body.email))throw Error('Enter a valid work email.');const product=(await publicProducts()).find(item=>item.id===body.productId);if(!product)throw Error('Product not found.');const state=await readCatalog();const listing=state.listings.find(item=>item.id===product.id);
    const ownerUrl=listing?.developerWebsite||(product.type==='Website'?product.url:undefined);let domain:string|undefined;
    if(ownerUrl){const host=new URL(ownerUrl).hostname;if(!['apps.apple.com','itunes.apple.com','play.google.com'].includes(host))domain=host;}
    const claim={id:randomUUID(),productId:product.id,email:body.email.trim().toLowerCase(),proofToken:randomBytes(24).toString('hex'),domain,status:'pending' as const,createdAt:new Date().toISOString()};
    await updateCatalog(state=>{if(state.claims.length>=1000)throw Error('Claim requests are temporarily paused.');state.claims.push(claim);});
    return NextResponse.json({id:claim.id,token:claim.proofToken,domain,verificationUrl:domain?`https://${domain}/.well-known/rivelo-verify.txt`:null,status:'pending',message:domain?'Add the verification token to your website, then verify below.':'Your request is saved. Our team will review store-account or domain evidence by email.'},{status:201,headers:{'Cache-Control':'no-store'}});
  }
  if(body.action==='verify'){
    const state=await readCatalog();const claim=state.claims.find(item=>item.id===body.id);if(!claim||!sameSecret(shortText(body.token,100),claim.proofToken))throw Error('Invalid claim verification.');if(!claim.domain)throw Error('This claim needs manual ownership review.');if(claim.status==='approved')return NextResponse.json({success:true,status:'approved'});
    const proof=await safeFetch(`https://${claim.domain}/.well-known/rivelo-verify.txt`,{maxBytes:3000,redirects:0});if(proof.status!==200||proof.text.trim()!==claim.proofToken)throw Error('The verification file does not match yet. Check its contents and try again.');
    await updateCatalog(state=>{const item=state.claims.find(item=>item.id===claim.id)!;if(item.status!=='approved')item.status='domain-verified';});return NextResponse.json({success:true,status:'domain-verified'});
  }
  throw Error('Unknown claim action.');
}catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not save the claim.'},{status:400});}}
