import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Building2, FilePen, FileText, Globe2, IdCard, IndianRupee, Phone, ShieldCheck, Star } from "lucide-react";
import { site } from "@/lib/site";

const options = [
  { href: "/federal-tax-filing", icon: FileText, title: "Individual Tax", note: "Federal & state returns" },
  { href: "/business-services", icon: Building2, title: "Business Tax", note: "LLC, corporate & payroll" },
  { href: "/fbar", icon: Globe2, title: "FBAR / FATCA", note: "Foreign accounts" },
  { href: "/indian-tax-services", icon: IndianRupee, title: "India / NRI Tax", note: "U.S. + India filing" },
  { href: "/itin", icon: IdCard, title: "ITIN Services", note: "Apply or renew" },
  { href: "/irs-representation", icon: FilePen, title: "IRS Notices", note: "Letters & audits" },
] as const;

/** Glass "quick start" panel shown over the hero video. */
export function HeroQuickStart() {
  const rating = site.stats.show ? site.stats.rating : null;
  return (
    <div className="relative mx-auto max-w-[540px] animate-fade-up [animation-delay:150ms]">
      {/* Floating badge */}
      <div className="float-y absolute -top-4 right-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-black/30">
        <BadgeCheck className="size-3.5" aria-hidden /> IRS authorized e-file provider
      </div>

      <div className="gradient-border relative rounded-3xl border border-white/15 bg-white/[0.07] p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-7">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden><div className="absolute -right-20 -top-24 size-64 animate-pulse rounded-full bg-brand-600/25 blur-3xl" /></div>

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-200">Get started in minutes</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight text-white sm:text-[28px]">
            What can we help you with?
          </h2>

          <ul className="stagger mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
            {options.map(({ href, icon: Icon, title, note }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex h-full items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3 transition duration-200 hover:-translate-y-0.5 hover:border-brand-300/60 hover:bg-white/[0.12] focus-visible:border-brand-300 sm:p-3.5"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-600/90 text-white shadow-md shadow-black/30 transition group-hover:rotate-[-6deg] group-hover:scale-110">
                    <Icon className="size-[18px]" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1 text-sm font-semibold text-white">
                      {title}
                      <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-100" aria-hidden />
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-white/60">{note}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <Link
              href="/get-started"
              className="btn-shine group inline-flex h-12 items-center sm:flex-1 justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-navy-900 transition hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-lg hover:shadow-black/30"
            >
              <span>Start my return</span> <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <a
              href={site.phone.href}
              className="phone-ring inline-flex h-12 items-center sm:flex-1 justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
            >
              <Phone className="size-4" aria-hidden /> {site.phone.display}
            </a>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-white/65">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-brand-300" aria-hidden /> Free consultation · Secure document upload
            </span>
            {rating && (
              <span className="inline-flex items-center gap-1.5">
                <span className="flex text-amber-400" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </span>
                <span className="font-semibold text-white">{rating.value}{rating.suffix}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
