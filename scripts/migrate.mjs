// Apply db/migrations/*.sql to DATABASE_URL in order.
// Usage: node --env-file=.env.local scripts/migrate.mjs
import pg from 'pg';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import path from 'node:path';
const raw=process.env.DATABASE_URL;if(!raw)throw Error('Set DATABASE_URL first.');
const url=new URL(raw);for(const k of ['sslmode','sslrootcert','sslcert','sslkey'])url.searchParams.delete(k);
const caPath=process.env.DATABASE_CA_PATH||path.join(process.cwd(),'certs','supabase-ca.crt');
const ca=process.env.DATABASE_CA_CERT?.replace(/\\n/g,'\n')||(existsSync(caPath)?readFileSync(caPath,'utf8'):undefined);
const client=new pg.Client({connectionString:url.href,ssl:{rejectUnauthorized:true,...(ca?{ca}:{})},application_name:'rivelo-migrate'});
await client.connect();
try{
  const dir=path.join(process.cwd(),'db','migrations');
  for(const file of readdirSync(dir).filter(f=>f.endsWith('.sql')).sort()){
    const version=file.replace(/\.sql$/,'');
    const done=await client.query(`SELECT 1 FROM rivelo.schema_migrations WHERE version=$1`,[version]).catch(()=>({rowCount:0}));
    if(done.rowCount){console.log(`✓ ${version} (already applied)`);continue;}
    await client.query(readFileSync(path.join(dir,file),'utf8'));console.log(`✓ ${version} applied`);
  }
}finally{await client.end();}
