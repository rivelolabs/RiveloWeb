import { products, type Product } from "@/lib/directory";
export const siteUrl = "https://rivelolabs.com";
export const shareImage = `${siteUrl}/opengraph-image`;
export function productUrl(product: Product) { return `${siteUrl}/products/${product.id}`; }
export const directorySchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteUrl}/#directory`,
  name: "Rivelo Labs app and website directory",
  url: siteUrl,
  description: "Discover independent apps and websites by genre and platform.",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({ "@type": "ListItem", position: index + 1, name: product.name, url: productUrl(product) })),
  },
};
export function productSchema(product: Product) {
  const categories = { "Social & community": "SocialNetworkingApplication", "Health & fitness": "HealthApplication", "Productivity": "ProductivityApplication", "Games": "GameApplication", "AI & developer tools": "DeveloperApplication" };
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", "@id": `${productUrl(product)}#application`, name: product.name, description: product.description, url: productUrl(product), applicationCategory: categories[product.genre], operatingSystem: product.platforms.join(", "), ...((product.logo||product.image) ? { image: (product.logo||product.image||"").startsWith("http")?(product.logo||product.image):`${siteUrl}${product.logo||product.image}` } : {}), ...(product.url ? { sameAs: product.url, installUrl: product.type==="App"?product.url:undefined } : {}) },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Discover", item: siteUrl },
        { "@type": "ListItem", position: 2, name: product.name, item: productUrl(product) },
      ] },
    ],
  };
}
export function serializeSchema(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
