import type { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

export const metadata: Metadata = {
  title: "Research References",
  description:
    "Browse a selection of academic papers and resources that inform the formulation of Eden's Pharm products.",
};

/**
 * Research References page.
 *
 * Presents a curated list of scholarly articles and resources that
 * underpin Eden's Pharm formulations. Links open in new tabs. Only
 * approved images appear on the page. To keep the page concise, not
 * every reference from the original site is included, but the list
 * structure makes it easy to add more entries.
 */
export default function ResearchReferencesPage() {
  const references: { title: string; url: string }[] = [
    {
      title: 'Effect of Milk Thistle (Silybum marianum) on the Chemoprevention and Treatment of Cancer',
      url: 'https://aacrjournals.org',
    },
    {
      title: 'Journal of the Endocrine Society Abstract',
      url: 'https://academic.oup.com',
    },
    {
      title: 'Journal of Sexual Medicine Home Page',
      url: 'https://academic.oup.com/jsm',
    },
    {
      title: 'Medicinal Uses of Seaweed in Traditional Chinese Medicine',
      url: 'https://books.rsc.org',
    },
    {
      title: 'The Complete Functional Medicine Guide to Organ Meats',
      url: 'https://drwillcole.com',
    },
    {
      title: 'Health Benefits of Kombucha Tea',
      url: 'https://www.ncbi.nlm.nih.gov',
    },
    {
      title: 'Traditional Chinese Medicine for COVID‑19',
      url: 'https://www.ncbi.nlm.nih.gov',
    },
    {
      title: 'A Review of Shilajit: Composition, Properties, and Therapeutic Potential',
      url: 'https://gnanaganga.inflibnet.ac.in',
    },
    {
      title: 'Beneficial Effects of Panax Ginseng on Cognitive Function (Heliyon)',
      url: 'https://www.cell.com',
    },
    {
      title: 'Sexual Medicine Reviews Abstracts',
      url: 'https://academic.oup.com',
    },
  ];
  return (
    <article className="space-y-12">
      {/* Hero */}
      <section className="relative h-64 w-full overflow-hidden rounded">
        <Image
          src="/images/banner.png"
          alt="Eden's Pharm banner"
          fill
          sizes="100vw"
          className="object-cover"
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
          Scientific Backing for Eden’s Pharm Products
        </h2>
        <p className="leading-relaxed">
          At Eden’s Pharm, we believe in radical transparency and efficacy
          grounded in scientific research. Below is a selection of research
          papers and academic references that inform our product formulations
          and support the claims we make about our ingredients and dosages.
        </p>
        <ul className="list-disc list-inside space-y-2">
          {references.map((ref) => (
            <li key={ref.title}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:text-sand"
              >
                {ref.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}