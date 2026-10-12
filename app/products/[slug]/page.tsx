import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getInventory, getProduct } from '@/app/lib/vineyard';
import ProductVariantSelector from '@/components/ProductVariantSelector';
import ProductGallery from '@/components/ProductGallery';
import Reveal from '@/components/Reveal';

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
  // Mark which options can be bought so the picker can label the rest and
  // open on an in-stock option. Live stock is still re-checked client-side.
  const variants = await Promise.all(
    product.variants.map(async ({ id, label, preorderAllowed }) => {
      const inv = await getInventory(id).catch(() => null);
      // Unknown (lookup failed) stays undefined so the option isn't mislabelled.
      const inStock = inv ? inv.availableQty > 0 || inv.preorderAllowed : undefined;
      return { id, label, preorderAllowed, inStock };
    }),
  );
  const variantsWithIngredients = product.variants.filter((v) => v.ingredients?.length);
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <ProductGallery images={[product.image, ...(product.gallery ?? [])]} name={product.name} />
        <div className="space-y-6">
          <h1 className="font-cursive text-5xl text-accent">{product.name}</h1>
          <p className="leading-relaxed">{product.description}</p>
          <div>
            <h2 className="text-xl font-bold mb-2">Select {optionName}</h2>
            <ProductVariantSelector
              variants={variants}
              optionName={optionName}
            />
          </div>
        </div>
      </div>
      {(product.ingredients?.length || variantsWithIngredients.length > 0) && (
        <Reveal as="section" className="space-y-4">
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
        </Reveal>
      )}
    </div>
  );
}
