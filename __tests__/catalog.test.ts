import { catalog, productLines, variantId } from '../app/lib/catalog';

describe('product catalog', () => {
  test('has every product from the Edens Pharm sheet', () => {
    expect(catalog).toHaveLength(35);
  });

  test('slugs are unique and URL-safe', () => {
    const slugs = catalog.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  test('every product has a known line and at least one variant', () => {
    const lines = new Set(productLines.map((l) => l.id));
    for (const p of catalog) {
      expect(lines.has(p.line)).toBe(true);
      expect(p.variants.length).toBeGreaterThan(0);
    }
  });

  test('variant ids are unique across the catalog', () => {
    const ids = catalog.flatMap((p) => p.variants.map((v) => variantId(p.slug, v.label)));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
