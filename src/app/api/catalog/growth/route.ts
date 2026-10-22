import {rateLimit} from '@/lib/catalog/limit';
import {NextResponse} from 'next/server';
import {randomUUID} from 'node:crypto';
import {updateCatalog} from '@/lib/catalog/store';
import {jsonBody,sameOrigin,validEmail,shortText} from '@/lib/catalog/http';
export const runtime='nodejs';
export async function POST(request:Request){if(!sameOrigin(request))return NextResponse.json({error:'Submit through the growth form.'},{status:403});try{rateLimit(request,'growth');const body=await jsonBody(request,5000);const message=shortText(body.message,2500);if(body.website!==''||!validEmail(body.email)||message.length<10)throw Error('Add your email and a short project description.');await updateCatalog(state=>{if(state.leads.length>=1000)throw Error('Please contact hello@rivelolabs.com directly.');state.leads.unshift({id:randomUUID(),email:body.email.trim().toLowerCase(),message,productId:shortText(body.productId,100)||undefined,createdAt:new Date().toISOString()});});return NextResponse.json({success:true},{status:201});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not save your request.'},{status:400});}}
