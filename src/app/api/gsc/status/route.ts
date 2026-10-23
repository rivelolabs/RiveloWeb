import {NextRequest,NextResponse} from 'next/server';
import {currentUser} from '@/lib/auth/server';
import {dbEnabled} from '@/lib/db';
import {getConnection,gscConfigured,canUseSearchConsole,listSites} from '@/lib/gsc';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:NextRequest){
  const h={'Cache-Control':'no-store'};
  const user=await currentUser(request);
  if(!user)return NextResponse.json({signedIn:false,configured:gscConfigured(),growth:false,connection:null,sites:[]},{headers:h});
  if(!dbEnabled()||!gscConfigured())return NextResponse.json({signedIn:true,configured:false,growth:false,connection:null,sites:[]},{headers:h});
  const [growth,connection]=await Promise.all([canUseSearchConsole(user.id),getConnection(user.id).catch(()=>null)]);
  const sites=connection?await listSites(user.id).catch(()=>[]):[];
  return NextResponse.json({signedIn:true,configured:true,growth,connection,sites},{headers:h});
}
