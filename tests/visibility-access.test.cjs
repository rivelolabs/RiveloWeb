const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const fsp=require('node:fs/promises');
const path=require('node:path');
const os=require('node:os');
const vm=require('node:vm');
const ts=require('typescript');
const {NextRequest}=require('next/server');
const COOKIE='rivelo-visibility-visitor';
const visitor='00000000-0000-4000-8000-000000000001';
const secondVisitor='00000000-0000-4000-8000-000000000002';
const report={url:'https://example.com',finalUrl:'https://example.com/',score:75,grade:'Good',title:'Example',description:'A fixture site',ms:10,checks:[],checkedAt:new Date().toISOString()};

function loader(env,mocks){
  const cache=new Map();
  function load(file){
    file=path.resolve(file);if(cache.has(file))return cache.get(file);
    const exports={};cache.set(file,exports);
    function local(name){
      if(name in mocks)return mocks[name];
      if(name.startsWith('@/')||name.startsWith('.')){
        let target=name.startsWith('@/')?path.resolve('src',name.slice(2)):path.resolve(path.dirname(file),name);
        if(!path.extname(target))target+='.ts';return load(target);
      }
      return require(name);
    }
    const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
    vm.runInNewContext(source,{exports,require:local,process:{env,cwd:()=>process.cwd()},Buffer,URL,Request,Response,AbortSignal,Error,fetch,setTimeout,clearTimeout,Date,console},{filename:file});
    return exports;
  }
  return load;
}

function request(method='POST',id=visitor,body={url:'example.com'}){
  return new NextRequest('http://localhost:3000/api/tools/visibility',{method,headers:{origin:'http://localhost:3000',cookie:`${COOKIE}=${id}`,'content-type':'application/json'},...(method==='POST'?{body:JSON.stringify(body)}:{})});
}

async function fixture(run,options={}){
  const directory=await fsp.mkdtemp(path.join(os.tmpdir(),'rivelo-visibility-'));
  let user=null,subscriptions=[],calls=0;
  const env={NODE_ENV:'development',CATALOG_DATA_DIR:directory};
  const mocks={
    '@/lib/auth/server':{currentUser:async()=>user},
    '@/lib/db':{dbEnabled:()=>true},
    '@/lib/db/billing':{userSubscriptions:async()=>subscriptions},
    '@/lib/visibility':{checkVisibility:async()=>{calls++;return options.check?options.check():report;}},
  };
  const load=loader(env,mocks);
  try{await run({route:load('src/app/api/tools/visibility/route.ts'),access:load('src/lib/visibility-access.ts'),store:load('src/lib/catalog/store.ts'),loadFresh:()=>loader(env,mocks),calls:()=>calls,setUser:value=>{user=value;},setSubscriptions:value=>{subscriptions=value;}});}
  finally{await fsp.rm(directory,{recursive:true,force:true});}
}

test('one successful check is free; reloads and direct API retries require premium',async()=>fixture(async({route,calls,loadFresh,store})=>{
  const fresh=await route.GET(request('GET'));
  assert.equal((await fresh.json()).used,false);
  assert.match(fresh.headers.get('set-cookie'),/HttpOnly/);
  assert.match(fresh.headers.get('cache-control'),/no-store/);
  const first=await route.POST(request());assert.equal(first.status,200);
  assert.equal((await first.json()).access.used,true);
  assert.equal((await route.GET(request('GET')).then(response=>response.json())).used,true);
  const reloaded=loadFresh()('src/app/api/tools/visibility/route.ts');
  const denied=await reloaded.POST(request());assert.equal(denied.status,402);
  assert.equal((await denied.json()).code,'PREMIUM_REQUIRED');assert.equal(calls(),1);
  assert.equal('visibilityChecks' in await store.readPublicCatalog(),false);
}));

