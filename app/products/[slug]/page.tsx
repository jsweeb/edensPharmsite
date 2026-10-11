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
 * description, image, variant selector and ingredients. Inventory is fetched per variant via
 * client-side API calls. If the product is not found, a 404 is thrown.
 */
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    notFound();
  }
  const optionName = product.optionName ?? 'Variant';
  const variantsWithIngredients = product.variants.filter((v) => v.ingredients?.length);
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
        <h2 className="text-xl font-bold mb-2">Select {optionName}</h2>
        <ProductVariantSelector
          variants={product.variants.map(({ id, label, preorderAllowed }) => ({ id, label, preorderAllowed }))}
          optionName={optionName}
        />
      </div>
      {(product.ingredients?.length || variantsWithIngredients.length > 0) && (
        <section className="space-y-4" aria-labelledby="ingredients-heading">
          <h2 id="ingredients-heading" className="text-xl font-bold">
            Ingredients
          </h2>
          {variantsWithIngredients.length > 0 ? (
            <dl className="space-y-3">
              {variantsWithIngredients.map((v) => (
                <div key={v.id}>
                  <dt className="font-semibold">{v.label}</dt>
                  <dd className="text-sm">{v.ingredients!.join(', ')}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm">{product.ingredients!.join(', ')}</p>
          )}
        </section>
      )}
    </div>
  );
}
