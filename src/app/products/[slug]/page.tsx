import ProductComments from '@/components/ProductComments';
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Globe2, Smartphone } from "lucide-react";
import {publicProducts} from "@/lib/catalog/store";
import { categoryForGenre, categoryPath } from "@/lib/categories";
import { productSchema, productUrl, serializeSchema, shareImage } from "@/lib/seo";
import "../../directory.css";

type Props = { params: Promise<{ slug: string }> };
// Share image: the owner banner when there is one, else the site card.
const ogImage=(p:{name:string;image?:string;logo?:string})=>p.logo&&p.image&&p.image.startsWith("https://")?{url:p.image,alt:`${p.name} banner`}:{url:shareImage,width:1200,height:630,alt:`${p.name} on Rivelo Labs`};
export const dynamic="force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const products=await publicProducts();
  const product = products.find(item => item.id === slug);
  if (!product) return { title: "Product not found", robots: { index: false } };
  return {
    title: `${product.name} — ${product.genre} ${product.type === "App" ? "App" : "Website"}`,
    description: product.description.length>158?product.description.slice(0,155).replace(/\s+\S*$/,'')+'…':product.description,
    alternates: { canonical: productUrl(product) },
    openGraph: { title: `${product.name} | Rivelo Labs`, description: product.tagline, url: productUrl(product), type: "website", images: [ogImage(product)] },
    twitter: { card: "summary_large_image", title: `${product.name} | Rivelo Labs`, description: product.tagline, images: [ogImage(product).url] },
  };
}
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const products=await publicProducts();
  const product = products.find(item => item.id === slug);
  if (!product) notFound();
  const category = categoryForGenre(product.genre);
  const related = products.filter(item => item.id !== product.id).sort((a,b)=>Number(b.genre===product.genre)-Number(a.genre===product.genre)).slice(0, 3);
  return <main className="rd-app rd-product-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeSchema(productSchema(product))}}/>
    <header className="rd-product-page-topbar"><Link href="/" className="rd-product-page-brand">rivelo<span>labs.</span></Link></header>
    <div className="rd-product-page-body">
      <nav aria-label="Breadcrumb" className="rd-product-breadcrumb"><Link href="/"><ArrowLeft size={15}/> Discover all products</Link><span>/</span><Link href={categoryPath(product.genre)}>{product.genre}</Link><span>/</span><span>{product.name}</span></nav>
      <section className="rd-product-page-hero"><div><span className="rd-overline">{product.genre} · {product.type}</span><h1>{product.name}<span>.</span></h1><p>{product.tagline}</p><div className="rd-product-page-platforms">{product.platforms.map(platform=><span key={platform}>{product.type==="App"?<Smartphone size={15}/>:<Globe2 size={15}/>} {platform}</span>)}</div>{product.url?<a className="rd-button rd-primary" href={product.url} target="_blank" rel={product.sponsored?"sponsored noopener noreferrer":"noopener noreferrer"}>Visit {product.name} <ArrowUpRight size={18}/></a>:<p className="rd-product-availability">Store links will be added when available.</p>}</div><div className={`rd-product-preview rd-${product.color}`}>{product.image&&<Image unoptimized={product.imported} src={product.image} alt={`${product.name} ${product.type.toLowerCase()} preview`} fill sizes="(max-width: 760px) 90vw, 45vw" priority style={{objectFit:"contain",padding:24}}/>}</div></section>
      <section className="rd-product-overview"><div><span className="rd-overline">A CLOSER LOOK</span><h2>About {product.name}</h2><p>{product.description}</p>{product.imported&&<div className="rc-product-source"><p>Source: <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer">{product.sourceKind} ↗</a>{product.sponsored?" · Sponsored placement":""}</p><Link className="rd-button rd-outline" href={`/claim?product=${product.id}`}>{product.claimed?"Request a correction":"Is this your product? Claim it"} <ArrowUpRight size={16}/></Link></div>}</div><aside><h3>At a glance</h3><dl><div><dt>Genre</dt><dd><Link href={categoryPath(product.genre)}>{product.genre} ↗</Link></dd></div><div><dt>Product type</dt><dd>{product.type}</dd></div><div><dt>Platforms</dt><dd>{product.platforms.join(", ")}</dd></div></dl>{product.policies&&<div className="rd-product-policy"><h3>Product information</h3>{product.policies.map(link=><Link key={link.href} href={link.href}>{link.name}<ArrowUpRight size={15}/></Link>)}</div>}</aside></section>
      <div className="rd-product-page-comments"><ProductComments productId={product.id} productName={product.name}/></div>
      <section className="rd-related"><div className="rd-catalog-heading"><h2>Keep exploring.</h2><Link href={categoryPath(product.genre)}>{category.genre} <ArrowUpRight size={15}/></Link></div><div>{related.map(item=><Link href={`/products/${item.id}`} key={item.id}><span className={`rd-related-icon rd-${item.color}`}>{item.letter}</span><div><h3>{item.name}</h3><p>{item.genre}</p></div><ArrowUpRight size={18}/></Link>)}</div></section>
      <footer className="rd-footer"><span>© {new Date().getFullYear()} Rivelo Labs</span><Link href="/">Back to the directory <ArrowUpRight size={14}/></Link></footer>
    </div>
  </main>;
}
