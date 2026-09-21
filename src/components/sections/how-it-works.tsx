import { ClipboardList, FolderUp, UserRoundCheck, Send } from "lucide-react";
import { SectionHeader } from "./section-header";

export const processSteps = [
  { n: "01", title: "Tell Us About Yourself", body: "Share your situation online or by phone. We'll confirm the services you need and send a document checklist.", icon: ClipboardList },
  { n: "02", title: "Upload Your Documents", body: "Upload W-2s, 1099s and other documents securely — drag & drop on desktop or snap photos on your phone.", icon: FolderUp },
  { n: "03", title: "Professional Review", body: "A tax professional prepares your return, reviews it for accuracy and walks you through the results.", icon: UserRoundCheck },
  { n: "04", title: "File & Track", body: "Once you approve, we file your return and keep you updated until it's accepted.", icon: Send },
];

export function HowItWorks({ title = "How It Works", subtitle = "A simple, guided process from first conversation to filed return.", as = "h2" }: { title?: string; subtitle?: string; as?: "h1" | "h2" }) {
  return (
    <section className="section-y" aria-labelledby="how-heading">
      <div className="container-x">
        <SectionHeader as={as} eyebrow="Simple process" title={<span id="how-heading">{title}</span>} subtitle={subtitle} />
        <ol className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Timeline line (desktop) */}
          <div className="absolute left-0 right-0 top-7 hidden h-0.5 lg:block" aria-hidden>
            <div className="mx-[12.5%] h-full bg-gradient-to-r from-brand-600 via-brand-200 to-line" />
          </div>
          {processSteps.map((s, i) => (
            <li key={s.n} data-reveal style={{ transitionDelay: `${i * 80}ms` }} className="relative lg:text-center">
              <div className="flex items-center gap-4 lg:flex-col lg:gap-0">
                <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl border border-line bg-white text-brand-600 shadow-[var(--shadow-soft)]">
                  <s.icon className="size-6" strokeWidth={1.75} aria-hidden />
                  <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-navy-900 text-[10px] font-bold text-white">{s.n}</span>
                </span>
                <h3 className="text-lg font-bold lg:mt-6">{s.title}</h3>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-muted lg:mx-auto lg:max-w-[260px]">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
