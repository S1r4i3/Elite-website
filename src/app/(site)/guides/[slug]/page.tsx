import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Info } from "lucide-react";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { guides, getGuide, type GuideBlock } from "@/lib/guides";
import { getService } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = getGuide((await params).slug);
  if (!g) return {};
  const base = pageMetadata({ title: g.seoTitle, description: g.description, path: `/guides/${g.slug}`, keywords: g.keywords });
  return {
    ...base,
    openGraph: { ...base.openGraph, type: "article", publishedTime: g.published, modifiedTime: g.updated, section: g.category },
  };
}

const fmt = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function Block({ b }: { b: GuideBlock }) {
  switch (b.type) {
    case "p":
      return <p className="mt-4 text-[17px] leading-8 text-ink">{b.text}</p>;
    case "list":
      return (
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[17px] leading-8 text-ink marker:text-brand-600">
          {b.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="mt-4 list-decimal space-y-2 pl-6 text-[17px] leading-8 text-ink marker:font-bold marker:text-brand-600">
          {b.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ol>
      );
    case "note":
      return (
        <p className="mt-5 flex gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-[15px] leading-7 text-navy-900">
          <Info className="mt-1 size-5 shrink-0 text-brand-600" aria-hidden />
          <span>{b.text}</span>
        </p>
      );
    case "table":
      return (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <thead className="bg-canvas text-navy-900">
              <tr>
                {b.head.map((h, i) => (
                  <th key={i} scope="col" className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-t border-line align-top">
                  {r.map((c, j) =>
                    j === 0 ? (
                      <th key={j} scope="row" className="px-4 py-3 font-semibold text-navy-900">
                        {c}
                      </th>
                    ) : (
                      <td key={j} className="px-4 py-3 text-muted">
                        {c}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const url = absoluteUrl(`/guides/${g.slug}`);
  const related = g.services.map((s) => getService(s)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  // Related guides first (shared services), then the rest — every guide gets links from its neighbours.
  const shared = (x: (typeof guides)[number]) => x.services.filter((s) => g.services.includes(s)).length;
  const more = guides
    .filter((x) => x.slug !== g.slug)
    .sort((a, b) => shared(b) - shared(a) || b.updated.localeCompare(a.updated))
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${url}#article`,
          headline: g.title,
          description: g.description,
          url,
          mainEntityOfPage: url,
          datePublished: g.published,
          dateModified: g.updated,
          articleSection: g.category,
          keywords: g.keywords.join(", "),
          image: absoluteUrl("/opengraph-image"),
          author: { "@type": "Organization", name: site.name, url: site.url },
          publisher: { "@id": absoluteUrl("/#organization") },
          inLanguage: "en-US",
        }}
      />

      <article>
        <header className="border-b border-line bg-canvas">
          <div className="container-x py-10 sm:py-14">
            <Breadcrumbs
              items={[
                { label: "Guides", href: "/guides" },
                { label: g.title, href: `/guides/${g.slug}` },
              ]}
            />
            <div className="mt-8 max-w-3xl">
              <p className="eyebrow">{g.category}</p>
              <h1 className="mt-3 text-[32px] font-extrabold leading-[1.1] sm:text-5xl">{g.title}</h1>
              <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                <span>By the {site.name} team</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden /> {g.readMinutes} min read
                </span>
                <span>Updated {fmt(g.updated)}</span>
              </p>
            </div>
          </div>
        </header>

        <div className="container-x grid gap-12 py-12 lg:grid-cols-12 lg:py-16">
          <div className="min-w-0 lg:col-span-8">
            <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">The short answer</p>
              <p className="mt-2 text-[17px] leading-8 text-navy-900">{g.summary}</p>
            </div>

            {g.sections.map((s) => (
              <section key={s.h2} id={anchor(s.h2)} className="mt-12 scroll-mt-28">
                <h2 className="text-2xl font-bold sm:text-3xl">{s.h2}</h2>
                {s.blocks.map((b, i) => (
                  <Block key={i} b={b} />
                ))}
              </section>
            ))}

            <div className="mt-12 rounded-2xl border border-line bg-canvas p-5 text-sm leading-6 text-muted">
              <p>
                <strong className="text-navy-900">Sources:</strong>{" "}
                {g.sources.map((s, i) => (
                  <span key={s.url}>
                    {i > 0 && " · "}
                    <a href={s.url} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-brand-600">
                      {s.label}
                    </a>
                  </span>
                ))}
              </p>
              <p className="mt-2">
                This guide is general information, not tax or legal advice for your situation. Rules and inflation-adjusted amounts change — contact us before
                you file. Read our{" "}
                <Link href="/disclaimer" className="underline underline-offset-2 hover:text-brand-600">
                  disclaimer and editorial policy
                </Link>
                .
              </p>
            </div>
          </div>

          <aside className="min-w-0 lg:col-span-4">
            <div className="space-y-5 lg:sticky lg:top-28">
              <nav aria-label="On this page" className="card p-5">
                <p className="text-sm font-semibold text-navy-900">On this page</p>
                <ol className="mt-3 space-y-2 text-sm">
                  {g.sections.map((s) => (
                    <li key={s.h2}>
                      <a href={`#${anchor(s.h2)}`} className="text-muted hover:text-brand-600">
                        {s.h2}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              {related.length > 0 && (
                <div className="card p-5">
                  <p className="text-sm font-semibold text-navy-900">We can do this for you</p>
                  <ul className="mt-3 space-y-2">
                    {related.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/${s.slug}`} className="group flex items-center justify-between gap-2 rounded-xl bg-canvas px-4 py-3 text-sm font-semibold text-navy-900 hover:bg-brand-50">
                          {s.name}
                          <ArrowRight className="size-4 text-brand-600 transition group-hover:translate-x-1" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href="/get-started" className="mt-4 block rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-700">
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>

      <FaqSection faqs={g.faqs} title="Questions people also ask" showAllLink={false} className="section-y bg-canvas" />

      {more.length > 0 && (
        <section className="section-y">
          <div className="container-x">
            <h2 className="text-2xl font-bold sm:text-3xl">More guides</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {more.map((m) => (
                <Link key={m.slug} href={`/guides/${m.slug}`} className="card card-hover p-6">
                  <p className="eyebrow">{m.category}</p>
                  <p className="mt-3 font-bold text-navy-900">{m.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCta />
    </>
  );
}
