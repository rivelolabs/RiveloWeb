import {createBrowserClient} from '@supabase/ssr';
import {authConfig} from './config';
let client:ReturnType<typeof createBrowserClient>|undefined;
export function browserAuth(){const config=authConfig();if(!config)return null;return client||(client=createBrowserClient(config.url,config.key));}
