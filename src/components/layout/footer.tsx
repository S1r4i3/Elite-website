import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./logo";
import { site } from "@/lib/site";

const cols = [
  {
    title: "Tax Services",
    links: [
      { label: "Federal Tax Filing", href: "/federal-tax-filing" },
      { label: "State Tax Filing", href: "/state-tax-filing" },
      { label: "FBAR", href: "/fbar" },
      { label: "FATCA", href: "/fatca" },
      { label: "ITIN", href: "/itin" },
      { label: "Tax Amendments", href: "/tax-amendment" },
      { label: "IRS Representation", href: "/irs-representation" },
      { label: "Indian Tax Services", href: "/indian-tax-services" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "LLC Services", href: "/llc-services" },
      { label: "Entity Formation", href: "/entity-formation" },
      { label: "Corporate Tax", href: "/corporate-tax" },
      { label: "Bookkeeping", href: "/bookkeeping" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Contact", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Reviews", href: "/reviews" },
      { label: "Privacy Policy", href: "" },
      { label: "Terms & Conditions", href: "" },
    ],
  },
];

const socialGlyph: Record<string, string> = { facebook: "f", twitter: "X", linkedin: "in" };

export function Footer() {
  const socials = Object.entries(site.social).filter(([, url]) => url);
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white/70">
      <div className="container-x pb-28 pt-16 md:pb-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed">
              Individual, business and U.S. + India tax services — prepared by professionals and explained in plain language.
            </p>
            <ul className="mt-6 space-y-3 text-[15px]">
              <li>
                <a href={site.phone.href} className="inline-flex items-center gap-3 hover:text-white">
                  <Phone className="size-4 text-brand-500" aria-hidden /> {site.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 hover:text-white">
                  <Mail className="size-4 text-brand-500" aria-hidden /> {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                <address className="not-italic">{site.address.display}</address>
              </li>
            </ul>
            {socials.length > 0 && (
              <ul className="mt-6 flex gap-2" aria-label="Social media">
                {socials.map(([name, url]) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="grid size-10 place-items-center rounded-full border border-white/15 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/5"
                    >
                      {socialGlyph[name]}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            {cols.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.12em] text-white">{col.title}</h2>
                <ul className="mt-5 space-y-3 text-[15px]">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} className="transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-[13px] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Elite B Tax Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
