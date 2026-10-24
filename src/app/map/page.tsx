import type {Metadata} from 'next';
import MapExplorer from '@/components/MapExplorer';
import {getMapData} from '@/lib/map-data';
import {mapThumbnailUrl} from '@/lib/map-images';
import '../directory.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Business map — Find apps & websites near you',description:'Explore owner-registered apps and websites by location and category on the Rivelo Labs business map.',alternates:{canonical:'https://www.rivelolabs.com/map'}};
export default async function Page(){
  const data=await getMapData();
  const pins=data.pins.map(pin=>({...pin,avatar:mapThumbnailUrl(pin.id,pin.avatar),badge:mapThumbnailUrl(pin.id,pin.badge,'badge')}));
  const yachts=data.yachts.map(yacht=>({...yacht,product:yacht.product?{...yacht.product,logo:mapThumbnailUrl(`yacht-${yacht.index}`,yacht.product.logo)}:undefined}));
  return <MapExplorer pins={pins} yachts={yachts}/>;
}
