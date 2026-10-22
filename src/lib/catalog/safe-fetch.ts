import { lookup } from "node:dns/promises";
import { BlockList, isIP } from "node:net";
import http from "node:http";
import https from "node:https";

const blocked = new BlockList();
for (const [ip,prefix] of [["0.0.0.0",8],["10.0.0.0",8],["100.64.0.0",10],["127.0.0.0",8],["169.254.0.0",16],["172.16.0.0",12],["192.0.0.0",24],["192.0.2.0",24],["192.168.0.0",16],["198.18.0.0",15],["198.51.100.0",24],["203.0.113.0",24],["224.0.0.0",3]] as const) blocked.addSubnet(ip,prefix,"ipv4");
const ipv6Global = new BlockList(); ipv6Global.addSubnet("2000::",3,"ipv6");
const ipv6Reserved = new BlockList(); ipv6Reserved.addSubnet("2001::",23,"ipv6"); ipv6Reserved.addSubnet("2001:db8::",32,"ipv6"); ipv6Reserved.addSubnet("2002::",16,"ipv6");
export function publicAddress(ip:string) {
  return isIP(ip)===4 ? !blocked.check(ip,"ipv4") : isIP(ip)===6 && ipv6Global.check(ip,"ipv6") && !ipv6Reserved.check(ip,"ipv6");
}
export function publicUrl(raw:string,base?:string):string {
  const url=new URL(raw,base);
  const host=url.hostname.toLowerCase().replace(/^\[|\]$/g,"");
  if (!['http:','https:'].includes(url.protocol)||url.username||url.password||(url.port && !['80','443'].includes(url.port))||host==='localhost'||host.endsWith('.localhost')||host.endsWith('.local')||host.endsWith('.internal')||host==='metadata.google.internal'||(isIP(host)?!publicAddress(host):!host.includes('.'))) throw Error("Use a public HTTP or HTTPS URL.");
  url.hash='';return url.href;
}
export type WebResponse = {status:number;url:string;headers:http.IncomingHttpHeaders;text:string;body:Buffer};
export async function safeFetch(raw:string, options:{maxBytes?:number;redirects?:number;headers?:Record<string,string>}={}):Promise<WebResponse> {
  const url=new URL(publicUrl(raw));
  const addresses=await lookup(url.hostname.replace(/^\[|\]$/g,''),{all:true,verbatim:true});
  if(!addresses.length||addresses.some(address=>!publicAddress(address.address)))throw Error('This address is not publicly accessible.');
  const response=await new Promise<WebResponse>((resolve,reject)=>{
    const transport=url.protocol==='https:'?https:http;
    const req=transport.request(url,{method:'GET',headers:{'User-Agent':'RiveloDirectoryBot/1.0 (+https://rivelolabs.com; contact: hello@rivelolabs.com)','Accept-Encoding':'identity',...options.headers},lookup:((_host:unknown,opts:{all?:boolean},cb:(...args:unknown[])=>void)=>{if(opts?.all)cb(null,addresses);else cb(null,addresses[0].address,addresses[0].family);}) as never},res=>{
      const status=res.statusCode||500;
      if(status>=300&&status<400&&res.headers.location){res.resume();resolve({status,url:url.href,headers:res.headers,text:'',body:Buffer.alloc(0)});return;}
      let bytes=0;const chunks:Buffer[]=[];
      res.on('data',(chunk:Buffer)=>{bytes+=chunk.length;if(bytes>(options.maxBytes||1_000_000)){res.destroy(Error('Response exceeds the import size limit.'));}else chunks.push(chunk);});
      res.on('end',()=>resolve({status,url:url.href,headers:res.headers,text:Buffer.concat(chunks).toString('utf8'),body:Buffer.concat(chunks)}));res.on('error',reject);
    });
    const timer=setTimeout(()=>req.destroy(Error('Import request timed out.')),10000);req.on('close',()=>clearTimeout(timer));req.on('error',reject);req.end();
  });
  if(response.status>=300&&response.status<400&&response.headers.location){if((options.redirects??3)<=0)throw Error('Too many redirects.');return safeFetch(new URL(response.headers.location,url).href,{...options,redirects:(options.redirects??3)-1});}
  return response;
}
export function robotsAllows(text:string,pathname:string):boolean {
  type Group={agents:string[];rules:{allow:boolean;pattern:string}[]};const groups:Group[]=[];let group:Group|undefined,hasRules=false;
  for(const line of text.split(/\r?\n/)){const clean=line.split('#')[0].trim();const match=clean.match(/^([^:]+):\s*(.*)$/);if(!match)continue;const key=match[1].toLowerCase(),value=match[2].trim();if(key==='user-agent'){if(!group||hasRules){group={agents:[],rules:[]};groups.push(group);hasRules=false;}group.agents.push(value.toLowerCase());}else if(group&&['allow','disallow'].includes(key)){hasRules=true;if(value)group.rules.push({allow:key==='allow',pattern:value});}}
  const exact=groups.filter(g=>g.agents.some(a=>a!=='*'&&'rivelodirectorybot'.includes(a)));
  const selected=exact.length?exact:groups.filter(g=>g.agents.includes('*'));
  const matches=selected.flatMap(g=>g.rules).filter(rule=>{const end=rule.pattern.endsWith('$');const pattern=(end?rule.pattern.slice(0,-1):rule.pattern).replace(/[.+?^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*');return new RegExp('^'+pattern+(end?'$':'')).test(pathname);}).sort((a,b)=>b.pattern.length-a.pattern.length||Number(b.allow)-Number(a.allow));
  return !matches.length||matches[0].allow;
}
