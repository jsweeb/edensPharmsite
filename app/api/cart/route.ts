import { NextRequest, NextResponse } from 'next/server';
import { addToCart, CartFullError, MAX_QTY } from '@/app/lib/cart';

/**
 * API handler for cart operations. Currently supports POST to add
 * items to the cart. Expects a JSON payload with variantId (string)
 * and qty (positive integer). Responds with the updated cart. Cookies
 * are managed via the cart helper functions.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const { variantId, qty } = (body ?? {}) as { variantId?: unknown; qty?: unknown };
  if (
    typeof variantId !== 'string' ||
    variantId.length === 0 ||
    variantId.length > 100 ||
    !Number.isInteger(qty) ||
    (qty as number) < 1 ||
    (qty as number) > MAX_QTY
  ) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  try {
    const cart = await addToCart(variantId, qty as number);
    return NextResponse.json({ cart });
  } catch (err) {
    if (err instanceof CartFullError) {
      return NextResponse.json({ error: err.message, code: 'cart_full' }, { status: 409 });
    }
    console.error('Failed to update cart', err);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
