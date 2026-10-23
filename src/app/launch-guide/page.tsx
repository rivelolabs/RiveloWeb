import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import CommunityShell from '@/components/CommunityShell';
import {serializeSchema} from '@/lib/seo';
import '../directory.css';
import '../tools.css';
const URL_='https://rivelolabs.com/launch-guide';
export const metadata:Metadata={
  title:'Where to Launch Your App or Website — Free Launch Sites & Product Hunt Alternatives',
  description:'A practical list of free places to launch a new app, SaaS or website: Product Hunt alternatives, startup directories, communities and AI-search tips to get your first users and backlinks.',
  alternates:{canonical:URL_},
  openGraph:{title:'Where to launch your app or website (free list) | Rivelo Labs',description:'Free launch sites, Product Hunt alternatives and a launch-week plan to get your first users.',url:URL_},
};
type Place={name:string;url:string;what:string;tip:string};
const SECTIONS:{title:string;intro:string;places:Place[]}[]=[
  {title:'Launch platforms',intro:'Big launch days. Prepare visuals and a short story, and be online to answer comments.',places:[
    {name:'Rivelo Labs',url:'https://rivelolabs.com/register',what:'Free listing, a public product page and a pin on the world map, with upvotes and comments.',tip:'Add the “Featured on Rivelo Labs” badge to your site for a backlink.'},
    {name:'Product Hunt',url:'https://www.producthunt.com',what:'The best-known daily launch board for tech products.',tip:'Launch on a weekday morning (Pacific time) with a clear tagline and a short demo video.'},
    {name:'Hacker News — Show HN',url:'https://news.ycombinator.com/showhn.html',what:'Post your project as “Show HN: …” to a technical audience.',tip:'Write plainly, explain how it works, and reply to every comment.'},
    {name:'DevHunt',url:'https://devhunt.org',what:'Launch board focused on developer tools.',tip:'Best for APIs, CLIs, SDKs and dev-facing SaaS.'},
    {name:'Peerlist Launchpad',url:'https://peerlist.io',what:'Weekly launches from a professional builder community.',tip:'Fill in your Peerlist profile first; it shows next to your launch.'},
  ]},
  {title:'Startup directories',intro:'Evergreen listings that keep sending visitors and give you backlinks AI assistants can read.',places:[
    {name:'BetaList',url:'https://betalist.com',what:'Early-stage startups looking for first users and beta testers.',tip:'Submit before your public launch.'},
    {name:'AlternativeTo',url:'https://alternativeto.net',what:'People search “alternatives to X”; list yourself as an alternative to the big player.',tip:'Pick 3–5 well-known products you replace.'},
    {name:'SaaSHub',url:'https://www.saashub.com',what:'Software directory and alternatives database.',tip:'Claim your page and add screenshots.'},
    {name:'Uneed',url:'https://www.uneed.best',what:'Daily launch list for tools and SaaS.',tip:'Schedule a launch day and share it with your audience.'},
    {name:'Fazier',url:'https://fazier.com',what:'Launch platform and directory for makers.',tip:'Good second launch after Product Hunt.'},
    {name:'Microlaunch',url:'https://microlaunch.net',what:'Month-long launches for small products.',tip:'Collect feedback over the whole month, not one day.'},
  ]},
  {title:'Communities',intro:'Be useful first. Share what you learned, not just a link.',places:[
    {name:'Indie Hackers',url:'https://www.indiehackers.com',what:'Founders sharing revenue, lessons and launches.',tip:'Post a build-in-public story with real numbers.'},
    {name:'Reddit',url:'https://www.reddit.com/r/SideProject/',what:'r/SideProject, r/startups, r/IMadeThis and niche subreddits for your audience.',tip:'Read each subreddit’s rules; many only allow self-promotion on set days.'},
    {name:'X (Twitter)',url:'https://x.com',what:'Build in public, reply to people with the problem you solve.',tip:'Share progress weekly and pin your launch post.'},
    {name:'Rivelo Community',url:'https://rivelolabs.com/community',what:'Ask questions and share launch lessons with other builders.',tip:'Post what you shipped this week.'},
  ]},
];
const STEPS=[
  ['Week before','Run the free Visibility Check, fix your title, description, share image and sitemap, and list on Rivelo Labs and BetaList.'],
  ['Launch day','Launch on one big platform (Product Hunt or Show HN), post a build story on X and Indie Hackers, and answer every comment.'],
  ['Week after','Submit to AlternativeTo, SaaSHub, Uneed and Fazier, add the Rivelo badge to your site, and verify your site in Google Search Console and Bing Webmaster Tools.'],
  ['Every month','Write one helpful article for the problem you solve, keep listings up to date, and ask happy users to mention you.'],
];
export default function Page(){
  const all=SECTIONS.flatMap(s=>s.places);
  const ld=[
    {'@context':'https://schema.org','@type':'Article',headline:'Where to launch your app or website',description:metadata.description,url:URL_,author:{'@type':'Organization',name:'Rivelo Labs',url:'https://rivelolabs.com'},publisher:{'@type':'Organization',name:'Rivelo Labs',logo:{'@type':'ImageObject',url:'https://rivelolabs.com/icon-512.png'}},dateModified:'2026-10-23'},
    {'@context':'https://schema.org','@type':'ItemList',name:'Free places to launch an app or website',itemListElement:all.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.name,url:p.url}))},
    {'@context':'https://schema.org','@type':'HowTo',name:'How to launch a new app or website',step:STEPS.map(([n,t])=>({'@type':'HowToStep',name:n,text:t}))},
  ];
  return <CommunityShell active="/launch-guide"><main className="rc-content tl-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeSchema(ld)}}/>
    <div className="rc-page-title"><span className="rd-overline">LAUNCH GUIDE · UPDATED OCTOBER 2026</span><h1>Where to launch your app<br/><em>or website — for free.</em></h1><p>{all.length} places to get your first users and backlinks, plus a simple launch-week plan. Product Hunt alternatives included.</p></div>
    <section className="tl-steps"><h2>A simple launch plan</h2><ol>{STEPS.map(([n,t])=><li key={n}><b>{n}</b><span>{t}</span></li>)}</ol><Link className="rd-button rd-primary" href="/tools/visibility-check">Run the free visibility check <ArrowUpRight size={16}/></Link></section>
    {SECTIONS.map(s=><section key={s.title} className="tl-list"><h2>{s.title}</h2><p className="tl-intro">{s.intro}</p><ol>{s.places.map(p=><li key={p.name}><div><a href={p.url} target="_blank" rel="noopener">{p.name} <ArrowUpRight size={14}/></a><p>{p.what}</p><small>Tip: {p.tip}</small></div></li>)}</ol></section>)}
    <section className="tl-faq"><h2>Getting recommended by AI assistants</h2><p className="tl-intro">ChatGPT, Claude and Perplexity mostly recommend products that independent sites already mention. Allow their crawlers in robots.txt, publish a short /llms.txt, and get listed on the directories above. Our <Link href="/tools/visibility-check">Visibility Check</Link> tests all of this for you.</p></section>
    <section className="tl-next"><h2>Start here</h2><div><Link href="/register">List your product free on Rivelo <ArrowUpRight size={15}/></Link><Link href="/tools/visibility-check">Check your site’s visibility <ArrowUpRight size={15}/></Link><Link href="/community">Ask the community <ArrowUpRight size={15}/></Link></div></section>
  </main></CommunityShell>;
}
