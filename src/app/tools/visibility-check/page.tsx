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
  title:'Free SEO Checker for Websites and App Landing Pages',
  description:'Check how visible your website or app landing page is on Google, social media and AI assistants like ChatGPT and Claude. Your first SEO check is free, with practical fixes. More checks with Growth.',
  alternates:{canonical:URL_},
  openGraph:{title:'Free Website Visibility Checker | Rivelo Labs',description:'Your first SEO, social preview and AI-search check is free. More checks with Growth.',url:URL_},
};
const FAQ=[
  ['What does the visibility score measure?','It checks technical signals that can affect discovery: whether Google may index the page, your title and description, mobile setup, speed, sitemap, structured data, share previews on X and LinkedIn, and whether AI assistants such as ChatGPT, Claude and Perplexity are allowed to read your site.'],
  ['How do I get my app or website recommended by ChatGPT or Claude?','Publish useful product information and allow the search crawlers you want to access it, such as OAI-SearchBot and Claude-SearchBot. Build relevant mentions on independent sites. Crawler access and an llms.txt file do not guarantee indexing or recommendations.'],
  ['What is the quickest way to get my first backlink?','List your product on directories where real people discover new tools. A free Rivelo Labs listing gives you a public product page, a pin on the world map and a badge you can add to your site.'],
  ['Is the checker free?','Your first successful SEO check is free, with no sign-up needed. After that, choose the Growth premium plan for more checks. Failed checks do not use your free check. We read the public page you enter, plus its robots.txt, sitemap.xml and llms.txt.'],
];
export default function Page(){
  const ld=[
    {'@context':'https://schema.org','@type':'WebApplication',name:'Rivelo Labs Visibility Check',url:URL_,applicationCategory:'BusinessApplication',operatingSystem:'Web',offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},description:'SEO, social preview and AI-search readiness checker for websites and app landing pages. First check free; more checks with Growth.'},
    {'@context':'https://schema.org','@type':'FAQPage',mainEntity:FAQ.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))},
  ];
  return <CommunityShell active="/tools/visibility-check"><main className="rc-content tl-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeSchema(ld)}}/>
    <div className="rc-page-title"><span className="rd-overline">ONE FREE CHECK · VISIBILITY CHECK</span><h1>Free SEO checker<br/><em>for your app or website.</em></h1><p>Score your website or app landing page for Google, social previews and AI assistants like ChatGPT and Claude — with the exact fixes to make. Your first check is free; Growth unlocks more.</p></div>
    <VisibilityCheck/>
    <section className="tl-faq"><h2>Questions builders ask</h2>{FAQ.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
    <section className="tl-next"><h2>Keep going</h2><div><Link href="/launch-guide">Where to launch your app or website (free list) <ArrowUpRight size={15}/></Link><Link href="/register">List your product free on Rivelo <ArrowUpRight size={15}/></Link><Link href="/map">See builders on the world map <ArrowUpRight size={15}/></Link></div></section>
  </main></CommunityShell>;
}
