const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { NextResponse } = require('next/server');
function load(env={}) {
  function execute(file, require) {
    const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
    const context={exports:{},require,process:{env,cwd:()=>process.cwd()},URL,Buffer,Date};
    vm.runInNewContext(source,context,{filename:file});return context.exports;
  }
  const lib=execute('src/lib/directory.ts',require);
  const route=execute('src/app/api/registry/route.ts',name=>name==='next/server'?{NextResponse}:name==='@/lib/directory'?lib:require(name));
  return {...route,...lib};
}
const sample={requestId:'00000000-0000-4000-8000-000000000001',name:'Example App',url:'https://example.com',genre:'Productivity',type:'App',tagline:'A clearly marked test registration.',email:'builder@example.com',website:''};
function request(body,headers={}) {return new Request('http://localhost:3000/api/registry',{method:'POST',headers:{origin:'http://localhost:3000','content-type':'application/json',...headers},body:typeof body==='string'?body:JSON.stringify(body)});}
test('rejects unsafe URLs, unsupported genres, empty fields, invalid contacts, and bot submissions',async()=>{
  const route=load({NODE_ENV:'production'});
  for(const change of [{url:'javascript:alert(1)'},{url:'https://name:password@example.com'},{url:'invalid'},{genre:'Made up'},{name:'  '},{tagline:''},{email:'invalid'},{website:'bot.example'},{requestId:'../private'}]) assert.equal((await route.POST(request({...sample,...change}))).status,400);
});
test('rejects cross-origin, non-JSON, malformed and oversized requests',async()=>{
  const route=load();assert.equal((await route.POST(request(sample,{origin:'https://other.example'}))).status,403);
  assert.equal((await route.POST(request(sample,{'content-type':'text/plain'}))).status,415);
  assert.equal((await route.POST(request('{'))).status,400);
  assert.equal((await route.POST(request('x'.repeat(6001)))).status,413);
});
test('production registration cannot claim success without durable storage configured',async()=>{
  const response=await load({NODE_ENV:'production'}).POST(request(sample));assert.equal(response.status,503);assert.equal((await response.json()).success,undefined);
});
test('persists a pending private record, replays identical requests, and rejects altered replays',async()=>{
  const dir=await fsp.mkdtemp(path.join(os.tmpdir(),'rivelo-registry-test-'));
  try {
    const route=load({NODE_ENV:'production',DIRECTORY_DATA_DIR:dir});
    for(let i=0;i<2;i++){const response=await route.POST(request(sample));assert.equal(response.status,201);assert.deepEqual(await response.json(),{success:true,id:sample.requestId,status:'pending'});}
    const records=await fsp.readdir(dir);assert.equal(records.length,1);
    const record=JSON.parse(await fsp.readFile(path.join(dir,records[0]),'utf8'));
    assert.equal(record.email,sample.email);assert.equal(record.status,'pending');assert.equal(record.url,'https://example.com/');
    assert.equal((await route.POST(request({...sample,name:'Changed App'}))).status,409);
  } finally {await fsp.rm(dir,{recursive:true,force:true});}
});
test('write failure cannot produce a successful receipt',async()=>{
  const dir=await fsp.mkdtemp(path.join(os.tmpdir(),'rivelo-registry-fail-'));
  try{const file=path.join(dir,'file');await fsp.writeFile(file,'not a directory');const response=await load({NODE_ENV:'production',DIRECTORY_DATA_DIR:file}).POST(request(sample));assert.equal(response.status,503);assert.equal((await response.json()).success,undefined);}finally{await fsp.rm(dir,{recursive:true,force:true});}
});
test('directory filters compose across platform, genre, saved items, search, and sort',()=>{
  const {filterProducts,products}=load();
  const base={view:'discover',genre:null,query:'',sort:'curated',saved:[]};
  assert.equal(filterProducts(base).length,5);
  assert.equal(filterProducts({...base,view:'apps'}).length,4);
  assert.equal(filterProducts({...base,view:'websites'})[0].id,'omeglevc');
  assert.equal(filterProducts({...base,query:'  rEvFiT '})[0].id,'revfit');
  assert.equal(filterProducts({...base,view:'apps',genre:'Social & community'})[0].id,'klyq');
  assert.equal(filterProducts({...base,view:'saved',saved:['calarm','boop'],query:'iOS'}).length,2);
  assert.equal(filterProducts({...base,view:'websites',genre:'Games'}).length,0);
  assert.equal(filterProducts({...base,sort:'az'})[0].name,'BOOP');
  assert.equal(products[0].id,'omeglevc');
});
