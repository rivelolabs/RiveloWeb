import {NextResponse} from 'next/server';
import {databasePool,postgresEnabled} from '@/lib/catalog/postgres';
import {authConfig} from '@/lib/auth/config';
export const runtime='nodejs';export const dynamic='force-dynamic';
// Quick production check: is the database reachable, and are the tables there? Never returns secrets.
export async function GET(){
  const out:Record<string,unknown>={store:postgresEnabled()?'postgres':'file',databaseUrlSet:!!process.env.DATABASE_URL,caCertSet:!!process.env.DATABASE_CA_CERT,supabaseAuth:!!authConfig()};
  if(postgresEnabled()){
    try{const u=new URL(process.env.DATABASE_URL||'');out.dbHost=u.hostname;out.dbPort=u.port;out.dbUser=decodeURIComponent(u.username);}catch{out.dbHost='invalid DATABASE_URL';}
    try{
      const pool=databasePool();await pool.query('select 1');out.db='ok';
      const t=await pool.query(`select table_schema||'.'||table_name t from information_schema.tables where table_schema in ('rivelo','rivelo_directory') order by 1`);
      out.tables=t.rows.map(r=>r.t);
      const c=await pool.query(`select count(*)::int n from rivelo_directory.catalog_state`).catch(e=>({rows:[{n:'missing: '+e.message}]}));out.catalogRows=c.rows[0].n;
    }catch(e){const err=e as Error&{code?:string};out.db='error';out.error=`${err.code||''} ${err.message}`.trim().replace(/postgres(ql)?:\/\/[^\s]+/g,'[url]');}
  }
  return NextResponse.json(out,{headers:{'Cache-Control':'no-store'}});
}
