import type { Metadata } from "next";
import {publicProducts} from "@/lib/catalog/store";
import Directory from "@/components/Directory";
import { preload } from "react-dom";
import { dbEnabled } from "@/lib/db";
import { liveSpotlights, countSpotlightImpressions } from "@/lib/db/billing";
import { recentLaunches } from "@/lib/db/trending";
import { directorySchema, serializeSchema, shareImage, siteUrl } from "@/lib/seo";
import "./directory.css";

export const metadata: Metadata = {
  title: { absolute: "Rivelo Labs — Discover Apps & Websites" },
  alternates: { canonical: siteUrl },
  description: "Discover new apps and websites from independent builders, or list your product with Rivelo Labs and get real users.",
  openGraph: { title: "Rivelo Labs — Discover what’s next", description: "Independent ideas. Thoughtful apps. Your next favorite thing.", url: siteUrl, type: "website", images: [{ url: shareImage, width: 1200, height: 630, alt: "Rivelo Labs — A home for good ideas" }] },
  twitter: { card: "summary_large_image", title: "Rivelo Labs — Discover what’s next", description: "Discover independent apps and websites.", images: [shareImage] },
};
export const dynamic="force-dynamic";
export default async function Home() {
  const catalog=await publicProducts();
  // Start downloading the first hero image with the HTML (it is the largest thing on screen).
  preload("/hero/hero-omeglevc-800.webp",{as:"image",fetchPriority:"high",imageSrcSet:"/hero/hero-omeglevc-800.webp 800w, /hero/hero-omeglevc-1600.webp 1600w",imageSizes:"(max-width: 760px) 92vw, 860px"});
  let sponsored:{id:string;name:string;tagline:string;url:string;image:string|null}[]=[],launches:Awaited<ReturnType<typeof recentLaunches>>=[];
  if(dbEnabled()){
    const [spots,recent]=await Promise.all([liveSpotlights().catch(()=>[]),recentLaunches(12).catch(()=>[])]);
    sponsored=spots.flatMap(s=>{const p=catalog.find(x=>x.id===s.productId);return p?[{id:p.id,name:p.name,tagline:s.headline||p.tagline,url:p.url||`${siteUrl}/products/${p.id}`,image:s.image||null}]:[];});
    launches=recent;
    void countSpotlightImpressions(spots.map(s=>s.id));
  }
  const schema={...directorySchema,mainEntity:{...directorySchema.mainEntity,numberOfItems:catalog.length,itemListElement:catalog.map((product,index)=>({"@type":"ListItem",position:index+1,name:product.name,url:`${siteUrl}/products/${product.id}`}))}};
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}/><Directory catalog={catalog} sponsored={sponsored} launches={launches}/></>;
}
