import {NextResponse} from 'next/server';
import {adminAuthorized,jsonBody,shortText} from '@/lib/catalog/http';
import {dbEnabled} from '@/lib/db';
import {addManualMaker,listMakers,markInvited,setMakerStatus,upsertFromReplies} from '@/lib/db/makers';
import {fetchReplies,parsePostUrl,xConfigured} from '@/lib/x/replies';
import {httpsUrl as imageUrl} from "@/lib/catalog/types";
export const runtime='nodejs';export const dynamic='force-dynamic';
const deny=()=>NextResponse.json({error:'Enter the discovery admin key.'},{status:401});
export async function GET(request:Request){
  if(!adminAuthorized(request))return deny();
  if(!dbEnabled())return NextResponse.json({makers:[],xConfigured:xConfigured(),error:'Database not configured.'});
  try{return NextResponse.json({makers:await listMakers(),xConfigured:xConfigured()},{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({makers:[],xConfigured:xConfigured(),error:'Run the 005 migration first.'});}
}
export async function POST(request:Request){
  if(!adminAuthorized(request))return deny();
  try{
    if(!dbEnabled())throw Error('Database not configured.');
    const b=await jsonBody(request,4000);
    if(b.action==='import'){const post=parsePostUrl(String(b.postUrl||''));const replies=await fetchReplies(post.id,post.author);return NextResponse.json(await upsertFromReplies(replies,post));}
    if(b.action==='add'){
      const username=String(b.username||'').replace(/^@/,'').trim();if(!/^[A-Za-z0-9_]{1,15}$/.test(username))throw Error('Enter a valid X username.');
      const productUrl=b.productUrl?imageUrl(b.productUrl)||null:null;
      await addManualMaker({username,name:shortText(b.name,120)||username,productUrl,replyText:shortText(b.replyText,600),sourcePostUrl:b.sourcePostUrl?parsePostUrl(String(b.sourcePostUrl)).url:null});
      return NextResponse.json({success:true});
    }
    if(b.action==='status'&&['draft','published','hidden'].includes(b.status)){await setMakerStatus(String(b.id),b.status);return NextResponse.json({success:true});}
    if(b.action==='invited'){await markInvited(String(b.id));return NextResponse.json({success:true});}
    throw Error('Unknown action.');
  }catch(error){const msg=error instanceof Error?error.message:'Failed.';return NextResponse.json({error:/duplicate key/.test(msg)?'That username already has a page.':msg},{status:400});}
}
