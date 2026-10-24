import {NextResponse} from 'next/server';
import {cronAuthorized} from '@/lib/catalog/http';
import {db,dbEnabled} from '@/lib/db';
import {agentConfigured,credit} from '@/lib/agent/claude';
import {getSettings,runTask} from '@/lib/agent/tasks';
import {emailReport,storeReport,weeklyReport} from '@/lib/agent/weekly';
export const runtime='nodejs';export const maxDuration=300;export const dynamic='force-dynamic';
// Weekly (e.g. Monday 06:00 UTC): GET /api/cron/weekly with "Authorization: Bearer $CRON_SECRET".
// For every Growth subscriber: Search Console report (stored + emailed) and an AI-visibility run (uses their AI credit).
export async function GET(request:Request){
  if(!cronAuthorized(request))return NextResponse.json({error:'Unauthorized.'},{status:401});
  if(!dbEnabled())return NextResponse.json({error:'Database unavailable.'},{status:503});
  const r=await db().query(`SELECT DISTINCT user_id FROM rivelo.subscriptions WHERE plan_id='growth' AND status IN ('active','authenticated')`).catch(()=>({rows:[]}));
  const out:Record<string,unknown>[]=[];
  for(const {user_id:id} of r.rows as {user_id:string}[]){
    const row:Record<string,unknown>={user:id.slice(0,8)};
    try{const w=await weeklyReport(id);if(w){await storeReport(id,w);const s=await getSettings(id).catch(()=>null);row.report=true;row.emailed=s?.weeklyEmail!==false?await emailReport(id,w):false;}}catch(e){row.reportError=(e as Error).message;}
    try{const s=await getSettings(id);if(agentConfigured()&&s.questions.length>=3&&(await credit(id)).left>=0.05){await runTask(id,'visibility');row.visibility=true;}}catch(e){row.visibilityError=(e as Error).message;}
    try{const s=await getSettings(id);if(s.siteUrl&&(await credit(id)).left>=0.05){await runTask(id,'audit');row.audit=true;}}catch(e){row.auditError=(e as Error).message;}
    out.push(row);
  }
  return NextResponse.json({users:out.length,out},{headers:{'Cache-Control':'no-store'}});
}
