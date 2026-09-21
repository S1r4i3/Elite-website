import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./section-header";

const services = [
  { title: "Indian Tax Filing", body: "Indian income tax returns (ITR) prepared by our dedicated India team." },
  { title: "NRI Tax Support", body: "Residency status, TDS refunds and Indian-source income for NRIs." },
  { title: "FBAR / FATCA", body: "U.S. reporting of NRE/NRO accounts, deposits and investments." },
  { title: "Cross-Border Tax Assistance", body: "Coordinating both returns under the India–U.S. tax treaty." },
];

function ConnectionGraphic() {
  return (
    <div className="card relative overflow-hidden p-6 sm:p-8" role="img" aria-label="Diagram connecting U.S. tax filing and Indian tax filing through Elite Tax">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <div className="w-full rounded-2xl sm:w-[42%] border border-line bg-white p-4 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">United States</p>
          <ul className="mt-3 space-y-2 text-[13px] text-ink">
            {["Form 1040 / 1040-NR", "State returns", "FBAR · Form 8938", "Foreign tax credit"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="size-3.5 shrink-0 text-success-600" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex flex-1 flex-col items-center">
          <span className="h-6 border-l-2 border-dashed border-brand-600 sm:hidden" aria-hidden />
          <svg viewBox="0 0 120 40" className="hidden w-full sm:block" aria-hidden>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0 0L10 5L0 10z" fill="#C8102E" />
              </marker>
            </defs>
            <path d="M4 20 H116" stroke="#C8102E" strokeWidth="2" strokeDasharray="4 4" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          </svg>
          <span className="-mt-1 grid size-14 place-items-center rounded-2xl bg-navy-900 p-2 shadow-[var(--shadow-lift)]">
            <Image src="/brand/ebt-mark.png" alt="" width={44} height={22} className="h-auto w-full" />
          </span>
          <span className="mt-2 text-center text-[11px] font-medium text-muted">One team</span>
          <span className="mt-2 h-6 border-l-2 border-dashed border-brand-600 sm:hidden" aria-hidden />
        </div>
        <div className="w-full rounded-2xl sm:w-[42%] border border-line bg-white p-4 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">India</p>
          <ul className="mt-3 space-y-2 text-[13px] text-ink">
            {["ITR filing", "TDS & Form 26AS", "Capital gains", "DTAA relief"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="size-3.5 shrink-0 text-success-600" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function UsIndia() {
  return (
    <section className="section-y" aria-labelledby="usindia-heading">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="order-2 lg:order-1 lg:col-span-6" data-reveal>
          <ConnectionGraphic />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-6">
          <SectionHeader
            align="left"
            eyebrow="U.S. + India"
            title={<span id="usindia-heading">U.S. + India Tax Support Under One Roof</span>}
            subtitle="Elite Tax supports clients with U.S. tax requirements and Indian tax-related needs — so NRIs, visa holders and families don't have to juggle two firms."
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.title} className="rounded-2xl border border-line p-4">
                <p className="font-display font-bold text-navy-900">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-8">
            <Link href="/indian-tax-services">
              Explore International Tax Services <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
