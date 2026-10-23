const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
function load(file, imports={}) {
  const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const context={exports:{},require:name=>{if(name in imports)return imports[name];throw Error(`Unexpected import: ${name}`)}};
  vm.runInNewContext(source,context);return context.exports;
}
test('theme resolver follows the device color scheme',()=>{
  const {resolveTheme}=load('src/lib/theme.ts');
  assert.equal(resolveTheme(true),'dark');
  assert.equal(resolveTheme(false),'light');
});
test('early theme script restores manual choices and defaults to light',()=>{
  const {themeBootstrap,resolveTheme,normalizeThemePreference}=load('src/lib/theme.ts');
  for(const {saved,dark,expected} of [
    {saved:'dark',dark:false,expected:'dark'},
    {saved:'light',dark:true,expected:'light'},
    {saved:'system',dark:true,expected:'dark'},
    {saved:null,dark:false,expected:'light'},
    {saved:'invalid',dark:true,expected:'light'},
    {saved:null,dark:true,expected:'light'},
  ]) {
    const context={document:{documentElement:{dataset:{}}},localStorage:{getItem(){return saved;}},matchMedia:()=>({matches:dark})};
    vm.runInNewContext(themeBootstrap,context);
    assert.equal(context.document.documentElement.dataset.theme,expected);
  }
  assert.equal(normalizeThemePreference('unknown'),'light');
  assert.equal(normalizeThemePreference('system'),'system');
  assert.equal(resolveTheme(true,'light'),'light');
  assert.equal(resolveTheme(false,'dark'),'dark');
  assert.equal(resolveTheme(false,'system'),'light');
  const context={document:{documentElement:{dataset:{}}},localStorage:{getItem(){throw Error('Storage unavailable');}},matchMedia:()=>({matches:true})};
  vm.runInNewContext(themeBootstrap,context);
  assert.equal(context.document.documentElement.dataset.theme,'light');
});
test('structured directory links and product breadcrumbs agree with actual product routes',()=>{
  const directory=load('src/lib/directory.ts');
  const categories=load('src/lib/categories.ts');
  const seo=load('src/lib/seo.ts',{'@/lib/directory':directory,'@/lib/categories':categories});
  assert.equal(seo.siteUrl,'https://www.rivelolabs.com');
  assert.equal(seo.directorySchema.mainEntity.numberOfItems,directory.products.length);
  for(const product of directory.ecosystemProducts) {
    const schema=seo.productSchema(product);
    assert.equal(schema['@graph'][0].url,`${seo.siteUrl}/products/${product.id}`);
    assert.equal(schema['@graph'][0].name,product.name);
    assert.equal(schema['@graph'][1].itemListElement[1].item,`${seo.siteUrl}${categories.categoryPath(product.genre)}`);
    assert.equal(schema['@graph'][1].itemListElement[2].item,seo.productUrl(product));
    assert.equal(schema['@graph'][0].aggregateRating,undefined);
    assert.equal(schema['@graph'][0].offers,undefined);
  }
  assert.doesNotMatch(seo.serializeSchema({name:'</script><script>unsafe</script>'}), /</);
});
test('every product genre has a unique, routable category',()=>{
  const {genres}=load('src/lib/directory.ts');
  const {categories,categoryPath}=load('src/lib/categories.ts');
  assert.equal(categories.length,genres.length);
  assert.equal(new Set(categories.map(category=>category.slug)).size,genres.length);
  for(const genre of genres) {
    const category=categories.find(item=>item.genre===genre);
    assert.ok(category);
    assert.match(category.slug,/^[a-z]+(?:-[a-z]+)*$/);
    assert.equal(categoryPath(genre),`/categories/${category.slug}`);
  }
});
