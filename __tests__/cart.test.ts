/**
 * Security regression tests for the cookie-backed cart. The cart cookie is
 * client-controlled, so tampered values must never reach checkout.
 */
const store = new Map<string, string>();

jest.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => (store.has(name) ? { name, value: store.get(name)! } : undefined),
    set: ({ name, value }: { name: string; value: string }) => store.set(name, value),
    delete: (name: string) => store.delete(name),
  }),
}));

import { addToCart, CartFullError, getCart, MAX_LINES, MAX_QTY } from '../app/lib/cart';

describe('cart cookie hardening', () => {
  beforeEach(() => store.clear());

  test('drops malformed or malicious entries from a tampered cookie', async () => {
    store.set(
      'cart',
      JSON.stringify([
        { variantId: 'ok', qty: 2 },
        { variantId: 'negative', qty: -5 },
        { variantId: 'huge', qty: 1e9 },
        { variantId: 'fraction', qty: 1.5 },
        { variantId: '', qty: 1 },
        { variantId: 'x'.repeat(500), qty: 1 },
        { variantId: { $ne: null }, qty: 1 },
        'not-an-object',
      ]),
    );
    expect(await getCart()).toEqual([{ variantId: 'ok', qty: 2 }]);
  });

  test('ignores a cookie that is not valid JSON', async () => {
    store.set('cart', '<script>alert(1)</script>');
    expect(await getCart()).toEqual([]);
  });

  test('caps quantity per line', async () => {
    await addToCart('a', MAX_QTY);
    expect(await addToCart('a', 10)).toEqual([{ variantId: 'a', qty: MAX_QTY }]);
  });

  test('refuses new lines once the cart is full', async () => {
    for (let i = 0; i < MAX_LINES; i++) await addToCart(`v${i}`, 1);
    await expect(addToCart('one-too-many', 1)).rejects.toBeInstanceOf(CartFullError);
    expect(await getCart()).toHaveLength(MAX_LINES);
  });
});
