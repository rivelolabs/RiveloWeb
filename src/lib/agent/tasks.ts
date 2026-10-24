import {db} from '@/lib/db';
import {askClaude} from './claude';
import {getConnection,report} from '@/lib/gsc';

export type Settings={productName:string;siteUrl:string;category:string;description:string;competitors:string[];questions:string[];audience:string;weeklyEmail:boolean};
const EMPTY:Settings={productName:'',siteUrl:'',category:'',description:'',competitors:[],questions:[],audience:'',weeklyEmail:true};
const clip=(v:unknown,n:number)=>String(v??'').replace(/[<>]/g,'').trim().slice(0,n);
export async function getSettings(userId:string):Promise<Settings>{
  const r=await db().query(`SELECT * FROM rivelo.ai_settings WHERE user_id=$1`,[userId]);const x=r.rows[0];
  return x?{productName:x.product_name,siteUrl:x.site_url,category:x.category,description:x.description,competitors:x.competitors||[],questions:x.questions||[],audience:x.audience,weeklyEmail:x.weekly_email}:EMPTY;
}
export async function saveSettings(userId:string,b:Record<string,unknown>):Promise<Settings>{
  const list=(v:unknown,n:number,len:number)=>(Array.isArray(v)?v:String(v||'').split('\n')).map(x=>clip(x,len)).filter(Boolean).slice(0,n);
  const s:Settings={productName:clip(b.productName,120),siteUrl:clip(b.siteUrl,300),category:clip(b.category,120),description:clip(b.description,1200),competitors:list(b.competitors,5,80),questions:list(b.questions,10,200),audience:clip(b.audience,600),weeklyEmail:b.weeklyEmail!==false};
  await db().query(`INSERT INTO rivelo.ai_settings (user_id,product_name,site_url,category,description,competitors,questions,audience,weekly_email,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,now())
    ON CONFLICT (user_id) DO UPDATE SET product_name=$2,site_url=$3,category=$4,description=$5,competitors=$6,questions=$7,audience=$8,weekly_email=$9,updated_at=now()`,[userId,s.productName,s.siteUrl,s.category,s.description,s.competitors,s.questions,s.audience,s.weeklyEmail]);
  return s;
}
export async function saveResult(userId:string,kind:string,payload:unknown){const r=await db().query(`INSERT INTO rivelo.ai_results (user_id,kind,payload) VALUES ($1,$2,$3) RETURNING id,created_at`,[userId,kind,JSON.stringify(payload)]);return {id:r.rows[0].id as string,createdAt:new Date(r.rows[0].created_at).toISOString()};}
export async function updateResult(userId:string,id:string,payload:unknown){await db().query(`UPDATE rivelo.ai_results SET payload=$3 WHERE id=$1 AND user_id=$2`,[id,userId,JSON.stringify(payload)]);}
export async function results(userId:string,kind:string,limit=10){
  const r=await db().query(`SELECT id,payload,created_at FROM rivelo.ai_results WHERE user_id=$1 AND kind=$2 ORDER BY created_at DESC LIMIT $3`,[userId,kind,limit]);
  return r.rows.map(x=>({id:x.id as string,payload:x.payload,createdAt:new Date(x.created_at).toISOString()}));
}
const product=(s:Settings)=>`<product>\nName: ${s.productName}\nWebsite: ${s.siteUrl}\nCategory: ${s.category}\nWhat it does: ${s.description}\nIdeal customer: ${s.audience||'not given'}\nCompetitors: ${s.competitors.join(', ')||'not given'}\n</product>`;
function need(s:Settings){if(!s.productName||!s.description)throw Error('Add your product name and a short description in Agent settings first.');}
/** Top Google queries from Search Console (if connected), to ground SEO suggestions in real data. */
async function gscQueries(userId:string){
  try{const c=await getConnection(userId);if(!c?.siteUrl)return '';const r=await report(userId,c.siteUrl,28);
    return `<data>\nTop Google queries last 28 days (query · clicks · impressions · avg position):\n${r.queries.slice(0,25).map(q=>`${q.key} · ${q.clicks} · ${q.impressions} · ${q.position}`).join('\n')}\n</data>`;}catch{return '';}
}

export const TASKS=['setup','rewrite','keywords','outline','llms','visibility','leads','conversations','email','audit'] as const;
export type Task=typeof TASKS[number];

