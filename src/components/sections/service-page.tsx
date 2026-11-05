import Link from "next/link";
import { TrackView } from "@/components/seo/analytics";
import { guides } from "@/lib/guides";
import { serviceDetails } from "@/lib/service-details";
import { AlertTriangle, ArrowRight, Check, FileCheck2, UserCheck } from "lucide-react";
import type { Service } from "@/lib/services";
import { getService } from "@/lib/services";
import { PageHero } from "./page-hero";
import { FaqSection } from "./faq-section";
import { FinalCta } from "./final-cta";
import { ServiceCard } from "./service-card";
import { TrustStats } from "./trust-stats";
import { SectionHeader } from "./section-header";
import { DocumentChecklist } from "./document-checklist";
import { LeadForm } from "@/components/forms/lead-form";
import { JsonLd } from "@/components/seo/json-ld";
import { Icon } from "@/components/ui/icon";
import { serviceSchema } from "@/lib/seo";
import { site } from "@/lib/site";

const categoryCrumb = {
  tax: { label: "Tax Services", href: "/tax-services" },
  business: { label: "Business Services", href: "/business-services" },
  international: { label: "Tax Services", href: "/tax-services" },
} as const;

function HeroAside({ service }: { service: Service }) {
  return (
    <div className="card p-6 shadow-[var(--shadow-lift)] sm:p-7">
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-2xl bg-brand-600 text-white">
          <Icon name={service.icon} className="size-6" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-subtle">Service</p>
          <p className="font-display text-lg font-bold text-navy-900">{service.name}</p>
        </div>
      </div>
      <p className="mt-5 text-sm font-semibold text-navy-900">What&apos;s included</p>
      <ul className="mt-3 space-y-2.5">
        {service.explanation.includes.slice(0, 5).map((i) => (
          <li key={i} className="flex items-start gap-2.5 text-[15px] text-ink">
            <Check className="mt-0.5 size-4 shrink-0 text-success-600" strokeWidth={2.5} aria-hidden /> {i}
          </li>
        ))}
      </ul>
      <Link href="#get-started" className="mt-6 flex items-center justify-between rounded-xl bg-canvas px-4 py-3 text-sm font-semibold text-navy-900 hover:text-brand-600">
        Request help with this service <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}

export function ServicePage({ service }: { service: Service }) {
  const related = service.related.map(getService).filter(Boolean) as Service[];
  const detail = serviceDetails[service.slug];
  const reading = [
    ...(detail?.guideSlugs ?? []).map((s) => guides.find((g) => g.slug === s)).filter((g): g is (typeof guides)[number] => Boolean(g)),
    ...guides.filter((g) => g.services.includes(service.slug)),
  ]
    .filter((g, i, all) => all.findIndex((x) => x.slug === g.slug) === i)
    .slice(0, 3);
  const crumbs = [categoryCrumb[service.category], { label: service.name, href: `/${service.slug}` }];

  return (
    <>
      <PageHero
        eyebrow={service.hero.eyebrow}
        title={service.hero.title}
        subtitle={service.hero.subtitle}
        crumbs={service.slug === "indian-tax-services" ? [{ label: service.name, href: `/${service.slug}` }] : crumbs}
        primary={{ label: "Get Started", href: "#get-started" }}
        aside={<HeroAside service={service} />}
      />

      {/* Problem + explanation */}
      <section className="section-y">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5" data-reveal>
            <div className="rounded-[20px] border border-line bg-canvas p-6 sm:p-8">
              <p className="eyebrow text-warn-700">
                <AlertTriangle className="size-4" aria-hidden /> Sound familiar?
              </p>
              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">{service.problem.title}</h2>
              <ul className="mt-6 space-y-3">
                {service.problem.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 rounded-xl bg-white p-3.5 text-[15px] text-ink shadow-[var(--shadow-soft)]">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-warn-700" aria-hidden /> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow">The service</p>
            <h2 className="h-section mt-3">{service.explanation.title}</h2>
            <div className="mt-5 space-y-4">
              {service.explanation.body.map((b) => (
                <p key={b.slice(0, 20)} className="lead-copy">
                  {b}
                </p>
              ))}
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {service.explanation.includes.map((i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-line p-3.5 text-[15px] text-ink">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-600" strokeWidth={2.5} aria-hidden /> {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Who needs it + documents */}
      <section className="section-y bg-canvas">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <div className="card flex flex-col p-6 sm:p-8" data-reveal>
            <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <UserCheck className="size-5" aria-hidden />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold">Who needs it</h2>
            <ul className="mt-5 space-y-3">
              {service.whoNeedsIt.map((w) => (
                <li key={w} className="flex items-start gap-3 text-[15px] text-ink">
                  <Check className="mt-0.5 size-4 shrink-0 text-success-600" strokeWidth={2.5} aria-hidden /> {w}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
                <p className="text-sm font-semibold text-navy-900">Not sure this applies to you?</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">Tell us your situation and we&apos;ll confirm what you need to file — no obligation.</p>
                <a href="#get-started" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
                  Check my situation <ArrowRight className="size-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>
          <div className="card p-6 sm:p-8" data-reveal>
            <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <FileCheck2 className="size-5" aria-hidden />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold">Documents to have ready</h2>
            <DocumentChecklist items={service.documents} />
            <p className="mt-5 text-[13px] text-muted">Don&apos;t have everything? Start anyway — we&apos;ll tell you exactly what&apos;s missing.</p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeader eyebrow="Process" title="How it works" subtitle={`What to expect with our ${service.name} service.`} />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((p, i) => (
              <li key={p.title} data-reveal className="card relative p-6">
                <span className="font-display text-sm font-extrabold text-brand-600">0{i + 1}</span>
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-canvas" aria-hidden>
                  <div className="h-full rounded-full bg-brand-600" style={{ width: `${((i + 1) / service.process.length) * 100}%` }} />
                </div>
                <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {detail && (
        <section className="section-y bg-canvas" aria-labelledby="details-h">
          <div className="container-x">
            <SectionHeader
              eyebrow="The details"
              title={<span id="details-h">Forms, deadlines and common mistakes</span>}
              subtitle={`What the ${service.name} process involves, so you know what to expect before you start.`}
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              <div className="card p-6 sm:p-8">
                <h3 className="text-xl font-bold">Forms involved</h3>
                <dl className="mt-5 space-y-4">
                  {detail.forms.map((f) => (
                    <div key={f.form}>
                      <dt className="font-semibold text-navy-900">{f.form}</dt>
                      <dd className="mt-0.5 text-[15px] text-muted">{f.what}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="card p-6 sm:p-8">
                <h3 className="text-xl font-bold">Key deadlines</h3>
                <dl className="mt-5 space-y-4">
                  {detail.deadlines.map((d) => (
                    <div key={d.when + d.what}>
                      <dt className="font-semibold text-navy-900">{d.when}</dt>
                      <dd className="mt-0.5 text-[15px] text-muted">{d.what}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-[13px] text-muted">
                  A due date on a weekend or legal holiday moves to the next business day. See all{" "}
                  <Link href="/tax-deadlines" className="font-semibold text-brand-600 hover:underline">
                    tax deadlines
                  </Link>
                  .
                </p>
              </div>
              <div className="card p-6 sm:p-8">
                <h3 className="text-xl font-bold">Common mistakes we fix</h3>
                <ul className="mt-5 space-y-3">
                  {detail.mistakes.map((m) => (
                    <li key={m} className="flex items-start gap-3 text-[15px] text-ink">
                      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warn-700" aria-hidden /> {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-line bg-white p-6">
                <h3 className="text-lg font-bold">Pricing</h3>
                <p className="mt-2 text-[15px] text-muted">
                  Fees depend on how complex your situation is — for example the number of forms, states, accounts or years involved. You get a
                  quote before any work begins, and there is no charge for the first conversation.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-white p-6">
                <h3 className="text-lg font-bold">Official sources</h3>
                <ul className="mt-2 space-y-1.5 text-[15px]">
                  {detail.sources.map((src) => (
                    <li key={src.url}>
                      <a href={src.url} target="_blank" rel="noopener" className="text-brand-600 underline-offset-2 hover:underline">
                        {src.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[13px] text-muted">
                  General information, not advice for your situation. <Link href="/disclaimer" className="underline">Read our disclaimer</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust */}
      <section className="border-y border-line bg-canvas py-12">
        <div className="container-x flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <h2 className="text-xl font-bold">Prepared by professionals. Explained clearly.</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              {site.credentials.slice(0, 3).map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <Check className="size-3.5 text-success-600" aria-hidden /> {c}
                </li>
              ))}
            </ul>
          </div>
          <TrustStats />
        </div>
      </section>

      {reading.length > 0 && (
        <section className="section-y" aria-labelledby="guides-h">
          <div className="container-x">
            <h2 id="guides-h" className="text-2xl font-bold sm:text-3xl">
              Helpful guides
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {reading.map((g) => (
                <Link key={g.slug} href={`/guides/${g.slug}`} className="card card-hover p-6">
                  <p className="eyebrow">{g.category}</p>
                  <p className="mt-3 font-bold text-navy-900">{g.title}</p>
                  <p className="mt-2 text-sm text-muted">{g.readMinutes} min read</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <FaqSection faqs={service.faqs} title={`${service.name} FAQs`} />

      {/* Lead form */}
      <section id="get-started" className="section-y bg-canvas">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeader
              align="left"
              eyebrow="Get started"
              title="Tell us what you need"
              subtitle="Share a few details and our team will contact you to discuss the right next step."
            />
          </div>
          <div className="lg:col-span-8">
            <LeadForm defaultService={service.leadValue} source={`service:${service.slug}`} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-y">
          <div className="container-x">
            <h2 className="text-2xl font-extrabold sm:text-3xl">Related services</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {related.map((r) => (
                <ServiceCard key={r.slug} href={`/${r.slug}`} icon={r.icon} title={r.name} description={r.summary} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCta />
      <TrackView event="service_page_view" params={{ service: service.slug }} />
      <JsonLd data={serviceSchema({ name: service.name, description: service.metaDescription, path: `/${service.slug}` })} />
    </>
  );
}
