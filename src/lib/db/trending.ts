import {db} from './index';
export type VoteCounts=Record<string,{total:number;week:number}>;
export async function voteCounts():Promise<VoteCounts>{
  const r=await db().query(`SELECT product_id,count(*)::int total,count(*) FILTER (WHERE created_at>now()-interval '7 days')::int week FROM rivelo.upvotes GROUP BY product_id`);
  return Object.fromEntries(r.rows.map(x=>[x.product_id,{total:x.total,week:x.week}]));
}
export async function myVotes(userId:string){const r=await db().query(`SELECT product_id FROM rivelo.upvotes WHERE user_id=$1`,[userId]);return r.rows.map(x=>x.product_id as string);}
export async function toggleVote(userId:string,productId:string){
  const del=await db().query(`DELETE FROM rivelo.upvotes WHERE user_id=$1 AND product_id=$2`,[userId,productId]);
  if(del.rowCount)return false;
  await db().query(`INSERT INTO rivelo.upvotes (user_id,product_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,[userId,productId]);return true;
}
export type Launch={id:string;source:'producthunt'|'indiehackers'|'rivelo';name:string;tagline:string;url:string;website:string|null;image:string|null;votes:number;comments:number;launchedAt:string;topics:string[]};
export async function recentLaunches(limit=30,days=14):Promise<Launch[]>{
  const r=await db().query(`SELECT id,source,name,COALESCE(tagline,'') tagline,url,website,image_url,votes,comments,launched_at,topics FROM rivelo.launches WHERE NOT hidden AND launched_at>now()-make_interval(days=>$2) ORDER BY date_trunc('day',launched_at) DESC,votes DESC LIMIT $1`,[limit,days]);
  return r.rows.map(x=>({id:x.id,source:x.source,name:x.name,tagline:x.tagline,url:x.url,website:x.website,image:x.image_url,votes:x.votes,comments:x.comments,launchedAt:new Date(x.launched_at).toISOString(),topics:x.topics}));
}
export type LaunchInput=Omit<Launch,'id'>&{externalId:string};
export async function upsertLaunches(items:LaunchInput[]){
  let n=0;
  for(const l of items){
    await db().query(`INSERT INTO rivelo.launches (source,external_id,name,tagline,url,website,image_url,topics,votes,comments,launched_at,fetched_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,now())
      ON CONFLICT (source,external_id) DO UPDATE SET name=EXCLUDED.name,tagline=EXCLUDED.tagline,url=EXCLUDED.url,website=EXCLUDED.website,image_url=EXCLUDED.image_url,topics=EXCLUDED.topics,votes=EXCLUDED.votes,comments=EXCLUDED.comments,fetched_at=now()`,
      [l.source,l.externalId,l.name.slice(0,200),l.tagline.slice(0,300),l.url,l.website,l.image,l.topics.slice(0,6),l.votes,l.comments,l.launchedAt]);n++;
  }
  return n;
}
