import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RIVENO — AI & Software Engineering at flash speed",
    short_name: "RIVENO",
    description:
      "Riveno by Rivelo Labs crafts high-throughput AI platforms, native mobile apps, and scalable web software. Inquiries to hello@rivelolabs.com.",
    start_url: "/",
    display: "standalone",
    background_color: "#090a0f",
    theme_color: "#090a0f",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
