import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { listProducts, getProduct, getInventory, type ProductSummary } from '@/app/lib/vineyard';
import { productLines } from '@/app/lib/catalog';

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Shop Hydrasal electrolytes, Elation adaptogenic tonics, BeneDulce sweetener, Sanctus Unā tallow skincare and fragrance, and Callalux ice cream.',
};

// Re-fetch catalog and stock from Vineyard at most once a minute.
export const revalidate = 60;

type ProductWithStatus = ProductSummary & { status: string };

async function withStatus(product: ProductSummary): Promise<ProductWithStatus> {
  try {
    const detail = await getProduct(product.slug);
    if (!detail) throw new Error(`Product ${product.slug} not found`);
    const inventories = await Promise.all(detail.variants.map((v) => getInventory(v.id)));
    const totalAvailable = inventories.reduce((sum, inv) => sum + inv.availableQty, 0);
    const anyPreorder = inventories.some((inv) => inv.preorderAllowed);
    let status: string;
    if (totalAvailable > 0) {
      status = 'In Stock';
    } else if (anyPreorder) {
      status = 'Pre‑Order Available';
    } else {
      status = 'Out of Stock';
    }
    return { ...product, status };
  } catch {
    return { ...product, status: 'Unavailable' };
  }
}

/**
 * Products listing page.
 *
 * Fetches product summaries from Vineyard and displays them grouped by
 * product line. Each card links to a dedicated product detail page. When
 * Vineyard is not configured the adapter falls back to the local catalog.
 */
export default async function ProductsPage() {
  const products = await Promise.all((await listProducts()).map(withStatus));
  const knownLines = new Set<string>(productLines.map((l) => l.id));
  const sections = [
    ...productLines.map((line) => ({
      id: line.id,
      name: line.name,
      tagline: line.tagline,
      products: products.filter((p) => p.line === line.id),
    })),
    {
      id: 'more',
      name: 'More Products',
      tagline: '',
      products: products.filter((p) => !p.line || !knownLines.has(p.line)),
    },
  ].filter((section) => section.products.length > 0);

  return (
    <div className="space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Products</h1>
        <nav aria-label="Product lines">
          <ul className="flex flex-wrap justify-center gap-3">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-block px-3 py-1 border border-highlight rounded hover:bg-highlight hover:text-white"
                >
                  {section.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {sections.map((section) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="space-y-4 scroll-mt-4">
          <div className="text-center">
            <h2 id={`${section.id}-heading`} className="text-2xl md:text-3xl font-cursive text-accent">
              {section.name}
            </h2>
            {section.tagline && <p className="text-sm">{section.tagline}</p>}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {section.products.map((product) => (
              <div
                key={product.id}
                className="border border-highlight rounded-lg overflow-hidden bg-earth flex flex-col"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                  <span className="text-sm font-semibold text-accent mb-2">{product.status}</span>
                  <p className="flex-1 text-sm mb-4">{product.description}</p>
                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-auto inline-block px-4 py-2 bg-accent text-earth rounded hover:bg-highlight hover:text-white"
                  >
                    View Details<span className="sr-only"> for {product.name}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
