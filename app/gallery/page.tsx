import type { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse photos of Eden's Pharm products and the natural inspirations that shape them.",
};

/**
 * Gallery page.
 *
 * Displays a simple grid of product and brand images. Only approved
 * hero images are used. Images are sized responsively using
 * next/image for optimal performance.
 */
export default function GalleryPage() {
  const items = [
    { src: '/images/hydrasal.png', alt: 'Hydrasal purple drink in glass' },
    { src: '/images/elation.png', alt: 'Elation pink drink with botanical accents' },
    { src: '/images/benedulce.jpg', alt: 'BeneDulce crystalline sweetener' },
    { src: '/images/sanctus.png', alt: 'Sanctus Una white blossom on water' },
    { src: '/images/banner.png', alt: "Eden's Pharm brand banner with flower reflection" },
  ];
  return (
    <article className="space-y-12">
      {/* Hero */}
      <section className="relative h-64 w-full overflow-hidden rounded">
        <Image
          src="/images/banner.png"
          alt="Eden's Pharm gallery banner"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-cursive text-sand drop-shadow-lg">
            Gallery
          </h1>
        </div>
      </section>
      <section className="space-y-6">
        <header className="text-center space-y-4">
          <h2 className="text-3xl font-bold font-cursive text-accent">
            A Glimpse Into Our World
          </h2>
          <p className="leading-relaxed max-w-2xl mx-auto">
            Browse photos of our products and the natural inspirations that shape
            them. Each image reflects the beauty, purity and care that goes into
            everything we create.
          </p>
        </header>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.src} className="w-full h-64 relative overflow-hidden rounded">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}