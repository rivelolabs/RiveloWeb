import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import CommunityShell from "@/components/CommunityShell";
import CategoryProductLogo from "@/components/CategoryProductLogo";
import { categories } from "@/lib/categories";
import { publicProducts } from "@/lib/catalog/store";
import { productUrl, serializeSchema, shareImage, siteUrl } from "@/lib/seo";
import "../../directory.css";
import "../../tools.css";
import "../categories.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find(item => item.slug === slug);
  if (!category) return { title: "Category not found", robots: { index: false } };
  const url = `${siteUrl}/categories/${category.slug}`;
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: url },
    openGraph: { title: `${category.title} | Rivelo Labs`, description: category.description, url, type: "website", images: [shareImage] },
    twitter: { card: "summary_large_image", title: `${category.title} | Rivelo Labs`, description: category.description, images: [shareImage] },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find(item => item.slug === slug);
  if (!category) notFound();
  const products = (await publicProducts()).filter(product => product.genre === category.genre);
  const url = `${siteUrl}/categories/${category.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: category.title, description: category.description, url,
        mainEntity: { "@type": "ItemList", numberOfItems: products.length, itemListElement: products.map((product, index) => ({ "@type": "ListItem", position: index + 1, name: product.name, url: productUrl(product) })) } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Discover", item: siteUrl },
        { "@type": "ListItem", position: 2, name: category.genre, item: url },
      ] },
    ],
  };
  return <CommunityShell active=""><main className="rc-content tl-page ct-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}/>
    <nav className="ct-breadcrumb" aria-label="Breadcrumb"><Link href="/">Discover all products</Link><span>/</span><span>{category.genre}</span></nav>
    <div className="rc-page-title"><span className="rd-overline">THE RIVELO DIRECTORY</span><h1>{category.title}</h1><p>{category.description}</p></div>
    <section className="ct-guide"><h2>Explore {category.genre.toLowerCase()}</h2><p>{category.guide}</p></section>
    <section aria-labelledby="category-products"><h2 id="category-products">Products in this category <span className="ct-count">({products.length})</span></h2>
      {products.length ? <ul className="ct-products">{products.map(product => <li key={product.id}>
        <div className="ct-product-heading"><CategoryProductLogo name={product.name} logo={product.logo} image={product.image}/><h3><Link href={`/products/${product.id}`}>{product.name} <ArrowUpRight size={16}/></Link></h3>{product.sponsored && <small>Sponsored</small>}</div>
        <p>{product.description || product.tagline}</p><small>{product.type} · {product.platforms.join(" · ")}</small>
        <Link className="ct-details" href={`/products/${product.id}`}>Explore {product.name} <ArrowUpRight size={14}/></Link>
      </li>)}</ul> : <p className="ct-empty">No products are listed in this category yet. Building something here? <Link href="/register">Submit your product for free.</Link></p>}
    </section>
    <section className="tl-next"><h2>Browse more categories</h2><div>{categories.filter(item => item.slug !== slug).map(item => <Link key={item.slug} href={`/categories/${item.slug}`}>{item.genre} <ArrowUpRight size={15}/></Link>)}</div></section>
    <section className="tl-next"><h2>Building your own app or website?</h2><p>Add a free product listing to Rivelo Labs so people can discover what you’re building.</p><div><Link href="/register">List your product free <ArrowUpRight size={15}/></Link><Link href="/launch-guide">Read the launch guide <ArrowUpRight size={15}/></Link></div></section>
  </main></CommunityShell>;
}
