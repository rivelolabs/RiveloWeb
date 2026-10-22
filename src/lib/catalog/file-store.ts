import {readFileSync} from 'node:fs';
import {mkdir,writeFile,rename,unlink,stat} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {products,genres} from '@/lib/directory';
import {listingProduct,type CatalogState} from './types';
export function catalogDirectory(){return process.env.CATALOG_DATA_DIR||(process.env.NODE_ENV!=='production'?path.join(process.cwd(),'.data','catalog'):null);}
export function initialState():CatalogState{return {version:1,pins:[],posts:[],sources:genres.map((genre,index)=>({id:`apple-in-${index}`,kind:'appstore-search',value:['social community','fitness habits','productivity planner','puzzle games','developer tools'][index],country:'in',genre,enabled:true})),listings:[],claims:[],invites:[],suppressed:[],leads:[],runs:[],enabled:false,cursor:0};}
// Keep private file contents outside React development async I/O traces.
export function readCatalog():CatalogState{const directory=catalogDirectory();if(!directory)return initialState();try{const state=JSON.parse(readFileSync(path.join(directory,'state.json'),'utf8'));if(state.version!==1||!Array.isArray(state.listings))throw Error('Invalid catalog storage.');return {...initialState(),...state};}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return initialState();throw error;}}
export async function updateCatalog<T>(fn:(state:CatalogState)=>T):Promise<T>{
  const directory=catalogDirectory();if(!directory)throw Error('Configure persistent CATALOG_DATA_DIR storage first.');
  await mkdir(directory,{recursive:true,mode:0o700});const lock=path.join(directory,'write.lock');let acquired=false;
  for(let attempt=0;attempt<20;attempt++){try{await writeFile(lock,'locked',{flag:'wx',mode:0o600});acquired=true;break;}catch(error){if((error as NodeJS.ErrnoException).code!=='EEXIST')throw error;try{if(Date.now()-(await stat(lock)).mtimeMs>120000)await unlink(lock);}catch{}await new Promise(resolve=>setTimeout(resolve,30));}}
  if(!acquired)throw Error('Catalog is busy. Please try again.');
  const temporary=path.join(directory,`state-${randomUUID()}.tmp`);
  try{const state=await readCatalog();const result=fn(state);await writeFile(temporary,JSON.stringify(state,null,2),{mode:0o600});await rename(temporary,path.join(directory,'state.json'));return result;}
  finally{await unlink(temporary).catch(()=>{});await unlink(lock).catch(()=>{});}
}
export function publicProducts(){const state=readCatalog();return [...products.map(product=>({...product,claimed:state.claims.some(claim=>claim.productId===product.id&&claim.status==='approved')})),...state.listings.filter(item=>item.status==='published').map(listingProduct)];}
