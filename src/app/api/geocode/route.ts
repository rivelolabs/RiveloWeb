import {NextRequest,NextResponse} from 'next/server';
import {rateLimit} from '@/lib/catalog/limit';
export const runtime='nodejs';export const dynamic='force-dynamic';
// City / place search and reverse lookup via Photon (OpenStreetMap data, built for search-as-you-type).
// Override with GEOCODER_URL to point at a self-hosted Photon instance.
const BASE=(process.env.GEOCODER_URL||'https://photon.komoot.io').replace(/\/$/,'');
type Feature={geometry:{coordinates:[number,number]};properties:Record<string,string|undefined>};
export type Place={label:string;detail:string;city:string;lat:number;lng:number;kind:string};
const cache=new Map<string,{at:number;data:Place[]}>();
function toPlace(f:Feature):Place|null{
  const p=f.properties||{},[lng,lat]=f.geometry?.coordinates||[];
  if(!Number.isFinite(lat)||!Number.isFinite(lng))return null;
  const kind=p.type||p.osm_value||'place';
  const town=['city','town','village','locality','district'].includes(kind)?p.name:(p.city||p.locality||p.district||p.county||p.name);
  const street=[p.housenumber,p.street].filter(Boolean).join(' ');
  const label=p.name||street||town||p.state||p.country||'Unnamed place';
  const detail=[label!==town?town:undefined,p.state,p.country].filter((v,i,a)=>v&&v!==label&&a.indexOf(v)===i).join(', ');
  const city=[town||p.state,p.country].filter(Boolean).join(', ');
  return {label,detail,city:city.slice(0,100),lat:Number(lat.toFixed(5)),lng:Number(lng.toFixed(5)),kind};
}
async function photon(path:string){
  const key=path;const hit=cache.get(key);if(hit&&Date.now()-hit.at<86400000)return hit.data;
  const response=await fetch(`${BASE}${path}`,{headers:{'User-Agent':'RiveloLabs/1.0 (+https://rivelolabs.com; hello@rivelolabs.com)',Accept:'application/json'},signal:AbortSignal.timeout(7000),cache:'no-store'});
  if(!response.ok)throw Error('Location search is unavailable right now.');
  const json=await response.json() as {features?:Feature[]};
  const seen=new Set<string>();
  const data=(json.features||[]).map(toPlace).filter((p):p is Place=>!!p).filter(p=>{const k=`${p.label}|${p.detail}`;if(seen.has(k))return false;seen.add(k);return true;}).slice(0,6);
  if(cache.size>2000)cache.clear();cache.set(key,{at:Date.now(),data});return data;
}
export async function GET(request:NextRequest){
  try{
    rateLimit(request,'geocode',60);
    // Approximate city from the visitor's network, used when browser location is blocked or unavailable.
    if(request.nextUrl.searchParams.has('ip')){
      const h=request.headers,lat=Number(h.get('x-vercel-ip-latitude')),lng=Number(h.get('x-vercel-ip-longitude'));
      if(!h.get('x-vercel-ip-latitude')||!Number.isFinite(lat)||!Number.isFinite(lng))return NextResponse.json({error:'Approximate location unavailable.'},{status:404});
      const dec=(v:string|null)=>{try{return v?decodeURIComponent(v):'';}catch{return v||'';}};
      const city=[dec(h.get('x-vercel-ip-city')),h.get('x-vercel-ip-country')||''].filter(Boolean).join(', ');
      return NextResponse.json({place:{lat:Number(lat.toFixed(2)),lng:Number(lng.toFixed(2)),city}},{headers:{'Cache-Control':'private, no-store'}});
    }
    const q=request.nextUrl.searchParams.get('q')?.trim().slice(0,120)||'';
    const lat=Number(request.nextUrl.searchParams.get('lat')),lng=Number(request.nextUrl.searchParams.get('lng'));
    if(q){if(q.length<2)return NextResponse.json({places:[]});return NextResponse.json({places:await photon(`/api/?q=${encodeURIComponent(q)}&limit=8&lang=en`)},{headers:{'Cache-Control':'private, max-age=300'}});}
    if(Number.isFinite(lat)&&Number.isFinite(lng)&&Math.abs(lat)<=90&&Math.abs(lng)<=180){
      const places=await photon(`/reverse?lat=${lat.toFixed(4)}&lon=${lng.toFixed(4)}&lang=en&limit=1`);
      return NextResponse.json({places},{headers:{'Cache-Control':'private, max-age=300'}});
    }
    return NextResponse.json({error:'Type a city or place.'},{status:400});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Location search failed.',places:[]},{status:503});}
}
