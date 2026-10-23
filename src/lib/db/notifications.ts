import type {User} from '@supabase/supabase-js';
import {db} from './index';
import {readCatalog} from '@/lib/catalog/store';
import {displayName} from '@/lib/auth/profile';
import {makerFromProductId} from './makers';

/** Who owns a product: the X account that claimed the builder page, or the account whose email listed/claimed the listing. */
export async function productOwner(productId:string):Promise<{userId:string;name:string;href:string}|null>{
  const username=makerFromProductId(productId);
  if(username){
    const r=await db().query(`SELECT claimed_by,name,product_name FROM rivelo.maker_pages WHERE lower(username)=lower($1) AND status='claimed'`,[username]);
    const m=r.rows[0];if(!m?.claimed_by)return null;
    const key=productId.split('/')[1];let name=m.product_name||m.name;
    if(key){const e=await db().query(`SELECT name FROM rivelo.maker_products WHERE replace(id::text,'-','') LIKE $1||'%'`,[key]).catch(()=>({rows:[]}));name=e.rows[0]?.name||name;}
    return {userId:m.claimed_by,name,href:`/makers/${username}`};
  }
  const state=await readCatalog();const l=state.listings.find(x=>x.id===productId);if(!l)return null;
  const emails=[l.ownerEmail,...state.pins.filter(p=>p.productId===productId).map(p=>p.email),...state.claims.filter(c=>c.productId===productId&&c.status==='approved').map(c=>c.email)].filter(Boolean).map(e=>e!.toLowerCase());
  if(!emails.length)return null;
  const r=await db().query(`SELECT id FROM rivelo.profiles WHERE lower(email)=ANY($1) LIMIT 1`,[emails]);
  return r.rows[0]?{userId:r.rows[0].id,name:l.name,href:`/products/${l.id}`}:null;
}
const actorOf=(u:User)=>({id:u.id,name:displayName(u),avatar:typeof u.user_metadata?.avatar_url==='string'?u.user_metadata.avatar_url:typeof u.user_metadata?.picture==='string'?u.user_metadata.picture:null});

/** Never throws: a missing table (migration 015 not run) or any error just skips the notification. */
async function insert(n:{userId:string;kind:'upvote'|'comment'|'reply';actor:User;subject:string;title:string;body?:string|null;href:string}){
  const a=actorOf(n.actor);if(a.id===n.userId)return;   // no notifications for your own actions
  await db().query(`INSERT INTO rivelo.notifications (user_id,kind,actor_id,actor_name,actor_avatar,subject_id,title,body,href) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING`,
    [n.userId,n.kind,a.id,a.name.slice(0,120),a.avatar,n.subject,n.title.slice(0,200),n.body?n.body.slice(0,240):null,n.href]).catch(()=>{});
}
export async function notifyUpvote(actor:User,productId:string){try{const o=await productOwner(productId);if(o)await insert({userId:o.userId,kind:'upvote',actor,subject:productId,title:o.name,href:o.href});}catch{}}
export async function notifyComment(actor:User,productId:string,text:string){try{const o=await productOwner(productId);if(o)await insert({userId:o.userId,kind:'comment',actor,subject:productId,title:o.name,body:text,href:o.href});}catch{}}
export async function notifyReply(actor:User,postId:string,text:string){
  try{const r=await db().query(`SELECT author_id,title FROM rivelo.community_posts WHERE id=$1`,[postId]);const p=r.rows[0];
    if(p?.author_id)await insert({userId:p.author_id,kind:'reply',actor,subject:postId,title:p.title,body:text,href:`/community`});}catch{}
}

export type Notice={id:string;kind:'upvote'|'comment'|'reply';actorName:string;actorAvatar:string|null;title:string;body:string|null;href:string;read:boolean;createdAt:string};
export async function myNotifications(userId:string,limit=30):Promise<{items:Notice[];unread:number}>{
  const [list,count]=await Promise.all([
    db().query(`SELECT id,kind,actor_name,actor_avatar,title,body,href,read_at,created_at FROM rivelo.notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2`,[userId,limit]),
    db().query(`SELECT count(*)::int n FROM rivelo.notifications WHERE user_id=$1 AND read_at IS NULL`,[userId])]);
  return {unread:count.rows[0]?.n||0,items:list.rows.map(x=>({id:x.id,kind:x.kind,actorName:x.actor_name,actorAvatar:x.actor_avatar,title:x.title,body:x.body,href:x.href,read:!!x.read_at,createdAt:new Date(x.created_at).toISOString()}))};
}
export async function markRead(userId:string){await db().query(`UPDATE rivelo.notifications SET read_at=now() WHERE user_id=$1 AND read_at IS NULL`,[userId]);}
