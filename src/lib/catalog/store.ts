import * as file from './file-store';
import {postgresEnabled,readPostgres,readPostgresPublic,updatePostgres} from './postgres';
import {buildPublicSnapshot} from './snapshot';
import type {CatalogState} from './types';
export const catalogDirectory=file.catalogDirectory;
export const initialState=file.initialState;
export function storageConfigured(){return postgresEnabled()?!!process.env.DATABASE_URL:!!catalogDirectory();}
export async function readCatalog():Promise<CatalogState>{return postgresEnabled()?readPostgres():file.readCatalog();}
export async function updateCatalog<T>(fn:(state:CatalogState)=>T):Promise<T>{return postgresEnabled()?updatePostgres(fn):file.updateCatalog(fn);}
// Public pages should never crash because the database is briefly unreachable: show an empty catalog and log the cause.
export async function readPublicCatalog(){
  if(!postgresEnabled())return buildPublicSnapshot(file.readCatalog());
  try{return await readPostgresPublic();}
  catch(error){console.error('[rivelo] public catalog unavailable:',error instanceof Error?error.message:error);return buildPublicSnapshot(file.initialState());}
}
export async function publicProducts(){return (await readPublicCatalog()).products;}
