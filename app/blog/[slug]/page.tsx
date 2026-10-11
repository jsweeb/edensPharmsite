import { getBlogPost, listBlogPosts } from '@/app/lib/blog';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import React from 'react';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static parameters for all blog posts. This enables
 * pre-rendering of each post at build time. When new posts are added
 * to the list, they will automatically become static routes.
 */
export async function generateStaticParams() {
  return listBlogPosts().map((post) => ({ slug: post.slug }));
}

/**
 * Provide per-page metadata based on the post content. Falls back
 * gracefully if a post cannot be found.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.image,
          alt: post.title,
        },
      ],
    },
  };
}

export const dynamicParams = false;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    notFound();
  }
  return (
    <article className="space-y-8">
      {/* Hero */}
      <section className="relative h-64 w-full overflow-hidden rounded">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-cursive text-sand drop-shadow-lg text-center px-4">
            {post.title}
          </h1>
        </div>
      </section>
      <section className="max-w-3xl mx-auto space-y-4 leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }} />
      </section>
    </article>
  );
}

/**
 * A very minimal markdown converter for the subset of Markdown used in
 * our sample posts. Converts headings and line breaks into HTML. For
 * more complex content you might use a library like remark or
 * unified/rehype, but those add significant bundle size.
 */
function markdownToHtml(md: string): string {
  return md
    .split('\n')
    .map((line) => {
      if (line.startsWith('### ')) {
        return `<h3>${line.substring(4)}</h3>`;
      }
      if (line.startsWith('## ')) {
        return `<h2>${line.substring(3)}</h2>`;
      }
      if (line.startsWith('# ')) {
        return `<h1>${line.substring(2)}</h1>`;
      }
      return `<p>${line}</p>`;
    })
    .join('');
}