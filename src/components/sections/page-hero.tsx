import { ParallaxDecor } from "@/components/effects/parallax-decor";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { site } from "@/lib/site";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  crumbs,
  primary = { label: "Get Started", href: "/get-started" },
  secondary = { label: "Talk to a Tax Professional", href: "/contact" },
  aside,
  showCallLine = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumbs: Crumb[];
  primary?: { label: string; href: string } | null;
  secondary?: { label: string; href: string } | null;
  aside?: React.ReactNode;
  showCallLine?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-canvas">
      <ParallaxDecor flip />
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" aria-hidden />
      <div className="container-x relative py-12 sm:py-16 lg:py-20">
        <Breadcrumbs items={crumbs} />
        <div className={aside ? "mt-8 grid items-center gap-12 lg:grid-cols-12" : "mt-8"}>
          <div className={aside ? "lg:col-span-7" : "max-w-3xl"}>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1 className="mt-3 text-[34px] font-extrabold leading-[1.08] sm:text-5xl lg:text-[56px]">{title}</h1>
            {subtitle && <p className="lead-copy mt-5 max-w-2xl">{subtitle}</p>}
            {(primary || secondary) && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {primary && (
                  <Button asChild size="lg">
                    <Link href={primary.href}>
                      {primary.label} <ArrowRight aria-hidden />
                    </Link>
                  </Button>
                )}
                {secondary && (
                  <Button asChild size="lg" variant="secondary">
                    <Link href={secondary.href}>{secondary.label}</Link>
                  </Button>
                )}
              </div>
            )}
            {showCallLine && (
              <p className="mt-5 flex items-center gap-2 text-sm text-muted">
                <Phone className="size-4 text-brand-600" aria-hidden />
                Prefer to talk? Call <a href={site.phone.href} className="font-semibold text-navy-900 hover:text-brand-600">{site.phone.display}</a>
              </p>
            )}
          </div>
          {aside && <div className="lg:col-span-5">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
