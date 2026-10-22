import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rivelo Labs — Discover new apps & websites",
    short_name: "Rivelo",
    description: "Discover new apps and websites from independent builders, and list yours to get real users.",
    start_url: "/",
    display: "standalone",
    background_color: "#07090d",
    theme_color: "#07090d",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
