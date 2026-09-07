/**
 * Absolute origin for canonical URLs and social card images. Set
 * NEXT_PUBLIC_SITE_URL in the deploy environment; Vercel provides
 * VERCEL_PROJECT_PRODUCTION_URL automatically on production builds.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
