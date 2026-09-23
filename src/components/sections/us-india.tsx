import { ParallaxDecor } from "@/components/effects/parallax-decor";
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

const usItems = ["Form 1040 / 1040-NR", "State returns", "FBAR · Form 8938", "Foreign tax credit"];
const indiaItems = ["ITR filing", "TDS & Form 26AS", "Capital gains", "DTAA relief"];

function Panel({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="link-panel w-full rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-soft)] sm:w-[39%]">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{label}</p>
      <ul className="tick-in mt-3 space-y-2 text-[13px] text-ink">
        {items.map((t) => (
          <li key={t} className="flex items-center gap-2 whitespace-nowrap">
            <Check className="size-3.5 shrink-0 text-success-600" /> {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConnectionGraphic() {
  return (
    <div className="card relative overflow-hidden p-6 sm:p-8" role="img" aria-label="Diagram connecting U.S. tax filing and Indian tax filing through Elite B Tax Services">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center sm:gap-2">
        <Panel label="United States" items={usItems} />

        {/* Connector: animated dashes running between the two panels, logo centred on top */}
        <div className="relative flex flex-1 flex-col items-center justify-center self-center py-1 sm:py-0">
          <span className="dash-v sm:hidden" aria-hidden />

          <svg viewBox="0 0 120 40" className="absolute -inset-x-3 top-1/2 hidden h-10 -translate-y-1/2 sm:block" aria-hidden>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0 0L10 5L0 10z" fill="#C8102E" />
              </marker>
            </defs>
            <path id="wire" d="M4 20 H116" stroke="#C8102E" strokeWidth="2" strokeDasharray="4 4" markerStart="url(#arrow)" markerEnd="url(#arrow)" className="dash-flow" />
            <circle r="2.6" fill="#C8102E" className="packet" style={{ offsetPath: "path('M4 20 H116')" }} />
            <circle r="2.6" fill="#16a34a" className="packet packet-back" style={{ offsetPath: "path('M4 20 H116')" }} />
          </svg>

          <span className="hub-pulse relative z-10 grid size-14 place-items-center rounded-2xl border border-line bg-white p-2.5 shadow-[var(--shadow-lift)]">
            <Image src="/brand/ebt-mark.png" alt="" width={48} height={24} className="h-auto w-full" priority={false} />
          </span>

          <span className="dash-v mt-1 sm:hidden" aria-hidden />
        </div>

        <Panel label="India" items={indiaItems} />
      </div>
    </div>
  );
}

export function UsIndia() {
  return (
    <section className="section-y relative isolate overflow-hidden" aria-labelledby="usindia-heading">
      <ParallaxDecor />
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="order-2 lg:order-1 lg:col-span-6" data-reveal>
          <ConnectionGraphic />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-6">
          <SectionHeader
            align="left"
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
