import { catalog, productLines, variantId } from '../app/lib/catalog';

describe('product catalog', () => {
  test('has every product from the Edens Pharm IFCR sheet', () => {
    expect(catalog).toHaveLength(40);
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

  test('only the launch lineup is in stock', () => {
    const inStock = catalog.flatMap((p) => p.variants.filter((v) => v.available).map((v) => `${p.name}: ${v.label}`));
    const sprays = ['EDC', 'EDT', 'EDP', 'Parfum', 'Extract'];
    expect(inStock.sort()).toEqual(
      [
        'Hydrasal: Raw',
        'Sanctum Fragrance: Solid – Extract',
        'Redeemed Fragrance: Solid – Extract',
        'Unbound Fragrance: Solid – Extract',
        ...sprays.map((c) => `Redeemed Fragrance: Spray – ${c}`),
        ...sprays.map((c) => `Unbound Fragrance: Spray – ${c}`),
      ].sort(),
    );
  });

  test('fragrances offer solid EDT/EDP/Extract and spray EDC/EDT/EDP/Parfum/Extract', () => {
    const sanctum = catalog.find((p) => p.slug === 'sanctus-una-sanctum-fragrance')!;
    expect(sanctum.variants.map((v) => v.label)).toEqual([
      'Solid – EDT',
      'Solid – EDP',
      'Solid – Extract',
      'Spray – EDC',
      'Spray – EDT',
      'Spray – EDP',
      'Spray – Parfum',
      'Spray – Extract',
    ]);
  });
});
