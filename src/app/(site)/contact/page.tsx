import { Mail, MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { LeadForm } from "@/components/forms/lead-form";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Elite B Tax Services — Talk to a Tax Professional",
  description: `Call ${site.phone.display} or email ${site.email} to talk to a tax professional about U.S. or India tax filing. Office in Dover, Delaware.`,
  path: "/contact",
});

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const mapQuery = encodeURIComponent(`${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`);
  const items = [
    { icon: Phone, label: "Call us", value: site.phone.display, href: site.phone.href },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: "Office", value: site.address.display, href: `https://www.google.com/maps/search/?api=1&query=${mapQuery}` },
  ];
  return (
    <section className="relative overflow-hidden bg-canvas">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_60%)]" aria-hidden />
      <div className="container-x relative py-10 sm:py-14 lg:py-20">
        <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow">Contact</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.08] sm:text-5xl">Talk to a tax professional.</h1>
            <p className="lead-copy mt-5">Tell us what you need and we&apos;ll help you determine the right next step. Prefer to talk now? Give us a call.</p>
            <ul className="mt-10 space-y-3">
              {items.map(({ icon: I, label, value, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="card card-hover flex items-center gap-4 p-4"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                      <I className="size-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[13px] text-muted">{label}</span>
                      <span className="block font-semibold text-navy-900">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <LeadForm defaultService={service} source="contact" submitLabel="Send Message" />
          </div>
        </div>
      </div>
    </section>
  );
}
