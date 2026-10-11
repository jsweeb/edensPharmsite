import Link from 'next/link';
import { getCart, clearCart, removeFromCart } from '@/app/lib/cart';
import { createCheckoutSession } from '@/app/lib/samcart';
import { listProducts, getProduct } from '@/app/lib/vineyard';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Review your cart and proceed to secure checkout.',
  robots: { index: false },
};

/**
 * Server action to process checkout. Reads the current cart, sends every
 * line to SamCart to create a session and then redirects the user to the
 * SamCart URL. If the cart is empty, it simply returns.
 */
async function processCheckout() {
  'use server';
  const cart = await getCart();
  if (cart.length === 0) {
    return;
  }
  let url: string | undefined;
  try {
    const session = await createCheckoutSession({ items: cart });
    if (session && typeof session.url === 'string') {
      url = session.url;
    }
  } catch (err) {
    console.error('Checkout failed', err);
  }
  // redirect() works by throwing, so it must run outside the try/catch.
  if (!url) {
    redirect('/checkout?error=1');
  }
  await clearCart();
  redirect(url);
}

async function removeItem(formData: FormData) {
  'use server';
  const variantId = formData.get('variantId');
  if (typeof variantId === 'string') {
    await removeFromCart(variantId);
  }
  revalidatePath('/checkout');
}

/**
 * Map variant ids to "Product — Variant" labels for display. Falls back to
 * the raw id if the catalog can't be reached.
 */
async function getVariantLabels(): Promise<Map<string, string>> {
  const labels = new Map<string, string>();
  try {
    const products = await listProducts();
    const details = await Promise.all(products.map((p) => getProduct(p.slug)));
    for (const detail of details) {
      if (!detail) continue;
      for (const v of detail.variants) {
        labels.set(v.id, `${detail.name} — ${v.label}`);
      }
    }
  } catch (err) {
    console.error('Failed to load variant labels', err);
  }
  return labels;
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [cart, labels, { error }] = await Promise.all([getCart(), getVariantLabels(), searchParams]);
  return (
    <article className="space-y-8">
      <h1 className="text-3xl font-bold text-center">Checkout</h1>
      {error && (
        <p role="alert" className="max-w-md mx-auto border border-red-400 rounded p-3 text-center">
          We couldn&apos;t start checkout just now. Please try again in a moment.
        </p>
      )}
      {cart.length === 0 ? (
        <p className="text-center">
          Your cart is empty.{' '}
          <Link href="/products" className="underline text-accent">
            Browse products
          </Link>
          .
        </p>
      ) : (
        <div className="max-w-md mx-auto space-y-4">
          <ul className="space-y-2">
            {cart.map((item) => (
              <li
                key={item.variantId}
                className="flex items-center justify-between gap-4 border-b border-highlight py-2"
              >
                <span>{labels.get(item.variantId) ?? item.variantId}</span>
                <span className="flex items-center gap-4">
                  <span>Qty: {item.qty}</span>
                  <form action={removeItem}>
                    <input type="hidden" name="variantId" value={item.variantId} />
                    <button type="submit" className="text-sm underline hover:text-accent">
                      Remove
                    </button>
                  </form>
                </span>
              </li>
            ))}
          </ul>
          <form action={processCheckout}>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-accent text-earth rounded hover:bg-highlight hover:text-white"
            >
              Proceed to Checkout
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
