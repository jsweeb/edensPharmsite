import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

/**
 * Home page.
 *
 * A moving hero, a ticker of the product lines, the line cards, the launch
 * fragrances and the brand story. Motion is decorative and switches off for
 * visitors who prefer reduced motion (see app/globals.css).
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
  },
  {
    slug: 'elation',
    href: '/products#elation',
    name: 'Elation',
    image: '/images/products/elation-logo.webp',
    alt: 'Elation wordmark in teal over warm amber light',
    description:
      'Adaptogens reimagined as daily luxury tonics. Elation blends herbs like ashwagandha, holy basil and saffron with decadent flavors — powered by our BeneDulce sweetener for functional balance.',
  },
  {
    slug: 'benedulce',
    href: '/products/benedulce',
    name: 'BeneDulce',
    image: '/images/products/benedulce-logo.webp',
    alt: 'BeneDulce script wordmark on deep purple paper',
    description:
      'The world’s first sweetener that is not only neutral but beneficial. Powered by allulose, erythritol, monk fruit, xylitol and collagen peptides, BeneDulce improves upon sugar with real health benefits.',
  },
  {
    slug: 'sanctus-una',
    href: '/products#sanctus-una',
    name: 'Sanctus Unā',
    image: '/images/sanctus.png',
    alt: 'White blossom floating on dark water above the Sanctus Unā script',
    position: 'object-[center_45%]',
    description:
      'Rooted in grass‑fed tallow, Sanctus Unā brings ancient wisdom into modern form. Each balm, salve, butter and solid perfume uses the earth’s simplest, most powerful ingredients.',
  },
  {
    slug: 'callalux',
    href: '/products/callalux',
    name: 'Callalux',
    image: '/images/products/callalux-logo.webp',
    alt: 'Callalux wordmark beneath a sculpted white calla lily',
    description:
      'Small‑batch custard ice cream made with heavy cream, egg yolks and sea salt, sweetened entirely with BeneDulce. Ten flavors inspired by places around the world.',
  },
];

const launchScents = ['Sanctum', 'Redeemed', 'Unbound'];

const headline = ['Nature', 'Refined.', 'Truth', 'Revealed.'];

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section
        className="light-sweep relative -mx-4 -mt-6 h-[72vh] min-h-[420px] max-h-[760px] overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <Image
          src="/images/banner.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="ken-burns object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-earth" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.6),transparent_65%)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center">
          <h1
            id="hero-heading"
            className="glow text-4xl sm:text-5xl md:text-7xl font-cursive text-accent drop-shadow-lg"
          >
            {headline.map((word, i) => (
              <span
                key={word}
                className="page-enter inline-block mr-3"
                style={{ animationDelay: `${150 + i * 180}ms` }}
              >
                {word}
              </span>
            ))}
          </h1>
          <p
            className="page-enter max-w-xl text-lg text-sand/90"
            style={{ animationDelay: '950ms' }}
          >
            Functional nutrition, ancestral skincare and fragrance — crafted with radical
            transparency.
          </p>
          <div className="page-enter flex flex-wrap justify-center gap-3" style={{ animationDelay: '1150ms' }}>
            <Link
              href="/products"
              className="shine rounded-full bg-accent px-6 py-3 font-semibold text-earth transition hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgb(127_255_212/0.5)]"
            >
              Shop the Collection
            </Link>
            <Link
              href="/research-references"
              className="rounded-full border border-sand/70 px-6 py-3 text-sand transition hover:-translate-y-0.5 hover:bg-sand/10"
            >
              See the Research
            </Link>
          </div>
        </div>
        <a
          href="#lines"
          className="float absolute bottom-6 left-1/2 -translate-x-1/2 text-sand/80"
          aria-label="Scroll to product lines"
        >
          <i className="fas fa-chevron-down text-2xl" aria-hidden="true"></i>
        </a>
      </section>

      {/* Ticker */}
      <div className="marquee -mx-4 overflow-hidden border-y border-highlight/50 py-3" aria-hidden="true">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap font-cursive text-2xl text-accent/80">
          {[...productLines, ...productLines].map((line, i) => (
            <span key={i} className="flex items-center gap-10">
              {line.name}
              <span className="text-sand/50">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Introduction */}
      <Reveal as="section" className="mx-auto max-w-3xl space-y-4 text-center">
        <h2 className="text-2xl font-bold md:text-3xl">Welcome to Eden&apos;s Pharm</h2>
        <p className="leading-relaxed">
          At Eden&apos;s Pharm, we restore the integrity of wellness through radical
          transparency, natural elegance and ethical innovation. We believe that food
          is medicine and that nature has already perfected what we need. Our
          products are crafted with purpose, grounded in truth and designed for
          healing from within.
        </p>
      </Reveal>

      {/* Product Lines */}
      <section id="lines" className="scroll-mt-20">
        <Reveal>
          <h2 className="mb-8 text-center font-cursive text-4xl text-accent">Our Product Lines</h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {productLines.map((line, i) => (
            <Reveal key={line.slug} delay={i * 110} className="h-full">
              <Link
                href={line.href}
                aria-label={`Shop ${line.name}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-highlight/70 bg-earth transition duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-[0_12px_40px_-12px_rgb(127_255_212/0.45)]"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={line.image}
                    alt={line.alt}
                    fill
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className={`object-cover transition duration-700 group-hover:scale-110 ${line.position ?? ''}`}
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mb-2 text-lg font-bold">{line.name}</h3>
                  <p className="flex-1 text-sm">{line.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Shop {line.name}
                    <i
                      className="fas fa-arrow-right transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    ></i>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Launch fragrances */}
      <section className="space-y-8">
        <Reveal className="text-center space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-sand/70">Sanctus Unā</p>
          <h2 className="font-cursive text-4xl text-accent">The Launch Collection</h2>
          <p className="mx-auto max-w-2xl text-sm">
            Grass‑fed tallow and beeswax solid perfumes, handcrafted in small batches. Hover a tin
            to open it.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {launchScents.map((scent, i) => {
            const base = `/images/products/fragrance-${scent.toLowerCase()}`;
            return (
              <Reveal key={scent} delay={i * 140}>
                <Link
                  href={`/products/sanctus-una-${scent.toLowerCase()}-fragrance`}
                  aria-label={`${scent} solid perfume, in stock`}
                  className="group block overflow-hidden rounded-xl border border-highlight/70 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-12px_rgb(245_222_179/0.4)]"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={`${base}-closed.webp`}
                      alt={`${scent} solid perfume tin`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <Image
                      src={`${base}-open.webp`}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover opacity-0 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <span className="text-lg font-bold">{scent}</span>
                    <span className="text-sm text-accent">In Stock</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Difference section */}
      <Reveal as="section" className="mx-auto max-w-4xl space-y-4 text-center">
        <h2 className="font-cursive text-4xl text-accent">The Eden’s Pharm Difference</h2>
        <p className="leading-relaxed">
          Where others cut corners with fillers, we build with function. Where others
          aim for neutrality, we design for active benefit. Where others separate
          health and indulgence, we unite them. Eden’s Pharm is more than
          supplements, skincare or hydration — it’s a new standard of wellness:
          delicious, beautiful, ancestral and uncompromising.
        </p>
      </Reveal>
    </div>
  );
}
