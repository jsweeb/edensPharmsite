"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface Variant {
  id: string;
  label: string;
  preorderAllowed: boolean;
  /** Server-side stock snapshot, used to label options and pick the default. */
  inStock?: boolean;
}

interface InventoryInfo {
  availableQty: number;
  preorderAllowed: boolean;
}

interface Props {
  variants: Variant[];
  /** Label for the picker, e.g. "Flavor". */
  optionName?: string;
}

const MAX_QTY = 99;

type CartStatus = 'idle' | 'adding' | 'added' | 'full' | 'out_of_stock' | 'error';

export default function ProductVariantSelector({ variants, optionName = 'Variant' }: Props) {
  const [selectedId, setSelectedId] = useState(
    (variants.find((v) => v.inStock) ?? variants[0])?.id ?? '',
  );
  // Inventory results are tagged with the variant they belong to so a stale
  // response is never shown for a newly selected variant.
  const [result, setResult] = useState<{ variantId: string; info: InventoryInfo | null } | null>(null);
  const [qty, setQty] = useState(1);
  const [cartStatus, setCartStatus] = useState<CartStatus>('idle');

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/vineyard/inventory/${encodeURIComponent(selectedId)}`);
        if (!res.ok) throw new Error(`Inventory request failed: ${res.status}`);
        const data: InventoryInfo = await res.json();
        if (!cancelled) setResult({ variantId: selectedId, info: data });
      } catch (err) {
        console.error(err);
        if (!cancelled) setResult({ variantId: selectedId, info: null });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const handleAdd = async () => {
    setCartStatus('adding');
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId: selectedId, qty }),
      });
      if (res.status === 409) {
        const body = await res.json().catch(() => ({}));
        setCartStatus(body.code === 'out_of_stock' ? 'out_of_stock' : 'full');
        return;
      }
      if (!res.ok) throw new Error(`Cart request failed: ${res.status}`);
      setCartStatus('added');
    } catch (err) {
      console.error('Failed to add to cart', err);
      setCartStatus('error');
    }
  };

  const current = result?.variantId === selectedId ? result : null;
  const inventory = current?.info ?? null;
  const inventoryError = !!current && !current.info;

  let stockMessage = 'Loading…';
  if (inventoryError) {
    stockMessage = 'Stock information unavailable';
  } else if (inventory) {
    if (inventory.availableQty > 0) {
      stockMessage = inventory.availableQty <= 5 ? `Only ${inventory.availableQty} left` : 'In Stock';
    } else if (inventory.preorderAllowed) {
      stockMessage = 'Pre‑Order Available';
    } else {
      stockMessage = 'Out of Stock';
    }
  }

  const canBuy = !!inventory && (inventory.availableQty > 0 || inventory.preorderAllowed);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="variant" className="block mb-1 font-bold">
          {optionName}
        </label>
        <select
          id="variant"
          className="w-full bg-earth border border-highlight p-2 rounded"
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setCartStatus('idle');
          }}
        >
          {variants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.inStock === false ? `${v.label} (Out of Stock)` : v.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="quantity" className="block mb-1 font-bold">
          Quantity
        </label>
        <input
          id="quantity"
          type="number"
          inputMode="numeric"
          min={1}
          max={MAX_QTY}
          value={qty}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            setQty(Number.isNaN(n) ? 1 : Math.min(Math.max(n, 1), MAX_QTY));
          }}
          className="w-full bg-earth border border-highlight p-2 rounded"
        />
      </div>
      <p className="font-semibold" data-testid="stock-message" aria-live="polite">
        {stockMessage}
      </p>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!canBuy || cartStatus === 'adding'}
        className="px-4 py-2 rounded bg-accent text-earth hover:bg-highlight hover:text-white disabled:opacity-50 disabled:hover:bg-accent disabled:hover:text-earth"
      >
        {inventory && inventory.availableQty === 0 && inventory.preorderAllowed
          ? 'Pre‑Order'
          : 'Add to Cart'}
      </button>
      <p role="status" className="min-h-[1.5rem]">
        {cartStatus === 'added' && (
          <>
            Added to your cart.{' '}
            <Link href="/checkout" className="underline text-accent">
              View cart &amp; checkout
            </Link>
          </>
        )}
        {cartStatus === 'full' && (
          <>
            Your cart is full. Please{' '}
            <Link href="/checkout" className="underline text-accent">
              check out or remove an item
            </Link>{' '}
            first.
          </>
        )}
        {cartStatus === 'out_of_stock' && 'Sorry, that option just went out of stock.'}
        {cartStatus === 'error' && 'Sorry, we couldn’t add that to your cart. Please try again.'}
      </p>
    </div>
  );
}
