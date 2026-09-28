import { PageHero } from "@/components/sections/page-hero";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { homeFaqs } from "@/lib/faqs";
import { services } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tax FAQs — Filing, FBAR, FATCA, ITIN & NRI Taxes",
  description: "Answers to common questions about U.S. tax filing, amendments, FBAR, FATCA, ITINs, IRS notices, LLCs, bookkeeping and Indian/NRI taxes.",
  path: "/faq",
});

export default function FaqPage() {
  const groups = services.map((s) => ({ title: s.name, faqs: s.faqs }));
  const all = [...homeFaqs, ...groups.flatMap((g) => g.faqs)];
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Clear answers to common tax questions. Don't see yours? Contact us — we're happy to help."
        crumbs={[{ label: "FAQs", href: "/faq" }]}
        primary={{ label: "Ask Us a Question", href: "/contact" }}
        secondary={null}
      />
      <FaqSection faqs={homeFaqs} title="General questions" withSchema={false} />
      {groups.map((g, i) => (
        <FaqSection key={g.title} faqs={g.faqs} title={g.title} eyebrow="Service FAQ" withSchema={false} showAllLink={false} className={i % 2 === 0 ? "py-14 bg-canvas" : "py-14"} />
      ))}
      <FinalCta />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: all.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
