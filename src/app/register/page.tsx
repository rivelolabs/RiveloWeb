import type {Metadata} from 'next';
import ProductRegistration from '@/components/ProductRegistration';
import '../directory.css';
export const metadata:Metadata={title:'List your app or website',description:'Register your product and choose its public location on the Rivelo Labs business map.',alternates:{canonical:'https://rivelolabs.com/register'}};
export default function Page(){return <ProductRegistration/>;}
