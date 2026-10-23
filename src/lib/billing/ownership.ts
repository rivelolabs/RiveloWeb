import {readCatalog} from '@/lib/catalog/store';
import {dbEnabled} from '@/lib/db';
import {makerExtras,makerFromProductId,myMakerPages,productLabel} from '@/lib/db/makers';
/** Who is buying: a plan can promote a catalog listing (matched by email) or a claimed X maker page (matched by account id). */
export type Buyer={id:string;email?:string|null};
const MAKER='maker:';
export async function ownsPublishedProduct(buyer:Buyer,productId:string){
  if(productId.startsWith(MAKER)){
    if(!dbEnabled())return false;const username=makerFromProductId(productId)!.toLowerCase(),key=productId.split('/')[1];
    const page=(await myMakerPages(buyer.id).catch(()=>[])).find(m=>m.username.toLowerCase()===username);if(!page)return false;
    return !key||!!(await makerExtras([page.id])).get(page.id)?.some(e=>e.key===key);
  }
  if(!buyer.email)return false;const e=buyer.email.toLowerCase();
  const state=await readCatalog();
  if(!state.listings.some(l=>l.id===productId&&l.status==='published'))return false;
  return state.pins.some(p=>p.productId===productId&&p.email.toLowerCase()===e)||state.claims.some(c=>c.productId===productId&&c.status==='approved'&&c.email.toLowerCase()===e);
}
/** Everything this user can promote: published listings on their email + maker pages they claimed with X. */
export async function promotableProducts(buyer:Buyer){
  const [state,makers]=await Promise.all([buyer.email?readCatalog():Promise.resolve(null),dbEnabled()?myMakerPages(buyer.id).catch(()=>[]):Promise.resolve([])]);
  const out:{id:string;name:string}[]=[];
  if(state&&buyer.email){const e=buyer.email.toLowerCase();
    const ids=new Set([...state.pins.filter(p=>p.email.toLowerCase()===e).map(p=>p.productId),...state.claims.filter(c=>c.status==='approved'&&c.email.toLowerCase()===e).map(c=>c.productId)]);
    out.push(...state.listings.filter(l=>l.status==='published'&&ids.has(l.id)).map(l=>({id:l.id,name:l.name})));}
  const extras=await makerExtras(makers.map(m=>m.id)).catch(()=>new Map());
  for(const m of makers){out.push({id:`${MAKER}${m.username}`,name:`${productLabel(m.productName,m.name)} (builder page)`});
    for(const e of extras.get(m.id)||[])out.push({id:`${MAKER}${m.username}/${e.key}`,name:`${e.name} (builder page)`});}
  return out;
}
