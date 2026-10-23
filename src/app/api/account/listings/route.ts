import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {jsonBody,sameOrigin,shortText} from '@/lib/catalog/http';
import {rateLimit} from '@/lib/catalog/limit';
import {readCatalog,updateCatalog} from '@/lib/catalog/store';
import {imageUrl,type CatalogState,type Listing} from '@/lib/catalog/types';
import {genres} from '@/lib/directory';
import {dbEnabled} from '@/lib/db';
import {myMakerPages,productLabel,xPhoto} from '@/lib/db/makers';
export const runtime='nodejs';export const dynamic='force-dynamic';

/** A signed-in person owns a listing they submitted, a pin they registered, or an approved claim — all matched by their sign-in email. */
function owns(state:CatalogState,listing:Listing,email:string){
  const e=email.toLowerCase();
  return listing.ownerEmail===e||state.pins.some(p=>p.productId===listing.id&&p.email.toLowerCase()===e)||state.claims.some(c=>c.productId===listing.id&&c.status==='approved'&&c.email.toLowerCase()===e);
}
const view=(state:CatalogState,l:Listing)=>{const pin=state.pins.find(p=>p.productId===l.id);return {id:l.id,name:l.name,description:l.editorialSummary||l.description,genre:l.genre,status:l.status,url:l.sourceUrl,logoUrl:l.logoUrl||'',bannerUrl:l.bannerUrl||'',fallbackImage:l.image?`/api/catalog/image/${l.id}`:'',city:pin?.city||'',pinStatus:pin?.status||null,submittedAt:l.importedAt,updatedAt:l.updatedAt||null};};

export async function GET(request:NextRequest){
  const user=await currentUser(request);if(!user)return NextResponse.json({signedIn:false,listings:[],makers:[]},{headers:{'Cache-Control':'no-store'}});
  try{const [state,pages]=await Promise.all([readCatalog(),dbEnabled()?myMakerPages(user.id).catch(()=>[]):Promise.resolve([])]);
    const makers=pages.map(m=>({username:m.username,name:m.name,product:productLabel(m.productName,m.name),image:m.logo||xPhoto(m.avatar,m.username),city:m.city||'',onMap:m.lat!=null&&m.lng!=null}));
    return NextResponse.json({signedIn:true,listings:state.listings.filter(l=>!!user.email&&owns(state,l,user.email)).map(l=>view(state,l)),makers},{headers:{'Cache-Control':'no-store'}});}
  catch{return NextResponse.json({signedIn:true,listings:[],error:'Your listings are unavailable right now.'});}
}
export async function PATCH(request:NextRequest){
  try{
    if(!sameOrigin(request))return NextResponse.json({error:'Invalid origin.'},{status:403});
    rateLimit(request,'account-listing',20);
    const user=await currentUser(request);if(!user?.email)return NextResponse.json({error:'Sign in again to edit your listing.'},{status:401});
    const b=await jsonBody(request,6000);
    const name=shortText(b.name,120),description=shortText(b.description,1500);
    if(name.length<2)throw Error('Add a product name.');
    if(description.length<80)throw Error('The description needs at least 80 characters.');
    if(!genres.includes(b.genre))throw Error('Choose a category.');
    const logoUrl=imageUrl(b.logoUrl),bannerUrl=imageUrl(b.bannerUrl);
    const updated=await updateCatalog(state=>{
      const l=state.listings.find(x=>x.id===b.id);if(!l||!owns(state,l,user.email!))throw Error('Listing not found.');
      l.name=name;l.editorialSummary=description;if(l.id.startsWith('owner-'))l.description=description;l.genre=b.genre;l.logoUrl=logoUrl;l.bannerUrl=bannerUrl;l.updatedAt=new Date().toISOString();
      state.pins.filter(p=>p.productId===l.id).forEach(p=>{p.name=name;p.genre=b.genre;});
      return view(state,l);
    });
    return NextResponse.json({listing:updated});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not save.'},{status:400});}
}
