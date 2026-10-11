import { NextRequest, NextResponse } from 'next/server';
import { addToCart, CartFullError, getCart, MAX_QTY } from '@/app/lib/cart';
import { canPurchase } from '@/app/lib/stock';
import { getInventory } from '@/app/lib/vineyard';

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
  // Never let an out-of-stock (or unknown) variant into the cart, or more
  // units than are in stock, even if the client bypasses the disabled button.
  try {
    const inv = await getInventory(variantId);
    if (!canPurchase(inv, 1)) {
      return NextResponse.json({ error: 'This item is out of stock', code: 'out_of_stock' }, { status: 409 });
    }
    const inCart = (await getCart()).find((item) => item.variantId === variantId)?.qty ?? 0;
    if (!canPurchase(inv, inCart + (qty as number))) {
      return NextResponse.json(
        {
          error: `Only ${inv.availableQty} available`,
          code: 'insufficient_stock',
          available: Math.max(inv.availableQty - inCart, 0),
        },
        { status: 409 },
      );
    }
  } catch (err) {
    console.error('Failed to check stock', err);
    return NextResponse.json({ error: 'Could not check stock' }, { status: 503 });
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
