import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { guides } from "@/lib/guides";
import { pageMetadata, webPageSchema } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

const title = "Tax Guides for NRIs, H-1B Workers & Small Businesses";
const description =
  "Plain-English guides on FBAR, FATCA, ITIN, Indian bank accounts, amended returns and business tax — sourced from the IRS and updated regularly.";

export const metadata = pageMetadata({ title, description, path: "/guides", keywords: ["tax guides", "NRI tax guide", "FBAR guide", "FATCA guide", "US tax for Indians"] });

const fmt = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default function GuidesPage() {
  const list = [...guides].sort((a, b) => b.updated.localeCompare(a.updated));
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ title, description, path: "/guides" }),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: list.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/guides/${g.slug}`), name: g.title })),
          },
        ]}
      />
      <PageHero
        eyebrow="Tax guides"
        title="Clear answers to the tax questions you're searching for."
        subtitle="FBAR, FATCA, Indian accounts and U.S. filing — explained in plain words, with the exact next step for your situation."
        crumbs={[{ label: "Guides", href: "/guides" }]}
      />
      <section className="section-y">
        <p className="container-x mb-8 text-[15px] text-muted">
          Looking for dates? See the{" "}
          <Link href="/tax-deadlines" className="font-semibold text-brand-600 hover:underline">
            U.S. and India tax deadlines for 2026–2027
          </Link>
          . Every guide links to its official sources —{" "}
          <Link href="/disclaimer" className="font-semibold text-brand-600 hover:underline">
            how we write and update them
          </Link>
          .
        </p>
        <div className="container-x grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="card card-hover group flex flex-col p-6">
              <p className="eyebrow">{g.category}</p>
              <h2 className="mt-3 text-xl font-bold leading-snug text-navy-900">{g.title}</h2>
              <p className="mt-3 flex-1 text-[15px] text-muted">{g.description}</p>
              <p className="mt-5 flex items-center justify-between text-sm text-subtle">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden /> {g.readMinutes} min read · {fmt(g.updated)}
                </span>
                <ArrowRight className="size-4 text-brand-600 transition group-hover:translate-x-1" aria-hidden />
              </p>
            </Link>
          ))}
        </div>
      </section>
      <FinalCta title="Not sure which forms you need?" copy="Tell us about your accounts in India and the U.S. — we'll tell you exactly what to file." />
    </>
  );
}
