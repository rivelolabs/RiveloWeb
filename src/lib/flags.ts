/** Country flag + short place name from a free-text city like "Austin, Texas, United States". */
let byName:Map<string,string>|null=null;
function names(){
  if(byName)return byName;byName=new Map();
  const dn=new Intl.DisplayNames(['en'],{type:'region'});const A=65;
  for(let i=0;i<26;i++)for(let j=0;j<26;j++){const code=String.fromCharCode(A+i,A+j);try{const n=dn.of(code);if(n&&n!==code)byName.set(n.toLowerCase(),code);}catch{}}
  for(const [alias,code] of [['usa','US'],['united states of america','US'],['us','US'],['uk','GB'],['england','GB'],['scotland','GB'],['wales','GB'],['uae','AE'],['south korea','KR'],['korea','KR'],['russia','RU'],['vietnam','VN'],['czech republic','CZ'],['türkiye','TR'],['turkey','TR'],['hong kong','HK'],['taiwan','TW']] as const)byName.set(alias,code);
  return byName;
}
export function countryCode(city:string|null|undefined){
  if(!city)return null;const parts=city.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
  for(let i=parts.length-1;i>=0;i--){const c=names().get(parts[i]);if(c)return c;}
  return null;
}
export const flag=(code:string|null)=>code?String.fromCodePoint(...[...code].map(c=>0x1f1e6+c.charCodeAt(0)-65)):'';
export const shortPlace=(city:string|null|undefined)=>(city||'').split(',')[0].trim();
