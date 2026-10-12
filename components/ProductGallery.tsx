"use client";

import Image from 'next/image';
import React, { useState } from 'react';

/**
 * Product photo viewer: a main image that crossfades between photos, with
 * thumbnails when there is more than one. The image zooms gently on hover.
 */
export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="space-y-3">
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-highlight/70">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === active ? name : ''}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={`object-cover transition duration-700 group-hover:scale-105 ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      {images.length > 1 && (
        <div className="flex gap-3" role="group" aria-label={`${name} photos`}>
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1} of ${images.length}`}
              aria-pressed={i === active}
              className={`relative h-16 w-20 overflow-hidden rounded-md border-2 transition ${
                i === active ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
