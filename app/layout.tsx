import '@/app/globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';
import React from 'react';
import { SITE_URL } from '@/app/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Eden's Pharm",
    template: "%s | Eden's Pharm",
  },
  description:
    "Eden's Pharm restores the integrity of wellness through radical transparency, natural elegance and ethical innovation.",
  openGraph: {
    title: "Eden's Pharm",
    description:
      "Discover wellness products crafted with purpose, grounded in truth and designed for healing from within.",
    url: SITE_URL,
    siteName: "Eden's Pharm",
    images: [
      {
        url: "/images/banner.png",
        alt: "Eden's Pharm hero banner",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Eden's Pharm",
    description:
      "Discover wellness products crafted with purpose, grounded in truth and designed for healing from within.",
    site: '@edenspharm',
    creator: '@edenspharm',
    images: ['/images/banner.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Lato:ital,wght@1,500&display=swap"
          rel="stylesheet"
        />
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
        />
      </head>
      <body className="bg-earth text-sand flex flex-col min-h-screen">
        {/* Skip link for screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only absolute left-0 top-0 p-2 bg-accent text-earth"
        >
          Skip to main content
        </a>
        <NavBar />
        <main id="main-content" className="flex-1 container mx-auto px-4 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}