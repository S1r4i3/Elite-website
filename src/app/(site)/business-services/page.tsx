import { LineChart, CalendarClock, Scale, PiggyBank } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { ServiceCard } from "@/components/sections/service-card";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { SectionHeader } from "@/components/sections/section-header";
import { LeadForm } from "@/components/forms/lead-form";
import { servicesByCategory } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Business Tax Services — LLC, Corporate Tax, Bookkeeping & Payroll",
  description:
    "LLC formation, entity formation, corporate tax filing (1120, 1120-S, 1065), bookkeeping, payroll and business tax planning for small and growing companies.",
  path: "/business-services",
  keywords: ["LLC tax services", "corporate tax filing", "bookkeeping services", "payroll services", "business tax planning"],
});

const planning = [
  { icon: Scale, title: "Entity & election review", body: "Is your LLC, S corp or C corp structure still the right fit for your income?" },
  { icon: PiggyBank, title: "Owner compensation", body: "Reasonable salary and distributions planning for S corporation owners." },
  { icon: CalendarClock, title: "Estimated taxes", body: "Quarterly estimated payment planning to avoid surprises and penalties." },
  { icon: LineChart, title: "Year-end review", body: "A look at income, expenses and timing before the year closes." },
];

const faqs = [
  { q: "Do you work with new businesses?", a: "Yes. We help new owners choose a structure, form the entity, get an EIN and set up bookkeeping and payroll from day one." },
  { q: "Can you file business returns for prior years?", a: "Yes. We can prepare late business returns and help bring your books up to date first." },
  { q: "Do you support foreign-owned U.S. companies?", a: "Yes. We help foreign owners and NRIs with U.S. entity formation and filings such as Form 5472." },
  { q: "Can one team handle my business and personal taxes?", a: "Yes. Handling both together helps keep K-1s, owner compensation and personal returns consistent." },
];

export default function BusinessServicesPage() {
  const list = servicesByCategory("business");
  return (
    <>
      <PageHero
        eyebrow="Business services"
        title="Tax & business support for growing companies."
        subtitle="Formation, books, payroll and business returns — handled by one team that sees the full picture."
        crumbs={[{ label: "Business Services", href: "/business-services" }]}
        primary={{ label: "Talk to Our Business Team", href: "#business-form" }}
        secondary={{ label: "Call Us", href: "/contact" }}
      />
      <section className="section-y">
        <div className="container-x">
          <SectionHeader align="left" title="Business services" subtitle="Pick what you need now — add more as you grow." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {list.map((s) => (
              <ServiceCard key={s.slug} href={`/${s.slug}`} icon={s.icon} title={s.name} description={s.summary} />
            ))}
          </div>
        </div>
      </section>
      <section id="planning" className="section-y bg-navy-900">
        <div className="container-x">
          <SectionHeader dark eyebrow="Business tax planning" title="Plan ahead, not at the deadline" subtitle="Proactive planning conversations that help you make informed decisions throughout the year." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {planning.map(({ icon: I, title, body }) => (
              <div key={title} data-reveal className="rounded-[20px] border border-white/10 bg-white/5 p-6">
                <I className="size-7 text-brand-200" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/65">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <HowItWorks subtitle="The same simple process for businesses — with a dedicated point of contact." />
      <FaqSection faqs={faqs} title="Business services FAQs" />
      <section id="business-form" className="section-y bg-canvas">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeader align="left" eyebrow="Get started" title="Tell us about your business" subtitle="We'll follow up to understand your needs and recommend the right services." />
          </div>
          <div className="lg:col-span-8">
            <LeadForm defaultService="corporate-tax" source="business-services" />
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
