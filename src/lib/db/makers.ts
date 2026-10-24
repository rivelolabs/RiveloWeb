import {db} from './index';
import {bust,cached} from '@/lib/cache';
import type {ReplyMaker} from '@/lib/x/replies';
export type Maker={id:string;username:string;name:string;bio:string|null;avatar:string|null;logo:string|null;followers:number|null;website:string|null;sourcePostUrl:string|null;sourceAuthor:string|null;replyText:string|null;productName:string|null;productUrl:string|null;productDescription:string|null;city:string|null;lat:number|null;lng:number|null;status:'draft'|'published'|'claimed'|'hidden';claimedBy:string|null;invitedAt:string|null;createdAt:string};
const COLS=`id,username,name,bio,avatar_url,logo_url,followers,website,source_post_url,source_author,reply_text,product_name,product_url,product_description,city,lat,lng,status,claimed_by,invited_at,created_at`;
const map=(r:Record<string,unknown>):Maker=>({id:r.id as string,username:r.username as string,name:r.name as string,bio:r.bio as string|null,avatar:r.avatar_url as string|null,logo:(r.logo_url as string|null)??null,followers:r.followers as number|null,website:r.website as string|null,sourcePostUrl:r.source_post_url as string|null,sourceAuthor:r.source_author as string|null,replyText:r.reply_text as string|null,productName:r.product_name as string|null,productUrl:r.product_url as string|null,productDescription:r.product_description as string|null,city:r.city as string|null,lat:r.lat as number|null,lng:r.lng as number|null,status:r.status as Maker['status'],claimedBy:r.claimed_by as string|null,invitedAt:r.invited_at?new Date(r.invited_at as string).toISOString():null,createdAt:new Date(r.created_at as string).toISOString()});
const host=(u:string)=>{try{return new URL(u).hostname.replace(/^www\./,'');}catch{return u;}};
/** App-store hosts are not product names ("play.google.com"); fall back to the maker's name. */
const STORE_HOSTS=new Set(['play.google.com','apps.apple.com','itunes.apple.com','github.com','x.com','twitter.com','linktr.ee']);
/** X profile photo for a maker: the stored one (larger size), else a public lookup by @username. */
export const xPhoto=(avatar:string|null,username:string)=>avatar?avatar.replace(/_normal(\.\w+)$/,'_200x200$1'):`https://unavatar.io/x/${encodeURIComponent(username)}`;
export const productLabel=(productName:string|null,name:string)=>productName&&!STORE_HOSTS.has(productName.toLowerCase())?productName:name;

