/** Public image links only. Share/view pages cannot be used as map photos. */
export function mapImageSource(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    if (['share.google', 'photos.app.goo.gl', 'docs.google.com'].includes(url.hostname)) return null;
    if (url.hostname === 'drive.google.com' && !['/uc', '/thumbnail'].includes(url.pathname)) return null;
    if (url.hostname === 'pbs.twimg.com') url.pathname = url.pathname.replace(/_(normal|bigger|200x200|400x400)(\.\w+)$/, '_200x200$2');
    if (url.hostname.endsWith('.googleusercontent.com')) url.pathname = url.pathname.replace(/=[sw]\d+[^/]*$/, '=s96');
    return url.href;
  } catch { return null; }
}

/** A source fingerprint lets changed logos bypass the browser's thumbnail cache. */
export function mapThumbnailUrl(id: string, source: string | null | undefined, kind: 'avatar' | 'badge' = 'avatar') {
  const image = mapImageSource(source);
  if (!image) return null;
  let hash = 2166136261;
  for (let index = 0; index < image.length; index++) hash = Math.imul(hash ^ image.charCodeAt(index), 16777619);
  return `/api/map/image/${encodeURIComponent(id)}?kind=${kind}&v=${(hash >>> 0).toString(36)}`;
}
