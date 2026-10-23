import {db} from './index';
import {bust,cached} from '@/lib/cache';

export type DbPost={id:string;author:string;email:string;topic:string;title:string;body:string;status:'pending'|'published'|'rejected';createdAt:string;replies:{id:string;author:string;email:string;body:string;status:'pending'|'published'|'rejected';createdAt:string}[]};

async function load(where:string,replyWhere:string,limit:number):Promise<DbPost[]>{
  const posts=await db().query(`SELECT id,author_name,COALESCE(email,'') email,topic,title,body,status,created_at FROM rivelo.community_posts ${where} ORDER BY created_at DESC LIMIT $1`,[limit]);
  if(!posts.rows.length)return [];
  const replies=await db().query(`SELECT id,post_id,author_name,COALESCE(email,'') email,body,status,created_at FROM rivelo.community_replies WHERE post_id=ANY($1::uuid[]) ${replyWhere} ORDER BY created_at`,[posts.rows.map(r=>r.id)]);
  return posts.rows.map(p=>({id:p.id,author:p.author_name,email:p.email,topic:p.topic,title:p.title,body:p.body,status:p.status,createdAt:new Date(p.created_at).toISOString(),
    replies:replies.rows.filter(r=>r.post_id===p.id).map(r=>({id:r.id,author:r.author_name,email:r.email,body:r.body,status:r.status,createdAt:new Date(r.created_at).toISOString()}))}));
}
/** Public feed: published posts with published replies; no emails. */
export async function publishedPosts(){
  return (await load(`WHERE status='published'`,`AND status='published'`,500)).map(({email:_e,status:_s,replies,...p})=>({...p,replies:replies.map(({email:_re,status:_rs,...r})=>r)}));
}
export async function allPostsForModeration(){return load('','',1000);}
export async function createPost(input:{authorId?:string;author:string;email:string;topic:string;title:string;body:string}){bust('community');
  const recent=await db().query(`SELECT count(*)::int n FROM rivelo.community_posts WHERE lower(email)=lower($1) AND created_at>now()-interval '1 hour'`,[input.email]);
  if(recent.rows[0].n>=5)throw Error('You’ve started a few conversations already. Try again in a little while.');
  await db().query(`INSERT INTO rivelo.community_posts (author_id,author_name,email,topic,title,body,status) VALUES ($1,$2,$3,$4,$5,$6,'published')`,[input.authorId??null,input.author,input.email,input.topic,input.title,input.body]);
}
export async function createReply(input:{postId:string;authorId?:string;author:string;email:string;body:string}){bust('community');
  if(!/^[0-9a-f-]{36}$/i.test(input.postId))throw Error('This discussion is unavailable.');
  const post=await db().query(`SELECT (SELECT count(*)::int FROM rivelo.community_replies r WHERE r.post_id=p.id) n FROM rivelo.community_posts p WHERE p.id=$1 AND p.status='published'`,[input.postId]);
  if(!post.rows[0]||post.rows[0].n>=100)throw Error('This discussion is unavailable.');
  await db().query(`INSERT INTO rivelo.community_replies (post_id,author_id,author_name,email,body,status) VALUES ($1,$2,$3,$4,$5,'published')`,[input.postId,input.authorId??null,input.author,input.email,input.body]);
}
export async function reviewPost(id:string,status:string,replyId?:string){bust('community');
  if(!['published','rejected'].includes(status))throw Error('Choose a post and status.');
  const result=replyId
    ?await db().query(`UPDATE rivelo.community_replies SET status=$1 WHERE id=$2 AND post_id=$3`,[status,replyId,id])
    :await db().query(`UPDATE rivelo.community_posts SET status=$1 WHERE id=$2`,[status,id]);
  if(!result.rowCount)throw Error(replyId?'Reply not found.':'Choose a post and status.');
}

/** Cached public feed for the community page. */
export const cachedPublishedPosts=cached(()=>publishedPosts(),'community-posts',['community'],60);
