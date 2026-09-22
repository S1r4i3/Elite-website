import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "./section-header";
import { ServicesGalaxy } from "@/components/effects/services-galaxy";

const items = [
  { href: "/federal-tax-filing", icon: "FileText", title: "Federal Tax Filing", description: "Professional preparation and filing support for your federal individual return." },
  { href: "/state-tax-filing", icon: "MapPin", title: "State Tax Filing", description: "State-specific tax filing assistance for residents, part-year and multi-state filers." },
  { href: "/fbar", icon: "Globe2", title: "FBAR / FATCA", description: "Support for international financial reporting requirements, including foreign accounts." },
  { href: "/itin", icon: "IdCard", title: "ITIN Services", description: "Assistance with ITIN applications, renewals and related documentation." },
  { href: "/tax-amendment", icon: "FilePen", title: "Tax Amendments", description: "Help correcting previously filed tax returns with Form 1040-X and state amendments." },
  { href: "/irs-representation", icon: "ShieldCheck", title: "IRS Representation", description: "Professional assistance with IRS-related issues, notices and the audit process." },
];

export function ServicesGrid() {
  return (
    <section className="section-y relative isolate overflow-hidden bg-navy-950 text-white" aria-labelledby="services-heading">
      {/* Background: deep navy + brand glows + interactive starfield */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_15%_0%,rgb(200_16_46/0.28),transparent_60%),radial-gradient(ellipse_60%_50%_at_95%_100%,rgb(200_16_46/0.18),transparent_60%)]" />
      </div>
      <ServicesGalaxy />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" aria-hidden />

      <div className="container-x relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            align="left"
            dark
            eyebrow="Individual tax services"
            title={
              <span id="services-heading">
                Tax Services Built Around <span className="text-shimmer">Your Situation</span>
              </span>
            }
            subtitle="Whether it's a simple W-2 return or foreign accounts and an IRS letter, we match you with the right service."
          />
          <Button asChild variant="outlineLight" className="shrink-0 self-start md:self-auto">
            <Link href="/tax-services">
              All tax services <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((s, i) => (
            <Link
              key={s.href}
              href={s.href}
              data-reveal
              data-cursor="View"
              style={{ transitionDelay: `${i * 60}ms` }}
              className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-brand-300/60 hover:bg-white/[0.09] hover:shadow-[0_20px_50px_-12px_rgb(200_16_46/0.45)] sm:p-7"
            >
              {/* hover glow */}
              <span className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-brand-600/0 blur-2xl transition duration-500 group-hover:bg-brand-600/30" aria-hidden />
              <span className="relative grid size-12 place-items-center rounded-2xl border border-white/15 bg-white/10 text-brand-200 transition duration-300 group-hover:rotate-[-6deg] group-hover:scale-110 group-hover:border-brand-500 group-hover:bg-brand-600 group-hover:text-white">
                <Icon name={s.icon} className="size-[22px]" />
              </span>
              <h3 className="relative mt-5 text-lg font-bold text-white">{s.title}</h3>
              <p className="relative mt-2 flex-1 text-[15px] leading-relaxed text-white/65">{s.description}</p>
              <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-200 transition group-hover:text-white">
                Learn More <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
