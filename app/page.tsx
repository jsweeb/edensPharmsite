import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Home page.
 *
 * Presents a hero banner, introductory copy and a grid of product lines. Each
 * card links to its product page, or to its section of the catalog when
 * the line has several products. Only approved images are used. All
 * headings and links are properly structured for accessibility.
 */
const productLines = [
  {
    slug: 'hydrasal',
    href: '/products#hydrasal',
    name: 'Hydrasal',
    image: '/images/hydrasal.png',
    alt: 'Glass of Hydrasal electrolyte drink with lemon and botanicals',
    description:
      "The world's only hydration system sweetened with our Healthy Sweetener System™. Every sip delivers functional electrolytes without blood sugar spikes, plus metabolic, dental and collagen support.",
    button: 'bg-accent text-earth hover:bg-highlight hover:text-white',
  },
  {
    slug: 'elation',
    href: '/products#elation',
    name: 'Elation',
    image: '/images/elation.png',
    alt: 'Swirling pink tonic representing Elation adaptogenic drink',
    description:
      'Adaptogens reimagined as daily luxury tonics. Elation blends herbs like ashwagandha, holy basil and saffron with decadent flavors — powered by our BeneDulce sweetener for functional balance.',
    button: 'bg-highlight text-white hover:bg-accent hover:text-earth',
  },
  {
    slug: 'benedulce',
    href: '/products/benedulce',
    name: 'BeneDulce',
    image: '/images/benedulce.jpg',
    alt: 'Cup filled with BeneDulce crystalline sweetener',
    description:
      'The world’s first sweetener that is not only neutral but beneficial. Powered by allulose, erythritol, monk fruit, xylitol and collagen peptides, BeneDulce improves upon sugar with real health benefits.',
    button: 'bg-accent text-earth hover:bg-highlight hover:text-white',
  },
  {
    slug: 'sanctus-una',
    href: '/products#sanctus-una',
    name: 'Sanctus Una',
    image: '/images/sanctus.png',
    alt: 'White blossom floating on dark water representing Sanctus Una skincare',
    description:
      'Rooted in grass‑fed tallow, Sanctus Una brings ancient wisdom into modern form. Each balm, salve and butter uses the earth’s simplest, most powerful ingredients for ancestral healing.',
    button: 'bg-highlight text-white hover:bg-accent hover:text-earth',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="relative h-64 w-full overflow-hidden" aria-labelledby="hero-heading">
        <Image
          src="/images/banner.png"
          alt="Eden's Pharm banner showing a tranquil floral scene"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1
            id="hero-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-cursive text-accent drop-shadow-md text-center"
          >
            Nature Refined. Truth Revealed.
          </h1>
        </div>
      </section>
      {/* Introduction */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold">Welcome to Eden&apos;s Pharm</h2>
        <p>
          At Eden&apos;s Pharm, we restore the integrity of wellness through radical
          transparency, natural elegance and ethical innovation. We believe that food
          is medicine and that nature has already perfected what we need. Our
          products are crafted with purpose, grounded in truth and designed for
          healing from within.
        </p>
      </section>
      {/* Product Lines */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6">Our Product Lines</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {productLines.map((line) => (
            <div
              key={line.slug}
              className="border border-highlight rounded-lg overflow-hidden bg-earth flex flex-col"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={line.image}
                  alt={line.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold mb-2">{line.name}</h3>
                <p className="flex-1 text-sm">{line.description}</p>
                <Link
                  href={line.href}
                  className={`mt-4 inline-block px-4 py-2 rounded ${line.button}`}
                >
                  Shop {line.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Difference section */}
      <section className="text-center max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl md:text-2xl font-bold">The Eden’s Pharm Difference</h2>
        <p>
          Where others cut corners with fillers, we build with function. Where others
          aim for neutrality, we design for active benefit. Where others separate
          health and indulgence, we unite them. Eden’s Pharm is more than
          supplements, skincare or hydration — it’s a new standard of wellness:
          delicious, beautiful, ancestral and uncompromising.
        </p>
      </section>
    </div>
  );
}
