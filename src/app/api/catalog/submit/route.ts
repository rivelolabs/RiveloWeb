import {NextResponse} from 'next/server';
import {randomUUID} from 'node:crypto';
import {genres} from '@/lib/directory';
import {jsonBody,sameOrigin,shortText,validEmail} from '@/lib/catalog/http';
import {rateLimit} from '@/lib/catalog/limit';
import {publicUrl} from '@/lib/catalog/safe-fetch';
import {importSource} from '@/lib/catalog/importer';
import {updateCatalog} from '@/lib/catalog/store';
import {imageUrl,type Source} from '@/lib/catalog/types';
import {isFunding} from '@/lib/funding';
export const runtime='nodejs';
export async function POST(request:Request){try{if(!sameOrigin(request))return NextResponse.json({error:'Invalid origin.'},{status:403});const body=await jsonBody(request);rateLimit(request,body.action==='preview'?'submit-preview':'submit',body.action==='preview'?30:8);if(body.website!==''||!genres.includes(body.genre))throw Error('Choose a genre.');const url=new URL(publicUrl(shortText(body.url,500)));let kind:Source['kind']='website';if(url.hostname==='apps.apple.com')kind='appstore';else if(url.hostname==='play.google.com')kind='googleplay';
 if(body.action==='preview'){const [item]=await importSource({id:'owner-preview',kind,value:url.href,country:'in',genre:body.genre,enabled:false});if(!item)throw Error('No app found.');return NextResponse.json({name:item.name,description:item.description,image:item.image,sourceKind:kind});}
 if(!validEmail(body.email)||body.consent!==true)throw Error('Add your email and confirm the public location.');const name=shortText(body.name,120),description=shortText(body.description,1500),city=shortText(body.city,100);const lat=body.lat,lng=body.lng;if(name.length<2||description.length<80||!city||typeof lat!=='number'||typeof lng!=='number'||!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>85||Math.abs(lng)>180)throw Error('Add a name, description (80+ characters), city, and a valid map pin.');
 const logoUrl=imageUrl(body.logoUrl),bannerUrl=imageUrl(body.bannerUrl);
 // Reuse the image found during the preview step instead of fetching the product page a second time.
 let image:string|undefined;try{image=imageUrl(body.previewImage);}catch{}if(!image&&!logoUrl&&!bannerUrl){try{const [metadata]=await importSource({id:'owner-submit',kind,value:url.href,country:'in',genre:body.genre,enabled:false});image=metadata?.image;}catch{}}
 const result=await updateCatalog(state=>{if(state.pins.length>=2000||state.listings.length>=2000)throw Error('Submissions are temporarily full.');if(state.pins.some(pin=>pin.email.toLowerCase()===body.email.toLowerCase()&&state.listings.find(l=>l.id===pin.productId)?.sourceUrl===url.href&&pin.status!=='rejected'))throw Error('This product has already been submitted.');const id='owner-'+randomUUID(),pinId=randomUUID();state.listings.push({id,sourceKey:id,sourceKind:kind,sourceUrl:url.href,name,description,image,editorialSummary:description,genre:body.genre,type:kind==='website'?'Website':'App',platforms:[kind==='website'?'Web':kind==='appstore'?'iOS':'Android'],status:'pending',importedAt:new Date().toISOString(),logoUrl,bannerUrl,ownerEmail:body.email.toLowerCase(),...(isFunding(body.funding)?{funding:body.funding}:{})});state.pins.push({id:pinId,productId:id,name,city,lat,lng,email:body.email.toLowerCase(),genre:body.genre,status:'pending',createdAt:new Date().toISOString()});return {id,pinId};});return NextResponse.json({success:true,...result},{status:201});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not submit.'},{status:400});}}
