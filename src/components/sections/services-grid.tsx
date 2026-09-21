import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./section-header";
import { ServiceCard } from "./service-card";

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
    <section className="section-y" aria-labelledby="services-heading">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            align="left"
            eyebrow="Individual tax services"
            title={<span id="services-heading">Tax Services Built Around Your Situation</span>}
            subtitle="Whether it's a simple W-2 return or foreign accounts and an IRS letter, we match you with the right service."
          />
          <Button asChild variant="secondary" className="shrink-0 self-start md:self-auto">
            <Link href="/tax-services">
              All tax services <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((s) => (
            <ServiceCard key={s.href} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
