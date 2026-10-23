import {publicProducts} from "@/lib/catalog/store";
import { MetadataRoute } from "next";
import {dbEnabled} from "@/lib/db";
import {db} from "@/lib/db";

export const dynamic="force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products=await publicProducts();
  const makers:string[]=dbEnabled()?await db().query(`SELECT username FROM rivelo.maker_pages WHERE status='claimed'`).then(r=>r.rows.map(x=>x.username as string)).catch(()=>[]):[];
  const baseUrl = "https://rivelolabs.com";
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...["map","community","register","premium","launches"].map(route=>({url:`${baseUrl}/${route}`,changeFrequency:"weekly" as const,priority:0.7})),
    ...makers.map(u=>({url:`${baseUrl}/makers/${u}`,changeFrequency:"weekly" as const,priority:0.6})),
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: product.importedAt?new Date(product.importedAt):lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/legal/refunds`,
      lastModified,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy/calarm`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy/boop`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy/boop-android`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/support/boop`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy/klyq`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy/klyq-android`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy/klyq-account-deletion`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/safety/klyq-child-safety`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/child-safety/klyq`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
