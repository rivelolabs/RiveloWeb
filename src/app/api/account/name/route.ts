import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {sameOrigin} from '@/lib/catalog/http';
import {db,dbEnabled,upsertProfile} from '@/lib/db';
import {bust} from '@/lib/cache';
export const runtime='nodejs';export const dynamic='force-dynamic';
// After the browser saves a new display name in Supabase (user_metadata.display_name), copy it to rivelo.profiles.
export async function POST(request:NextRequest){
  if(!sameOrigin(request)||!dbEnabled())return NextResponse.json({error:'Unavailable.'},{status:403});
  const user=await currentUser(request,{fresh:true});if(!user)return NextResponse.json({error:'Sign in again.'},{status:401});
  const name=String(user.user_metadata?.display_name||'').trim().slice(0,120);
  await upsertProfile(user);
  // One name everywhere: account, builder page, Builders list, map and community.
  if(name){await db().query(`UPDATE rivelo.profiles SET full_name=$2 WHERE id=$1`,[user.id,name]).catch(()=>{});
    await db().query(`UPDATE rivelo.maker_pages SET name=$2 WHERE claimed_by=$1 AND status='claimed'`,[user.id,name]).catch(()=>{});
    // Past posts, replies and comments show the new name too.
    for(const t of ['community_posts','community_replies','product_comments'])await db().query(`UPDATE rivelo.${t} SET author_name=$2 WHERE author_id=$1`,[user.id,name]).catch(()=>{});bust('makers','profiles','community');}
  return NextResponse.json({ok:true,name});
}
