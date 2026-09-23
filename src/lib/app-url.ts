import "server-only";

/** Public base URL used in email links. Set APP_URL in production (e.g. https://www.elitebtax.com). */
export function appUrl() {
  return (process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").trim().replace(/\/$/, "");
}
