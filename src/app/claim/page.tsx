import type {Metadata} from 'next';
import OwnerClaim from '@/components/OwnerClaim';
import {publicProducts} from '@/lib/catalog/store';
import '../directory.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Claim your product',robots:{index:false,follow:true}};
export default async function Page({searchParams}:{searchParams:Promise<{product?:string}>}){const query=await searchParams;const products=(await publicProducts()).map(({id,name})=>({id,name}));return <OwnerClaim products={products} selected={query.product||''}/>;}
