import { Check, HandHeart, MessageCircle, Scale } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { WhyElite } from "@/components/sections/why-elite";
import { TrustStats } from "@/components/sections/trust-stats";
import { FinalCta } from "@/components/sections/final-cta";
import { SectionHeader } from "@/components/sections/section-header";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Elite B Tax Services (EliteBridge Tech Inc) provides individual, business and U.S.–India tax services online, from Dover, Delaware.",
  path: "/about",
});

const values = [
  { icon: HandHeart, title: "Accessible", body: "Tax help that's easy to reach — online, by phone or in person." },
  { icon: MessageCircle, title: "Approachable", body: "Plain-English explanations. No question is too basic." },
  { icon: Scale, title: "Accountable", body: "Careful preparation, review before filing, and practice guided by IRS Circular 230." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Tax services without confusion."
        subtitle="Elite B Tax Services helps individuals, families and businesses in the U.S. — and clients with ties to India — file accurately and understand their taxes."
        crumbs={[{ label: "About", href: "/about" }]}
      />
      <section className="section-y">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeader align="left" eyebrow="Who we are" title="Over a decade of tax, bookkeeping and payroll experience" />
            <div className="lead-copy mt-6 space-y-4">
              <p>
                {site.name} is operated by {site.legalName}, based in {site.address.city}, {site.address.regionName}. Our team has over a decade of experience in
                business bookkeeping, taxation and payroll services.
              </p>
              <p>
                We are a registered Electronic Return Originator (ERO) with the IRS. Returns are prepared by a team that includes CPAs, CAs, EAs and PTIN-holding
                tax professionals, and our approach to tax preparation is proactive rather than reactive.
              </p>
              <p>
                Through our dedicated India processing team, we also help clients meet Indian tax obligations — so NRIs and families with ties to both countries can
                work with one firm.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="card p-6 sm:p-8">
              <h2 className="text-xl font-bold">At a glance</h2>
              <ul className="mt-5 space-y-3">
                {site.credentials.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-[15px] text-ink">
                    <Check className="mt-0.5 size-4 shrink-0 text-success-600" strokeWidth={2.5} aria-hidden /> {c}
                  </li>
                ))}
              </ul>
              <TrustStats className="mt-8 border-t border-line pt-6 [&_ul]:flex [&_ul]:flex-col [&_ul]:items-start" />
              {site.stats.show && <p className="mt-4 text-xs text-subtle">{site.stats.sourceNote}</p>}
            </div>
          </div>
        </div>
      </section>
      <section className="section-y bg-canvas">
        <div className="container-x">
          <SectionHeader eyebrow="Our values" title="Accessible, Approachable & Accountable" />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {values.map(({ icon: I, title, body }) => (
              <div key={title} className="card p-7" data-reveal>
                <I className="size-8 text-brand-600" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WhyElite />
      <FinalCta />
    </>
  );
}
