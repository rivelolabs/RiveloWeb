import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {sameOrigin} from '@/lib/catalog/http';
import {dbEnabled,upsertProfile} from '@/lib/db';
import {joinAsMaker,makerByUsername,setMakerProductUrl} from '@/lib/db/makers';
import {jsonBody} from '@/lib/catalog/http';
import {httpsUrl} from '@/lib/catalog/types';
import {xIdentity} from '@/lib/x/identity';
import {rateLimit} from '@/lib/catalog/limit';
import {profileDetails} from '@/lib/auth/profile';
export const runtime='nodejs';export const dynamic='force-dynamic';
// "Add yourself": the signed-in X account gets its own builder page (it can only ever be its own @username).
export async function POST(request:NextRequest){
  try{
    if(!sameOrigin(request)||!dbEnabled())return NextResponse.json({error:'Unavailable.'},{status:403});
    rateLimit(request,'maker-join',10);
    const user=await currentUser(request,{fresh:true});if(!user)return NextResponse.json({error:'Sign in with X to add yourself.',signIn:true},{status:401});
    const x=xIdentity(user);if(!x?.username)return NextResponse.json({error:'Builder pages use your X profile. Sign in with X to add yourself.',signIn:true},{status:403});
    const b=await jsonBody(request,1000).catch(()=>({} as Record<string,unknown>));let productUrl:string;try{productUrl=httpsUrl(String(b.productUrl||''))||'';if(!productUrl)throw 0;}catch{return NextResponse.json({error:'Add the link to your app or website (starting with https://).'},{status:400});}
    await upsertProfile(user);
    const username=await joinAsMaker(user.id,x,profileDetails(user)?.name||x.username);
    if(!username)return NextResponse.json({error:`@${x.username} is already claimed by another account. Email hello@rivelolabs.com if this is you.`},{status:409});
    const m=await makerByUsername(username);if(m)await setMakerProductUrl(m.id,productUrl);
    return NextResponse.json({username});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not add you.'},{status:400});}
}
