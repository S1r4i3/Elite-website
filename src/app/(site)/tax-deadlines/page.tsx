import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata, webPageSchema } from "@/lib/seo";

const title = "Tax Deadlines 2026–2027: U.S. and India Due Dates";
const description =
  "Key U.S. and India tax due dates from October 2026 to October 2027: individual and business returns, FBAR, estimated taxes, payroll forms and Indian ITR filing.";
export const metadata = pageMetadata({ title, description, path: "/tax-deadlines", keywords: ["tax deadlines 2027", "FBAR deadline", "estimated tax due dates", "1065 due date", "ITR due date NRI"] });

type Row = { date: string; who: "Individuals" | "Businesses" | "Employers" | "India"; what: string; link?: { href: string; label: string } };

/**
 * Calendar-year rules. Dates already moved for weekends: Oct 31, 2026 (Sat) → Nov 2; Jan 31, 2027 (Sun) → Feb 1;
 * Jul 31, 2027 (Sat) → Aug 2 for Form 941. India's July 31 date is shown as published (it is not moved for weekends).
 */
const rows: Row[] = [
  { date: "2026-10-15", who: "Individuals", what: "Extended 2025 Form 1040 returns are due (if you filed Form 4868). Extended FBAR for 2025 is due.", link: { href: "/fbar", label: "FBAR filing" } },
  { date: "2026-10-15", who: "Businesses", what: "Extended 2025 Form 1120 (C corporation) returns are due." },
  { date: "2026-11-02", who: "Employers", what: "Form 941 for July–September 2026 (October 31 falls on a Saturday).", link: { href: "/payroll", label: "Payroll" } },
  { date: "2026-12-15", who: "India", what: "Advance tax installment: 75% of the year's estimated tax paid by this date." },
  { date: "2027-01-15", who: "Individuals", what: "Fourth estimated tax payment for 2026.", link: { href: "/guides/estimated-tax-payments", label: "Estimated taxes guide" } },
  { date: "2027-02-01", who: "Employers", what: "W-2s to employees and the SSA, 1099-NEC to contractors and the IRS, Form 941 for Q4 and Form 940 (January 31 falls on a Sunday).", link: { href: "/bookkeeping", label: "Bookkeeping" } },
  { date: "2027-03-15", who: "Businesses", what: "2026 Form 1065 (partnerships and multi-member LLCs) and Form 1120-S (S corporations), with K-1s to owners. Also the usual date for a calendar-year Form 2553 election for 2027.", link: { href: "/corporate-tax", label: "Business tax filing" } },
  { date: "2027-03-15", who: "India", what: "Final advance tax installment: 100% of the year's estimated tax." },
  { date: "2027-04-15", who: "Individuals", what: "2026 Form 1040, and Form 1040-NR if you had wages subject to withholding. FBAR for 2026. First estimated tax payment for 2027. Form 4868 extends filing to October 15 — not payment.", link: { href: "/federal-tax-filing", label: "Federal tax filing" } },
  { date: "2027-04-15", who: "Businesses", what: "2026 Form 1120 for calendar-year C corporations (Form 7004 extends filing by six months). First 2027 corporate estimated payment." },
  { date: "2027-04-30", who: "Employers", what: "Form 941 for January–March 2027." },
  { date: "2027-06-15", who: "Individuals", what: "Second estimated tax payment for 2027. Form 1040 for U.S. citizens and residents living abroad (automatic two-month extension), and Form 1040-NR when you had no wages subject to withholding." },
  { date: "2027-06-15", who: "India", what: "First advance tax installment: 15% of the year's estimated tax." },
  { date: "2027-07-31", who: "India", what: "Usual ITR due date for individuals who don't need an audit, for income earned April 2026–March 2027. The government sometimes extends it.", link: { href: "/indian-tax-services", label: "Indian tax services" } },
  { date: "2027-08-02", who: "Employers", what: "Form 941 for April–June 2027 (July 31 falls on a Saturday)." },
  { date: "2027-09-15", who: "Individuals", what: "Third estimated tax payment for 2027." },
  { date: "2027-09-15", who: "Businesses", what: "Extended 2026 Form 1065 and Form 1120-S returns are due." },
  { date: "2027-09-15", who: "India", what: "Advance tax installment: 45% of the year's estimated tax." },
  { date: "2027-10-15", who: "Individuals", what: "Extended 2026 Form 1040 returns and extended FBAR for 2026 are due." },
  { date: "2027-10-15", who: "Businesses", what: "Extended 2026 Form 1120 returns are due." },
];

