/**
 * Verified customer reviews ONLY.
 * Add reviews copied from a real, linkable source (Google Business Profile, Yelp, Trustpilot, etc.)
 * with the customer's permission. Leave empty rather than inventing testimonials.
 *
 * Example:
 * { name: "Priya S.", service: "FBAR / FATCA", rating: 5, text: "…", source: "Google", url: "https://g.page/…", date: "2026-03-14" }
 */
export type Review = {
  name: string;
  service: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  source: string;
  url: string;
  date?: string;
};

export const reviews: Review[] = [];

/** Public profile where customers can read/leave reviews (e.g. Google Business Profile). */
export const reviewProfileUrl = "";
