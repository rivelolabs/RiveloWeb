import {db} from './index';
export type ProductComment={id:string;author:string;avatar:string|null;body:string;createdAt:string;mine?:boolean};
export async function listComments(productId:string,userId?:string):Promise<ProductComment[]>{
  const r=await db().query(`SELECT id,author_id,author_name,avatar_url,body,created_at FROM rivelo.product_comments WHERE product_id=$1 AND status='published' ORDER BY created_at DESC LIMIT 100`,[productId]);
  return r.rows.map(c=>({id:c.id,author:c.author_name,avatar:c.avatar_url,body:c.body,createdAt:new Date(c.created_at).toISOString(),mine:!!userId&&c.author_id===userId}));
}
export async function commentCounts():Promise<Record<string,number>>{
  const r=await db().query(`SELECT product_id,count(*)::int n FROM rivelo.product_comments WHERE status='published' GROUP BY product_id`);
  return Object.fromEntries(r.rows.map(x=>[x.product_id,x.n]));
}
export async function addComment(input:{productId:string;userId:string;author:string;avatar:string|null;body:string}){
  // One round trip: the hourly limit check, the insert, and the name from the profile (so a recent rename shows straight away).
  const r=await db().query(`WITH recent AS (SELECT count(*)::int n FROM rivelo.product_comments WHERE author_id=$2 AND created_at>now()-interval '1 hour')
    INSERT INTO rivelo.product_comments (product_id,author_id,author_name,avatar_url,body)
    SELECT $1,$2,COALESCE((SELECT NULLIF(full_name,'') FROM rivelo.profiles WHERE id=$2),$3),$4,$5 FROM recent WHERE recent.n<20
    RETURNING id,created_at,author_name`,[input.productId,input.userId,input.author,input.avatar,input.body]);
  if(!r.rows[0])throw Error('You’re commenting a lot. Take a short break and try again.');
  return {id:r.rows[0].id as string,author:r.rows[0].author_name as string,avatar:input.avatar,body:input.body,createdAt:new Date(r.rows[0].created_at).toISOString(),mine:true} satisfies ProductComment;
}

export async function deleteOwnComment(id:string,userId:string){
  const r=await db().query(`UPDATE rivelo.product_comments SET status='hidden' WHERE id=$1 AND author_id=$2`,[id,userId]);return !!r.rowCount;
}