test('invalid input and failed scans leave the free check available',async()=>{
  let fail=true;
  await fixture(async({route,calls})=>{
    assert.equal((await route.POST(request('POST',visitor,{url:'invalid'}))).status,400);
    assert.equal(calls(),0);
    assert.equal((await route.POST(request())).status,400);
    assert.equal((await route.GET(request('GET')).then(response=>response.json())).used,false);
    fail=false;
    assert.equal((await route.POST(request())).status,200);
    assert.equal(calls(),2);
  },{check:()=>{if(fail)throw Error('Fixture scan failed');return report;}});
});

test('concurrent requests cannot spend the same free check twice',async()=>{
  let release,started;
  const waiting=new Promise(resolve=>{release=resolve;});
  const entered=new Promise(resolve=>{started=resolve;});
  await fixture(async({route,calls})=>{
    const first=route.POST(request());await entered;
    const other=await route.POST(request());assert.equal(other.status,409);
    assert.equal((await other.json()).code,'CHECK_IN_PROGRESS');
    release();assert.equal((await first).status,200);
    assert.equal((await route.POST(request())).status,402);assert.equal(calls(),1);
  },{check:async()=>{started();await waiting;return report;}});
});

test('anonymous usage follows a signed-in account to another browser',async()=>fixture(async({route,setUser,calls})=>{
  assert.equal((await route.POST(request())).status,200);
  setUser({id:'fixture-user'});
  assert.equal((await route.GET(request('GET')).then(response=>response.json())).used,true);
  assert.equal((await route.POST(request('POST',secondVisitor))).status,402);
  assert.equal(calls(),1);
}));

test('only paid, unexpired Growth access unlocks repeated checks',async()=>fixture(async({route,access,setUser,setSubscriptions,calls})=>{
  const future=new Date(Date.now()+86400000).toISOString();
  const past=new Date(Date.now()-86400000).toISOString();
  const valid={plan_id:'growth',status:'active',current_period_end:future};
  for(const changes of [{plan_id:'spotlight'},{plan_id:'yacht'},{status:'pending'},{status:'authenticated'},{status:'halted'},{current_period_end:past},{current_period_end:null}]){
    assert.equal(access.hasGrowthAccess([{...valid,...changes}]),false);
  }
  assert.equal(access.hasGrowthAccess([{...valid,status:'cancelled'}]),true);
  setUser({id:'growth-user'});setSubscriptions([valid]);
  assert.equal((await route.GET(request('GET')).then(response=>response.json())).premium,true);
  for(let attempt=0;attempt<2;attempt++){
    const response=await route.POST(request());assert.equal(response.status,200);
    assert.equal((await response.json()).access.premium,true);
  }
  assert.equal(calls(),2);
}));

test('abandoned reservations expire and old completions cannot overwrite a newer check',async()=>fixture(async({access,store})=>{
  const keys=access.visibilityKeys(visitor);
  const first=await access.reserveVisibilityCheck(keys);
  await store.updateCatalog(state=>{state.visibilityChecks[keys[0]].expiresAt=Date.now()-1;});
  const next=await access.reserveVisibilityCheck(keys);assert.equal(next.status,'reserved');
  await access.finishVisibilityCheck(keys,first.reservation,true);
  assert.equal((await access.visibilityAccess(keys)).used,false);
  await access.finishVisibilityCheck(keys,next.reservation,true);
  assert.equal((await access.visibilityAccess(keys)).used,true);
}));

test('storage failure does not allow an unmetered check',async()=>{
  let calls=0;
  const load=loader({NODE_ENV:'production'},{
    '@/lib/auth/server':{currentUser:async()=>null},
    '@/lib/db':{dbEnabled:()=>false},
    '@/lib/db/billing':{userSubscriptions:async()=>[]},
    '@/lib/visibility':{checkVisibility:async()=>{calls++;return report;}},
  });
  const response=await load('src/app/api/tools/visibility/route.ts').POST(request());
  assert.equal(response.status,503);assert.equal(calls,0);
});
