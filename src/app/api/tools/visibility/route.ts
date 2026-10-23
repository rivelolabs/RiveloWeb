import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { jsonBody, sameOrigin } from '@/lib/catalog/http';
import { rateLimit } from '@/lib/catalog/limit';
import { currentUser } from '@/lib/auth/server';
import { checkVisibility } from '@/lib/visibility';
import { finishVisibilityCheck, reserveVisibilityCheck, visibilityAccess, visibilityKeys } from '@/lib/visibility-access';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;
const COOKIE = 'rivelo-visibility-visitor';

function visitorId(request: NextRequest) {
  const saved = request.cookies.get(COOKIE)?.value;
  return saved && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(saved) ? saved : randomUUID();
}

function json(visitor: string, body: unknown, status = 200) {
  const response = NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', Vary: 'Cookie' } });
  response.cookies.set(COOKIE, visitor, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/api/tools/visibility', maxAge: 365 * 86400 });
  return response;
}

export async function GET(request: NextRequest) {
  const visitor = visitorId(request);
  try {
    const user = await currentUser(request);
    return json(visitor, await visibilityAccess(visibilityKeys(visitor, user?.id), user?.id));
  } catch {
    return json(visitor, { error: 'Could not load your SEO check access. Please try again.' }, 503);
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });
  const visitor = visitorId(request);
  let keys: string[] = [];
  let reservation: string | undefined;
  try {
    rateLimit(request, 'visibility', 8);
    const body = await jsonBody(request, 1000);
    const url = String(body.url || '').trim().slice(0, 500);
    if (!url || !/\./.test(url)) return json(visitor, { error: 'Enter your website address, like your-product.com.' }, 400);
    const user = await currentUser(request);
    keys = visibilityKeys(visitor, user?.id);
    let access;
    try {
      access = await visibilityAccess(keys, user?.id);
      if (!access.premium) {
        const claim = await reserveVisibilityCheck(keys);
        if (claim.status === 'used') return json(visitor, { code: 'PREMIUM_REQUIRED', error: 'You’ve used your free SEO check. Upgrade to Growth for more checks.', access: { premium: false, used: true, checking: false } }, 402);
        if (claim.status === 'checking') return json(visitor, { code: 'CHECK_IN_PROGRESS', error: 'Your free SEO check is already running. Please wait for it to finish.' }, 409);
        reservation = claim.reservation;
      }
    } catch {
      return json(visitor, { error: 'SEO checks are temporarily unavailable. Please try again.' }, 503);
    }
    const report = await checkVisibility(url);
    if (reservation) await finishVisibilityCheck(keys, reservation, true);
    return json(visitor, { ...report, access: { premium: access.premium, used: !access.premium, checking: false } });
  } catch (error) {
    if (reservation) {
      try { await finishVisibilityCheck(keys, reservation, false); }
      catch { return json(visitor, { error: 'Could not complete your check. Please try again in a minute.' }, 503); }
    }
    return json(visitor, { error: error instanceof Error ? error.message : 'Could not check that site.' }, 400);
  }
}
