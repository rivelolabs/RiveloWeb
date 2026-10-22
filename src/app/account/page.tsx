import AccountProfile from '@/components/AccountProfile';
import CommunityShell from '@/components/CommunityShell';
import '../directory.css';
export const metadata={title:'Your account',robots:{index:false,follow:false}};
export default function Page(){return <CommunityShell active="/account"><main className="rc-content ra-account-page"><AccountProfile/></main></CommunityShell>;}
