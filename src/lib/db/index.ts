import {databasePool} from '@/lib/catalog/postgres';
import type {User} from '@supabase/supabase-js';

/** New relational tables (schema `rivelo`) are used whenever the app runs on Postgres. */
export function dbEnabled(){return process.env.CATALOG_STORE==='postgres'&&!!process.env.DATABASE_URL;}
export function db(){return databasePool();}

/** Keep the profile row current. The DB trigger creates it on first sign-in; this also refreshes it. */
export async function upsertProfile(user:User){
  if(!dbEnabled())return;
  const m=user.user_metadata||{};
  const pick=(...keys:string[])=>{for(const k of keys){const v=m[k];if(typeof v==='string'&&v.trim())return v.trim().slice(0,300);}return null;};
  await db().query(
    `INSERT INTO rivelo.profiles (id,email,full_name,username,avatar_url,provider,last_seen_at)
     VALUES ($1,$2,$3,$4,$5,$6,now())
     ON CONFLICT (id) DO UPDATE SET email=COALESCE(EXCLUDED.email,rivelo.profiles.email),
       full_name=COALESCE(EXCLUDED.full_name,rivelo.profiles.full_name),
       username=COALESCE(EXCLUDED.username,rivelo.profiles.username),
       avatar_url=COALESCE(EXCLUDED.avatar_url,rivelo.profiles.avatar_url),
       provider=COALESCE(EXCLUDED.provider,rivelo.profiles.provider),
       last_seen_at=now()`,
    [user.id,user.email??null,pick('full_name','name'),pick('user_name','preferred_username'),pick('avatar_url','picture'),typeof user.app_metadata?.provider==='string'?user.app_metadata.provider:null]
  );
}

/** Profile photos (from X / Google sign-in) for a set of emails. */
export async function avatarsByEmail(emails:string[]){
  const list=[...new Set(emails.map(e=>e.toLowerCase()))];if(!list.length||!dbEnabled())return new Map<string,string>();
  const r=await db().query(`SELECT lower(email) e,avatar_url FROM rivelo.profiles WHERE lower(email)=ANY($1) AND avatar_url IS NOT NULL`,[list]);
  return new Map<string,string>(r.rows.map(x=>[x.e,String(x.avatar_url).replace('_normal.','_400x400.')]));
}
