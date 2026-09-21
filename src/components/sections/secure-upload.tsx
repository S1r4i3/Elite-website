"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, CheckCircle2, FileStack, FileText, Files, Lock, MousePointerClick, Receipt, ShieldCheck, FileWarning, FolderOpen, Gauge, ArrowRight } from "lucide-react";
import { SectionHeader } from "./section-header";
import { FileDropzone } from "@/components/forms/file-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { id: "w2", label: "W-2", hint: "Wage statements", icon: FileText },
  { id: "1099", label: "1099", hint: "Contract & other income", icon: Receipt },
  { id: "prior-return", label: "Previous Tax Return", hint: "Last year's return", icon: FileStack },
  { id: "pay-stubs", label: "Pay Stubs", hint: "Recent paychecks", icon: Files },
  { id: "irs-notice", label: "IRS Notice", hint: "Letters from the IRS", icon: FileWarning },
  { id: "other", label: "Other Documents", hint: "1098, IDs, statements", icon: FolderOpen },
];

const features = [
  { icon: MousePointerClick, label: "Drag & drop" },
  { icon: Camera, label: "Mobile camera upload" },
  { icon: Files, label: "Multiple files" },
  { icon: Gauge, label: "Upload progress" },
  { icon: Lock, label: "Private storage" },
];

export function SecureUpload() {
  const [category, setCategory] = useState("w2");
  const [uploaded, setUploaded] = useState(0);
  const active = categories.find((c) => c.id === category)!;

  return (
    <section id="upload" className="section-y bg-canvas" aria-labelledby="upload-heading">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeader
            align="left"
            eyebrow="Secure document upload"
            title={<span id="upload-heading">Your Documents. Securely Handled.</span>}
            subtitle="Send your tax documents without email attachments or office visits. Choose a document type, then upload from your computer or phone."
          />
          <ul className="mt-8 flex flex-wrap gap-2">
            {features.map(({ icon: I, label }) => (
              <li key={label} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium text-navy-900">
                <I className="size-4 text-brand-600" strokeWidth={1.75} aria-hidden /> {label}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-line bg-white p-5">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success-600" aria-hidden />
            <p className="text-sm leading-relaxed text-muted">
              Documents are transferred over HTTPS, stored privately (never on public pages) and accessed only by our team to prepare your taxes.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="card p-5 sm:p-7">
            <p className="text-sm font-medium text-navy-900" id="doc-type-label">
              1. Choose document type
            </p>
            <div role="radiogroup" aria-labelledby="doc-type-label" className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-3">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={category === c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "flex flex-col items-start gap-2.5 rounded-xl border p-3.5 text-left transition",
                    category === c.id ? "border-brand-600 bg-brand-50/60 ring-1 ring-brand-600" : "border-line hover:border-brand-200",
                  )}
                >
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", category === c.id ? "bg-brand-600 text-white" : "bg-canvas text-navy-900")}>
                    <c.icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-tight text-navy-900">{c.label}</span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-muted">{c.hint}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mb-3 mt-6 text-sm font-medium text-navy-900">2. Upload your {active.label}</p>
            <FileDropzone key={category} category={category} label={`Upload ${active.label}`} onChange={(ids) => {
                setUploaded(ids.length);
                try {
                  sessionStorage.setItem("elite:pendingDocs", JSON.stringify(ids));
                } catch {}
              }} />
            {uploaded > 0 && (
              <div className="mt-5 flex flex-col gap-3 rounded-xl bg-success-50 p-4 sm:flex-row sm:items-center sm:justify-between" role="status">
                <p className="flex items-center gap-2 text-sm font-medium text-success-700">
                  <CheckCircle2 className="size-4" aria-hidden /> {uploaded} file{uploaded > 1 ? "s" : ""} received. Tell us who you are so we can match them to you.
                </p>
                <Button asChild size="sm">
                  <Link href="/get-started">
                    Continue <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
