const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
const sharp=require('sharp');

function load(file,imports={}){
  const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const context={exports:{},require:name=>name in imports?imports[name]:require(name),URL,Buffer,Response};
  vm.runInNewContext(source,context,{filename:file});return context.exports;
}
const images=load('src/lib/map-images.ts');
const cache={cached:fn=>fn};

test('map images reject share pages and unsupported schemes, and resize known CDN URLs',()=>{
  for(const source of ['https://drive.google.com/file/d/example/view','https://share.google/example','https://docs.google.com/document/d/example','javascript:alert(1)','https://user:password@example.com/logo.png','not a url'])assert.equal(images.mapImageSource(source),null);
  assert.equal(images.mapImageSource('https://pbs.twimg.com/profile_images/1/avatar_400x400.jpg'),'https://pbs.twimg.com/profile_images/1/avatar_200x200.jpg');
  assert.equal(images.mapImageSource('https://play-lh.googleusercontent.com/icon=w480-h960-rw'),'https://play-lh.googleusercontent.com/icon=s96');
  assert.equal(images.mapThumbnailUrl('pin','https://share.google/example'),null);
  assert.notEqual(images.mapThumbnailUrl('pin','https://example.com/a.png'),images.mapThumbnailUrl('pin','https://example.com/b.png'));
});

test('thumbnail route compresses published map images to at most 96 pixels',async()=>{
  const original=await sharp({create:{width:512,height:256,channels:4,background:'#f97316'}}).png().toBuffer();
  let requested;
  const route=load('src/app/api/map/image/[id]/route.ts',{
    '@/lib/map-data':{getMapData:async()=>({pins:[{id:'public-pin',avatar:'https://example.com/photo.png'}],yachts:[]})},
    '@/lib/map-images':images,'@/lib/cache':cache,
    '@/lib/catalog/safe-fetch':{safeFetch:async source=>{requested=source;return {status:200,headers:{'content-type':'image/png'},body:original};}},
  });
  const response=await route.GET(new Request('https://www.rivelolabs.com/api/map/image/public-pin'),{params:Promise.resolve({id:'public-pin'})});
  assert.equal(response.status,200);assert.equal(requested,'https://example.com/photo.png');
  assert.equal(response.headers.get('content-type'),'image/webp');assert.match(response.headers.get('cache-control'),/s-maxage=86400/);
  const output=Buffer.from(await response.arrayBuffer()),metadata=await sharp(output).metadata();
  assert.equal(metadata.width,96);assert.equal(metadata.height,48);assert.ok(output.length<original.length);
});

test('thumbnail requests cannot choose arbitrary URLs or unpublished IDs',async()=>{
  let calls=0;
  const route=load('src/app/api/map/image/[id]/route.ts',{
    '@/lib/map-data':{getMapData:async()=>({pins:[{id:'bad-logo',avatar:'https://drive.google.com/file/d/private/view'}],yachts:[]})},
    '@/lib/map-images':images,'@/lib/cache':cache,
    '@/lib/catalog/safe-fetch':{safeFetch:async()=>{calls++;throw Error('Must not fetch');}},
  });
  for(const [id,query] of [['unknown','?url=https://example.com/logo.png'],['bad-logo',''],['bad-logo','?kind=other']]){
    const response=await route.GET(new Request(`https://www.rivelolabs.com/api/map/image/${id}${query}`),{params:Promise.resolve({id})});
    assert.equal(response.status,404);
  }
  assert.equal(calls,0);
});

test('non-image upstream responses fail without exposing their contents',async()=>{
  const route=load('src/app/api/map/image/[id]/route.ts',{
    '@/lib/map-data':{getMapData:async()=>({pins:[{id:'public-pin',avatar:'https://example.com/page'}],yachts:[]})},
    '@/lib/map-images':images,'@/lib/cache':cache,
    '@/lib/catalog/safe-fetch':{safeFetch:async()=>({status:200,headers:{'content-type':'text/html'},body:Buffer.from('not an image')})},
  });
  const response=await route.GET(new Request('https://www.rivelolabs.com/api/map/image/public-pin'),{params:Promise.resolve({id:'public-pin'})});
  assert.equal(response.status,404);assert.equal(await response.text(),'');
});

test('map snapshot preserves ranks, maker links and sponsored yacht destinations',async()=>{
  const queryCalls=[];
  const {getMapData}=load('src/lib/map-data.ts',{
    '@/lib/cache':cache,
    '@/lib/catalog/store':{readPublicCatalog:async()=>({pins:[{id:'pin',productId:'app',name:'App',genre:'Productivity',city:'City',lat:10,lng:20}],products:[{id:'app',logo:'https://example.com/logo.png',importedAt:'2026-10-23',url:'https://example.com',name:'App'}]})},
    '@/lib/db':{dbEnabled:()=>true,db:()=>({query:async sql=>{queryCalls.push(sql);return {rows:[{id:'pin',avatar:'https://example.com/avatar.png'}]};}})},
    '@/lib/db/billing':{cachedYachtSlots:async()=>[[1,'app'],[2,'maker:builder']]},
    '@/lib/db/makers':{cachedMakerPins:async()=>[{id:'maker-pin',productId:'maker:builder',name:'Builder',href:'/makers/builder',joinedAt:'2026-10-22',avatar:'https://example.com/photo.png',badge:null}],promotedMakers:async()=>new Map([['maker:builder',{id:'maker:builder',name:'Builder',url:'https://builder.example',logo:null}]])},
    '@/lib/yachts':{YACHTS:[{index:1,sea:'Atlantic',lat:0,lng:0},{index:2,sea:'Pacific',lat:0,lng:0}]},
  });
  const data=await getMapData();
  assert.equal(data.pins[0].href,'/makers/builder');assert.equal(data.pins[0].rank,1);
  assert.equal(data.pins[1].rank,2);assert.equal(data.pins[1].avatar,'https://example.com/logo.png');
  assert.equal(data.yachts[0].product.url,'https://example.com');assert.equal(data.yachts[1].product.url,'https://builder.example');
  assert.equal(queryCalls.length,1);assert.match(queryCalls[0],/pin->>'status'='published'/);
  assert.equal('joinedAt' in data.pins[0],false);assert.equal('email' in data.pins[1],false);
});
