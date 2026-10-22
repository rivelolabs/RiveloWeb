import {NextResponse} from 'next/server';
import {jsonBody} from '@/lib/catalog/http';
import {unsubscribe} from '@/lib/catalog/outreach';
export const runtime='nodejs';
export async function POST(request:Request){try{const body=await jsonBody(request,1000);return NextResponse.json(await unsubscribe(body.token));}catch{return NextResponse.json({error:'This unsubscribe link is invalid. Contact hello@rivelolabs.com for help.'},{status:400});}}
