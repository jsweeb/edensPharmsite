import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <article className="text-center space-y-4 py-16">
      <h1 className="text-4xl font-cursive text-accent">Page Not Found</h1>
      <p>Sorry, we couldn&apos;t find the page you were looking for.</p>
      <p>
        <Link href="/" className="underline text-accent">
          Return home
        </Link>{' '}
        or{' '}
        <Link href="/products" className="underline text-accent">
          browse our products
        </Link>
        .
      </p>
    </article>
  );
}