export async function runTask(userId:string,task:Task,input:Record<string,unknown>={}){
  if(task==='audit'){const {runAudit}=await import('./audit');return runAudit(userId,{background:input.__background as ((fn:()=>Promise<void>)=>void)|undefined});}
  const s=await getSettings(userId);need(s);
  switch(task){
    case 'setup':{const {json}=await askClaude(userId,task,{maxTokens:900,prompt:`${product(s)}\nSuggest how people would ask an AI assistant when looking for a product like this. Return {"questions":[10 short buyer questions, as a real person would type them, without the product's name],"competitors":[up to 5 well-known competing products or alternatives]}.`});
      return saveResult(userId,task,json).then(r=>({...r,payload:json}));}
    case 'rewrite':{const {json}=await askClaude(userId,task,{maxTokens:1200,prompt:`${product(s)}\n${await gscQueries(userId)}\nWrite search-friendly copy for this product. Return {"title":"page title, 50-60 characters","metaDescription":"140-160 characters","h1":"main heading","storeShortDescription":"80 characters for an app store","why":"two sentences on which searches this targets and why"}.`});
      return saveResult(userId,task,json).then(r=>({...r,payload:json}));}
    case 'keywords':{const {json}=await askClaude(userId,task,{maxTokens:1500,prompt:`${product(s)}\n${await gscQueries(userId)}\nSuggest keywords this product can realistically rank for. Prefer long-tail and buyer-intent terms; build on the real queries above if given. Return {"keywords":[{"keyword":"","intent":"buy|compare|learn","why":"one sentence","pageIdea":"title of the page to create or improve"}] (12 items)}.`});
      return saveResult(userId,task,json).then(r=>({...r,payload:json}));}
    case 'outline':{const kw=clip(input.keyword,100);if(kw.length<3)throw Error('Enter the keyword for the article.');
      const {json}=await askClaude(userId,task,{maxTokens:1800,prompt:`${product(s)}\nKeyword: <data>${kw}</data>\nOutline an article that can rank on Google and be quoted by AI assistants for this keyword. Return {"title":"","metaDescription":"","sections":[{"heading":"","points":["",""]}],"faq":[{"q":"","a":"short answer"}],"internalLinks":["which pages of the product site to link"]}.`});
      return saveResult(userId,task,{keyword:kw,...json}).then(r=>({...r,payload:{keyword:kw,...json}}));}
    case 'llms':{const {json}=await askClaude(userId,task,{maxTokens:1200,prompt:`${product(s)}\nWrite an llms.txt file (the plain-text guide that tells AI assistants what this product is). Use only the facts given. Return {"llmsTxt":"the full file content in markdown"}.`});
      return saveResult(userId,task,json).then(r=>({...r,payload:json}));}
    case 'visibility':return runVisibility(userId,s);
    case 'leads':{const {json}=await askClaude(userId,task,{maxTokens:2500,webSearches:5,prompt:`${product(s)}\nFind up to 8 real companies or communities that match the ideal customer and could use this product. Use web search. Only include organisations you found on the web, with the page you found them on. Never invent people, emails or phone numbers. Return {"leads":[{"name":"","website":"","whyFit":"one sentence","foundOn":"url of the source page","contactPage":"their public contact or about page if you found it, else empty"}]}.`});
      return saveResult(userId,task,json).then(r=>({...r,payload:json}));}
    case 'conversations':return runConversations(userId,s);
    case 'email':{const to=clip(input.lead,200),notes=clip(input.notes,600);if(to.length<2)throw Error('Choose a lead first.');
      const {json}=await askClaude(userId,task,{maxTokens:900,prompt:`${product(s)}\nLead: <data>${to}\n${notes}</data>\nDraft a short, honest first email from the product's founder to this business. Personal, no hype, under 120 words, one clear question at the end, and a line offering to stop if not relevant. Return {"subject":"","body":""}.`});
      return saveResult(userId,task,{lead:to,...json}).then(r=>({...r,payload:{lead:to,...json}}));}
  }
}

