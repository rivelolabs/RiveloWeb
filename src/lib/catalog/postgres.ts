import {Pool} from 'pg';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import type {CatalogState} from './types';
import {buildPublicSnapshot,type PublicSnapshot} from './snapshot';
const globalDb=globalThis as unknown as {riveloCatalogPool?:{url:string;pool:Pool}};
export function postgresEnabled(){return process.env.CATALOG_STORE==='postgres';}
/** Network-level failures worth one retry (never SQL errors). */
export function transientDbError(error:unknown){const m=error instanceof Error?`${error.message} ${(error as {code?:string}).code||''}`:'';return /Connection terminated|connection timeout|timeout exceeded when trying to connect|ECONNRESET|ETIMEDOUT|EPIPE|57P01|08006|08003|08001/i.test(m);}
export function databasePool(){
  const raw=process.env.DATABASE_URL;if(!raw)throw Error('Configure DATABASE_URL before selecting PostgreSQL storage.');
  const url=new URL(raw);if(!['postgres:','postgresql:'].includes(url.protocol))throw Error('Use a PostgreSQL database URL.');
  for(const key of ['sslmode','sslrootcert','sslcert','sslkey'])url.searchParams.delete(key);
  if(globalDb.riveloCatalogPool?.url===raw)return globalDb.riveloCatalogPool.pool;
  const certificatePath=process.env.DATABASE_CA_PATH||path.join(process.cwd(),'certs','supabase-ca.crt');
  const ca=process.env.DATABASE_CA_CERT?.replace(/\\n/g,'\n')||(existsSync(certificatePath)?readFileSync(certificatePath,'utf8'):undefined);
  // Serverless functions freeze between requests, so idle sockets go stale: keep them short-lived and kept alive.
  const pool=new Pool({connectionString:url.href,max:3,connectionTimeoutMillis:10000,idleTimeoutMillis:10000,keepAlive:true,statement_timeout:12000,ssl:{rejectUnauthorized:true,...(ca?{ca}:{})},application_name:'rivelo-directory'});
  pool.on('error',()=>console.error('Rivelo database connection interrupted.'));
  // A dropped or timed-out connection is retried once on a fresh connection before the error reaches the page.
  const query=pool.query.bind(pool) as (...args:unknown[])=>Promise<unknown>;
  pool.query=(async(...args:unknown[])=>{try{return await query(...args);}catch(error){if(!transientDbError(error))throw error;await new Promise(r=>setTimeout(r,250));return query(...args);}}) as typeof pool.query;
  globalDb.riveloCatalogPool?.pool.end().catch(()=>{});globalDb.riveloCatalogPool={url:raw,pool};return pool;
}
export async function initializePostgres(initial:CatalogState){
  const client=await databasePool().connect();try{
    await client.query('BEGIN');
    await client.query('CREATE SCHEMA IF NOT EXISTS rivelo_directory');
    await client.query('REVOKE ALL ON SCHEMA rivelo_directory FROM PUBLIC');
    await client.query(`DO $$ BEGIN IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname='anon') THEN REVOKE ALL ON SCHEMA rivelo_directory FROM anon; END IF; IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN REVOKE ALL ON SCHEMA rivelo_directory FROM authenticated; END IF; END $$`);
    await client.query(`CREATE TABLE IF NOT EXISTS rivelo_directory.catalog_state (id text PRIMARY KEY CHECK(id='primary'), payload jsonb NOT NULL, public_payload jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`);
    await client.query('ALTER TABLE rivelo_directory.catalog_state ENABLE ROW LEVEL SECURITY');
    await client.query('REVOKE ALL ON rivelo_directory.catalog_state FROM PUBLIC, anon, authenticated');
    const result=await client.query(`INSERT INTO rivelo_directory.catalog_state(id,payload,public_payload) VALUES('primary',$1::jsonb,$2::jsonb) ON CONFLICT(id) DO NOTHING RETURNING id`,[JSON.stringify(initial),JSON.stringify(buildPublicSnapshot(initial))]);
    await client.query('COMMIT');return {success:true,initialized:result.rowCount===1};
  }catch{await client.query('ROLLBACK').catch(()=>{});throw Error('Database initialization failed. Verify the connection, certificate, and schema permissions.');}finally{client.release();}
}
export async function readPostgres():Promise<CatalogState>{try{const result=await databasePool().query(`SELECT payload FROM rivelo_directory.catalog_state WHERE id='primary'`);if(!result.rows[0])throw Error('Missing catalog');return result.rows[0].payload;}catch{throw Error('The database catalog is unavailable. Check its connection and initialization.');}}
const lastPublic=((globalThis as unknown as {riveloLastPublic?:{snap?:PublicSnapshot}}).riveloLastPublic??={});
export async function readPostgresPublic():Promise<PublicSnapshot>{
  // Only sanitized data is read by React pages, including development I/O traces.
  try{const result=await databasePool().query(`SELECT public_payload FROM rivelo_directory.catalog_state WHERE id='primary'`);if(!result.rows[0])throw Error('Missing catalog');const snap=result.rows[0].public_payload as PublicSnapshot;
  // Snapshots saved before the built-in listings were removed still contain them; only real listings (imported or owner-submitted) are public now.
  const out={...snap,products:(snap.products||[]).filter(p=>p.imported)};lastPublic.snap=out;return out;}catch(error){console.error('[rivelo] readPostgresPublic failed:',error instanceof Error?error.message:error);
  // Keep pages up during a database blip: serve the last catalog this server instance read successfully.
  if(lastPublic.snap){console.warn('[rivelo] serving last good public catalog');return lastPublic.snap;}throw Error('The public catalog is temporarily unavailable.');}
}
export async function updatePostgres<T>(fn:(state:CatalogState)=>T):Promise<T>{const client=await databasePool().connect();try{await client.query('BEGIN');const row=await client.query(`SELECT payload FROM rivelo_directory.catalog_state WHERE id='primary' FOR UPDATE`);if(!row.rows[0])throw Error('Initialize the database catalog first.');const state=row.rows[0].payload as CatalogState;const result=fn(state);await client.query(`UPDATE rivelo_directory.catalog_state SET payload=$1::jsonb,public_payload=$2::jsonb,updated_at=now() WHERE id='primary'`,[JSON.stringify(state),JSON.stringify(buildPublicSnapshot(state))]);await client.query('COMMIT');return result;}catch(error){await client.query('ROLLBACK').catch(()=>{});throw error;}finally{client.release();}}
