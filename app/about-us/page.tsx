import Image from 'next/image';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about the origins of Eden's Pharm, our mission to restore wellness through clean formulations, and the values that guide our craft.",
};

/**
 * About Us page.
 *
 * This page tells the story of how Eden's Pharm came to be—from a home
 * experiment with electrolytes to a full line of products rooted in
 * ancestral wisdom. The content is drawn from the original static site
 * and has been structured with semantic HTML and Tailwind CSS for
 * accessibility and clarity. Only approved images are used.
 */
export default function AboutUsPage() {
  return (
    <article className="space-y-12">
      {/* Hero section */}
      <section className="relative h-64 w-full overflow-hidden rounded">
        <Image
          src="/images/banner.png"
          alt="Eden's Pharm hero banner with flower reflection"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-cursive text-sand drop-shadow-lg">
            About Us
          </h1>
        </div>
      </section>
      {/* Origin story */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold font-cursive text-accent">
          A Return to the Garden. A Leap Forward in Wellness.
        </h2>
        <p className="leading-relaxed">
          Eden’s Pharm began the way many good stories do—with a problem and a
          question.
        </p>
        <h3 className="text-2xl font-semibold mt-4">From Kitchen Counter to Clinical Craft: Our Origin Story</h3>
        <p className="leading-relaxed">
          It started when I began following a ketovore diet. I quickly
          realised I needed a clean electrolyte supplement—but everything on the
          market was either packed with sugar, filled with cheap fillers, or
          had ingredients that interfered with each other. The few that almost
          got it right were prohibitively expensive.
        </p>
        <p className="leading-relaxed">
          So I decided to make my own. I went down a rabbit hole of research,
          testing and daily use until I landed on the Hydrosal: Raw
          formula—a simple, clean electrolyte blend that I still drink every
          day. It became the cornerstone of an entire hydration line.
        </p>
        <p className="leading-relaxed">
          But I couldn’t do it alone. I reached out to my friend—and now
          business partner—Brandon, and together we began formulating
          flavoured versions. Our first attempt? Let’s just say it was a noble
          failure. It tasted okay, but it didn’t meet our standards.
        </p>
        <p className="leading-relaxed">
          We had started off using a commercial sweetener blend that included
          stevia—which led to another rabbit hole. I learned that while stevia
          is generally safe for men, it’s a hormone disruptor for women and has
          even been used traditionally as a contraceptive in the Amazon. That
          wasn’t acceptable.
        </p>
        <p className="leading-relaxed">
          So I created our own: <strong>Benedulce™</strong>, a clean, functional
          sweetener with a 1:1 sugar replacement ratio—powered by allulose,
          monk fruit, erythritol, xylitol and collagen.
        </p>
        <p className="leading-relaxed">
          Once that door opened, I couldn’t stop. I began reading every
          label—from supplements to seasonings—and was shocked at how many
          “health” products were hiding unnecessary or harmful ingredients. That
          realisation gave birth to our <strong>Elation™</strong> line of
          functional adaptogenic supplements and clean culinary blends.
        </p>
        <p className="leading-relaxed">
          Then one day, my sister asked if I could make her a face balm from
          tallow. Challenge accepted. Another rabbit hole. Another revelation.
          The result was our hero skincare product: Renew Balm—and eventually
          the launch of our <strong>Sanctus Unā</strong> line, a reverent return
          to ancestral skincare using grass‑fed tallow and botanicals.
        </p>
        <p className="italic leading-relaxed">
          I never set out to build a wellness company. But now that we have,
          we’re going to do it the right way.
        </p>
        <p className="font-semibold">— Joseph Schwiebert, CEO &amp; Chief Formulator, Eden’s Pharm</p>
      </section>
      {/* Nature meets design */}
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold">Where Nature Meets Design</h3>
        <p className="leading-relaxed">
          We don’t just make products. We make tools for daily restoration.
        </p>
        <p className="leading-relaxed">
          Whether it’s Hydrosal™ electrolytes engineered for functional
          hydration at home and in the field; Elation™ adaptogenic supplements
          designed for hormonal, neurological and energy support; Sanctus Unā
          skincare powered by grass‑fed tallow and regenerative botanicals; or
          our proprietary sweetener Benedulce™, formulated to delight while
          enhancing metabolic health—every product begins with a problem worth
          solving and ends with a formulation worth trusting.
        </p>
      </section>
      {/* Our craft */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Our Craft</h3>
        <p className="leading-relaxed">
          Our process is rigorous but simple:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Use only ingredients that serve a purpose.</li>
          <li>Avoid anything that doesn’t.</li>
          <li>Design formulations that synergise rather than compete.</li>
          <li>Prioritise transparency, sustainability and scientific grounding.</li>
        </ul>
        <p className="leading-relaxed">
          We honour clinical insight, ancestral wisdom and the elegance of
          restraint.
        </p>
      </section>
      {/* Our foundation */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Our Foundation</h3>
        <p className="leading-relaxed">
          Eden’s Pharm is grounded in stewardship. Faith is not just part of
          our story—it’s the root of it. We believe that business is a form
          of ministry, and our responsibility is to serve, not just sell.
        </p>
        <p className="leading-relaxed">
          That means putting people over profit, purpose over trends and
          truth over convenience. We embrace clean design, regenerative
          sourcing and honest communication—because the best medicine is trust.
        </p>
      </section>
      {/* Our community */}
      <section className="space-y-4 mb-8">
        <h3 className="text-2xl font-semibold">Our Community</h3>
        <p className="leading-relaxed">We build for:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Mothers and fathers seeking clean tools for their family’s health</li>
          <li>Homesteaders and healers reclaiming ancestral wisdom</li>
          <li>Athletes, workers and professionals demanding performance without compromise</li>
          <li>Faith‑led consumers who want values and products to align</li>
        </ul>
        <p className="leading-relaxed">
          Eden’s Pharm is not for everyone. But if you’ve ever longed for
          wellness that’s elegant, effective and ethical… you just found home.
        </p>
      </section>
    </article>
  );
}