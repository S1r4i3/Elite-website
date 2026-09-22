import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustStats } from "./trust-stats";
import { HeroQuickStart } from "./hero-quick-start";
import { HeroVideo } from "./hero-video";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <>
    <section className="slate-bg relative overflow-hidden text-white">
      <HeroVideo />
      <div className="grid-bg-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_70%_20%,black,transparent)]" aria-hidden />
      <div className="pointer-events-none absolute -right-40 -top-40" data-parallax="-0.2" suppressHydrationWarning aria-hidden>
        <div data-depth="40" suppressHydrationWarning className="size-[560px] rounded-full bg-brand-600/20 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-600/60 to-transparent" aria-hidden />
      <div className="container-x relative grid items-center gap-14 pb-16 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-20">
        <div className="lg:col-span-6" data-parallax="-0.08" suppressHydrationWarning>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[13px] font-medium text-white/80 backdrop-blur">
            <span className="size-2 rounded-full bg-brand-500 shadow-[0_0_0_3px_rgb(227_25_47/0.25)]" aria-hidden />
            Individual, business & U.S. + India tax services
          </p>
          <h1 className="mt-6 text-[40px] font-extrabold leading-[1.04] text-white sm:text-6xl lg:text-[64px]">
            Your Taxes. Done Right.{" "}
            <span className="text-shimmer">Without the Stress.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Professional tax preparation and business tax services designed to make filing simpler, clearer, and more convenient.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="btn-shine btn-glow" data-magnetic>
              <Link href="/get-started">
                Get Started Today <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outlineLight" className="phone-ring" data-magnetic>
              <Link href="/contact"><Phone aria-hidden /> Talk to a Tax Professional</Link>
            </Button>
          </div>
          <ul className="stagger mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
            {["Registered IRS e-file provider (ERO)", "Federal, state & international", "Upload from your phone"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-brand-300" aria-hidden /> {t}
              </li>
            ))}
          </ul>
          <TrustStats dark className="mt-10 border-t border-white/10 pt-8" />
          {site.stats.show && <p className="mt-3 text-xs text-white/55">{site.stats.sourceNote}</p>}
          <a href={site.phone.href} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-brand-200 sm:hidden">
            <Phone className="size-4" aria-hidden /> {site.phone.display}
          </a>
        </div>
        <div className="lg:col-span-6" data-depth="-14" suppressHydrationWarning>
          <HeroQuickStart />
        </div>
      </div>
      <a href="#main-after-hero" aria-label="Scroll to services" className="scroll-cue absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50 transition hover:text-white lg:flex">
        <span className="block h-8 w-5 rounded-full border-2 border-current p-1" aria-hidden>
          <span className="mx-auto block h-1.5 w-1 rounded-full bg-current" />
        </span>
        Scroll
      </a>
    </section>
    <div id="main-after-hero" aria-hidden />
    </>
  );
}
