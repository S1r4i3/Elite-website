import Link from "next/link";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export function FinalCta({
  title = "Ready to Get Your Taxes Sorted?",
  copy = "Start with a simple conversation. Tell us what you need and we'll help you determine the right next step.",
  primary = { label: "Get Started", href: "/get-started" },
  secondary = { label: "Talk to a Tax Professional", href: "/contact" },
}: {
  title?: string;
  copy?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
      <div data-reveal className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[28px] slate-bg px-6 py-14 text-center sm:px-12 sm:py-20">
        <div className="grid-bg-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[640px] -translate-x-1/2 rounded-full bg-brand-600/25 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -left-10 bottom-6 hidden md:block" data-parallax="-0.15" suppressHydrationWarning aria-hidden>
          <div data-depth="30" suppressHydrationWarning className="size-36 rounded-full border-2 border-white/10" />
        </div>
        <div className="pointer-events-none absolute right-10 top-10 hidden md:block" data-parallax="0.2" suppressHydrationWarning aria-hidden>
          <div data-depth="-24" suppressHydrationWarning className="size-24" style={{ backgroundImage: "radial-gradient(rgb(255 255 255 / 0.2) 1.5px, transparent 1.6px)", backgroundSize: "12px 12px" }} />
        </div>
        <div className="pointer-events-none absolute bottom-12 right-[18%] hidden md:block" data-parallax="-0.3" suppressHydrationWarning aria-hidden>
          <div data-depth="36" suppressHydrationWarning className="size-3 rotate-45 rounded-[3px] bg-brand-500 shadow-[0_0_20px_rgb(227_25_47/0.7)]" />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">{title}</h2>
          <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">{copy}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="btn-shine" data-magnetic>
              <Link href={primary.href}>
                {primary.label} <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outlineLight" data-magnetic>
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          </div>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 text-sm text-white/60 sm:flex-row sm:gap-6">
            <a href={site.phone.href} className="inline-flex items-center gap-2 hover:text-white">
              <Phone className="size-4" aria-hidden /> {site.phone.display}
            </a>
            <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-white">
              <Mail className="size-4" aria-hidden /> {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
