/**
 * Site-wide constants. SITE_URL is used for canonical URLs, the sitemap,
 * robots.txt and social cards; override it per environment with
 * NEXT_PUBLIC_SITE_URL.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://edenspharm.com').replace(/\/$/, '');

export const CONTACT_EMAIL = 'info@edenspharm.com';
