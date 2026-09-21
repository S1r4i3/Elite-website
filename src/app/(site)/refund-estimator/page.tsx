import { RefundEstimator } from "@/components/sections/refund-estimator";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { FaqSection } from "@/components/sections/faq-section";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FinalCta } from "@/components/sections/final-cta";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free Tax Refund Estimator",
  description:
    "Estimate your federal tax refund or balance due in five quick steps. Free, no sign-up — then get a detailed estimate from an Elite Tax professional.",
  path: "/refund-estimator",
  keywords: ["tax refund estimator", "federal tax calculator", "refund estimate", "self-employment tax estimate"],
});

const faqs = [
  { q: "How accurate is this estimate?", a: "It's a simplified federal estimate based on the standard deduction, federal brackets, self-employment tax and the child tax credit. It doesn't include state taxes, itemized deductions or many credits, so your actual result may differ." },
  { q: "Is my information saved?", a: "No. The calculator doesn't store what you enter. Information is only saved if you choose to request a detailed estimate using the form." },
  { q: "Can you guarantee a refund?", a: "No one can guarantee a refund. Your result depends on your complete tax information. A tax professional can review your full situation and give you a detailed estimate." },
];

export default function RefundEstimatorPage() {
  return (
    <>
      <div className="container-x pt-8">
        <Breadcrumbs items={[{ label: "Refund Estimator", href: "/refund-estimator" }]} />
      </div>
      <RefundEstimator headingLevel="h1" id="estimator-page" />
      <HowItWorks title="After your estimate" subtitle="Request a detailed estimate and here's what happens next." />
      <FaqSection faqs={faqs} title="Estimator FAQs" />
      <FinalCta />
    </>
  );
}
