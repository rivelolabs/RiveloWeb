import type {Metadata} from 'next';
import ProductRegistration from '@/components/ProductRegistration';
import '../directory.css';
export const metadata:Metadata={title:'Submit Your App, SaaS or Startup — Free Product Listing',description:'Submit your app, SaaS or website to the Rivelo Labs startup directory for free. Create a public product listing and help people discover what you’re building.',alternates:{canonical:'https://www.rivelolabs.com/register'}};
export default function Page(){return <ProductRegistration/>;}
