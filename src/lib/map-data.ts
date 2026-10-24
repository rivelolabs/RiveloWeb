import { readPublicCatalog } from '@/lib/catalog/store';
import { db, dbEnabled } from '@/lib/db';
import { cachedYachtSlots } from '@/lib/db/billing';
import { cachedMakerPins, promotedMakers } from '@/lib/db/makers';
import { cached } from '@/lib/cache';
import { YACHTS, type YachtSpot } from '@/lib/yachts';

const pinAvatars = cached(async () => {
  // Extract only published pin IDs and photos; do not read the full private catalog into the page.
  const result = await db().query(`SELECT pin->>'id' id, profile.avatar_url avatar
    FROM rivelo_directory.catalog_state catalog
    CROSS JOIN LATERAL jsonb_array_elements(COALESCE(catalog.payload->'pins', '[]'::jsonb)) pin
    JOIN rivelo.profiles profile ON lower(profile.email)=lower(pin->>'email')
    WHERE catalog.id='primary' AND pin->>'status'='published' AND NULLIF(profile.avatar_url,'') IS NOT NULL`);
  return result.rows.map(row => [row.id as string, row.avatar as string] as [string, string]);
}, 'map-pin-avatars-v2', ['catalog', 'profiles'], 300);

/** One serializable snapshot for the map page and its public thumbnail endpoints. */
export const getMapData = cached(async () => {
  const enabled = dbEnabled();
  const [{ pins, products }, slots, makers, photos] = await Promise.all([
    readPublicCatalog(),
    enabled ? cachedYachtSlots().catch(() => [] as [number, string][]) : [],
    enabled ? cachedMakerPins().catch(() => []) : [],
    enabled ? pinAvatars().catch(() => [] as [string, string][]) : [],
  ]);
  const booked = new Map(slots), photo = new Map(photos), byId = new Map(products.map(product => [product.id, product]));
  const makerYachts = enabled ? await promotedMakers([...booked.values()]).catch(() => new Map()) : new Map();
  const yachts: YachtSpot[] = YACHTS.map(yacht => {
    const id = booked.get(yacht.index), product = id ? byId.get(id) : undefined;
    const maker = id && !product ? makerYachts.get(id.toLowerCase()) : undefined;
    return { ...yacht, product: product ? { id: product.id, name: product.name, url: product.url || `/products/${product.id}`, logo: product.logo || null }
      : maker ? { id: maker.id, name: maker.name, url: maker.url, logo: maker.logo } : undefined };
  });
  const productPins = pins.map(pin => ({ ...pin, avatar: byId.get(pin.productId)?.logo || photo.get(pin.id) || null, badge: null, joinedAt: byId.get(pin.productId)?.importedAt || '' }));
  const ranked = [...productPins, ...makers].sort((a, b) => (a.joinedAt || '9').localeCompare(b.joinedAt || '9'))
    .map((pin, index) => { const { joinedAt, ...rest } = pin; void joinedAt; return { ...rest, rank: index + 1 }; });
  return { pins: ranked, yachts };
}, 'public-map-data-v1', ['catalog', 'makers', 'profiles', 'billing'], 60);
