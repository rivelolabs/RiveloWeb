import {createHash} from 'node:crypto';
const windows=new Map<string,{count:number;until:number}>();
export function rateLimit(request:Request,bucket:string,limit=6){const key=bucket+createHash('sha256').update(request.headers.get('x-forwarded-for')?.split(',')[0]||'local').digest('hex');const now=Date.now();for(const [id,value] of windows)if(value.until<now)windows.delete(id);const value=windows.get(key)||{count:0,until:now+600000};if(value.count>=limit||windows.size>2000)throw Error('Please wait a few minutes before trying again.');value.count++;windows.set(key,value);}
