jest.mock('../app/lib/vineyard', () => ({ getInventory: jest.fn() }));

import { canPurchase, reconcileCart } from '../app/lib/stock';
import { getInventory } from '../app/lib/vineyard';

const stock: Record<string, { availableQty: number; preorderAllowed: boolean }> = {
  plenty: { availableQty: 10, preorderAllowed: false },
  two: { availableQty: 2, preorderAllowed: false },
  none: { availableQty: 0, preorderAllowed: false },
  preorder: { availableQty: 0, preorderAllowed: true },
};

beforeEach(() => {
  jest.mocked(getInventory).mockImplementation(async (id) => stock[id] ?? stock.none);
});

describe('stock rules', () => {
  test('canPurchase compares quantity to stock unless preorder', () => {
    expect(canPurchase(stock.two, 2)).toBe(true);
    expect(canPurchase(stock.two, 3)).toBe(false);
    expect(canPurchase(stock.none, 1)).toBe(false);
    expect(canPurchase(stock.preorder, 50)).toBe(true);
  });

  test('reconcileCart drops out-of-stock lines and trims quantities', async () => {
    const result = await reconcileCart([
      { variantId: 'plenty', qty: 3 },
      { variantId: 'two', qty: 5 },
      { variantId: 'none', qty: 1 },
      { variantId: 'preorder', qty: 4 },
    ]);
    expect(result.changed).toBe(true);
    expect(result.cart).toEqual([
      { variantId: 'plenty', qty: 3 },
      { variantId: 'two', qty: 2 },
      { variantId: 'preorder', qty: 4 },
    ]);
  });

  test('reconcileCart reports no change for a valid cart', async () => {
    const cart = [{ variantId: 'plenty', qty: 1 }];
    expect(await reconcileCart(cart)).toEqual({ cart, changed: false });
  });

  test('reconcileCart fails closed when stock cannot be checked', async () => {
    jest.mocked(getInventory).mockRejectedValue(new Error('Vineyard down'));
    await expect(reconcileCart([{ variantId: 'plenty', qty: 1 }])).rejects.toThrow('Vineyard down');
  });
});
