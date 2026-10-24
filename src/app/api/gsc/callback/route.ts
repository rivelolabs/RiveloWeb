import {NextRequest,NextResponse} from 'next/server';
import {callbackOrigin,currentUser} from '@/lib/auth/server';
import {exchangeCode,listSites,readState,saveConnection,setSite} from '@/lib/gsc';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:NextRequest){
  const origin=callbackOrigin(request),p=request.nextUrl.searchParams;
  const back=(status:string)=>NextResponse.redirect(`${origin}/growth?gsc=${status}`);
  if(p.get('error'))return back('cancelled');
  const user=await currentUser(request,{fresh:true});const owner=readState(p.get('state')||'');
  if(!user||!owner||owner!==user.id)return back('expired');
  try{
    await saveConnection(user.id,await exchangeCode(origin,p.get('code')||''));
    const sites=await listSites(user.id).catch(()=>[]);
    if(sites.length===1)await setSite(user.id,sites[0].siteUrl);
    return back(sites.length?'connected':'nosites');
  }catch(e){console.error('[gsc] connect failed:',e instanceof Error?e.message:e);return back('failed');}
}
