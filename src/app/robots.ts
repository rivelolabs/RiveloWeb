import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/account", "/login", "/unsubscribe", "/claim"] },
    sitemap: "https://rivelolabs.com/sitemap.xml",
    host: "https://rivelolabs.com",
  };
}
