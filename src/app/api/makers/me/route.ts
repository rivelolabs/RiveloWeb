import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {jsonBody,sameOrigin,shortText} from '@/lib/catalog/http';
import {dbEnabled} from '@/lib/db';
import {makerByUsername,removeOwnMaker,setMakerAvatar,setMakerExtras,updateOwnMaker} from '@/lib/db/makers';
import {xIdentity} from '@/lib/x/identity';
import {httpsUrl as imageUrl} from "@/lib/catalog/types";
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:NextRequest){
  const username=request.nextUrl.searchParams.get('username')||'';
  if(!dbEnabled())return NextResponse.json({owner:false});
  const [user,maker]=await Promise.all([currentUser(request),makerByUsername(username).catch(()=>null)]);
  return NextResponse.json({owner:!!user&&!!maker&&maker.claimedBy===user.id,signedIn:!!user},{headers:{'Cache-Control':'no-store'}});
}
export async function PATCH(request:NextRequest){
  try{
    if(!sameOrigin(request)||!dbEnabled())return NextResponse.json({error:'Unavailable.'},{status:403});
    const user=await currentUser(request);if(!user)return NextResponse.json({error:'Sign in again.'},{status:401});
    const b=await jsonBody(request,20000);const maker=await makerByUsername(String(b.username||''));
    if(!maker||maker.claimedBy!==user.id)return NextResponse.json({error:'Not your page.'},{status:403});
    if(b.remove===true){await removeOwnMaker(maker.id,user.id);return NextResponse.json({removed:true});}
    const x=xIdentity(user);if(x?.avatar&&x.avatar!==maker.avatar)await setMakerAvatar(maker.id,x.avatar).catch(()=>{});
    const lat=typeof b.lat==='number'&&Math.abs(b.lat)<=85?b.lat:null,lng=typeof b.lng==='number'&&Math.abs(b.lng)<=180?b.lng:null;
    if(!String(b.productUrl||'').trim())return NextResponse.json({error:'Add the link to your app or website.'},{status:400});
    // Extra products (optional, up to 5). Each needs a name and an https link.
    if(Array.isArray(b.extras)){
      const extras=(b.extras as Record<string,unknown>[]).slice(0,5).map((e,i)=>{const name=shortText(e.name,120),url=e.url?imageUrl(e.url)||'':'';
        if(!name||!url)throw Error(`Product ${i+2}: add a name and a link starting with https://`);
        return {id:typeof e.id==='string'?e.id:undefined,name,url,logo:e.logo?imageUrl(e.logo)||null:null,description:shortText(e.description,1500)};});
      await setMakerExtras(maker.id,user.id,extras);
    }
    const updated=await updateOwnMaker(maker.id,user.id,{name:shortText(b.name,120)||maker.name,bio:shortText(b.bio,400),productName:shortText(b.productName,120),productUrl:b.productUrl?imageUrl(b.productUrl)||null:null,productDescription:shortText(b.productDescription,1500),city:shortText(b.city,100)||null,lat:lat!==null&&lng!==null?lat:null,lng:lat!==null&&lng!==null?lng:null,logo:b.logo?imageUrl(b.logo)||null:null});
    return NextResponse.json({maker:updated});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not save.'},{status:400});}
}
