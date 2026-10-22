import type {Metadata} from 'next';
import MapExplorer from '@/components/MapExplorer';
import {readCatalog,readPublicCatalog} from '@/lib/catalog/store';
import {avatarsByEmail,dbEnabled} from '@/lib/db';
import {yachtBookings} from '@/lib/db/billing';
import {makerAvatarMap,makerPins} from '@/lib/db/makers';
import {YACHTS,type YachtSpot} from '@/lib/yachts';
import '../directory.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Business map — Find apps & websites near you',description:'Explore owner-registered apps and websites by location and category on the Rivelo Labs business map.',alternates:{canonical:'https://rivelolabs.com/map'}};
export default async function Page(){
  const {pins,products}=await readPublicCatalog();
  const booked=dbEnabled()?await yachtBookings().catch(()=>new Map<number,string>()):new Map<number,string>();
  const yachts:YachtSpot[]=YACHTS.map(y=>{const id=booked.get(y.index);const p=id?products.find(x=>x.id===id):undefined;return {...y,product:p?{id:p.id,name:p.name,url:p.url||`/products/${p.id}`,logo:p.logo||null}:undefined};});
  const makers=dbEnabled()?await makerPins().catch(()=>[]):[];
  // Each pin shows the product logo, or the lister's X/Google profile photo. Emails never leave the server.
  const full=await readCatalog().catch(()=>null);
  const emailOf=new Map((full?.pins||[]).map(p=>[p.id,p.email]));
  const avatars=await avatarsByEmail([...emailOf.values()]).catch(()=>new Map<string,string>());
  const withPhotos=pins.map(p=>{const logo=products.find(x=>x.id===p.productId)?.logo;const e=emailOf.get(p.id)?.toLowerCase();return {...p,avatar:logo||(e?avatars.get(e):undefined)||null};});
  const makerAvatars=dbEnabled()?await makerAvatarMap().catch(()=>new Map<string,string>()):new Map<string,string>();
  return <MapExplorer pins={[...withPhotos,...makers.map(m=>({...m,avatar:makerAvatars.get(m.id)||null}))]} yachts={yachts}/>;
}
