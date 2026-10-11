import { test, expect } from '@playwright/test';

/**
 * Happy path end‑to‑end tests.
 *
 * These run against the production server started by playwright.config.ts
 * (run `npm run build` first). They exercise browsing products, adding a
 * variant to the cart and reaching checkout, plus a few launch smoke checks.
 */
test('user can browse products and initiate checkout', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation').getByRole('link', { name: 'Products' }).click();
  await expect(page).toHaveURL(/\/products$/);

  await page.getByRole('link', { name: /View Details/ }).first().click();
  await expect(page).toHaveURL(/\/products\/[^/]+$/);

  await expect(page.getByTestId('stock-message')).not.toHaveText('Loading…');
  await page.getByRole('button', { name: /Add to Cart|Pre‑Order/ }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Added to your cart' })).toBeVisible();

  await page.getByRole('link', { name: /View cart & checkout/ }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByText('Your cart is empty')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Proceed to Checkout' })).toBeVisible();
});

test('home page product cards link to the catalog', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Shop BeneDulce' }).click();
  await expect(page).toHaveURL(/\/products\/benedulce$/);
  await expect(page.getByRole('heading', { level: 1, name: 'BeneDulce' })).toBeVisible();

  await page.goto('/');
  await page.getByRole('link', { name: 'Shop Elation' }).click();
  await expect(page).toHaveURL(/\/products#elation$/);
  await expect(page.getByRole('heading', { level: 2, name: 'Elation' })).toBeVisible();
});

test('every product in the sitemap has a working page', async ({ page, request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const paths = Array.from(sitemap.matchAll(/<loc>[^<]*?(\/products\/[^<]+)<\/loc>/g), (m) => m[1]);
  expect(paths.length).toBe(40);
  for (const path of paths) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
  }
  await page.goto('/products/hydrasal');
  await expect(page.getByLabel('Flavor')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ingredients' })).toBeVisible();
});

test('unknown product returns 404', async ({ page }) => {
  const res = await page.goto('/products/does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
});

test('About menu opens with the keyboard', async ({ page }) => {
  await page.goto('/');
  const about = page.getByRole('button', { name: 'About' });
  await about.focus();
  await page.keyboard.press('Enter');
  await expect(about).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Mission & Values' })).toBeVisible();
});

test('mobile menu toggles navigation links', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Blog' })).toBeHidden();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('link', { name: 'Blog' }).click();
  await expect(page).toHaveURL(/\/blog$/);
});
