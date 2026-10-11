import type { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';
import ContactForm from '@/components/ContactForm';
import { CONTACT_EMAIL } from '@/app/lib/site';

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Eden's Pharm team for questions about products, orders or general inquiries.",
};

/**
 * Contact page.
 *
 * Presents a contact form alongside company contact information. The
 * form hands off to the visitor's email client (see ContactForm).
 */
export default function ContactPage() {
  return (
    <article className="space-y-12">
      {/* Hero */}
      <section className="relative h-64 w-full overflow-hidden rounded">
        <Image
          src="/images/sanctus.png"
          alt="White blossom on dark water"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-cursive text-sand drop-shadow-lg">
            Contact Us
          </h1>
        </div>
      </section>
      <section className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h2 className="text-3xl font-bold font-cursive text-accent">
            We’d Love to Hear From You
          </h2>
          <p className="leading-relaxed">
            Have a question about our products, your order, or just want to say
            hello? Fill out the form below or reach us using the information
            provided. Our team strives to respond within 1–2 business days.
          </p>
        </header>
        <div className="grid md:grid-cols-2 gap-8">
          <ContactForm email={CONTACT_EMAIL} />
          {/* Contact details */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Contact Information</h3>
            <p className="flex items-center space-x-2">
              <i className="fas fa-envelope" aria-hidden="true"></i>
              <span>
                Email:{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline text-accent">
                  {CONTACT_EMAIL}
                </a>
              </span>
            </p>
            <p className="flex items-center space-x-2">
              <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
              <span>Address: Olathe, Kansas, USA</span>
            </p>
            <p>Our hours of operation are Monday through Friday, 9 am – 5 pm Central Time.</p>
          </div>
        </div>
      </section>
    </article>
  );
}