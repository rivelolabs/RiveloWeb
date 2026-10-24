"use client";
import { useState } from 'react';

export default function MapPhoto({ name, source }: { name: string; source?: string | null }) {
  const [failedSource, setFailedSource] = useState<string>();
  const showImage = !!source && source !== failedSource;
  return <span className={`ra-product-monogram${showImage ? ' ra-has-photo' : ''}`}>
    {showImage ? /* Map images are already resized and cached by /api/map/image. */
      // eslint-disable-next-line @next/next/no-img-element
      <img src={source} alt="" width={40} height={40} loading="lazy" decoding="async" fetchPriority="low" referrerPolicy="no-referrer" onError={() => setFailedSource(source)}/>
      : name.slice(0, 2).toUpperCase()}
  </span>;
}
