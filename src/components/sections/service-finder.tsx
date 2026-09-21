"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Briefcase, Building2, FilePen, FileText, Globe2, IdCard, RefreshCcw, ShieldAlert, Sparkles, Check,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

type Rec = { title: string; body: string; services: { label: string; href: string }[]; cta: { label: string; href: string } };
type Option = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  question?: { text: string; yes: Rec; no: Rec };
  rec?: Rec;
};

const start = (service: string) => `/get-started?service=${service}`;

const options: Option[] = [
  {
    id: "file",
    label: "File My Taxes",
    description: "Prepare and file this year's return",
    icon: FileText,
    question: {
      text: "Did you have bank accounts or income outside the U.S. (for example, in India)?",
      yes: {
        title: "You may need Federal & State Tax Filing, plus FBAR / FATCA.",
        body: "Foreign accounts can trigger FBAR and FATCA reporting alongside your regular return. We can handle all of it together.",
        services: [
          { label: "Federal Tax Filing", href: "/federal-tax-filing" },
          { label: "FBAR", href: "/fbar" },
          { label: "FATCA", href: "/fatca" },
        ],
        cta: { label: "Get Started", href: start("federal-tax-filing") },
      },
      no: {
        title: "You may need Federal & State Tax Filing.",
        body: "We'll prepare your federal return and any state returns you need, review them with you, and e-file once you approve.",
        services: [
          { label: "Federal Tax Filing", href: "/federal-tax-filing" },
          { label: "State Tax Filing", href: "/state-tax-filing" },
        ],
        cta: { label: "Get Started", href: start("federal-tax-filing") },
      },
    },
  },
  {
    id: "refund",
    label: "Check My Refund",
    description: "Estimate or track a refund",
    icon: RefreshCcw,
    question: {
      text: "Have you already filed your return for this year?",
      yes: {
        title: "Track your refund with the IRS — and we can help if it's delayed.",
        body: "The IRS 'Where's My Refund?' tool shows the status of a filed return. If your refund is delayed or you received a notice, we can review it.",
        services: [
          { label: "IRS: Where's My Refund?", href: "https://www.irs.gov/wheres-my-refund" },
          { label: "IRS Notice Help", href: "/irs-representation" },
        ],
        cta: { label: "Get Help With My Refund", href: start("irs-representation") },
      },
      no: {
        title: "Let's prepare and file your return.",
        body: "Tell us about your situation and a tax professional will review your documents, file your federal and state returns and help you maximize your refund.",
        services: [
          { label: "Federal Tax Filing", href: "/federal-tax-filing" },
          { label: "State Tax Filing", href: "/state-tax-filing" },
        ],
        cta: { label: "Get Started", href: start("federal-tax-filing") },
      },
    },
  },
  {
    id: "itin",
    label: "ITIN",
    description: "Apply for or renew an ITIN",
    icon: IdCard,
    rec: {
      title: "You may need ITIN Processing.",
      body: "We'll confirm eligibility for you, your spouse or dependents, prepare Form W-7 and the accompanying return, and check your documents.",
      services: [{ label: "ITIN Processing", href: "/itin" }],
      cta: { label: "Get Started", href: start("itin") },
    },
  },
  {
    id: "fbar",
    label: "FBAR / FATCA",
    description: "Report foreign accounts & assets",
    icon: Globe2,
    rec: {
      title: "You may need FBAR and/or FATCA reporting.",
      body: "If your foreign accounts exceeded $10,000 combined at any time, an FBAR is generally required. Higher balances may also require Form 8938 (FATCA).",
      services: [
        { label: "FBAR", href: "/fbar" },
        { label: "FATCA", href: "/fatca" },
      ],
      cta: { label: "Get Started", href: start("fbar") },
    },
  },
  {
    id: "notice",
    label: "IRS Notice",
    description: "Got a letter from the IRS",
    icon: ShieldAlert,
    rec: {
      title: "You may need IRS Notice Support.",
      body: "Send us a copy of the notice. We'll explain what it means and help you respond before the deadline.",
      services: [{ label: "IRS Representation", href: "/irs-representation" }],
      cta: { label: "Get Help With My Notice", href: start("irs-representation") },
    },
  },
  {
    id: "amend",
    label: "Amend My Return",
    description: "Fix a return you already filed",
    icon: FilePen,
    rec: {
      title: "You may need a Tax Amendment (Form 1040-X).",
      body: "We'll review your original return, prepare the amended federal and state returns, and help you track them.",
      services: [{ label: "Tax Amendments", href: "/tax-amendment" }],
      cta: { label: "Get Started", href: start("tax-amendment") },
    },
  },
  {
    id: "business",
    label: "Business Taxes",
    description: "Corporate, partnership or LLC returns",
    icon: Briefcase,
    question: {
      text: "Are your books up to date for the year?",
      yes: {
        title: "You may need Corporate Tax Filing.",
        body: "We'll prepare your business return (1120, 1120-S or 1065), owner K-1s and state filings.",
        services: [{ label: "Corporate Tax Filing", href: "/corporate-tax" }],
        cta: { label: "Get Started", href: start("corporate-tax") },
      },
      no: {
        title: "You may need Bookkeeping + Corporate Tax Filing.",
        body: "We'll bring your books up to date first, then prepare an accurate business return from them.",
        services: [
          { label: "Bookkeeping", href: "/bookkeeping" },
          { label: "Corporate Tax Filing", href: "/corporate-tax" },
        ],
        cta: { label: "Get Started", href: start("bookkeeping") },
      },
    },
  },
  {
    id: "llc",
    label: "Start an LLC",
    description: "Form a new business entity",
    icon: Building2,
    question: {
      text: "Are you (or any owner) living outside the U.S.?",
      yes: {
        title: "You may need LLC Services for foreign-owned companies.",
        body: "We'll help form your LLC, obtain an EIN, and set up annual filings — including Form 5472 where required.",
        services: [
          { label: "LLC Services", href: "/llc-services" },
          { label: "Entity Formation", href: "/entity-formation" },
        ],
        cta: { label: "Get Started", href: start("llc-services") },
      },
      no: {
        title: "You may need LLC Services.",
        body: "We'll help you form your LLC, get your EIN, choose a tax classification and plan your first-year filings.",
        services: [
          { label: "LLC Services", href: "/llc-services" },
          { label: "Entity Formation", href: "/entity-formation" },
        ],
        cta: { label: "Get Started", href: start("llc-services") },
      },
    },
  },
];

