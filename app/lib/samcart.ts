import { createHash, timingSafeEqual } from 'crypto';
import { env } from 'process';
import type { CartItem } from '@/app/lib/cart';

/**
 * SamCart API adapter.
 *
 * Provides a helper to create a checkout session. Calls to SamCart are
 * authenticated using a bearer token defined in the SAMCART_API_KEY
 * environment variable. The base URL is defined by SAMCART_BASE_URL.
 */

const BASE_URL = env.SAMCART_BASE_URL ?? '';
const API_KEY = env.SAMCART_API_KEY ?? '';

interface CheckoutParams {
  items: CartItem[];
}

export interface CheckoutResponse {
  url: string;
}

async function fetchSamCart<T>(path: string, body: CheckoutParams): Promise<T> {
  if (!BASE_URL || !API_KEY) {
    // Never send real customers to a fake checkout page.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SamCart is not configured: set SAMCART_BASE_URL and SAMCART_API_KEY');
    }
    // Return a dummy URL for local development
    const ids = body.items.map((i) => i.variantId).join(',');
    return { url: `https://samcart.example/checkout?items=${encodeURIComponent(ids)}` } as T;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SamCart request failed: ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

/**
 * Create a checkout session covering every line in the cart.
 */
export async function createCheckoutSession(
  params: CheckoutParams,
): Promise<CheckoutResponse> {
  return await fetchSamCart<CheckoutResponse>('/checkout-session', params);
}

function digest(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

// Validate the webhook's shared-secret header with a constant-time
// comparison. Confirm against SamCart's docs for your account whether
// it sends a static secret or an HMAC of the body, and switch to
// HMAC-SHA256 over `payload` if so.
export function verifyWebhookSignature(
  signature: string | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  payload: string,
): boolean {
  const secret = env.SAMCART_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  return timingSafeEqual(digest(signature), digest(secret));
}
