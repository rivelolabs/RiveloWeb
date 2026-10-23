import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import CommunityShell from '@/components/CommunityShell';
import VisibilityCheck from '@/components/VisibilityCheck';
import {serializeSchema} from '@/lib/seo';
import '../../directory.css';
import '../../tools.css';
const URL_='https://rivelolabs.com/tools/visibility-check';
export const metadata:Metadata={
  title:'Free Website Visibility Checker — SEO, social & AI search score',
  description:'Check how visible your website or app landing page is on Google, social media and AI assistants like ChatGPT and Claude. Free score with the exact fixes to make, in 10 seconds.',
  alternates:{canonical:URL_},
  openGraph:{title:'Free Website Visibility Checker | Rivelo Labs',description:'Your SEO, social preview and AI-search score with the exact fixes to make. Free, no sign-up.',url:URL_},
};
const FAQ=[
  ['What does the visibility score measure?','It checks the things that decide whether people can find you: whether Google may index the page, your title and description, mobile setup, speed, sitemap, structured data, share previews on X and LinkedIn, and whether AI assistants such as ChatGPT, Claude and Perplexity are allowed to read your site.'],
  ['How do I get my app or website recommended by ChatGPT or Claude?','Let their crawlers read your site (do not block GPTBot, OAI-SearchBot, ClaudeBot or PerplexityBot in robots.txt), publish a short /llms.txt that explains what you do, and get mentioned on trusted independent sites and directories. AI assistants mostly recommend products that other sites already talk about.'],
  ['What is the quickest way to get my first backlink?','List your product on directories where real people discover new tools. A free Rivelo Labs listing gives you a public product page, a pin on the world map and a badge you can add to your site.'],
  ['Is the checker free?','Yes. There is no sign-up and no limit for normal use. We only read the public page you enter, plus its robots.txt, sitemap.xml and llms.txt.'],
];
export default function Page(){
  const ld=[
    {'@context':'https://schema.org','@type':'WebApplication',name:'Rivelo Labs Visibility Check',url:URL_,applicationCategory:'BusinessApplication',operatingSystem:'Web',offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},description:'Free SEO, social preview and AI-search readiness checker for websites and app landing pages.'},
    {'@context':'https://schema.org','@type':'FAQPage',mainEntity:FAQ.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))},
  ];
  return <CommunityShell active="/tools/visibility-check"><main className="rc-content tl-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeSchema(ld)}}/>
    <div className="rc-page-title"><span className="rd-overline">FREE TOOL · VISIBILITY CHECK</span><h1>Can people find your product?<br/><em>Find out in 10 seconds.</em></h1><p>Score your website or app landing page for Google, social previews and AI assistants like ChatGPT and Claude — with the exact fixes to make.</p></div>
    <VisibilityCheck/>
    <section className="tl-faq"><h2>Questions builders ask</h2>{FAQ.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
    <section className="tl-next"><h2>Keep going</h2><div><Link href="/launch-guide">Where to launch your app or website (free list) <ArrowUpRight size={15}/></Link><Link href="/register">List your product free on Rivelo <ArrowUpRight size={15}/></Link><Link href="/map">See builders on the world map <ArrowUpRight size={15}/></Link></div></section>
  </main></CommunityShell>;
}
