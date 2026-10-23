import type {Metadata} from 'next';
import MapExplorer from '@/components/MapExplorer';
import {readCatalog,readPublicCatalog} from '@/lib/catalog/store';
import {avatarsByEmail,dbEnabled} from '@/lib/db';
import {cachedYachtSlots} from '@/lib/db/billing';
import {cachedMakerPins} from '@/lib/db/makers';
import {cached} from '@/lib/cache';
import {YACHTS,type YachtSpot} from '@/lib/yachts';
import '../directory.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Business map — Find apps & websites near you',description:'Explore owner-registered apps and websites by location and category on the Rivelo Labs business map.',alternates:{canonical:'https://rivelolabs.com/map'}};
// Pin photos need lister emails, which stay on the server; cache the resulting id -> photo map.
const pinAvatars=cached(async()=>{
  const full=await readCatalog().catch(()=>null);
  const emailOf=new Map((full?.pins||[]).map(p=>[p.id,p.email.toLowerCase()]));
  const avatars=await avatarsByEmail([...emailOf.values()]).catch(()=>new Map<string,string>());
  return [...emailOf].flatMap(([id,e])=>avatars.get(e)?[[id,avatars.get(e)!] as [string,string]]:[]);
},'map-pin-avatars',['catalog','profiles'],300);
export default async function Page(){
  // Everything is read in parallel and from the short-lived cache, so the map opens without waiting on the database.
  const [{pins,products},slots,makers,photos]=await Promise.all([
    readPublicCatalog(),
    dbEnabled()?cachedYachtSlots().catch(()=>[] as [number,string][]):Promise.resolve([] as [number,string][]),
    dbEnabled()?cachedMakerPins().catch(()=>[]):Promise.resolve([]),
    dbEnabled()?pinAvatars().catch(()=>[] as [string,string][]):Promise.resolve([] as [string,string][]),
  ]);
  const booked=new Map(slots),photo=new Map(photos);
  const yachts:YachtSpot[]=YACHTS.map(y=>{const id=booked.get(y.index);const p=id?products.find(x=>x.id===id):undefined;return {...y,product:p?{id:p.id,name:p.name,url:p.url||`/products/${p.id}`,logo:p.logo||null}:undefined};});
  const withPhotos=pins.map(p=>({...p,avatar:products.find(x=>x.id===p.productId)?.logo||photo.get(p.id)||null}));
  return <MapExplorer pins={[...withPhotos,...makers]} yachts={yachts}/>;
}
