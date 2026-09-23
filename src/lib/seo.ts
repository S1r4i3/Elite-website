import type { Metadata } from "next";
import { services } from "./services";
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
    priceRange: "$$",
    currenciesAccepted: "USD, INR",
    knowsLanguage: ["en-US", "hi", "te", "ta"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "14:00" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phone.e164,
        email: site.email,
        contactType: "customer service",
        areaServed: ["US", "IN"],
        availableLanguage: ["English", "Hindi", "Telugu", "Tamil"],
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tax & business services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: absoluteUrl(`/${s.slug}`) },
      })),
    },
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

/** Site-level entity, so search engines can link the brand to the domain. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: site.url,
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    inLanguage: "en-US",
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

/** Marks a page as part of the site and ties it to the organization. */
export function webPageSchema({ title, description, path }: { title: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en-US",
  };
}

/** Pages that must never appear in search results (sign-in, verification, etc.). */
export function privatePageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: false, follow: true, nocache: true, googleBot: { index: false, follow: true } },
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
    areaServed: [{ "@type": "Country", name: "United States" }, { "@type": "Country", name: "India" }],
    isPartOf: { "@id": absoluteUrl("/#website") },
  };
}
