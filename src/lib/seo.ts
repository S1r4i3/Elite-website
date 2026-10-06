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
  // Google shows ~60 characters of a title. Add the brand only when the full title still fits.
  const branded = `${title} | ${site.name}`;
  const fullTitle = branded.length <= 60 ? branded : title;
  const image = { url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` };
  return {
    title: { absolute: fullTitle },
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: fullTitle, description, siteName: site.name, locale: "en_US", images: [image] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image.url] },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    legalName: site.legalName,
    alternateName: site.alternateNames,
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
    alternateName: site.alternateNames,
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

export function serviceSchema(s: { name: string; description: string; path: string; serviceType?: string }) {
  const url = absoluteUrl(s.path);
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: s.name,
      description: s.description,
      isPartOf: { "@id": absoluteUrl("/#website") },
      about: { "@id": `${url}#service` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: s.name,
      description: s.description,
      serviceType: s.serviceType ?? s.name,
      url,
      mainEntityOfPage: { "@id": `${url}#webpage` },
      provider: { "@id": absoluteUrl("/#organization") },
      areaServed: [{ "@type": "Country", name: "United States" }, { "@type": "Country", name: "India" }],
    },
  ];
}
