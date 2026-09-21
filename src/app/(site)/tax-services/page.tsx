import { PageHero } from "@/components/sections/page-hero";
import { ServiceCard } from "@/components/sections/service-card";
import { ServiceFinder } from "@/components/sections/service-finder";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { SectionHeader } from "@/components/sections/section-header";
import { services } from "@/lib/services";
import { homeFaqs } from "@/lib/faqs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Individual Tax Services — Federal, State, FBAR, FATCA, ITIN & IRS Help",
  description:
    "U.S. tax preparation for individuals and families: federal and state filing, FBAR, FATCA, ITIN applications, amended returns, IRS notices and Indian/NRI tax services.",
  path: "/tax-services",
  keywords: ["U.S. tax preparation", "federal tax filing", "state tax filing", "FBAR", "FATCA", "ITIN", "IRS representation"],
});

export default function TaxServicesPage() {
  const individual = services.filter((s) => s.category === "tax" || s.category === "international");
  return (
    <>
      <PageHero
        eyebrow="Tax services"
        title="Individual tax services, explained simply."
        subtitle="From a single W-2 to foreign accounts and IRS letters — choose a service below or let our service finder point you in the right direction."
        crumbs={[{ label: "Tax Services", href: "/tax-services" }]}
      />
      <section className="section-y">
        <div className="container-x">
          <SectionHeader align="left" title="Choose your service" subtitle="Every service includes professional preparation, a review with you before filing, and ongoing support." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {individual.map((s) => (
              <ServiceCard key={s.slug} href={`/${s.slug}`} icon={s.icon} title={s.name} description={s.summary} />
            ))}
          </div>
        </div>
      </section>
      <ServiceFinder />
      <HowItWorks />
      <FaqSection faqs={homeFaqs.slice(0, 7)} />
      <FinalCta />
    </>
  );
}
