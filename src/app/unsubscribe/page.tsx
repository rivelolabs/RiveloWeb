import Unsubscribe from '@/components/Unsubscribe';
import '../directory.css';
export const metadata={title:'Unsubscribe',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{token?:string}>}){return <main className="rd-app"><div className="rc-content"><Unsubscribe token={(await searchParams).token||''}/></div></main>;}
