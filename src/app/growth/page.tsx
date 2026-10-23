import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import CommunityShell from '@/components/CommunityShell';
import GrowthDashboard from '@/components/GrowthDashboard';
import '../directory.css';
import '../tools.css';
import '../growth.css';
export const metadata:Metadata={title:'Growth dashboard',robots:{index:false,follow:true}};
export default function Page(){
  return <CommunityShell active="/premium"><main className="rc-content gd-page">
    <div className="rc-page-title"><span className="rd-overline">FREE SEARCH CONSOLE DASHBOARD · AI AGENT WITH GROWTH</span><h1>Your growth dashboard.<br/><em>Search, AI and visibility in one place.</em></h1><p>Free for every builder: your Google Search Console graphs, the keywords people use to find you, and quick wins to act on. Growth adds AI-search tracking and a Claude SEO agent with monthly AI credit. <Link href="/premium" style={{textDecoration:'underline'}}>See plans <ArrowUpRight size={13}/></Link></p></div>
    <GrowthDashboard/>
  </main></CommunityShell>;
}
