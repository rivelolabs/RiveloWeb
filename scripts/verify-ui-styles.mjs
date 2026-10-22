// Read-only check of the styles actually delivered by Next.js, including CSS modules.
import assert from 'node:assert/strict';
const origin=process.env.DISCOVERY_WORKER_ORIGIN||'http://127.0.0.1:3000';
for(const route of ['/login','/map']){
  const response=await fetch(new URL(route,origin));assert.equal(response.status,200,`${route} must load`);const html=await response.text();
  const paths=[...new Set([...html.matchAll(/href="([^\"]+\.css[^\"]*)"/g)].map(match=>match[1].replaceAll('&amp;','&')))];assert.ok(paths.length,'Page must include CSS');
  const css=(await Promise.all(paths.map(async path=>{const asset=await fetch(new URL(path,origin));assert.equal(asset.status,200,'Stylesheet must load');return asset.text();}))).join('\n');
  if(route==='/login'){
    const classes=[...html.matchAll(/class="([^\"]*)"/g)].flatMap(match=>match[1].split(' '));
    for(const suffix of ['__card','__button','__story','__form']){const name=classes.find(value=>value.startsWith('SignIn-module__')&&value.endsWith(suffix));assert.ok(name,`Login needs ${suffix} markup`);assert.ok(css.includes('.'+name),`Delivered CSS must contain ${suffix} styles`);}
  }else for(const selector of ['.ra-atlas','.ra-results-panel','.ra-theme-switch'])assert.ok(css.includes(selector),`Delivered map CSS must contain ${selector}`);
  console.log(`PASS ${route}: page and required stylesheet rules delivered`);
}
