import {load} from 'cheerio';
import {createHash} from 'node:crypto';
import {safeFetch,publicUrl,robotsAllows} from './safe-fetch';
import type {Listing,Source} from './types';
export function plain(value:unknown,max=800){return typeof value==='string'?load(`<div>${value}</div>`).text().replace(/\s+/g,' ').trim().slice(0,max):'';}
function optionalUrl(value:unknown,base?:string){try{return typeof value==='string'?publicUrl(value,base):undefined;}catch{return undefined;}}
function makeListing(source:Source,key:string,url:string,name:unknown,description:unknown,image:unknown,developerWebsite?:unknown):Listing{
  const cleaned=plain(name,120),summary=plain(description);if(!cleaned||summary.length<20)throw Error('The source did not provide a usable name and description.');
  const sourceUrl=publicUrl(url);return {id:`import-${createHash('sha256').update(key).digest('hex').slice(0,20)}`,sourceKey:key,sourceKind:source.kind,sourceUrl,name:cleaned,description:summary,image:optionalUrl(image,sourceUrl),developerWebsite:optionalUrl(developerWebsite),genre:source.genre,type:source.kind==='website'?'Website':'App',platforms:[source.kind==='website'?'Web':source.kind==='googleplay'?'Android':'iOS'],importedAt:new Date().toISOString(),status:'pending'};
}
export function parseWebsite(html:string,url:string,source:Source):Listing{
  const $=load(html);const robots=$('meta[name="robots"],meta[name="googlebot"]').map((_,el)=>$(el).attr('content')||'').get().join(' ');
  if(/noindex|noimageindex|nosnippet/i.test(robots))throw Error('The website opts out of indexing or snippets.');
  const meta=(property:string)=>$(`meta[property="${property}"],meta[name="${property}"]`).first().attr('content');
  return makeListing(source,`website:${new URL(url).origin}`,url,meta('og:site_name')||meta('og:title')||$('title').first().text(),meta('description')||meta('og:description')||meta('twitter:description'),meta('og:image')||meta('twitter:image'));
}
/** How recent an app's first release must be for search imports (default: this week). */
export const newAppDays=()=>Math.max(1,Math.min(90,Number(process.env.NEW_APP_DAYS)||7));
export function parseApple(data:unknown,source:Source):Listing[]{
  const results=(data as {results?:Record<string,unknown>[]})?.results;if(!Array.isArray(results))throw Error('Apple returned an unexpected result.');
  const apps=results.filter(item=>typeof item.trackId==='number'&&item.kind==='software'&&typeof item.trackViewUrl==='string'&&(item.artworkUrl512||item.artworkUrl100));
  const since=Date.now()-newAppDays()*86400000;
  const fresh=source.kind==='appstore-search'?apps.filter(item=>typeof item.releaseDate==='string'&&Date.parse(item.releaseDate)>=since).sort((a,b)=>Date.parse(String(b.releaseDate))-Date.parse(String(a.releaseDate))):apps;
  return fresh.slice(0,10).flatMap(item=>{try{const l=makeListing(source,'appstore:'+item.trackId,String(item.trackViewUrl),item.trackName,item.description,item.artworkUrl512||item.artworkUrl100,item.sellerUrl);l.developerName=plain(item.artistName||item.sellerName,120)||undefined;l.releasedAt=typeof item.releaseDate==='string'?item.releaseDate:undefined;return [l];}catch{return [];}});
}
export function parsePlay(data:unknown,source:Source,packageId:string):Listing{
  const payload=data as {product_info?:{title?:string;thumbnail?:string};about_this_app?:{snippet?:string};error?:string};if(payload.error)throw Error('Google Play provider could not return this app.');
  return makeListing(source,`googleplay:${packageId}`,`https://play.google.com/store/apps/details?id=${encodeURIComponent(packageId)}`,payload.product_info?.title,payload.about_this_app?.snippet,payload.product_info?.thumbnail);
}
export async function importSource(source:Source):Promise<Listing[]>{
  if(source.kind==='website'){
    const target=new URL(publicUrl(source.value));const robots=await safeFetch(`${target.origin}/robots.txt`,{maxBytes:150000});
    if(robots.status!==404&&(robots.status<200||robots.status>=300))throw Error('Could not verify the website’s crawl permissions.');
    if(!robotsAllows(robots.text,target.pathname+target.search))throw Error('This page is excluded by robots.txt.');
    const page=await safeFetch(target.href,{redirects:0});if(page.status>=300&&page.status<400)throw Error('Use the website’s final URL, without a redirect.');
    if(page.status!==200||!String(page.headers['content-type']).includes('text/html'))throw Error('The website did not return an HTML page.');
    if(/noindex|nosnippet/i.test(String(page.headers['x-robots-tag']||'')))throw Error('The website opts out through X-Robots-Tag.');
    return [parseWebsite(page.text,page.url,source)];
  }
  if(source.kind==='googleplay'){
    const packageId=source.value.startsWith('http')?new URL(source.value).searchParams.get('id')||'':source.value;
    if(!/^[a-zA-Z][\w]*(\.[\w]+)+$/.test(packageId))throw Error('Enter a valid Google Play package ID or store link.');
    if(!process.env.SERPAPI_API_KEY)return [await playFromStorePage(source,packageId)];
    const url=new URL('https://serpapi.com/search.json');url.search=new URLSearchParams({engine:'google_play_product',store:'apps',product_id:packageId,gl:source.country,hl:'en',api_key:process.env.SERPAPI_API_KEY}).toString();
    const result=await safeFetch(url.href,{maxBytes:2_000_000});if(result.status!==200)throw Error('Google Play provider request failed.');return [parsePlay(JSON.parse(result.text),source,packageId)];
  }
  const endpoint=source.kind==='appstore-search'?'search':'lookup';const url=new URL(`https://itunes.apple.com/${endpoint}`);
  if(source.kind==='appstore-search')url.search=new URLSearchParams({term:source.value,entity:'software',country:source.country,limit:'200'}).toString();
  else {const id=source.value.match(/(?:id)?(\d{5,})/)?.[1];if(!id)throw Error('Enter an App Store ID or app link.');url.search=new URLSearchParams({id,country:source.country,entity:'software'}).toString();}
  const result=await safeFetch(url.href,{maxBytes:2_000_000});if(result.status!==200)throw Error('Apple’s search API is unavailable.');return parseApple(JSON.parse(result.text),source);
}

/** Without a SerpApi key, read the public title, description and icon a Play store page shares for link previews. */
async function playFromStorePage(source:Source,packageId:string):Promise<Listing>{
  const url=`https://play.google.com/store/apps/details?id=${encodeURIComponent(packageId)}&hl=en&gl=${encodeURIComponent(source.country||'us')}`;
  const page=await safeFetch(url,{maxBytes:3_000_000});
  if(page.status===404)throw Error('That app isn’t on Google Play (or isn’t public yet).');
  if(page.status!==200)throw Error('Google Play didn’t respond. You can enter the details below.');
  const $=load(page.text);const meta=(k:string)=>$(`meta[property="${k}"],meta[name="${k}"],meta[itemprop="${k}"]`).first().attr('content');
  const name=(meta('og:title')||$('title').first().text()||'').replace(/\s*[-–]\s*Apps on Google Play\s*$/i,'').trim();
  const description=meta('description')||meta('og:description')||'';
  const listing=makeListing(source,`googleplay:${packageId}`,`https://play.google.com/store/apps/details?id=${encodeURIComponent(packageId)}`,name,description,meta('og:image')||meta('image'));
  return listing;
}
