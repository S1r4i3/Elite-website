import type { Metadata } from "next";
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
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { homeFaqs } from "@/lib/faqs";
import { absoluteUrl } from "@/lib/utils";

// Interactive sections are code-split (still server-rendered) to keep the initial bundle small.
const ServiceFinder = dynamic(() => import("@/components/sections/service-finder").then((m) => m.ServiceFinder));

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceFinder />
      <ServicesGrid />
      <BusinessServices />
      <UsIndia />
      <HowItWorks />
      <WhyElite />
      <Reviews />
      <FaqSection faqs={homeFaqs} subtitle="Quick answers to the questions we hear most." />
      <FinalCta />
      <WhatsAppButton />
    </>
  );
}
