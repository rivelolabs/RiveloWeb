import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import CommunityShell from '@/components/CommunityShell';
import VisibilityCheck from '@/components/VisibilityCheck';
import {serializeSchema} from '@/lib/seo';
import '../../directory.css';
import '../../tools.css';
const URL_='https://www.rivelolabs.com/tools/visibility-check';
export const metadata:Metadata={
  title:'Website Analyzer & SEO Checker — First Check Free',
  description:'Analyze your website or app landing page for SEO issues, metadata, sitemaps and social previews. Get a prioritized website audit. First check free.',
  alternates:{canonical:URL_},
  openGraph:{title:'Website Analyzer & SEO Checker | Rivelo Labs',description:'Your first SEO, social preview and AI-search check is free. More checks with Growth.',url:URL_},
};
const FAQ=[
  ['What does the website analyzer check?', 'The website analyzer reviews one public website or app landing page. Its SEO audit checks titles, meta descriptions, headings, canonical links, sitemaps, structured data, image descriptions and social preview tags, then highlights issues to fix first.'],
  ['Can I use it as a meta tag checker?', 'Yes. Enter your landing page URL to check its title, meta description, Open Graph image and Twitter card. The report explains missing or incomplete metadata so you can improve search snippets and shared links.'],
  ['Does it analyze every page on my website?', 'Each check analyzes the URL you enter, plus supporting files such as robots.txt and sitemap.xml. It is a single-page website audit, rather than a crawl of every page or an app store ranking analysis.'],
  ['What does the visibility score measure?','It checks technical signals that can affect discovery: whether Google may index the page, your title and description, mobile setup, speed, sitemap, structured data, share previews on X and LinkedIn, and whether AI assistants such as ChatGPT, Claude and Perplexity are allowed to read your site.'],
  ['How do I get my app or website recommended by ChatGPT or Claude?','Publish useful product information and allow the search crawlers you want to access it, such as OAI-SearchBot and Claude-SearchBot. Build relevant mentions on independent sites. Crawler access and an llms.txt file do not guarantee indexing or recommendations.'],
  ['What is the quickest way to get my first backlink?','List your product on directories where real people discover new tools. A free Rivelo Labs listing gives you a public product page, a pin on the world map and a badge you can add to your site.'],
  ['Is the checker free?','Your first successful SEO check is free, with no sign-up needed. After that, choose the Growth premium plan for more checks. Failed checks do not use your free check. We read the public page you enter, plus its robots.txt, sitemap.xml and llms.txt.'],
];
export default function Page(){
  const ld=[
    {'@context':'https://schema.org','@type':'WebApplication',name:'Rivelo Labs Website Analyzer',url:URL_,applicationCategory:'BusinessApplication',operatingSystem:'Web',offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},description:'Website analyzer and SEO checker for metadata, sitemaps, social previews and technical visibility signals. First successful audit free; more checks with Growth.'},
    {'@context':'https://schema.org','@type':'FAQPage',mainEntity:FAQ.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))},
  ];
  return <CommunityShell active="/tools/visibility-check"><main className="rc-content tl-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeSchema(ld)}}/>
    <div className="rc-page-title"><span className="rd-overline">ONE FREE CHECK · VISIBILITY CHECK</span><h1>Website analyzer<br/><em>and SEO checker.</em></h1><p>Find SEO issues on your website or app landing page. Analyze metadata, search visibility and social previews, then get practical fixes. Your first website audit is free; Growth unlocks more checks.</p></div>
    <VisibilityCheck/>
    <section className="tl-list"><h2>A website SEO audit with clear next steps</h2><p>Use the analyzer before a product launch or after updating your landing page. Review your title and description, check whether search crawlers can access the page, and see how your links are prepared for social sharing.</p><p>The technical checks include HTTPS, mobile viewport settings, HTML size and response time from our server. Work through the prioritized fixes, then use the <Link href="/app-growth">app growth guide</Link> to plan how people will discover and try your product.</p></section>
    <section className="tl-faq"><h2>Questions builders ask</h2>{FAQ.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
    <section className="tl-next"><h2>Keep going</h2><div><Link href="/launch-guide">Where to launch your app or website (free list) <ArrowUpRight size={15}/></Link><Link href="/register">List your product free on Rivelo <ArrowUpRight size={15}/></Link><Link href="/app-growth">Explore app growth and promotion ideas <ArrowUpRight size={15}/></Link><Link href="/map">See builders on the world map <ArrowUpRight size={15}/></Link></div></section>
  </main></CommunityShell>;
}
