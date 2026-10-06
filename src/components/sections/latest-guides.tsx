import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { guides } from "@/lib/guides";
import { SectionHeader } from "./section-header";

/** Homepage strip linking the newest guides and the deadlines page (crawl paths into the knowledge center). */
export function LatestGuides() {
  const latest = [...guides].sort((a, b) => b.updated.localeCompare(a.updated) || a.title.localeCompare(b.title)).slice(0, 3);
  return (
    <section className="section-y" aria-labelledby="latest-guides-h">
      <div className="container-x">
        <SectionHeader
          eyebrow="Tax guides"
          title={<span id="latest-guides-h">Answers to the questions we hear most</span>}
          subtitle="Plain-language guides on FBAR, ITIN, amended returns, business tax and more — with links to the IRS sources."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {latest.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="card card-hover group flex flex-col p-6">
              <p className="eyebrow">{g.category}</p>
              <h3 className="mt-3 text-lg font-bold leading-snug">{g.title}</h3>
              <p className="mt-2 flex-1 text-[15px] text-muted">{g.readMinutes} min read</p>
              <ArrowRight className="mt-4 size-4 text-brand-600 transition group-hover:translate-x-1" aria-hidden />
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/guides" className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-navy-900 hover:border-brand-600 hover:text-brand-600">
            All tax guides <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link href="/tax-deadlines" className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-navy-900 hover:border-brand-600 hover:text-brand-600">
            <CalendarClock className="size-4" aria-hidden /> Tax deadlines 2026–2027
          </Link>
        </div>
      </div>
    </section>
  );
}
