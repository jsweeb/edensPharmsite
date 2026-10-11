import type { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

export const metadata: Metadata = {
  title: "Mission & Values",
  description:
    "Explore the mission and core values that guide Eden's Pharm in crafting transparent, purpose‑driven wellness products.",
};

/**
 * Mission and Values page.
 *
 * Reflects the guiding principles of Eden's Pharm. The content is
 * adapted from the original static site and structured semantically.
 */
export default function MissionValuesPage() {
  return (
    <article className="space-y-12">
      {/* Hero */}
      <section className="relative h-64 w-full overflow-hidden rounded">
        <Image
          src="/images/banner.png"
          alt="Eden's Pharm banner with flower reflection"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-cursive text-sand drop-shadow-lg">
            Our Mission &amp; Values
          </h1>
        </div>
      </section>
      <section className="space-y-6">
        <h2 className="text-3xl font-bold font-cursive text-accent">
          Rooted in Nature. Guided by Integrity. Designed for Real Life.
        </h2>
        <p className="leading-relaxed">
          At Eden’s Pharm, our mission is to restore the connection between people
          and the healing power of creation. We believe that true wellness is not
          built in laboratories or trend cycles—but in tradition, transparency
          and intentional design.
        </p>
        <p className="leading-relaxed">
          We are here to offer more than products. We are building a movement—one
          grounded in stewardship, truth and the elegant simplicity of nature.
        </p>
      </section>
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold">Our Mission</h3>
        <p className="leading-relaxed">
          To create effective, honest and beautiful wellness solutions by
          returning to nature’s original pharmacy. We seek to empower individuals
          and families through products that are:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Scientifically informed</li>
          <li>Traditionally rooted</li>
          <li>Cleanly formulated</li>
          <li>Accessible without compromise</li>
        </ul>
        <p className="leading-relaxed">
          Whether it’s hydration, skincare, supplements or sugar‑free
          alternatives, we honour the body’s design and the earth’s
          provisions—crafting each product to serve a higher standard of care.
        </p>
      </section>
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold">Our Core Values</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-xl font-semibold">1. Truth‑Based Formulation</h4>
            <p className="leading-relaxed">
              No gimmicks. No filler. No synthetic tricks. Every ingredient we
              use must have a real function, a traceable origin and a clinical
              or traditional rationale for inclusion.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold">2. Stewardship Over Waste</h4>
            <p className="leading-relaxed">
              We minimise waste and maximise purpose in every phase—from
              sourcing regenerative tallow for our skincare to using recyclable
              packaging and bulk‑friendly formats. Eden’s Pharm is as much
              about ethical production as it is about product performance.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold">3. Care That’s Meant to Be Shared</h4>
            <p className="leading-relaxed">
              Our products are built to serve real families, not just idealised
              lifestyles. From our Hydrosal™ electrolyte blends for crews, to
              Sanctus Unā skincare for mindful self‑care, we design with
              community in mind—not ego.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold">4. Science Meets Soul</h4>
            <p className="leading-relaxed">
              We blend the best of clinical science, ancestral wisdom and
              modern design to create formulations that work synergistically
              with the body—not against it. We balance data and discernment.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold">5. Faith‑Inspired Integrity</h4>
            <p className="leading-relaxed">
              Our decisions are rooted in a belief that we are stewards, not
              owners of our resources or mission. Eden’s Pharm is a business,
              yes—but more importantly, it’s a calling. Our values come first.
              Always.
            </p>
          </div>
        </div>
      </section>
      <section className="space-y-4 mb-8">
        <h3 className="text-2xl font-semibold">A Brand You Can Trust</h3>
        <p className="leading-relaxed">
          From our sweetener Benedulce™, to our Chai Rose Estrogen Support Drink,
          and our Sanctus Unā skincare line, Eden’s Pharm reflects a cohesive,
          high‑integrity approach to health—inside and out. We’re not here to
          keep up with trends. We’re here to redefine what clean, elegant and
          ethical looks like—one formulation at a time.
        </p>
      </section>
    </article>
  );
}