import { getMapData } from '@/lib/map-data';
import { mapImageSource } from '@/lib/map-images';
import { safeFetch } from '@/lib/catalog/safe-fetch';
import { cached } from '@/lib/cache';

export const runtime = 'nodejs';
export const maxDuration = 30;
const TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'];
const thumbnail = cached(async (source: string) => {
  const image = await safeFetch(source, { maxBytes: 2_000_000 });
  const type = String(image.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
  if (image.status !== 200 || !TYPES.includes(type)) throw Error('Not a public image.');
  // Loading inside the handler allows an original-image fallback if a native
  // dependency is unavailable in a serverless deployment.
  const { default: sharp } = await import('sharp');
  const buffer = await sharp(image.body, { limitInputPixels: 16_777_216, animated: false })
    .rotate().resize(96, 96, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 75 }).toBuffer();
  return buffer.toString('base64');
}, 'map-thumbnail-v1', ['catalog', 'makers', 'profiles', 'billing'], 86400);

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (id.length > 150) return missing();
    const kind = new URL(request.url).searchParams.get('kind') || 'avatar';
    if (!['avatar', 'badge'].includes(kind)) return missing();
    // The caller chooses a public pin ID, never an arbitrary URL to fetch.
    const data = await getMapData();
    const pin = data.pins.find(item => item.id === id);
    const yacht = data.yachts.find(item => `yacht-${item.index}` === id);
    const source = mapImageSource(pin ? (kind === 'badge' ? pin.badge : pin.avatar) : yacht?.product?.logo);
    if (!source) return missing();
    try {
      const image = await thumbnail(source);
      return new Response(new Uint8Array(Buffer.from(image, 'base64')), { headers: {
        'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400', 'X-Content-Type-Options': 'nosniff',
      } });
    } catch (error) {
      console.error('Map thumbnail unavailable; using original image', { id, kind, error: error instanceof Error ? error.name : 'UnknownError' });
      // Only the stored public image can be used; request parameters never
      // control this destination. Do not cache temporary processing failures.
      return new Response(null, { status: 307, headers: {
        Location: source, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff',
      } });
    }
  } catch {
    return new Response(null, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}

function missing() {
  return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}