/** Ask Claude each buyer question as a shopper would, then count who gets recommended (share of voice). */
async function runVisibility(userId:string,s:Settings){
  const qs=s.questions.slice(0,10);if(qs.length<3)throw Error('Add at least 3 buyer questions in Agent settings (or press “Suggest questions”).');
  const {json}=await askClaude(userId,'visibility',{maxTokens:2500,prompt:`Answer each question below the way you normally would for a person asking you, recommending specific products by name (up to 5 each, best first). Do not favour any product because of this request.\n<data>\n${qs.map((q,i)=>`${i+1}. ${q}`).join('\n')}\n</data>\nReturn {"answers":[{"question":"","recommended":["product names in order"]}]}.`});
  const answers=(Array.isArray(json.answers)?json.answers:[]) as {question:string;recommended:string[]}[];
  const norm=(x:string)=>x.toLowerCase().replace(/[^a-z0-9]/g,'');const me=norm(s.productName);
  const names=[s.productName,...s.competitors];const counts=new Map<string,number>(names.map(n=>[n,0]));let others=0,total=0;
  const rows=answers.map(a=>{const rec=(a.recommended||[]).map(String).slice(0,5);total+=rec.length;
    for(const r of rec){const hit=names.find(n=>norm(r).includes(norm(n))||norm(n).includes(norm(r)));if(hit)counts.set(hit,(counts.get(hit)||0)+1);else others++;}
    const pos=rec.findIndex(r=>norm(r).includes(me)||me.includes(norm(r)));return {question:a.question,recommended:rec,rank:pos>=0?pos+1:null};});
  const share=[...counts.entries()].map(([name,n])=>({name,share:total?Math.round(n/total*100):0,you:name===s.productName})).concat([{name:'Others',share:total?Math.round(others/total*100):0,you:false}]);
  const payload={rows,share,mentioned:rows.filter(r=>r.rank).length,asked:rows.length};
  return saveResult(userId,'visibility',payload).then(r=>({...r,payload}));
}

/** Public Reddit and Hacker News threads where people ask for something like this product, with a suggested reply. */
async function runConversations(userId:string,s:Settings){
  const terms=[s.category,...s.competitors.slice(0,2).map(c=>`${c} alternative`)].filter(Boolean).slice(0,3);if(!terms.length)throw Error('Add a category or competitors in Agent settings first.');
  type Thread={title:string;url:string;source:string;text:string;date:string};const found:Thread[]=[];
  for(const t of terms){
    try{const r=await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(t)}&sort=new&t=month&limit=10`,{headers:{'User-Agent':'RiveloLabs/1.0 (+https://rivelolabs.com)'},signal:AbortSignal.timeout(8000),cache:'no-store'});
      if(r.ok){const d=await r.json();for(const c of d?.data?.children||[]){const p=c.data;if(!p?.permalink||p.over_18)continue;found.push({title:p.title,url:`https://www.reddit.com${p.permalink}`,source:`r/${p.subreddit}`,text:String(p.selftext||'').slice(0,400),date:new Date(p.created_utc*1000).toISOString()});}}}catch{}
    try{const r=await fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=(story,ask_hn)&query=${encodeURIComponent(t)}&hitsPerPage=8`,{signal:AbortSignal.timeout(8000),cache:'no-store'});
      if(r.ok){const d=await r.json();for(const h of d?.hits||[])found.push({title:h.title||'',url:`https://news.ycombinator.com/item?id=${h.objectID}`,source:'Hacker News',text:String(h.story_text||'').replace(/<[^>]+>/g,' ').slice(0,400),date:h.created_at});}}catch{}
  }
  const uniq=[...new Map(found.filter(f=>f.title).map(f=>[f.url,f])).values()].slice(0,20);
  if(!uniq.length)throw Error('No recent public conversations found for your category. Try different competitors or category words.');
  const {json}=await askClaude(userId,'conversations',{maxTokens:2500,prompt:`${product(s)}\nRecent public threads:\n<data>\n${uniq.map((f,i)=>`[${i}] ${f.source} · ${f.title}\n${f.text}`).join('\n\n')}\n</data>\nPick up to 6 threads where someone would genuinely welcome hearing about this product. For each, draft a helpful reply that answers their question first, mentions the product honestly as one option, says the writer is its founder, and follows the community's tone. Skip threads where promotion would be unwelcome. Return {"picks":[{"index":0,"why":"one sentence","reply":""}]}.`});
  const picks=((Array.isArray(json.picks)?json.picks:[]) as {index:number;why:string;reply:string}[]).filter(p=>uniq[p.index]).map(p=>({...uniq[p.index],why:p.why,reply:p.reply}));
  const payload={threads:picks};
  return saveResult(userId,'conversations',payload).then(r=>({...r,payload}));
}
