import type { Genre } from "@/lib/directory";

export const categories: { slug: string; genre: Genre; title: string; description: string; guide: string }[] = [
  {
    slug: "social-community", genre: "Social & community", title: "Social & Community Apps and Websites",
    description: "Discover social apps and community websites for conversations, shared interests and meeting people. Explore products from independent builders on Rivelo Labs.",
    guide: "Explore products for conversations, shared interests and online communities. Before joining, check each product’s age requirements, privacy settings and moderation tools on its own website.",
  },
  {
    slug: "health-fitness", genre: "Health & fitness", title: "Health & Fitness Apps and Websites",
    description: "Discover health and fitness apps for workouts, habits and daily routines. Browse independent products and find their supported platforms on Rivelo Labs.",
    guide: "Browse tools for workouts, habits and everyday routines. Check supported devices, integrations, subscriptions and how health data is handled on the product’s website before choosing an app.",
  },
  {
    slug: "productivity", genre: "Productivity", title: "Productivity Apps and Websites",
    description: "Discover productivity apps and websites for planning, focus and getting work done. Explore tools from independent builders or submit your own product for free.",
    guide: "Find tools for planning your day, staying focused and organizing work. Compare the platforms listed below, then visit each product to check integrations, pricing and whether it fits your workflow.",
  },
  {
    slug: "games", genre: "Games", title: "Indie Games and Gaming Apps",
    description: "Discover indie games and gaming apps for web and mobile. Browse independent releases, explore their product pages or list your own game for free on Rivelo Labs.",
    guide: "Explore games from independent builders across web and mobile. Product pages show the available platforms; check the developer’s site or store listing for age ratings, purchases and device requirements.",
  },
  {
    slug: "ai-developer-tools", genre: "AI & developer tools", title: "AI Tools and Developer Tools",
    description: "Discover AI tools and developer tools from independent builders. Explore apps and websites for coding and building products, or submit your own tool for free.",
    guide: "Explore tools for coding, automation and building products. Visit each product to review its documentation, supported integrations, pricing and data policies before adding it to your workflow.",
  },
];

export function categoryForGenre(genre: Genre) {
  return categories.find(category => category.genre === genre)!;
}

export function categoryPath(genre: Genre) {
  return `/categories/${categoryForGenre(genre).slug}`;
}
