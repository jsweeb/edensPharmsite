import { cookies } from 'next/headers';

/**
 * Represents an item stored in the user's cart. Each entry is keyed
 * by a specific variant identifier and a quantity. In a real system
 * you would also include product metadata (price, name, etc.) but
 * those values can be looked up at checkout via the variant id.
 */
export interface CartItem {
  variantId: string;
  qty: number;
}

const CART_COOKIE = 'cart';
export const MAX_QTY = 99;
export const MAX_LINES = 20;

/** Thrown when adding a new line would exceed MAX_LINES. */
export class CartFullError extends Error {
  constructor() {
    super(`Cart can hold at most ${MAX_LINES} different items`);
  }
}

function isValidItem(item: unknown): item is CartItem {
  if (!item || typeof item !== 'object') return false;
  const { variantId, qty } = item as Record<string, unknown>;
  return (
    typeof variantId === 'string' &&
    variantId.length > 0 &&
    variantId.length <= 100 &&
    Number.isInteger(qty) &&
    (qty as number) > 0 &&
    (qty as number) <= MAX_QTY
  );
}

/**
 * Parse the JSON cart cookie from the incoming request. If no cart
 * cookie exists, returns an empty array. Cookies are stored as
 * JSON-encoded arrays; malformed entries are dropped.
 */
export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(CART_COOKIE)?.value;
  if (!cookie) return [];
  try {
    const parsed = JSON.parse(cookie);
    if (Array.isArray(parsed)) {
      return parsed.filter(isValidItem).slice(0, MAX_LINES);
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

/**
 * Persist the cart in the response cookies. Uses a path of '/' so
 * the cart is available on all routes. Serialises the cart as JSON.
 */
async function saveCart(cart: CartItem[]): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: CART_COOKIE,
    value: JSON.stringify(cart),
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });
}

/**
 * Add an item to the cart or update its quantity if it already exists.
 * Quantities are capped at MAX_QTY per line. Throws CartFullError if the
 * cart already has MAX_LINES lines. Returns the updated cart contents.
 * Must be called from a route handler or server action.
 */
export async function addToCart(variantId: string, qty: number): Promise<CartItem[]> {
  const current = await getCart();
  const index = current.findIndex((item) => item.variantId === variantId);
  if (index >= 0) {
    current[index].qty = Math.min(current[index].qty + qty, MAX_QTY);
  } else if (current.length < MAX_LINES) {
    current.push({ variantId, qty: Math.min(qty, MAX_QTY) });
  } else {
    throw new CartFullError();
  }
  await saveCart(current);
  return current;
}

/**
 * Remove a single line from the cart.
 */
export async function removeFromCart(variantId: string): Promise<CartItem[]> {
  const next = (await getCart()).filter((item) => item.variantId !== variantId);
  await saveCart(next);
  return next;
}

/**
 * Clear all items from the cart by deleting the cookie.
 */
export async function clearCart(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE);
}
