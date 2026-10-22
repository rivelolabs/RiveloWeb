import CommunityShell from '@/components/CommunityShell';
import SignIn from '@/components/SignIn';
import {safeNext} from '@/lib/auth/config';
import '../directory.css';
export const metadata={title:'Sign in to Rivelo',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{next?:string;error?:string}>}){const params=await searchParams;return <CommunityShell active="/login"><main className="rc-content ra-login-page"><SignIn next={safeNext(params.next)} failed={!!params.error}/></main></CommunityShell>;}
