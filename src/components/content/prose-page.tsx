import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { webPageSchema } from "@/lib/seo";

export type ProseSection = { h2: string; paragraphs?: string[]; list?: string[] };

const fmt = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

/** Long-form text page (privacy, terms, disclaimer) — real headings, readable measure, last-updated date. */
export function ProsePage({
  title,
  description,
  path,
  intro,
  updated,
  sections,
  related = [],
}: {
  title: string;
  description: string;
  path: string;
  intro: string;
  updated: string;
  sections: ProseSection[];
  related?: { label: string; href: string }[];
}) {
  return (
    <>
      <JsonLd data={webPageSchema({ title, description, path })} />
      <PageHero title={title} subtitle={intro} crumbs={[{ label: title, href: path }]} primary={null} secondary={null} showCallLine={false} />
      <section className="section-y">
        <div className="container-x max-w-3xl">
          <p className="text-sm text-muted">Last updated {fmt(updated)}</p>
          {sections.map((s) => (
            <section key={s.h2} className="mt-10">
              <h2 className="text-2xl font-bold">{s.h2}</h2>
              {s.paragraphs?.map((p) => (
                <p key={p.slice(0, 32)} className="mt-4 text-[17px] leading-8 text-ink">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="mt-4 list-disc space-y-2 pl-6 text-[17px] leading-8 text-ink marker:text-brand-600">
                  {s.list.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          {related.length > 0 && (
            <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
              See also:{" "}
              {related.map((r, i) => (
                <span key={r.href}>
                  {i > 0 && " · "}
                  <Link href={r.href} className="font-semibold text-brand-600 hover:underline">
                    {r.label}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
