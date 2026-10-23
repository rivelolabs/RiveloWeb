import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import CommunityShell from '@/components/CommunityShell';
import { serializeSchema, shareImage, siteUrl } from '@/lib/seo';
import '../directory.css';
import '../tools.css';

const URL_ = `${siteUrl}/app-growth`;
const TITLE = 'App Growth Guide — Promote Your App & Get First Users';
const DESCRIPTION = 'A practical app growth guide for indie builders: free app promotion, startup directories, website SEO audits and ways to turn early visitors into users.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL_ },
  openGraph: { title: `${TITLE} | Rivelo Labs`, description: DESCRIPTION, url: URL_, type: 'article', images: [shareImage] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [shareImage] },
};

const FAQ = [
  ['How can I promote my app for free?', 'Start with a clear landing page, a free app directory listing and one community where people already discuss the problem you solve. Share a short demo and ask for specific feedback. Track which channels bring people who actually try the product before spending money on promotion.'],
  ['How is app growth different from app store optimization?', 'App store optimization focuses on discovery and conversion inside stores such as the App Store and Google Play. App growth also includes your website, search traffic, launch communities, onboarding and whether people return. Rivelo’s website analyzer checks public web pages; it does not audit your app store rankings.'],
  ['Should a new SaaS product focus on SEO or a launch?', 'A launch can start conversations and bring early feedback, while useful search content gives people another way to discover the product over time. Prepare a focused product page, fix basic SEO issues, then choose a launch channel that matches the people you want to reach.'],
];

export default function AppGrowthPage() {
  const schema = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: TITLE, description: DESCRIPTION, url: URL_, datePublished: '2026-10-23', dateModified: '2026-10-23', author: { '@type': 'Organization', name: 'Rivelo Labs', url: siteUrl }, publisher: { '@type': 'Organization', name: 'Rivelo Labs', url: siteUrl } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Discover', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'App growth guide', item: URL_ },
    ] },
  ];
  return <CommunityShell active=""><main className="rc-content tl-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}/>
    <div className="rc-page-title"><span className="rd-overline">APP MARKETING · A GUIDE FOR INDEPENDENT BUILDERS</span><h1>App growth starts<br/><em>with your first real users.</em></h1><p>A practical starting point for mobile apps, SaaS products and independent websites. Use this guide to plan your app promotion, improve your landing page and learn which channels bring people who want what you’re building.</p></div>

    <section className="tl-list"><h2>1. Make your product easy to understand</h2><p>Describe one audience, one problem and the result your product helps people achieve. Put that explanation near the top of your app landing page, alongside a screenshot or short demo and a clear next step. “Plan your week in ten minutes” tells a potential user more than a list of technologies.</p><p>Keep the same product name, website and explanation on your public profiles and directory listings. Consistent details make it easier for people to recognize your product after seeing it in different places.</p></section>

    <section className="tl-list"><h2>2. Run a website SEO audit before promoting it</h2><p>Use a <Link href="/tools/visibility-check">website analyzer and SEO checker</Link> to review the public page that people will visit. Check its title, meta description, main heading, canonical URL, sitemap and social preview image. These details help explain the product in search results and when someone shares a link.</p><p>Rivelo’s analyzer also checks basic technical signals such as HTTPS, mobile viewport settings, HTML size and response time from our server. Your first successful check is free; more checks are included with Growth. Start with the highest-priority fixes before you send people to the page.</p></section>

    <section className="tl-list"><h2>3. Launch where your early users already look</h2><p>A startup launch platform or SaaS directory is useful when its visitors match your audience. Developer tools, fitness apps and social products often need different communities and different demos. Choose a few relevant places and explain why you built the product.</p><p><Link href="/register">Submit your app or website for free</Link> to create a Rivelo product listing. For more options, our <Link href="/launch-guide">free launch sites and Product Hunt alternatives guide</Link> covers launch platforms, startup directories and builder communities. Prepare a clear tagline and be available to answer questions after posting.</p></section>

    <section className="tl-list"><h2>4. Turn early visits into useful feedback</h2><p>Watch what happens after someone reaches your site. Can they understand the product, find the right store link and finish the first useful action? Ask a few new users where they got stuck. Shortening a confusing sign-up flow can be more useful than sending more people into it.</p><p>Choose an activation event that means the product helped someone: finishing a workout, creating a project or starting a conversation. Compare promotion channels using that event alongside visits and sign-ups.</p></section>

    <section className="tl-list"><h2>5. Build an app marketing routine you can sustain</h2><p>Share a useful update, customer lesson or short tutorial regularly. Write about a specific problem your users face, with examples from your product. A guide answering a real question gives people a reason to visit even when they are not ready to sign up.</p><p>Use the <Link href="/community">builder community</Link> to discuss launch lessons and ask focused questions. Keep your product listing current as features and supported platforms change. When you are ready to pay for promotion, <Link href="/premium">app growth and product promotion plans</Link> explain Rivelo’s sponsored placements and Growth features.</p></section>

    <section className="tl-list"><h2>6. Measure discovery, activation and return visits</h2><p>Review which search queries and pages bring relevant traffic. In Google Search Console, compare impressions, clicks and click-through rate over time. A page with many impressions and few clicks may need a clearer title or a better match for what people are searching for.</p><p>Compare that discovery data with sign-ups, activation and return visits from your own product analytics. Keep a simple record of what you changed and when. This helps you choose the next experiment from evidence instead of chasing every marketing channel.</p></section>

    <section className="tl-faq"><h2>App growth questions</h2>{FAQ.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
    <section className="tl-next"><h2>Choose your next step</h2><div><Link href="/tools/visibility-check">Analyze your website’s SEO <ArrowUpRight size={15}/></Link><Link href="/register">List your product for free <ArrowUpRight size={15}/></Link><Link href="/launch-guide">Find a place to launch <ArrowUpRight size={15}/></Link></div></section>
  </main></CommunityShell>;
}
