import type { Metadata } from "next";
import {publicProducts} from "@/lib/catalog/store";
import Directory from "@/components/Directory";
import { preload } from "react-dom";
import { dbEnabled } from "@/lib/db";
import { cachedSpotlights, countSpotlightImpressions } from "@/lib/db/billing";
import { after } from "next/server";
import { promotedMakers } from "@/lib/db/makers";
import { cachedRecentLaunches, type Launch } from "@/lib/db/trending";
import { directorySchema, serializeSchema, shareImage, siteUrl } from "@/lib/seo";
import { cachedBuilders, rankBuilders } from "@/lib/db/builders";
import { flag, shortPlace } from "@/lib/flags";
import type { BuilderCard } from "@/components/TopBuilders";
import "./directory.css";

export const metadata: Metadata = {
  title: { absolute: "Discover New Apps & Websites — List Yours Free | Rivelo Labs" },
  alternates: { canonical: siteUrl },
  description: "Discover independent products in our free app and website directory. Launch your startup, analyze your website’s SEO and explore app growth resources.",
  openGraph: { title: "Discover New Apps & Websites — List Yours Free", description: "Discover independent apps and websites, or list your own product for free.", url: siteUrl, type: "website", images: [{ url: shareImage, width: 1200, height: 630, alt: "Rivelo Labs — A home for good ideas" }] },
  twitter: { card: "summary_large_image", title: "Discover New Apps & Websites — List Yours Free", description: "Discover independent apps and websites, or list your own product for free.", images: [shareImage] },
};
export const dynamic="force-dynamic";
export default async function Home() {
  // Start downloading the first hero image with the HTML (it is the largest thing on screen).
  preload("/hero/hero-omeglevc-800.webp",{as:"image",fetchPriority:"high",imageSrcSet:"/hero/hero-omeglevc-800.webp 800w, /hero/hero-omeglevc-1600.webp 1600w",imageSizes:"(max-width: 760px) 92vw, 860px"});
  let sponsored:{id:string;name:string;tagline:string;url:string;image:string|null}[]=[];
  const db=dbEnabled();
  const [catalog,spots,launches]=await Promise.all([publicProducts(),db?cachedSpotlights().catch(()=>[]):Promise.resolve([]),db?cachedRecentLaunches(12,14).catch(()=>[] as Launch[]):Promise.resolve([] as Launch[])]);
  const builders:BuilderCard[]=db?rankBuilders(await cachedBuilders().catch(()=>[]),'top').slice(0,6).map(b=>({username:b.username,name:b.name,photo:b.photo,logo:b.logo,claimed:b.claimed,place:shortPlace(b.city),flag:flag(b.country),product:b.product&&b.product!==b.name?b.product:null,points:b.points,week:b.week,bio:b.bio.slice(0,120)})):[];
  if(db){
    const makerSpots=await promotedMakers(spots.map(s=>s.productId)).catch(()=>new Map());
    sponsored=spots.flatMap(s=>{const p=catalog.find(x=>x.id===s.productId);if(p)return [{id:p.id,name:p.name,tagline:s.headline||p.tagline,url:p.url||`${siteUrl}/products/${p.id}`,image:s.image||null}];const m=makerSpots.get(s.productId.toLowerCase());return m?[{id:m.id,name:m.name,tagline:s.headline||m.tagline,url:m.url,image:s.image||m.logo}]:[];});
    after(()=>countSpotlightImpressions(spots.map(s=>s.id)));
  }
  const schema={...directorySchema,mainEntity:{...directorySchema.mainEntity,numberOfItems:catalog.length,itemListElement:catalog.map((product,index)=>({"@type":"ListItem",position:index+1,name:product.name,url:`${siteUrl}/products/${product.id}`}))}};
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}/><Directory catalog={catalog} sponsored={sponsored} launches={launches} builders={builders}/></>;
}