export function ServiceFinder() {
  const [selected, setSelected] = useState<Option | null>(null);
  const [rec, setRec] = useState<Rec | null>(null);

  const choose = (o: Option) => {
    setSelected(o);
    setRec(o.rec ?? null);
  };
  const resetAll = () => {
    setSelected(null);
    setRec(null);
  };
  const step = !selected ? 1 : rec ? 3 : 2;

  return (
    <section id="service-finder" className="section-y bg-canvas" aria-labelledby="finder-heading">
      <div className="container-x">
        <SectionHeader
          eyebrow="Service finder"
          title={<span id="finder-heading">Not Sure Which Tax Service You Need?</span>}
          subtitle="Answer a few simple questions and we'll point you in the right direction."
        />

        <div className="mx-auto mt-10 max-w-5xl">
          {/* Progress */}
          <div className="mb-6 flex items-center justify-center gap-2" aria-hidden>
            {[1, 2, 3].map((n) => (
              <span key={n} className={cn("h-1.5 rounded-full transition-all duration-300", n <= step ? "w-10 bg-brand-600" : "w-6 bg-line-strong")} />
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            Step {step} of 3
          </p>

          {step === 1 && (
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {options.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => choose(o)}
                    className="card card-hover group flex h-full w-full flex-col items-start p-4 text-left sm:p-5"
                  >
                    <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                      <o.icon className="size-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="mt-4 font-display text-[15px] font-bold text-navy-900 sm:text-base">{o.label}</span>
                    <span className="mt-1 text-[13px] leading-snug text-muted">{o.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {step === 2 && selected?.question && (
            <div className="card mx-auto max-w-2xl animate-fade-up p-6 sm:p-10">
              <p className="flex items-center gap-2 text-sm font-medium text-brand-600">
                <selected.icon className="size-4" aria-hidden /> {selected.label}
              </p>
              <h3 className="mt-3 text-xl font-bold sm:text-2xl">{selected.question.text}</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button variant="secondary" size="lg" onClick={() => setRec(selected.question!.yes)}>
                  Yes
                </Button>
                <Button variant="secondary" size="lg" onClick={() => setRec(selected.question!.no)}>
                  No
                </Button>
              </div>
              <button type="button" onClick={resetAll} className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-900">
                <ArrowLeft className="size-4" aria-hidden /> Back
              </button>
            </div>
          )}

          {step === 3 && rec && (
            <div className="card relative mx-auto max-w-3xl animate-fade-up overflow-hidden p-6 sm:p-10" role="status" aria-live="polite">
              <div className="absolute inset-x-0 top-0 h-1 bg-brand-600" aria-hidden />
              <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                <Sparkles className="size-3.5" aria-hidden /> Our recommendation
              </p>
              <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">{rec.title}</h3>
              <p className="mt-3 text-muted">{rec.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {rec.services.map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1.5 text-sm font-medium text-navy-900 hover:border-brand-200 hover:text-brand-600"
                    >
                      <Check className="size-3.5 text-success-600" aria-hidden /> {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <Link href={rec.cta.href}>
                    {rec.cta.label} <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" onClick={resetAll}>
                  <ArrowLeft aria-hidden /> Start over
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