const fmt = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const dot: Record<Row["who"], string> = {
  Individuals: "bg-brand-600",
  Businesses: "bg-navy-900",
  Employers: "bg-warn-700",
  India: "bg-success-600",
};

export default function TaxDeadlinesPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ title, description, path: "/tax-deadlines" })} />
      <PageHero
        eyebrow="Resources"
        title="Tax deadlines for 2026–2027"
        subtitle="U.S. federal, payroll and FBAR due dates for calendar-year filers, plus the main India dates for NRIs — in one list."
        crumbs={[{ label: "Tax Deadlines", href: "/tax-deadlines" }]}
        primary={{ label: "Get Started", href: "/get-started" }}
      />
      <section className="section-y">
        <div className="container-x max-w-4xl">
          <p className="flex items-start gap-3 rounded-2xl border border-line bg-canvas p-4 text-[15px] text-muted">
            <CalendarClock className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
            <span>
              Dates assume a calendar tax year. When a U.S. due date falls on a weekend or legal holiday, it moves to the next business day — already applied
              below. State due dates can differ. Last reviewed October 7, 2026.
            </span>
          </p>
          {/* Phones: a stacked list; larger screens: the table */}
          <ol className="mt-8 space-y-3 md:hidden">
            {rows.map((r) => (
              <li key={r.date + r.who} className="rounded-2xl border border-line p-4">
                <p className="flex flex-wrap items-center justify-between gap-2">
                  <time dateTime={r.date} className="font-semibold text-navy-900">
                    {fmt(r.date)}
                  </time>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs font-semibold text-navy-900">
                    <span className={`size-1.5 rounded-full ${dot[r.who]}`} aria-hidden />
                    {r.who}
                  </span>
                </p>
                <p className="mt-2 text-[15px] text-ink">
                  {r.what}
                  {r.link && (
                    <>
                      {" "}
                      <Link href={r.link.href} className="font-semibold text-brand-600 hover:underline">
                        {r.link.label} →
                      </Link>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-8 hidden overflow-x-auto rounded-2xl border border-line md:block">
            <table className="w-full min-w-[620px] text-left text-[15px]">
              <caption className="sr-only">U.S. and India tax deadlines, October 2026 to October 2027</caption>
              <thead className="bg-canvas text-navy-900">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                  <th scope="col" className="px-4 py-3 font-semibold">For</th>
                  <th scope="col" className="px-4 py-3 font-semibold">What is due</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.date + r.who} className="border-t border-line align-top">
                    <th scope="row" className="whitespace-nowrap px-4 py-3 font-semibold text-navy-900">
                      <time dateTime={r.date}>{fmt(r.date)}</time>
                    </th>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-2.5 py-1 text-xs font-semibold text-navy-900">
                        <span className={`size-1.5 rounded-full ${dot[r.who]}`} aria-hidden />
                        {r.who}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink">
                      {r.what}
                      {r.link && (
                        <>
                          {" "}
                          <Link href={r.link.href} className="font-semibold text-brand-600 hover:underline">
                            {r.link.label} →
                          </Link>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 rounded-2xl border border-line p-5 text-sm leading-6 text-muted">
            <p>
              <strong className="text-navy-900">Sources:</strong>{" "}
              <a className="underline" href="https://www.irs.gov/filing/individuals/when-to-file" target="_blank" rel="noopener">IRS — When to file</a> ·{" "}
              <a className="underline" href="https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes" target="_blank" rel="noopener">IRS — Estimated taxes</a> ·{" "}
              <a className="underline" href="https://www.irs.gov/publications/p509" target="_blank" rel="noopener">IRS Publication 509 (Tax Calendars)</a> ·{" "}
              <a className="underline" href="https://www.fincen.gov/report-foreign-bank-and-financial-accounts" target="_blank" rel="noopener">FinCEN — FBAR</a> ·{" "}
              <a className="underline" href="https://www.incometax.gov.in/iec/foportal/" target="_blank" rel="noopener">Income Tax Department of India</a>
            </p>
            <p className="mt-2">
              General information for calendar-year filers, not advice. <Link href="/disclaimer" className="underline">Disclaimer</Link>.
            </p>
          </div>
        </div>
      </section>
      <FinalCta title="Want us to track your deadlines?" copy="Tell us what you file in the U.S. and India — we'll plan the dates and prepare everything on time." />
    </>
  );
}
