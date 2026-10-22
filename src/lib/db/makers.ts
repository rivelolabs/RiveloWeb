import {db} from './index';
import type {ReplyMaker} from '@/lib/x/replies';
export type Maker={id:string;username:string;name:string;bio:string|null;avatar:string|null;followers:number|null;website:string|null;sourcePostUrl:string|null;sourceAuthor:string|null;replyText:string|null;productName:string|null;productUrl:string|null;productDescription:string|null;city:string|null;lat:number|null;lng:number|null;status:'draft'|'published'|'claimed'|'hidden';claimedBy:string|null;invitedAt:string|null;createdAt:string};
const COLS=`id,username,name,bio,avatar_url,followers,website,source_post_url,source_author,reply_text,product_name,product_url,product_description,city,lat,lng,status,claimed_by,invited_at,created_at`;
const map=(r:Record<string,unknown>):Maker=>({id:r.id as string,username:r.username as string,name:r.name as string,bio:r.bio as string|null,avatar:r.avatar_url as string|null,followers:r.followers as number|null,website:r.website as string|null,sourcePostUrl:r.source_post_url as string|null,sourceAuthor:r.source_author as string|null,replyText:r.reply_text as string|null,productName:r.product_name as string|null,productUrl:r.product_url as string|null,productDescription:r.product_description as string|null,city:r.city as string|null,lat:r.lat as number|null,lng:r.lng as number|null,status:r.status as Maker['status'],claimedBy:r.claimed_by as string|null,invitedAt:r.invited_at?new Date(r.invited_at as string).toISOString():null,createdAt:new Date(r.created_at as string).toISOString()});
const host=(u:string)=>{try{return new URL(u).hostname.replace(/^www\./,'');}catch{return u;}};

/** Drafts from an X thread. Existing pages are refreshed but never overwrite what an owner claimed and edited. */
export async function upsertFromReplies(items:ReplyMaker[],post:{url:string;author:string}){
  let created=0;
  for(const m of items){
    const link=m.links[0]||m.website||null;
    const r=await db().query(`INSERT INTO rivelo.maker_pages (x_user_id,username,name,bio,avatar_url,followers,website,source_post_url,source_author,reply_text,product_name,product_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      ON CONFLICT (x_user_id) DO UPDATE SET username=EXCLUDED.username,avatar_url=EXCLUDED.avatar_url,followers=EXCLUDED.followers,
        name=CASE WHEN rivelo.maker_pages.status='claimed' THEN rivelo.maker_pages.name ELSE EXCLUDED.name END,
        bio=CASE WHEN rivelo.maker_pages.status='claimed' THEN rivelo.maker_pages.bio ELSE EXCLUDED.bio END
      RETURNING (xmax=0) inserted`,[m.xUserId,m.username,m.name.slice(0,120),m.bio.slice(0,400),m.avatar,m.followers,m.website,post.url,post.author,m.replyText,link?host(link):null,link]);
    if(r.rows[0]?.inserted)created++;
  }
  return {found:items.length,created};
}
export async function addManualMaker(input:{username:string;name:string;productUrl:string|null;replyText:string;sourcePostUrl:string|null}){
  await db().query(`INSERT INTO rivelo.maker_pages (username,name,product_url,product_name,reply_text,source_post_url,source_author) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [input.username,input.name,input.productUrl,input.productUrl?host(input.productUrl):null,input.replyText,input.sourcePostUrl,input.sourcePostUrl?.match(/(?:x|twitter)\.com\/([A-Za-z0-9_]+)/)?.[1]||null]);
}
export async function listMakers(){const r=await db().query(`SELECT ${COLS} FROM rivelo.maker_pages ORDER BY created_at DESC LIMIT 500`);return r.rows.map(map);}
export async function makerByUsername(username:string){const r=await db().query(`SELECT ${COLS} FROM rivelo.maker_pages WHERE lower(username)=lower($1)`,[username]);return r.rows[0]?map(r.rows[0]):null;}
export async function setMakerStatus(id:string,status:'draft'|'published'|'hidden'){await db().query(`UPDATE rivelo.maker_pages SET status=$2 WHERE id=$1 AND (status<>'claimed' OR $2='hidden')`,[id,status]);}
export async function markInvited(id:string){await db().query(`UPDATE rivelo.maker_pages SET invited_at=now() WHERE id=$1`,[id]);}
export async function claimMaker(id:string,userId:string){const r=await db().query(`UPDATE rivelo.maker_pages SET status='claimed',claimed_by=$2,claimed_at=now() WHERE id=$1 AND status IN ('draft','published') RETURNING id`,[id,userId]);return !!r.rowCount;}
export async function updateOwnMaker(id:string,userId:string,f:{name:string;bio:string;productName:string;productUrl:string|null;productDescription:string;city:string|null;lat:number|null;lng:number|null}){
  const r=await db().query(`UPDATE rivelo.maker_pages SET name=$3,bio=$4,product_name=$5,product_url=$6,product_description=$7,city=$8,lat=$9,lng=$10 WHERE id=$1 AND claimed_by=$2 AND status='claimed' RETURNING ${COLS}`,[id,userId,f.name,f.bio,f.productName,f.productUrl,f.productDescription,f.city,f.lat,f.lng]);
  return r.rows[0]?map(r.rows[0]):null;
}
export async function removeOwnMaker(id:string,userId:string){await db().query(`UPDATE rivelo.maker_pages SET status='hidden' WHERE id=$1 AND claimed_by=$2`,[id,userId]);}
/** Claimed makers with a location appear on the world map. */
export async function makerPins(){
  const r=await db().query(`SELECT id,username,name,product_name,city,lat,lng FROM rivelo.maker_pages WHERE status='claimed' AND lat IS NOT NULL AND lng IS NOT NULL`);
  return r.rows.map(x=>({id:`maker-${x.id}`,productId:`maker:${x.username}`,name:x.product_name||x.name,city:x.city||'',lat:x.lat,lng:x.lng,genre:'Makers',href:`/makers/${x.username}`}));
}
export async function makerAvatarMap(){const r=await db().query(`SELECT id,avatar_url FROM rivelo.maker_pages WHERE status='claimed' AND avatar_url IS NOT NULL`);return new Map<string,string>(r.rows.map(x=>[`maker-${x.id}`,x.avatar_url]));}
