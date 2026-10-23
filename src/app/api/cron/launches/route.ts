import {NextResponse} from 'next/server';
import {cronAuthorized} from '@/lib/catalog/http';
import {dbEnabled} from '@/lib/db';
import {importProductHunt} from '@/lib/launches/producthunt';
import {importRiveloLaunches} from '@/lib/launches/rivelo';
import {importShowHN} from '@/lib/launches/hackernews';
import {enrichContacts} from '@/lib/catalog/contacts';
export const runtime='nodejs';export const maxDuration=60;export const dynamic='force-dynamic';
// Schedule every few hours: GET /api/cron/launches with "Authorization: Bearer $CRON_SECRET".
// Indie Hackers has no public API and its terms don't allow scraping, so it isn't imported automatically.
export async function GET(request:Request){
  if(!cronAuthorized(request))return NextResponse.json({error:'Unauthorized.'},{status:401});
  if(!dbEnabled())return NextResponse.json({error:'Database unavailable.'},{status:503});
  const results=[];
  for(const job of [()=>importProductHunt(),()=>importShowHN(),()=>importRiveloLaunches()]){try{results.push(await job());}catch(e){results.push({error:e instanceof Error?e.message:'failed'});}}
  // Find public business contacts for the newly queued launches (reviewed by a person in the Discovery desk).
  try{results.push({source:'contacts',...await enrichContacts(12)});}catch(e){results.push({source:'contacts',error:e instanceof Error?e.message:'failed'});}
  return NextResponse.json({results},{headers:{'Cache-Control':'no-store'}});
}
