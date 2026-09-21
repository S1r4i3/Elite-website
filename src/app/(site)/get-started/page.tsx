import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { LeadForm } from "@/components/forms/lead-form";
import { serviceOptions } from "@/lib/services";
import { processSteps } from "@/components/sections/how-it-works";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Get Started",
  description: "Tell us about your tax situation and upload documents securely. An Elite Tax professional will contact you to discuss next steps.",
  path: "/get-started",
});

export default async function GetStartedPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const label = serviceOptions.find((o) => o.value === service)?.label;
  return (
    <section className="bg-canvas">
      <div className="container-x py-10 sm:py-14 lg:py-16">
        <Breadcrumbs items={[{ label: "Get Started", href: "/get-started" }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <p className="eyebrow">Get started</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">{label ? `Let's get started with ${label}.` : "Let's get started."}</h1>
            <p className="lead-copy mt-4">It takes about two minutes. Documents are optional — you can send them later.</p>
            <ol className="mt-8 space-y-4">
              {processSteps.map((s, i) => (
                <li key={s.n} className="flex gap-3">
                  <span className={i === 0 ? "grid size-7 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white" : "grid size-7 shrink-0 place-items-center rounded-full border border-line-strong bg-white text-xs font-bold text-muted"}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-navy-900">{s.title}</p>
                    <p className="text-sm text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 flex items-center gap-2 text-sm text-muted">
              <CheckCircle2 className="size-4 text-success-600" aria-hidden /> No obligation to continue.
            </p>
          </div>
          <div className="lg:col-span-8">
            <LeadForm defaultService={service} source="get-started" submitLabel="Submit Request" />
          </div>
        </div>
      </div>
    </section>
  );
}
