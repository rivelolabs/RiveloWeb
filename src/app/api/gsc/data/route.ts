import {NextRequest,NextResponse} from 'next/server';
import {unstable_cache} from 'next/cache';
import {currentUser} from '@/lib/auth/server';
import {getConnection,canUseSearchConsole,report} from '@/lib/gsc';
export const runtime='nodejs';export const dynamic='force-dynamic';export const maxDuration=30;
// Search Console numbers change once a day, so each user's report is cached for an hour.
const cachedReport=unstable_cache((userId:string,site:string,days:7|28|90)=>report(userId,site,days),['gsc-report'],{revalidate:3600});
export async function GET(request:NextRequest){
  try{
    const user=await currentUser(request);if(!user)return NextResponse.json({error:'Sign in again.'},{status:401});
    if(!await canUseSearchConsole(user.id))return NextResponse.json({error:'Sign in to use Search Console.'},{status:403});
    const c=await getConnection(user.id);if(!c?.siteUrl)return NextResponse.json({error:'Connect Search Console and choose a property first.'},{status:400});
    const q=request.nextUrl.searchParams.get('days');const days=q==='90'?90:q==='7'?7:28;
    return NextResponse.json(await cachedReport(user.id,c.siteUrl,days),{headers:{'Cache-Control':'private, no-store'}});
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Could not load Search Console data.'},{status:502});}
}
