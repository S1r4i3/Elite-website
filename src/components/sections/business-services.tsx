import { ParallaxDecor } from "@/components/effects/parallax-decor";
import Link from "next/link";
import { ArrowRight, Building2, Briefcase, BookOpen, Wallet, LineChart, Network, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./section-header";

const list = [
  { icon: Building2, label: "LLC Formation", href: "/llc-services" },
  { icon: Briefcase, label: "Corporate Tax Filing", href: "/corporate-tax" },
  { icon: BookOpen, label: "Bookkeeping", href: "/bookkeeping" },
  { icon: Wallet, label: "Payroll", href: "/payroll" },
  { icon: LineChart, label: "Business Tax Planning", href: "/business-services#planning" },
  { icon: Network, label: "Entity Formation", href: "/entity-formation" },
];

function BusinessVisual() {
  const bars = [42, 55, 48, 66, 58, 74, 70, 82, 76, 90, 84, 96];
  return (
    <div className="relative" role="img" aria-label="Illustration of a business finance dashboard with revenue chart, filing calendar and payroll status">
      <div className="rounded-[22px] border border-white/10 bg-navy-800/60 p-5 backdrop-blur sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50">Business overview</p>
            <p className="font-display text-lg font-bold text-white">Acme Studio LLC</p>
          </div>
          <span className="rounded-full bg-success-600/15 px-2.5 py-1 text-xs font-semibold text-green-300">Books reconciled</span>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { k: "Revenue", v: "$184.2k" },
            { k: "Expenses", v: "$96.8k" },
            { k: "Net income", v: "$87.4k" },
          ].map((m) => (
            <div key={m.k} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] text-white/50">{m.k}</p>
              <p className="mt-1 font-display text-base font-bold text-white sm:text-lg">{m.v}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-[11px] text-white/50">
            <span>Monthly revenue</span>
            <span>Jan – Dec</span>
          </div>
          <div className="mt-3 flex h-28 items-end gap-1.5">
            {bars.map((h, i) => (
              <span key={i} className={i === bars.length - 1 ? "flex-1 rounded-t bg-brand-500" : "flex-1 rounded-t bg-white/15"} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] text-white/50">Next filing</p>
            <p className="mt-1 text-sm font-semibold text-white">Form 1120-S · Mar 15</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-4/5 rounded-full bg-brand-500" />
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] text-white/50">Payroll</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-white">
              <Check className="size-4 text-green-300" /> Q3 941 filed
            </p>
            <p className="mt-2 text-[11px] text-white/50">Next run in 4 days</p>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-white/40">Illustrative example</p>
    </div>
  );
}

export function BusinessServices() {
  return (
    <section className="slate-bg relative isolate overflow-hidden py-16 sm:py-20 lg:py-24" aria-labelledby="business-heading">
      <ParallaxDecor variant="dark" flip />
      <div className="grid-bg-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_right,black,transparent_70%)]" aria-hidden />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeader
            dark
            align="left"
            eyebrow="Business services"
            title={<span id="business-heading">Tax & Individual Business Tax Services</span>}
            subtitle="From forming your company to payroll and year-end returns — one team that understands both your books and your taxes."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {list.map(({ icon: I, label, href }) => (
              <li key={label}>
                <Link href={href} className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 text-[15px] font-medium text-white transition hover:border-white/25 hover:bg-white/10">
                  <span className="grid size-9 place-items-center rounded-lg bg-brand-600/20 text-brand-200">
                    <I className="size-[18px]" strokeWidth={1.75} aria-hidden />
                  </span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" variant="white" className="mt-9">
            <Link href="/business-services">
              Explore Business Services <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="lg:col-span-7 lg:pl-8" data-reveal>
          <BusinessVisual />
        </div>
      </div>
    </section>
  );
}
