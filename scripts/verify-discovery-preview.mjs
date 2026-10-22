// Run with: node --env-file=.env.local scripts/verify-discovery-preview.mjs
// Read-only smoke check. Does not create listings, contacts, posts, or mail.
const origin=process.env.DISCOVERY_WORKER_ORIGIN||'http://127.0.0.1:3000';
if(!process.env.CATALOG_ADMIN_KEY)throw Error('Set CATALOG_ADMIN_KEY first.');
const response=await fetch(new URL('/api/catalog/admin',origin),{headers:{Authorization:`Bearer ${process.env.CATALOG_ADMIN_KEY}`}});
if(!response.ok)throw Error(`Admin API returned ${response.status}.`);
const state=await response.json();
const privateMarkers=[process.env.CATALOG_ADMIN_KEY,process.env.DATABASE_URL,...(process.env.DATABASE_URL?[decodeURIComponent(new URL(process.env.DATABASE_URL).password)]:[]),...state.listings.filter(x=>x.status!=='published').map(x=>x.id),...state.sources.map(x=>x.id),...state.claims.map(x=>x.email),...state.pins.map(x=>x.email),...state.posts.flatMap(x=>[x.email,...x.replies.map(r=>r.email)]),...state.leads.map(x=>x.email),...state.invites.flatMap(x=>[x.to,x.text])].filter(Boolean);
for(const route of ['/','/register','/map','/community','/claim','/premium']){const page=await fetch(new URL(route,origin));if(page.status!==200)throw Error(`${route} returned ${page.status}.`);const html=await page.text();if(privateMarkers.some(value=>html.includes(value)))throw Error(`${route} exposes private catalog data.`);console.log(`PASS ${route}: 200, no private catalog data in the response`);}
const unauthorized=await fetch(new URL('/api/catalog/admin',origin));if(unauthorized.status!==401)throw Error('Admin access must require authentication.');
console.log('PASS unauthenticated admin access rejected');
