import {NextRequest,NextResponse} from 'next/server';
import {callbackOrigin,currentUser} from '@/lib/auth/server';
import {dbEnabled} from '@/lib/db';
import {authUrl,gscConfigured,canUseSearchConsole,signState} from '@/lib/gsc';
export const runtime='nodejs';export const dynamic='force-dynamic';
// Starts "Connect Google Search Console" (read-only).
export async function GET(request:NextRequest){
  const origin=callbackOrigin(request);
  const user=await currentUser(request);if(!user)return NextResponse.redirect(`${origin}/login?next=/growth`);
  if(!gscConfigured()||!dbEnabled())return NextResponse.redirect(`${origin}/growth?gsc=unavailable`);
  if(!await canUseSearchConsole(user.id))return NextResponse.redirect(`${origin}/growth?gsc=upgrade`);
  return NextResponse.redirect(authUrl(origin,signState(user.id)));
}
