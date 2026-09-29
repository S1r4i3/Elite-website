/** The live website address. www.elitebtax.com redirects here. */
export const PRODUCTION_URL = "https://elitebtax.com";

const clean = (v?: string) => (v || "").trim().replace(/\/$/, "");
/** A *.vercel.app deployment address is never used for links, canonicals or emails. */
const usable = (v?: string) => !!clean(v) && !/\.vercel\.app$/i.test(clean(v));

/** Base URL for canonicals, sitemap and Open Graph (NEXT_PUBLIC_SITE_URL unless it is a vercel.app address). */
export const SITE_URL = usable(process.env.NEXT_PUBLIC_SITE_URL) ? clean(process.env.NEXT_PUBLIC_SITE_URL) : PRODUCTION_URL;

/** Base URL for links in emails (verification, password reset). Localhost during development. */
export function emailBaseUrl() {
  if (usable(process.env.APP_URL)) return clean(process.env.APP_URL);
  if (usable(process.env.NEXT_PUBLIC_SITE_URL)) return clean(process.env.NEXT_PUBLIC_SITE_URL);
  return process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:3000";
}
