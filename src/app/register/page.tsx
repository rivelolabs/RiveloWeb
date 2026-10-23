import type {Metadata} from 'next';
import ProductRegistration from '@/components/ProductRegistration';
import '../directory.css';
export const metadata:Metadata={title:'Submit Your App or Website for Free',description:'List your app, website or startup for free on Rivelo Labs. Create a public product page and add your product to the world map for people to discover.',alternates:{canonical:'https://www.rivelolabs.com/register'}};
export default function Page(){return <ProductRegistration/>;}
