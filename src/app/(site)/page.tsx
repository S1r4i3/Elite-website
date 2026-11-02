import { site } from "@/lib/site";
import type { Metadata } from "next";
import { LatestGuides } from "@/components/sections/latest-guides";
import { Hero } from "@/components/sections/hero";
import dynamic from "next/dynamic";
import { ServicesGrid } from "@/components/sections/services-grid";
import { BusinessServices } from "@/components/sections/business-services";
import { UsIndia } from "@/components/sections/us-india";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WhyElite } from "@/components/sections/why-elite";
import { Reviews } from "@/components/sections/reviews";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { homeFaqs } from "@/lib/faqs";
import { absoluteUrl } from "@/lib/utils";

// Interactive sections are code-split (still server-rendered) to keep the initial bundle small.
const ServiceFinder = dynamic(() => import("@/components/sections/service-finder").then((m) => m.ServiceFinder));

const homeDescription =
  "Elitebtax (Elite B Tax Services): U.S. federal & state tax filing, FBAR, FATCA, ITIN, IRS notices, business tax and NRI tax help. Online, secure, done right.";

export const metadata: Metadata = {
  // Homepage title leads with the one-word brand people type: "Elitebtax".
  title: { absolute: `${site.siteName} — ${site.name} | U.S. & India Tax Filing, FBAR, ITIN` },
  description: homeDescription,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    siteName: site.siteName,
    locale: "en_US",
    url: absoluteUrl("/"),
    description: homeDescription,
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", description: homeDescription, images: [absoluteUrl("/opengraph-image")] },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <BusinessServices />
      <UsIndia />
      <HowItWorks />
      <ServiceFinder />
      <WhyElite />
      <Reviews />
      <LatestGuides />
      <FaqSection faqs={homeFaqs} subtitle="Quick answers to the questions we hear most." />
      <FinalCta />
    </>
  );
}
