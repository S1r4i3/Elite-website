/**
 * Central business configuration.
 * Source: https://www.elitebtax.com (retrieved Sept 2026). Keep in sync with the live business record.
 * Anything marked `verify` is published on the current website without a cited source —
 * confirm it with the business before launch, or set `show: false` to hide it site-wide.
 */
export const site = {
  name: "Elite Tax Services",
  shortName: "Elite B Tax",
  logo: "/brand/ebt-logo.png",
  mark: "/brand/ebt-mark.png",
  legalName: "EliteBridge Tech Inc",
  domain: "elitebtax.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.elitebtax.com",
  tagline: "Tax services without confusion.",
  description:
    "Elite Tax Services provides U.S. federal and state tax filing, FBAR and FATCA reporting, ITIN assistance, tax amendments, IRS notice support, business tax, LLC formation, bookkeeping, payroll and Indian/NRI tax services.",
  phone: {
    display: "+1 (945) 388-4422",
    href: "tel:+19453884422",
    e164: "+19453884422",
  },
  email: "support@elitebtax.com",
  whatsapp: {
    number: "19453884422",
    display: "+1 (945) 388-4422",
    message: "Hi Elite B Tax Services, I'd like help with my taxes.",
  },
  address: {
    street: "8 The Green, Ste A",
    city: "Dover",
    region: "DE",
    regionName: "Delaware",
    postalCode: "19901",
    country: "US",
    display: "8 The Green, Ste A, Dover, Delaware 19901, US",
  },
  /** Add real profile URLs here; icons render only for entries with a URL. */
  social: {
    facebook: "",
    twitter: "",
    linkedin: "",
  } as Record<"facebook" | "twitter" | "linkedin", string>,
  /** Figures as published on elitebtax.com. */
  stats: {
    show: true,
    customers: { value: 22291, suffix: "+", label: "Customers served", verify: true },
    rating: { value: 4.9, suffix: "/5", label: "Customer rating", verify: true },
    years: { value: 10, suffix: "+", label: "Years of experience", verify: true },
    sourceNote: "Figures as published by Elite Tax Services on elitebtax.com.",
  },
  /** Credentials as described on elitebtax.com. */
  credentials: [
    "Registered Electronic Return Originator (ERO) with the IRS",
    "Returns prepared by CPAs, CAs, EAs and PTIN-holding tax professionals",
    "Practice guided by IRS Circular 230",
    "Dedicated India processing team for Indian tax filing",
  ],
} as const;

export type Site = typeof site;
