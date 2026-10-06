import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { guides } from "@/lib/guides";
import { absoluteUrl } from "@/lib/utils";

/**
 * Every indexable URL, weighted so search engines crawl the money pages first.
 * Private areas (portal, admin, auth) are excluded here and in robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Bump when site-wide content changes; guides use their own "updated" date.
  const now = new Date("2026-10-07T12:00:00Z");
  const ogImage = absoluteUrl("/opengraph-image");

  const core: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/tax-services", priority: 0.9, changeFrequency: "weekly" },
    { path: "/business-services", priority: 0.9, changeFrequency: "weekly" },
    { path: "/get-started", priority: 0.9, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/how-it-works", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/reviews", priority: 0.6, changeFrequency: "weekly" },
    { path: "/guides", priority: 0.8, changeFrequency: "weekly" },
    { path: "/tax-deadlines", priority: 0.7, changeFrequency: "monthly" },
  ];

  return [
    ...core.map((c) => ({ url: absoluteUrl(c.path), lastModified: now, changeFrequency: c.changeFrequency, priority: c.priority, images: [ogImage] })),
    ...services.map((s) => ({
      url: absoluteUrl(`/${s.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
      images: [ogImage],
    })),
    ...guides.map((g) => ({
      url: absoluteUrl(`/guides/${g.slug}`),
      lastModified: new Date(`${g.updated}T12:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.75,
      images: [ogImage],
    })),
    ...["/privacy", "/terms", "/disclaimer"].map((p) => ({ url: absoluteUrl(p), lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
