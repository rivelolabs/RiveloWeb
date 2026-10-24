import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {jsonBody,sameOrigin} from '@/lib/catalog/http';
import {rateLimit} from '@/lib/catalog/limit';
import {dbEnabled,upsertProfile} from '@/lib/db';
import {agentConfigured,canUseAgent,credit} from '@/lib/agent/claude';
import {getSettings,results,runTask,saveSettings,TASKS,type Task} from '@/lib/agent/tasks';
import {weeklyReport} from '@/lib/agent/weekly';
export const runtime='nodejs';export const dynamic='force-dynamic';export const maxDuration=120;
const KINDS=['setup','rewrite','keywords','outline','llms','visibility','leads','conversations','email','weekly'];
// GET: plan access, credit, settings, latest results. POST {settings} saves settings; POST {task,input} runs one agent task.
export async function GET(request:NextRequest){
  const user=dbEnabled()?await currentUser(request):null;if(!user)return NextResponse.json({signedIn:false});
  const allowed=await canUseAgent(user.id);if(!allowed)return NextResponse.json({signedIn:true,growth:false});
  try{
    const [c,s,...lists]=await Promise.all([credit(user.id),getSettings(user.id),...KINDS.map(k=>results(user.id,k,k==='visibility'||k==='weekly'?8:5))]);
    return NextResponse.json({signedIn:true,growth:true,configured:agentConfigured(),credit:c,settings:s,results:Object.fromEntries(KINDS.map((k,i)=>[k,lists[i]]))},{headers:{'Cache-Control':'no-store'}});
  }catch{return NextResponse.json({signedIn:true,growth:true,setup:'Run db/migrations/017_growth_agent.sql in Supabase.'});}
}
export async function POST(request:NextRequest){
  try{
    if(!sameOrigin(request)||!dbEnabled())return NextResponse.json({error:'Unavailable.'},{status:403});
    const user=await currentUser(request);if(!user)return NextResponse.json({error:'Sign in again.'},{status:401});
    if(!await canUseAgent(user.id))return NextResponse.json({error:'The Claude agent is part of the Growth plan.'},{status:403});
    await upsertProfile(user);
    const b=await jsonBody(request,8000);
    if(b.settings&&typeof b.settings==='object')return NextResponse.json({settings:await saveSettings(user.id,b.settings as Record<string,unknown>)});
    if(b.task==='weekly'){const w=await weeklyReport(user.id);if(!w)throw Error('Connect Google Search Console and choose your website first.');return NextResponse.json({payload:w});}
    if(!TASKS.includes(b.task))throw Error('Unknown task.');
    rateLimit(request,'agent',30);
    const out=await runTask(user.id,b.task as Task,(b.input&&typeof b.input==='object'?b.input:{}) as Record<string,unknown>);
    return NextResponse.json({result:out,credit:await credit(user.id)});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'The agent could not finish.'},{status:400});}
}
