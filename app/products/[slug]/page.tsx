import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct } from '@/app/lib/vineyard';
import ProductVariantSelector from '@/components/ProductVariantSelector';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Re-fetch product data from Vineyard at most once a minute.
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug).catch(() => null);
  if (!product) {
    return { title: 'Product Not Found' };
  }
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

/**
 * Product detail page.
 *
 * Fetches detailed information for a single product and displays its
 * description, image and variant selector. Inventory is fetched per variant via
 * client-side API calls. If the product is not found, a 404 is thrown.
 */
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    notFound();
  }
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <div className="relative w-full h-64 overflow-hidden rounded">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          sizes="(min-width: 896px) 896px, 100vw"
          className="object-cover"
        />
      </div>
      <p>{product.description}</p>
      <div>
        <h2 className="text-xl font-bold mb-2">Select Variant</h2>
        <ProductVariantSelector variants={product.variants} />
      </div>
    </div>
  );
}
