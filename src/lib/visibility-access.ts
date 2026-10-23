import { randomUUID } from 'node:crypto';
import { readCatalog, updateCatalog } from '@/lib/catalog/store';
import { dbEnabled } from '@/lib/db';
import { userSubscriptions } from '@/lib/db/billing';
import type { CatalogState } from '@/lib/catalog/types';

export type VisibilityAccess = { premium: boolean; used: boolean; checking: boolean };
type Subscription = { plan_id: string; status: string; current_period_end: string | null };

export function hasGrowthAccess(subscriptions: Subscription[], now = Date.now()) {
  return subscriptions.some(subscription => subscription.plan_id === 'growth'
    && ['active', 'cancelled'].includes(subscription.status)
    && subscription.current_period_end !== null
    && Date.parse(subscription.current_period_end) > now);
}

export function visibilityKeys(visitorId: string, userId?: string) {
  return [`visitor:${visitorId}`, ...(userId ? [`user:${userId}`] : [])];
}

function quotaStatus(state: CatalogState, keys: string[]) {
  const entries = keys.map(key => state.visibilityChecks?.[key]);
  return {
    used: entries.some(entry => entry?.status === 'used'),
    checking: entries.some(entry => entry?.status === 'pending' && entry.expiresAt > Date.now()),
  };
}

export async function visibilityAccess(keys: string[], userId?: string): Promise<VisibilityAccess> {
  if (userId && dbEnabled() && hasGrowthAccess(await userSubscriptions(userId))) {
    return { premium: true, used: false, checking: false };
  }
  const state = await readCatalog();
  const status = quotaStatus(state, keys);
  // Carry an anonymous trial onto the account when the visitor signs in.
  if (status.used && keys.some(key => state.visibilityChecks?.[key]?.status !== 'used')) {
    await updateCatalog(current => {
      current.visibilityChecks ??= {};
      for (const key of keys) current.visibilityChecks[key] = { status: 'used' };
    });
  }
  return { premium: false, ...status };
}

export async function reserveVisibilityCheck(keys: string[]) {
  return updateCatalog(state => {
    const status = quotaStatus(state, keys);
    if (status.used) {
      state.visibilityChecks ??= {};
      for (const key of keys) state.visibilityChecks[key] = { status: 'used' };
      return { status: 'used' } as const;
    }
    if (status.checking) return { status: 'checking' } as const;
    const reservation = randomUUID();
    state.visibilityChecks ??= {};
    for (const key of keys) state.visibilityChecks[key] = { status: 'pending', reservation, expiresAt: Date.now() + 60_000 };
    return { status: 'reserved', reservation } as const;
  });
}

export async function finishVisibilityCheck(keys: string[], reservation: string, success: boolean) {
  await updateCatalog(state => {
    for (const key of keys) {
      const entry = state.visibilityChecks?.[key];
      if (entry?.status !== 'pending' || entry.reservation !== reservation) continue;
      if (success) state.visibilityChecks![key] = { status: 'used' };
      else delete state.visibilityChecks![key];
    }
  });
}
