import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {jsonBody,sameOrigin} from '@/lib/catalog/http';
import {rateLimit} from '@/lib/catalog/limit';
import {dbEnabled,upsertProfile} from '@/lib/db';
import {myVotes,toggleVote,voteCounts} from '@/lib/db/trending';
import {commentCounts} from '@/lib/db/comments';
import {notifyUpvote} from '@/lib/db/notifications';
import {after} from 'next/server';
import {publicProducts} from '@/lib/catalog/store';
import {products as staticProducts} from '@/lib/directory';
import {builderProducts,cachedBuilders} from '@/lib/db/builders';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:NextRequest){
  if(!dbEnabled())return NextResponse.json({counts:{},mine:[]});
  try{const user=await currentUser(request);const [counts,mine,comments]=await Promise.all([voteCounts(),user?myVotes(user.id):Promise.resolve([]),commentCounts().catch(()=>({}))]);return NextResponse.json({counts,mine,comments,signedIn:!!user},{headers:{'Cache-Control':'no-store'}});}
  catch{return NextResponse.json({counts:{},mine:[]});}
}
export async function POST(request:NextRequest){
  try{
    if(!sameOrigin(request))return NextResponse.json({error:'Invalid origin.'},{status:403});
    rateLimit(request,'upvote',60);
    if(!dbEnabled())return NextResponse.json({error:'Voting opens soon.'},{status:503});
    const [user,body]=await Promise.all([currentUser(request),jsonBody(request,300)]);if(!user)return NextResponse.json({error:'Sign in to upvote.',signIn:true},{status:401});
    const productId=typeof body.productId==='string'?body.productId:'';
    const known=staticProducts.some(p=>p.id===productId)||(productId.startsWith('maker:')?builderProducts(await cachedBuilders()).some(p=>p.id.toLowerCase()===productId.toLowerCase()):(await publicProducts()).some(p=>p.id===productId));
    if(!known)return NextResponse.json({error:'Product not found.'},{status:404});
    // The profile row normally exists already (created at sign-in); only create it first if the vote insert says it's missing.
    const voted=await toggleVote(user.id,productId).catch(async(error)=>{if((error as {code?:string}).code!=='23503')throw error;await upsertProfile(user);return toggleVote(user.id,productId);});
    after(()=>upsertProfile(user).catch(()=>{}));
    if(voted)after(()=>notifyUpvote(user,productId));
    return NextResponse.json({voted});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not vote.'},{status:400});}
}
