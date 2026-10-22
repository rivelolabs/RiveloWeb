import type {Metadata} from 'next';
import DiscoveryDesk from '@/components/DiscoveryDesk';
import '../../directory.css';
import '../../desk.css';
export const metadata:Metadata={title:'Discovery desk',robots:{index:false,follow:false}};
export default function Page(){return <DiscoveryDesk/>;}
