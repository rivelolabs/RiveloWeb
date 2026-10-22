import {NextResponse} from 'next/server';
import {cronAuthorized} from '@/lib/catalog/http';
import {runDiscovery} from '@/lib/catalog/jobs';
export const runtime='nodejs';export const maxDuration=60;export const dynamic='force-dynamic';
export async function GET(request:Request){if(!cronAuthorized(request))return NextResponse.json({error:'Unauthorized.'},{status:401});try{return NextResponse.json(await runDiscovery(),{headers:{'Cache-Control':'no-store'}});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Discovery failed.'},{status:503});}}
