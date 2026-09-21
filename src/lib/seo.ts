import type { Metadata } from "next";
import { site } from "./site";
import { absoluteUrl } from "./utils";

export function pageMetadata({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: `${title} | ${site.name}`, description, siteName: site.name, locale: "en_US" },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    legalName: site.legalName,
    alternateName: [site.shortName, "EBT"],
    url: site.url,
    logo: absoluteUrl(site.logo),
    image: absoluteUrl("/opengraph-image"),
    description: site.description,
    telephone: site.phone.e164,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: [{ "@type": "Country", name: "United States" }, { "@type": "Country", name: "India" }],
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

export function serviceSchema(s: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    serviceType: s.name,
    url: absoluteUrl(s.path),
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: { "@type": "Country", name: "United States" },
  };
}
