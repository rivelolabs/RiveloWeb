import {readCatalog} from '@/lib/catalog/store';
/** A signed-in user may promote a product they registered (same email) or have an approved claim on. */
export async function ownsPublishedProduct(email:string|null|undefined,productId:string){
  if(!email)return false;const e=email.toLowerCase();
  const state=await readCatalog();
  if(!state.listings.some(l=>l.id===productId&&l.status==='published'))return false;
  return state.pins.some(p=>p.productId===productId&&p.email.toLowerCase()===e)||state.claims.some(c=>c.productId===productId&&c.status==='approved'&&c.email.toLowerCase()===e);
}
/** Published products this user can promote (for the plan picker). */
export async function promotableProducts(email:string|null|undefined){
  if(!email)return [];const e=email.toLowerCase();const state=await readCatalog();
  const ids=new Set([...state.pins.filter(p=>p.email.toLowerCase()===e).map(p=>p.productId),...state.claims.filter(c=>c.status==='approved'&&c.email.toLowerCase()===e).map(c=>c.productId)]);
  return state.listings.filter(l=>l.status==='published'&&ids.has(l.id)).map(l=>({id:l.id,name:l.name}));
}
