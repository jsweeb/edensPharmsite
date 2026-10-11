import type { MetadataRoute } from 'next';
import { listBlogPosts } from '@/app/lib/blog';
import { listProducts } from '@/app/lib/vineyard';
import { SITE_URL } from '@/app/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    '',
    '/products',
    '/about-us',
    '/mission-values',
    '/research-references',
    '/contact',
    '/blog',
    '/gallery',
  ];
  const products = await listProducts().catch(() => []);
  const paths = [
    ...staticPaths,
    ...products.map((p) => `/products/${p.slug}`),
    ...listBlogPosts().map((post) => `/blog/${post.slug}`),
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
