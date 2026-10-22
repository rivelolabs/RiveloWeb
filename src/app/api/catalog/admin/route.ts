import {dbEnabled} from '@/lib/db';
import {allPostsForModeration,reviewPost} from '@/lib/db/community';
import {initializePostgres,postgresEnabled} from '@/lib/catalog/postgres';
import {readCatalog as readFileCatalog} from '@/lib/catalog/file-store';
import {NextResponse} from 'next/server';
import {randomUUID} from 'node:crypto';
import {readCatalog,updateCatalog,catalogDirectory,storageConfigured} from '@/lib/catalog/store';
import {adminAuthorized,jsonBody,shortText,validEmail} from '@/lib/catalog/http';
import {genres} from '@/lib/directory';
import {runDiscovery} from '@/lib/catalog/jobs';
import {draftInvitation,sendInvitation} from '@/lib/catalog/outreach';
import {publicUrl} from '@/lib/catalog/safe-fetch';
import type {Source} from '@/lib/catalog/types';
export const runtime='nodejs';export const dynamic='force-dynamic';
const failure=(error:unknown,status=400)=>NextResponse.json({error:error instanceof Error?error.message:'Request failed.'},{status});
export async function GET(request:Request){if(!adminAuthorized(request))return failure(Error('Enter the discovery admin key.'),401);try{const state=await readCatalog();if(dbEnabled())state.posts=await allPostsForModeration();return NextResponse.json({...state,claims:state.claims.map(({proofToken,...claim})=>claim),invites:state.invites.map(({unsubscribeToken,...invite})=>invite),storageConfigured:storageConfigured(),storageBackend:postgresEnabled()?'postgres':'file',playConfigured:!!process.env.SERPAPI_API_KEY,mailConfigured:process.env.OUTREACH_ENABLED==='true'&&!!process.env.RESEND_API_KEY&&!!process.env.OUTREACH_FROM_EMAIL&&!!process.env.OUTREACH_SENDER_ADDRESS},{headers:{'Cache-Control':'no-store'}});}catch(error){return failure(error,503);}}
export async function POST(request:Request){if(!adminAuthorized(request))return failure(Error('Enter the discovery admin key.'),401);try{const body=await jsonBody(request);
  if(body.action==='initialize-postgres')return NextResponse.json(await initializePostgres(readFileCatalog()));
  if(body.action==='run')return NextResponse.json(await runDiscovery(true,shortText(body.sourceId,100)||undefined));
  if(body.action==='schedule'){await updateCatalog(state=>{state.enabled=body.enabled===true;});return NextResponse.json({success:true});}
  if(body.action==='source'){
    if(!['website','appstore','appstore-search','googleplay'].includes(body.kind)||!genres.includes(body.genre))throw Error('Choose a valid source and genre.');
    const value=shortText(body.value,500),country=shortText(body.country,2).toLowerCase();if(!value||!/^[a-z]{2}$/.test(country))throw Error('Provide a source and two-letter country code.');
    if(body.kind==='website')publicUrl(value);
    await updateCatalog(state=>{if(state.sources.length>=30)throw Error('The source limit is 30.');state.sources.push({id:randomUUID(),kind:body.kind,value,country,genre:body.genre,enabled:true} as Source);});return NextResponse.json({success:true});
  }
  if(body.action==='toggle-source'){await updateCatalog(state=>{const source=state.sources.find(item=>item.id===body.id);if(!source)throw Error('Source not found.');source.enabled=body.enabled===true;});return NextResponse.json({success:true});}
  if(body.action==='review'){
    await updateCatalog(state=>{const listing=state.listings.find(item=>item.id===body.id);if(!listing)throw Error('Listing not found.');if(!['published','rejected','pending'].includes(body.status))throw Error('Choose a review status.');
      if(body.status==='published'){const summary=shortText(body.summary,1500);if(summary.length<80||(!listing.id.startsWith('owner-')&&summary===listing.description))throw Error('Write an original summary of at least 80 characters before publishing.');if(body.rightsConfirmed!==true)throw Error('Confirm the listing and image rights review.');listing.editorialSummary=summary;state.pins.filter(p=>p.productId===listing.id&&p.status==='pending').forEach(p=>{p.status='published';});if(genres.includes(body.genre))listing.genre=body.genre;}
      listing.status=body.status;
    });return NextResponse.json({success:true});
  }
  if(body.action==='claim-review'){await updateCatalog(state=>{const claim=state.claims.find(item=>item.id===body.id);if(!claim)throw Error('Claim not found.');if(!['approved','rejected'].includes(body.status))throw Error('Choose a claim outcome.');if(body.status==='approved'&&claim.status!=='domain-verified'&&body.manualEvidenceConfirmed!==true)throw Error('Verify the domain or confirm that ownership evidence was reviewed.');claim.status=body.status;if(body.status==='approved'){const listing=state.listings.find(item=>item.id===claim.productId);if(listing)listing.claimed=true;}});return NextResponse.json({success:true});}
  if(body.action==='invite'){if(!validEmail(body.to)||body.businessContactConfirmed!==true)throw Error('Confirm an appropriate business contact before preparing an invitation.');return NextResponse.json(await draftInvitation(shortText(body.productId,100),body.to));}
  if(body.action==='send-invite'){if(body.confirm!==true)throw Error('Confirm this recipient and message before sending.');return NextResponse.json(await sendInvitation(shortText(body.id,100)));}
  if(body.action==='pin-review'){await updateCatalog(state=>{const pin=state.pins.find(p=>p.id===body.id);if(!pin||!['published','rejected'].includes(body.status))throw Error('Choose a pin and status.');if(body.status==='published'&&!state.listings.some(l=>l.id===pin.productId&&l.status==='published'))throw Error('Publish the reviewed product first.');pin.status=body.status;});return NextResponse.json({success:true});}
  if(body.action==='reject-stale'){const days=Math.max(1,Math.min(90,Number(body.days)||7));const since=Date.now()-days*86400000;const n=await updateCatalog(state=>{let c=0;for(const l of state.listings){if(l.status==='pending'&&!l.id.startsWith('owner-')&&!(l.releasedAt&&Date.parse(l.releasedAt)>=since)){l.status='rejected';c++;}}return c;});return NextResponse.json({success:true,rejected:n});}
  if(body.action==='post-review'&&dbEnabled()){await reviewPost(String(body.id||''),String(body.status||''),body.replyId?String(body.replyId):undefined);return NextResponse.json({success:true});}
  if(body.action==='post-review'){await updateCatalog(state=>{const post=state.posts.find(p=>p.id===body.id);if(!post||!['published','rejected'].includes(body.status))throw Error('Choose a post and status.');if(body.replyId){const reply=post.replies.find(r=>r.id===body.replyId);if(!reply)throw Error('Reply not found.');reply.status=body.status;}else post.status=body.status;});return NextResponse.json({success:true});}
  throw Error('Unknown discovery action.');
}catch(error){return failure(error);}}
