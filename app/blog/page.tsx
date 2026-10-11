import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { listBlogPosts } from '@/app/lib/blog';
import React from 'react';

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore stories behind our products, deep dives into our ingredients and musings on wellness.",
};

/**
 * Blog listing page.
 *
 * Fetches all posts via listBlogPosts() and renders them in a responsive grid.
 */
export default async function BlogPage() {
  const posts = listBlogPosts();
  return (
    <article className="space-y-12">
      {/* Hero */}
      <section className="relative h-64 w-full overflow-hidden rounded">
        <Image
          src="/images/banner.png"
          alt="Eden's Pharm blog banner"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-cursive text-sand drop-shadow-lg">
            Blog
          </h1>
        </div>
      </section>
      <section className="space-y-6">
          <header className="text-center space-y-4">
            <h2 className="text-3xl font-bold font-cursive text-accent">
              Insights &amp; Inspiration
            </h2>
            <p className="leading-relaxed max-w-2xl mx-auto">
              Explore stories behind our products, deep dives into our
              ingredients and musings on how nature and science meet. We share
              research, recipes and reflections to help you on your wellness
              journey.
            </p>
          </header>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="border border-highlight rounded overflow-hidden bg-earth flex flex-col"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-sm flex-1 mb-4">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-auto inline-block px-3 py-2 bg-accent text-earth rounded hover:bg-highlight hover:text-white"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
      </section>
    </article>
  );
}