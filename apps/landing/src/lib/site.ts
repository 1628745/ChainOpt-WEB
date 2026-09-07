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

/**
 * Scheduling link for the early-access section, e.g. a Cal.com or Calendly
 * booking page. Leave it empty and the whole "or book a call" branch -- the
 * divider and the button -- disappears; there is no half-configured state that
 * sends someone to a dead link.
 *
 * Read from the environment so the link can be changed without a deploy of new
 * code, and so it is absent by default rather than pointing somewhere wrong.
 */
export const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? "";
