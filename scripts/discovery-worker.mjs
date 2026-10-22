// Run with: node --env-file=.env.local scripts/discovery-worker.mjs
// Runs while this process and your Next.js server are running.
const origin=process.env.DISCOVERY_WORKER_ORIGIN||'http://127.0.0.1:3000';
if(!process.env.CRON_SECRET)throw Error('Set CRON_SECRET in .env.local first.');
async function tick(){try{const response=await fetch(new URL('/api/cron/discover',origin),{headers:{Authorization:`Bearer ${process.env.CRON_SECRET}`},signal:AbortSignal.timeout(90000)});const result=await response.json();console.log(new Date().toISOString(),response.status,result.skipped||result.status||result.error||'Discovery checked');}catch(error){console.error('Discovery check failed:',error.message);}}
await tick();setInterval(tick,60*60*1000);
