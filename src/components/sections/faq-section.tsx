import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeader } from "./section-header";
import type { Faq } from "@/lib/faqs";
import Link from "next/link";

export function FaqSection({
  faqs,
  title = "Frequently asked questions",
  eyebrow = "FAQ",
  subtitle,
  withSchema = true,
  showAllLink = true,
  className = "section-y",
}: {
  faqs: Faq[];
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  withSchema?: boolean;
  showAllLink?: boolean;
  className?: string;
}) {
  const hid = `faq-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section className={className} aria-labelledby={hid}>
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeader align="left" eyebrow={eyebrow} title={<span id={hid} className="block text-3xl sm:text-4xl">{title}</span>} subtitle={subtitle} />
          {showAllLink && (
            <p className="mt-6 text-[15px] text-muted">
              Still have questions?{" "}
              <Link href="/contact" className="font-semibold text-brand-600 hover:underline">
                Talk to our team
              </Link>
            </p>
          )}
        </div>
        <div className="lg:col-span-8">
          <Accordion type="single" collapsible className="card px-5 sm:px-8">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      {withSchema && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }}
        />
      )}
    </section>
  );
}
