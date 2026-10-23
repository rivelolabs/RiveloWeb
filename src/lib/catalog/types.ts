import type {Genre,Product} from '@/lib/directory';
export type Source={id:string;kind:'website'|'appstore'|'appstore-search'|'googleplay';value:string;country:string;genre:Genre;enabled:boolean};
export type Listing={id:string;sourceKey:string;sourceKind:Source['kind'];sourceUrl:string;name:string;description:string;image?:string;developerWebsite?:string;genre:Genre;type:'App'|'Website';platforms:string[];importedAt:string;status:'pending'|'published'|'rejected';editorialSummary?:string;claimed?:boolean;sponsored?:boolean;logoUrl?:string;bannerUrl?:string;ownerEmail?:string;updatedAt?:string;developerName?:string;releasedAt?:string;contactEmail?:string;contactFoundOn?:string;contactCheckedAt?:string;contactError?:string;tagline?:string;launchUrl?:string;votes?:number};
export type Claim={id:string;productId:string;email:string;proofToken:string;domain?:string;status:'pending'|'domain-verified'|'approved'|'rejected';createdAt:string};
export type Invite={id:string;productId:string;to:string;subject:string;text:string;status:'draft'|'sending'|'sent';unsubscribeToken:string;createdAt:string;sentAt?:string;error?:string};
export type Run={id:string;startedAt:string;finishedAt?:string;imported:number;errors:string[];sourceId?:string;status:'running'|'complete'|'failed'};
export type BusinessPin={id:string;productId:string;name:string;city:string;lat:number;lng:number;email:string;genre:Genre;status:'pending'|'published'|'rejected';createdAt:string};
export type CommunityPost={id:string;author:string;email:string;topic:string;title:string;body:string;status:'pending'|'published'|'rejected';createdAt:string;replies:{id:string;author:string;email:string;body:string;status:'pending'|'published'|'rejected';createdAt:string}[]};
export type VisibilityUsage={status:"pending";reservation:string;expiresAt:number}|{status:"used"};
export type CatalogState={visibilityChecks?:Record<string,VisibilityUsage>;version:1;pins:BusinessPin[];posts:CommunityPost[];sources:Source[];listings:Listing[];claims:Claim[];invites:Invite[];suppressed:string[];leads:{id:string;productId?:string;email:string;message:string;createdAt:string}[];runs:Run[];enabled:boolean;cursor:number;lastRunAt?:string;lease?:{id:string;expiresAt:number}};
export function listingProduct(listing:Listing):Product {
  return {id:listing.id,name:listing.name,tagline:(listing.editorialSummary||listing.description).slice(0,150),description:listing.editorialSummary||listing.description,genre:listing.genre,platforms:listing.platforms,type:listing.type,color:['lilac','lime','peach','butter','blue'][parseInt(listing.id.slice(-2),16)%5]||'blue',letter:listing.name.slice(0,1).toLowerCase(),url:listing.sourceUrl,logo:listing.logoUrl,image:listing.bannerUrl||(listing.image?`/api/catalog/image/${listing.id}`:undefined),imported:true,sourceKind:listing.sourceKind,sourceUrl:listing.sourceUrl,importedAt:listing.importedAt,claimed:listing.claimed,sponsored:listing.sponsored};
}

/** Owner-supplied logo/banner: we store only the https URL and never fetch it on the server. */
export function imageUrl(value:unknown){
  if(typeof value!=='string'||!value.trim())return undefined;
  const v=value.trim();if(v.length>500)throw Error('Image links must be under 500 characters.');
  let u:URL;try{u=new URL(v);}catch{throw Error('Use a full image link that starts with https://');}
  if(u.protocol!=='https:'||u.username||u.password)throw Error('Use a full image link that starts with https://');
  return u.href;
}
export function httpsUrl(value:unknown){try{return imageUrl(value);}catch{throw Error('Use a full link that starts with https://');}}
