import {NextResponse} from 'next/server';
import {cronAuthorized} from '@/lib/catalog/http';
import {dbEnabled} from '@/lib/db';
import {importProductHunt} from '@/lib/launches/producthunt';
import {importRiveloLaunches} from '@/lib/launches/rivelo';
export const runtime='nodejs';export const maxDuration=60;export const dynamic='force-dynamic';
// Schedule every few hours: GET /api/cron/launches with "Authorization: Bearer $CRON_SECRET".
// Indie Hackers has no public API and its terms don't allow scraping, so it isn't imported automatically.
export async function GET(request:Request){
  if(!cronAuthorized(request))return NextResponse.json({error:'Unauthorized.'},{status:401});
  if(!dbEnabled())return NextResponse.json({error:'Database unavailable.'},{status:503});
  const results=[];
  for(const job of [()=>importProductHunt(),()=>importRiveloLaunches()]){try{results.push(await job());}catch(e){results.push({error:e instanceof Error?e.message:'failed'});}}
  return NextResponse.json({results},{headers:{'Cache-Control':'no-store'}});
}
