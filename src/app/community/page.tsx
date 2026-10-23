import type {Metadata} from 'next';
import {publicPosts} from '@/lib/catalog/public';
import CommunityFeed from '@/components/CommunityFeed';
import {readPublicCatalog} from '@/lib/catalog/store';
import {dbEnabled} from '@/lib/db';
import {cachedPublishedPosts} from '@/lib/db/community';
import '../directory.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Community — Meet the people building',description:'Ask questions and share lessons about launching apps, websites, product design, and growth with the Rivelo Labs community.',alternates:{canonical:'https://rivelolabs.com/community'}};
export default async function Page(){const posts=dbEnabled()?await cachedPublishedPosts().catch(e=>{console.error("[rivelo] community posts unavailable:",e instanceof Error?e.message:e);return [];}):(await readPublicCatalog()).posts;return <CommunityFeed posts={posts}/>;}
