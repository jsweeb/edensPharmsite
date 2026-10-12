import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { productsForTopic, referencesByTopic, researchReferences } from '@/app/lib/research';

export const metadata: Metadata = {
  title: 'Research References',
  description:
    "The published studies and reviews on the botanicals and nutrients used in Eden's Pharm formulations, grouped by ingredient.",
};

/**
 * Research References page.
 *
 * Lists the papers behind Eden's Pharm formulations, grouped by ingredient,
 * with links to the products that use each ingredient. The data lives in
 * app/lib/research.ts.
 */
export default function ResearchReferencesPage() {
  const groups = referencesByTopic();
  return (
    <article className="space-y-12">
      {/* Hero */}
      <section className="light-sweep relative h-64 w-full overflow-hidden rounded">
        <Image
          src="/images/banner.png"
          alt="Eden's Pharm banner"
          fill
          sizes="100vw"
          className="ken-burns object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-cursive text-sand drop-shadow-lg">
            Research References
          </h1>
        </div>
      </section>
      <section className="space-y-6">
        <h2 className="text-3xl font-bold font-cursive text-accent">
          The Research Behind Our Ingredients
        </h2>
        <p className="leading-relaxed">
          We choose ingredients by reading the literature first. Below are the{' '}
          {researchReferences.length} studies, reviews and other sources we drew on
          when building our formulations, grouped by ingredient. Study types are noted so you
          can see what kind of evidence each one is: many are laboratory or animal studies,
          and their results may not carry over to people.
        </p>
        <nav aria-label="Ingredients">
          <ul className="flex flex-wrap gap-2">
            {groups.map(({ topic }) => (
              <li key={topic.id}>
                <a
                  href={`#${topic.id}`}
                  className="inline-block px-3 py-1 text-sm border border-highlight rounded hover:bg-highlight hover:text-white"
                >
                  {topic.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>
      {groups.map(({ topic, references }) => {
        const products = productsForTopic(topic);
        return (
          <section
            key={topic.id}
            id={topic.id}
            aria-labelledby={`${topic.id}-heading`}
            className="space-y-3 scroll-mt-24"
          >
            <h3 id={`${topic.id}-heading`} className="text-2xl font-cursive text-accent">
              {topic.name}
            </h3>
            {products.length > 0 && (
              <p className="text-sm">
                Found in:{' '}
                {products.map((product, i) => (
                  <React.Fragment key={product.slug}>
                    {i > 0 && ', '}
                    <Link href={`/products/${product.slug}`} className="underline hover:text-accent">
                      {product.name}
                    </Link>
                  </React.Fragment>
                ))}
              </p>
            )}
            <ul className="space-y-3">
              {references.map((ref) => (
                <li key={ref.id} className="border-l-2 border-highlight pl-3">
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline hover:text-sand"
                  >
                    {ref.title}
                  </a>
                  <p className="text-sm">
                    {ref.authors && `${ref.authors.replace(/\.?$/, '.')} `}
                    <em>{ref.source}</em>
                    {ref.year ? `, ${ref.year}.` : '.'}{' '}
                    <span className="inline-block px-2 text-xs border border-highlight rounded">
                      {ref.kind}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <p className="text-sm italic">
        These references are shared for education and transparency. They describe research on
        individual ingredients, not on Eden&apos;s Pharm products, and are not a claim that any
        product diagnoses, treats, cures or prevents any disease. Talk to your healthcare provider
        before starting a new supplement, especially if you are pregnant, nursing, taking
        medication or managing a health condition.
      </p>
    </article>
  );
}
