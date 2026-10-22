import { MetadataRoute } from "next";

const PRIVATE = ["/api/", "/admin/", "/account", "/login", "/unsubscribe", "/claim", "/ingest/"];
// Search engines and AI assistants (ChatGPT, Claude, Perplexity, Gemini, Copilot, Apple) are welcome to read public pages,
// so Rivelo products can be cited and recommended in AI answers.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot", "DuckAssistBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_BOTS, allow: ["/", "/llms.txt"], disallow: PRIVATE },
    ],
    sitemap: "https://rivelolabs.com/sitemap.xml",
    host: "https://rivelolabs.com",
  };
}
