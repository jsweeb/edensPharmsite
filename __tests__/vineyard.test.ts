import { listProducts, getProduct, getInventory } from '../app/lib/vineyard';

describe('Vineyard adapter fallback', () => {
  test('listProducts returns at least one product', async () => {
    const products = await listProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  test('getProduct returns variants', async () => {
    const products = await listProducts();
    const detail = await getProduct(products[0].slug);
    expect(detail).not.toBeNull();
    expect(detail!.variants.length).toBeGreaterThan(0);
  });

  test('getProduct returns null for an unknown slug', async () => {
    expect(await getProduct('does-not-exist')).toBeNull();
  });

  test('getInventory returns availableQty', async () => {
    const products = await listProducts();
    const detail = await getProduct(products[0].slug);
    const inv = await getInventory(detail!.variants[0].id);
    expect(inv).toHaveProperty('availableQty');
    expect(typeof inv.availableQty).toBe('number');
  });
});