import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {displayName} from '@/lib/auth/profile';
import {jsonBody,sameOrigin,shortText} from '@/lib/catalog/http';
import {rateLimit} from '@/lib/catalog/limit';
import {dbEnabled,upsertProfile} from '@/lib/db';
import {addComment,deleteOwnComment,listComments} from '@/lib/db/comments';
import {publicProducts} from '@/lib/catalog/store';
import {builderProducts,cachedBuilders} from '@/lib/db/builders';
import {notifyComment} from '@/lib/db/notifications';
import {after} from 'next/server';
export const runtime='nodejs';export const dynamic='force-dynamic';
const validId=(v:unknown):v is string=>typeof v==='string'&&/^[\w.:\/-]{1,120}$/.test(v);
export async function GET(request:NextRequest){
  const productId=request.nextUrl.searchParams.get('productId');
  if(!validId(productId))return NextResponse.json({comments:[],signedIn:false});
  if(!dbEnabled()){const u=await currentUser(request);return NextResponse.json({comments:[],signedIn:!!u,error:'Comments need the database (CATALOG_STORE=postgres).'});}
  const user=await currentUser(request);
  try{return NextResponse.json({comments:await listComments(productId,user?.id),signedIn:!!user},{headers:{'Cache-Control':'no-store'}});}
  catch{return NextResponse.json({comments:[],signedIn:!!user,error:'Comments aren’t set up yet. Run the 003 database migration.'});}
}
export async function POST(request:NextRequest){
  try{
    if(!sameOrigin(request))return NextResponse.json({error:'Invalid origin.'},{status:403});
    rateLimit(request,'comment',15);
    if(!dbEnabled())return NextResponse.json({error:'Comments open soon.'},{status:503});
    // Who is posting and the request body are read together; the product check runs alongside.
    const [user,b]=await Promise.all([currentUser(request),jsonBody(request,3000)]);if(!user)return NextResponse.json({error:'Sign in to comment.',signIn:true},{status:401});
    if(b.delete&&typeof b.delete==='string'){return NextResponse.json({deleted:await deleteOwnComment(b.delete,user.id)});}
    const text=shortText(b.body,1000).replace(/\s+\n/g,'\n');
    if(text.length<2)return NextResponse.json({error:'Write a comment first.'},{status:400});
    // Builder-page products ("maker:<username>[/key]") are not in the catalog, so check them separately.
    const exists=validId(b.productId)&&(b.productId.startsWith('maker:')?builderProducts(await cachedBuilders()).some(p=>p.id.toLowerCase()===String(b.productId).toLowerCase()):(await publicProducts()).some(p=>p.id===b.productId));
    if(!exists)return NextResponse.json({error:'Product not found.'},{status:404});
    const avatar=typeof user.user_metadata?.avatar_url==='string'?user.user_metadata.avatar_url:typeof user.user_metadata?.picture==='string'?user.user_metadata.picture:null;
    const input={productId:b.productId,userId:user.id,author:displayName(user),avatar,body:text};
    // The profile row normally exists already (created at sign-in); only create it first if the insert says it's missing.
    const comment=await addComment(input).catch(async(error)=>{if((error as {code?:string}).code!=='23503')throw error;await upsertProfile(user);return addComment(input);});
    after(()=>upsertProfile(user).catch(()=>{}));
    after(()=>notifyComment(user,b.productId,text));
    return NextResponse.json({comment},{status:201});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not post comment.'},{status:400});}
}
