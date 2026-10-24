export const genres = ["Social & community", "Health & fitness", "Productivity", "Games", "AI & developer tools"] as const;
export type Genre = typeof genres[number];
export type Product = {
  id: string; name: string; tagline: string; description: string; genre: Genre;
  platforms: string[]; type: "App" | "Website"; color: string; letter: string;
  imported?:boolean; sourceKind?:string; sourceUrl?:string; importedAt?:string; claimed?:boolean; sponsored?:boolean; image?: string; logo?: string; url?: string; funding?: string; policies?: { name: string; href: string }[];
};
/** Earlier built-in apps. Kept for artwork only; they are no longer listed in the directory. */
export const ecosystemProducts: Product[] = [
  { id: "omeglevc", name: "OmegleVC", tagline: "A little hello. A whole new connection.", description: "A real-time video and voice platform built to make meeting someone new feel simple. Discover spontaneous conversations powered by WebRTC.", genre: "Social & community", platforms: ["Web"], type: "Website", color: "lilac", letter: "o", url: "https://omeglevc.com", image: "/omeglevc.png" },
  { id: "revfit", name: "RevFit", tagline: "Your everyday, a little stronger.", description: "A fitness and lifestyle companion for workouts, nutrition, daily habits, and progress. Built for iPhone with Apple Health integration.", genre: "Health & fitness", platforms: ["iOS"], type: "App", color: "lime", letter: "R", image: "/revfit.png", policies: [{name:"Privacy policy",href:"/privacy"}] },
  { id: "boop", name: "BOOP", tagline: "Small taps. Big little adventures.", description: "A playful physics puzzle with living waves. Tap the water, stomp the meadow, or gust through the sky to guide your character into the ring.", genre: "Games", platforms: ["iOS", "Android"], type: "App", color: "peach", letter: "b", image: "/boop-water.jpg", policies: [{name:"iOS privacy",href:"/privacy/boop"},{name:"Android privacy",href:"/privacy/boop-android"},{name:"Support",href:"/support/boop"}] },
  { id: "calarm", name: "Calarm", tagline: "Make time for what’s coming next.", description: "Turn Google Calendar events into useful wake-up alarms. Organize your day with calendar sync, color-based rules, and custom alarm timing.", genre: "Productivity", platforms: ["iOS"], type: "App", color: "butter", letter: "c", image: "/calarm-screen-1.png", policies: [{name:"Privacy policy",href:"/privacy/calarm"}] },
  { id: "klyq", name: "Klyq", tagline: "Find your people. Make it a moment.", description: "A social arena bringing live video and voice, mini-games, and community spaces together. An adults-only experience for iOS and Android.", genre: "Social & community", platforms: ["iOS", "Android"], type: "App", color: "blue", letter: "k", image: "/klyq-arena.png", policies: [{name:"iOS privacy",href:"/privacy/klyq"},{name:"Android privacy",href:"/privacy/klyq-android"},{name:"Child safety",href:"/safety/klyq-child-safety"}] },
];
/** Built-in directory listings. Empty: only submitted and approved products are shown. */
export const products: Product[] = [];
export type Registration = { requestId: string; name: string; url: string; genre: Genre; type: "App" | "Website"; tagline: string; email: string; website: string };
export function validateRegistration(value: unknown): value is Registration {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  const string = (key: string, max: number) => typeof data[key] === "string" && (data[key] as string).trim().length > 0 && (data[key] as string).length <= max;
  if (!string("name", 80) || !string("url", 500) || !string("tagline", 180) || !string("email", 200)) return false;
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email as string)) return false;
  if (!genres.includes(data.genre as Genre) || !["App", "Website"].includes(data.type as string)) return false;
  if (data.website !== "" || typeof data.requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.requestId)) return false;
  try {
    const url = new URL(data.url as string);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || !url.hostname.includes('.')) return false;
  } catch { return false; }
  return true;
}

export function filterProducts(options: { view:string; genre:Genre|null; query:string; sort:string; saved:string[]; items?:Product[]; funding?:string }): Product[] {
  const needle = options.query.trim().toLowerCase();
  const result = (options.items||products).filter(product =>
    (options.view !== "apps" || product.type === "App") &&
    (options.view !== "websites" || product.type === "Website") &&
    (options.view !== "saved" || options.saved.includes(product.id)) &&
    (!options.genre || product.genre === options.genre) &&
    (!options.funding || product.funding === options.funding) &&
    `${product.name} ${product.tagline} ${product.genre} ${product.platforms.join(" ")}`.toLowerCase().includes(needle)
  );
  return options.sort === "az" ? [...result].sort((a,b) => a.name.localeCompare(b.name)) : result;
}