/** Drafts from an X thread. Existing pages are refreshed but never overwrite what an owner claimed and edited. */
export async function upsertFromReplies(items:ReplyMaker[],post:{url:string;author:string}){bust('makers');
  let created=0;
  for(const m of items){
    const link=m.links[0]||m.website||null;
    const r=await db().query(`INSERT INTO rivelo.maker_pages (x_user_id,username,name,bio,avatar_url,followers,website,source_post_url,source_author,reply_text,product_name,product_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      ON CONFLICT (x_user_id) DO UPDATE SET username=EXCLUDED.username,avatar_url=EXCLUDED.avatar_url,followers=EXCLUDED.followers,
        name=CASE WHEN rivelo.maker_pages.status='claimed' THEN rivelo.maker_pages.name ELSE EXCLUDED.name END,
        bio=CASE WHEN rivelo.maker_pages.status='claimed' THEN rivelo.maker_pages.bio ELSE EXCLUDED.bio END
      RETURNING (xmax=0) inserted`,[m.xUserId,m.username,m.name.slice(0,120),m.bio.slice(0,400),m.avatar,m.followers,m.website,post.url,post.author,m.replyText,link&&!STORE_HOSTS.has(host(link))?host(link):null,link]);
    if(r.rows[0]?.inserted)created++;
  }
  return {found:items.length,created};
}
export async function addManualMaker(input:{username:string;name:string;productUrl:string|null;replyText:string;sourcePostUrl:string|null}){bust('makers');
  await db().query(`INSERT INTO rivelo.maker_pages (username,name,product_url,product_name,reply_text,source_post_url,source_author) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [input.username,input.name,input.productUrl,input.productUrl&&!STORE_HOSTS.has(host(input.productUrl))?host(input.productUrl):null,input.replyText,input.sourcePostUrl,input.sourcePostUrl?.match(/(?:x|twitter)\.com\/([A-Za-z0-9_]+)/)?.[1]||null]);
}
export async function listMakers(){const r=await db().query(`SELECT ${COLS} FROM rivelo.maker_pages ORDER BY created_at DESC LIMIT 500`);return r.rows.map(map);}
export async function makerByUsername(username:string){const r=await db().query(`SELECT ${COLS} FROM rivelo.maker_pages WHERE lower(username)=lower($1)`,[username]);return r.rows[0]?map(r.rows[0]):null;}
export async function setMakerStatus(id:string,status:'draft'|'published'|'hidden'){bust('makers');await db().query(`UPDATE rivelo.maker_pages SET status=$2 WHERE id=$1 AND (status<>'claimed' OR $2='hidden')`,[id,status]);}
export async function markInvited(id:string){await db().query(`UPDATE rivelo.maker_pages SET invited_at=now() WHERE id=$1`,[id]);}
export async function claimMaker(id:string,userId:string){bust('makers');const r=await db().query(`UPDATE rivelo.maker_pages SET status='claimed',claimed_by=$2,claimed_at=now() WHERE id=$1 AND status IN ('draft','published') RETURNING id`,[id,userId]);return !!r.rowCount;}
export async function updateOwnMaker(id:string,userId:string,f:{name:string;bio:string;productName:string;productUrl:string|null;productDescription:string;city:string|null;lat:number|null;lng:number|null;logo:string|null}){bust('makers');
  const r=await db().query(`UPDATE rivelo.maker_pages SET name=$3,bio=$4,product_name=$5,product_url=$6,product_description=$7,city=$8,lat=$9,lng=$10,logo_url=$11 WHERE id=$1 AND claimed_by=$2 AND status='claimed' RETURNING ${COLS}`,[id,userId,f.name,f.bio,f.productName,f.productUrl,f.productDescription,f.city,f.lat,f.lng,f.logo]);
  return r.rows[0]?map(r.rows[0]):null;
}
/** The product link the maker gave when claiming or joining (also sets a readable product name if none yet). */
export async function setMakerProductUrl(id:string,url:string){bust('makers');
  await db().query(`UPDATE rivelo.maker_pages SET product_url=$2,product_name=COALESCE(NULLIF(product_name,''),$3) WHERE id=$1`,[id,url,STORE_HOSTS.has(host(url))?null:host(url)]);}
/** A signed-in X user adds themselves: creates (or takes over their own unclaimed) page, already claimed. */
export async function joinAsMaker(userId:string,x:{username:string;id:string;avatar:string|null},name:string){bust('makers');
  const r=await db().query(`INSERT INTO rivelo.maker_pages (x_user_id,username,name,avatar_url,status,claimed_by,claimed_at) VALUES (NULLIF($1,''),$2,$3,$4,'claimed',$5,now())
    ON CONFLICT (lower(username)) DO UPDATE SET status='claimed',claimed_by=EXCLUDED.claimed_by,claimed_at=COALESCE(rivelo.maker_pages.claimed_at,now()),avatar_url=COALESCE(EXCLUDED.avatar_url,rivelo.maker_pages.avatar_url)
      WHERE rivelo.maker_pages.claimed_by IS NULL OR rivelo.maker_pages.claimed_by=EXCLUDED.claimed_by
    RETURNING username`,[x.id,x.username,name.slice(0,120)||x.username,x.avatar,userId]);
  return r.rows[0]?.username as string|undefined;
}
export async function removeOwnMaker(id:string,userId:string){bust('makers');await db().query(`UPDATE rivelo.maker_pages SET status='hidden' WHERE id=$1 AND claimed_by=$2`,[id,userId]);}
/** Claimed makers with a location appear on the world map. */
export async function makerPins(){
  const r=await db().query(`SELECT id,username,name,product_name,city,lat,lng,avatar_url,NULLIF(logo_url,'') logo,COALESCE(claimed_at,created_at) joined FROM rivelo.maker_pages WHERE status='claimed' AND lat IS NOT NULL AND lng IS NOT NULL`);
  const extras=await makerExtras(r.rows.map(x=>x.id));
  return r.rows.map(x=>({id:`maker-${x.id}`,productId:`maker:${x.username}`,name:productLabel(x.product_name,x.name)+((extras.get(x.id)?.length)?` +${extras.get(x.id)!.length}`:''),city:x.city||'',lat:x.lat,lng:x.lng,genre:'Makers',href:`/makers/${x.username}`,joinedAt:new Date(x.joined).toISOString(),avatar:xPhoto(x.avatar_url,x.username),badge:x.logo||null}));
}
/** Pin photo per claimed maker: their product logo if they added one, otherwise their X profile photo (larger size). */
export async function makerAvatarMap(){const r=await db().query(`SELECT id,username,NULLIF(logo_url,'') logo,avatar_url FROM rivelo.maker_pages WHERE status='claimed'`);return new Map<string,{photo:string;logo:string|null}>(r.rows.map(x=>[`maker-${x.id}`,{photo:xPhoto(x.avatar_url,x.username),logo:x.logo||null}]));}
/** Keep the stored X photo fresh from the signed-in owner's X account. */
export async function setMakerAvatar(id:string,avatar:string){bust('makers');await db().query(`UPDATE rivelo.maker_pages SET avatar_url=$2 WHERE id=$1`,[id,avatar]);}

export const cachedMakerPins=cached(makerPins,'maker-pins-v2',['makers'],120);

/** Maker pages this signed-in user has claimed (for their account page). */
export async function myMakerPages(userId:string){const r=await db().query(`SELECT ${COLS} FROM rivelo.maker_pages WHERE claimed_by=$1 AND status='claimed' ORDER BY created_at DESC`,[userId]);return r.rows.map(map);}

/** Display info for promoted maker pages (homepage Spotlight, map yachts), keyed by "maker:<username>". */
export async function promotedMakers(ids:string[]){
  const names=[...new Set(ids.map(i=>makerFromProductId(i)?.toLowerCase()).filter((x):x is string=>!!x))];if(!names.length)return new Map<string,{id:string;name:string;tagline:string;url:string;logo:string|null}>();
  const r=await db().query(`SELECT ${COLS} FROM rivelo.maker_pages WHERE lower(username)=ANY($1) AND status='claimed'`,[names]);
  const makers=r.rows.map(map),extras=await makerExtras(makers.map(m=>m.id));
  const out=new Map<string,{id:string;name:string;tagline:string;url:string;logo:string|null}>();
  for(const m of makers){out.set(`maker:${m.username.toLowerCase()}`,{id:`maker:${m.username}`,name:productLabel(m.productName,m.name),tagline:m.productDescription||m.bio||`Built by @${m.username}`,url:m.productUrl||`/makers/${m.username}`,logo:m.logo||null});
    for(const e of extras.get(m.id)||[])out.set(`maker:${m.username.toLowerCase()}/${e.key}`,{id:makerProductId(m.username,e.key),name:e.name,tagline:e.description||`Built by @${m.username}`,url:e.url,logo:e.logo||null});}
  return out;
}

/* ───────── extra products (migration 014) ───────── */
export type MakerProduct={id:string;key:string;name:string;url:string;logo:string|null;description:string;createdAt:string};
/** Product id used across the site (upvotes, plans): "maker:<username>" for the main product, "maker:<username>/<key>" for extras. */
export const makerProductId=(username:string,key?:string)=>key?`maker:${username}/${key}`:`maker:${username}`;
/** Username part of a maker product id ("maker:alex/1a2b3c4d" → "alex"). */
export const makerFromProductId=(id:string)=>id.startsWith('maker:')?id.slice(6).split('/')[0]:null;
const mp=(r:Record<string,unknown>):MakerProduct=>({id:r.id as string,key:String(r.id).replace(/-/g,'').slice(0,8),name:r.name as string,url:r.url as string,logo:(r.logo_url as string|null)||null,description:(r.description as string|null)||'',createdAt:new Date(r.created_at as string).toISOString()});
/** Extra products for these maker page ids. Returns an empty map until migration 014 is run. */
export async function makerExtras(makerIds:string[]){
  const out=new Map<string,MakerProduct[]>();if(!makerIds.length)return out;
  const r=await db().query(`SELECT id,maker_id,name,url,logo_url,description,created_at FROM rivelo.maker_products WHERE maker_id=ANY($1::uuid[]) ORDER BY position,created_at`,[makerIds]).catch(()=>({rows:[]}));
  for(const x of r.rows as Record<string,unknown>[]){const k=x.maker_id as string;out.set(k,[...(out.get(k)||[]),mp(x)]);}
  return out;
}
/** Replace a builder's extra products (owner only, up to 5). Keeps ids of items that are kept, so upvotes stay. */
export async function setMakerExtras(makerId:string,userId:string,items:{id?:string;name:string;url:string;logo:string|null;description:string}[]){
  bust('makers');
  const own=await db().query(`SELECT 1 FROM rivelo.maker_pages WHERE id=$1 AND claimed_by=$2`,[makerId,userId]);if(!own.rowCount)throw Error('Not your page.');
  const client=await db().connect();
  try{await client.query('BEGIN');
    const keep=items.map(i=>i.id).filter((x):x is string=>!!x&&/^[0-9a-f-]{36}$/.test(x));
    await client.query(`DELETE FROM rivelo.maker_products WHERE maker_id=$1 AND NOT (id=ANY($2::uuid[]))`,[makerId,keep]);
    for(const [i,it] of items.slice(0,5).entries()){
      if(it.id&&keep.includes(it.id))await client.query(`UPDATE rivelo.maker_products SET name=$3,url=$4,logo_url=$5,description=$6,position=$7 WHERE id=$1 AND maker_id=$2`,[it.id,makerId,it.name,it.url,it.logo,it.description,i]);
      else await client.query(`INSERT INTO rivelo.maker_products (maker_id,name,url,logo_url,description,position) VALUES ($1,$2,$3,$4,$5,$6)`,[makerId,it.name,it.url,it.logo,it.description,i]);
    }
    await client.query('COMMIT');
  }catch(e){await client.query('ROLLBACK').catch(()=>{});if(/maker_products/.test(String((e as Error).message))&&/does not exist/.test(String((e as Error).message)))throw Error('Run db/migrations/014_maker_products.sql in Supabase to add more products.');throw e;}
  finally{client.release();}
}

/** Funding stage of a builder page (migration 016). Reads/writes are skipped quietly until it is run. */
export async function makerFunding(id:string){const r=await db().query(`SELECT funding FROM rivelo.maker_pages WHERE id=$1`,[id]).catch(()=>({rows:[]}));return (r.rows[0]?.funding as string|null)||'';}
export async function setMakerFunding(id:string,userId:string,funding:string|null){bust('makers');
  await db().query(`UPDATE rivelo.maker_pages SET funding=$3 WHERE id=$1 AND claimed_by=$2`,[id,userId,funding]).catch(e=>{if(funding&&/funding/.test(String(e.message)))throw Error('Run db/migrations/016_maker_funding.sql in Supabase to save the funding stage.');});}
