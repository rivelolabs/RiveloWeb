// Read replies to an X post with the X API v2 (needs X_BEARER_TOKEN on a plan that includes
// recent search — X's Basic tier or higher). Recent search only covers the last 7 days.
export type ReplyMaker={xUserId:string;username:string;name:string;bio:string;avatar:string|null;followers:number;website:string|null;replyText:string;links:string[]};
type XUser={id:string;name:string;username:string;description?:string;profile_image_url?:string;public_metrics?:{followers_count?:number};entities?:{url?:{urls?:{expanded_url?:string}[]}}};
type XTweet={id:string;author_id:string;text:string;entities?:{urls?:{expanded_url?:string;unwound_url?:string}[]}};
export function xConfigured(){return !!process.env.X_BEARER_TOKEN;}
export function parsePostUrl(input:string){
  const m=input.trim().match(/^https?:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/([A-Za-z0-9_]{1,15})\/status\/(\d{5,25})/);
  if(!m)throw Error('Paste a post link like https://x.com/username/status/123…');
  return {author:m[1],id:m[2],url:`https://x.com/${m[1]}/status/${m[2]}`};
}
const SKIP=/^(https?:\/\/)?(x|twitter)\.com|t\.co\//i;
export async function fetchReplies(postId:string,author:string,limit=300):Promise<ReplyMaker[]>{
  if(!xConfigured())throw Error('Set X_BEARER_TOKEN to import replies from X.');
  const out=new Map<string,ReplyMaker>();let next:string|undefined;
  for(let page=0;page<Math.ceil(limit/100);page++){
    const q=new URLSearchParams({query:`conversation_id:${postId} -is:retweet -from:${author}`,max_results:'100','tweet.fields':'author_id,entities,created_at',expansions:'author_id','user.fields':'name,username,description,profile_image_url,public_metrics,url,entities'});
    if(next)q.set('next_token',next);
    const r=await fetch(`https://api.x.com/2/tweets/search/recent?${q}`,{headers:{Authorization:`Bearer ${process.env.X_BEARER_TOKEN}`},cache:'no-store',signal:AbortSignal.timeout(15000)});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw Error(r.status===403||r.status===401?'X refused the request. Recent search needs the X API Basic plan or higher.':r.status===429?'X rate limit reached. Try again in 15 minutes.':(d?.detail||'X import failed.'));
    const users=new Map<string,XUser>((d.includes?.users||[]).map((u:XUser)=>[u.id,u]));
    for(const t of (d.data||[]) as XTweet[]){
      const u=users.get(t.author_id);if(!u||out.has(u.id))continue;
      const links=(t.entities?.urls||[]).map(x=>x.unwound_url||x.expanded_url||'').filter(x=>x&&!SKIP.test(x));
      out.set(u.id,{xUserId:u.id,username:u.username,name:u.name,bio:u.description||'',avatar:u.profile_image_url?u.profile_image_url.replace('_normal.','_400x400.'):null,followers:u.public_metrics?.followers_count||0,website:u.entities?.url?.urls?.[0]?.expanded_url||null,replyText:t.text.replace(/https:\/\/t\.co\/\w+/g,'').trim().slice(0,600),links:[...new Set(links)].slice(0,5)});
    }
    next=d.meta?.next_token;if(!next)break;
  }
  return [...out.values()];
}
