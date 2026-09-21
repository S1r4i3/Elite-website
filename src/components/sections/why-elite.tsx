import { Users, Layers, Globe2, Route, Headphones, ShieldCheck } from "lucide-react";
import { SectionHeader } from "./section-header";
import { site } from "@/lib/site";

const reasons = [
  { icon: Users, title: "Experienced Professionals", body: "Returns prepared by a team that includes CPAs, CAs, EAs and PTIN-holding tax preparers." },
  { icon: Layers, title: "Individual & Business Tax Services", body: "Personal returns, business returns, bookkeeping and payroll — handled by one team." },
  { icon: Globe2, title: "U.S. + India Tax Support", body: "A dedicated India processing team for Indian returns, coordinated with your U.S. filing." },
  { icon: Route, title: "Simple Process", body: "Four clear steps, a tailored document checklist and plain-English explanations." },
  { icon: Headphones, title: "Responsive Support", body: "Reach a real person by phone or email when you have questions." },
  { icon: ShieldCheck, title: "Secure Document Handling", body: "Documents are uploaded over HTTPS and stored privately — not sent around by email." },
];

export function WhyElite() {
  return (
    <section className="section-y" aria-labelledby="why-heading">
      <div className="container-x">
        <SectionHeader eyebrow="Why Elite" title={<span id="why-heading">Why Clients Choose Elite</span>} subtitle="Accessible, approachable and accountable — tax help that's easy to understand." />
        <div className="mt-12 grid gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ icon: I, title, body }) => (
            <div key={title} data-reveal className="bg-white p-6 sm:p-8">
              <I className="size-7 text-brand-600" strokeWidth={1.5} aria-hidden />
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-muted">
          {site.credentials.map((c) => (
            <li key={c} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand-600" aria-hidden /> {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
