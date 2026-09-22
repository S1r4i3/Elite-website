import { Clock, MessagesSquare, Smartphone, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { SectionHeader } from "@/components/sections/section-header";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How It Works — Simple Online Tax Filing With a Professional",
  description: "Tell us about yourself, upload documents securely, get a professional review and file. See how working with Elite Tax Services works.",
  path: "/how-it-works",
});

const perks = [
  { icon: Smartphone, title: "Do it from anywhere", body: "Everything can be done online or by phone — no office visit required." },
  { icon: MessagesSquare, title: "A real person to talk to", body: "Questions go to our team, not a chatbot." },
  { icon: ShieldCheck, title: "Review before filing", body: "You see and approve your return before it's submitted." },
  { icon: Clock, title: "Clear status updates", body: "We keep you informed from documents received to filing accepted." },
];

const faqs = [
  { q: "Do I need to visit an office?", a: "No. You can share documents online and talk with us by phone or email. Our office is at 8 The Green, Ste A, Dover, Delaware 19901, US." },
  { q: "What if I don't have all my documents?", a: "Start anyway. We'll send a checklist and tell you exactly what's missing." },
  { q: "When do I pay?", a: "Fees depend on your situation. Ask us for a quote before any work begins." },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="From first question to filed return — in four steps."
        subtitle="A guided process designed to answer three questions quickly: Can you help me? What do I need to do? How do I start?"
        crumbs={[{ label: "How It Works", href: "/how-it-works" }]}
      />
      <HowItWorks title="The process" />
      <section className="section-y bg-canvas">
        <div className="container-x">
          <SectionHeader title="What working with us feels like" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map(({ icon: I, title, body }) => (
              <div key={title} className="card p-6" data-reveal>
                <I className="size-7 text-brand-600" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-[15px] text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FaqSection faqs={faqs} />
      <FinalCta />
    </>
  );
}
