import {products} from '@/lib/directory';
import {listingProduct,type CatalogState} from './types';
import {publicPins,publicPosts} from './public';
export function buildPublicSnapshot(state:CatalogState){return {products:[...products.map(product=>({...product,claimed:state.claims.some(claim=>claim.productId===product.id&&claim.status==='approved')})),...state.listings.filter(item=>item.status==='published').map(listingProduct)],pins:publicPins(state),posts:publicPosts(state)};}
export type PublicSnapshot=ReturnType<typeof buildPublicSnapshot>;
