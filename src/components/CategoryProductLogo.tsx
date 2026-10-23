"use client";

import Image from "next/image";
import { useState } from "react";

export default function CategoryProductLogo({ name, logo, image }: { name: string; logo?: string; image?: string }) {
  const [failedSource, setFailedSource] = useState<string>();
  const source = logo || image;

  return <span className="ct-product-logo">
    {source && failedSource !== source ? <Image
      src={source}
      alt={`${name} ${logo ? "logo" : "preview"}`}
      width={56}
      height={56}
      unoptimized={source.startsWith("http")}
      onError={() => setFailedSource(source)}
    /> : <span aria-hidden="true">{name.trim().slice(0, 1).toUpperCase() || "•"}</span>}
  </span>;
}
