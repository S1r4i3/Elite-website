"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Briefcase, Building2, Check, Info, Laptop, Loader2, Minus, Plus, RotateCcw, UserRound, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { calculateEstimate, type EmploymentType, type EstimateResult, type FilingStatus } from "@/lib/tax/estimate";
import { cn, formatCurrency } from "@/lib/utils";

const LeadForm = dynamic(() => import("@/components/forms/lead-form").then((m) => m.LeadForm), {
  loading: () => <div className="h-96 animate-pulse rounded-2xl bg-canvas" aria-hidden />,
});

const employmentOptions: { value: EmploymentType; label: string; hint: string; icon: typeof UserRound }[] = [
  { value: "w2", label: "W-2 Employee", hint: "Salary or hourly wages", icon: UserRound },
  { value: "1099", label: "1099 Contractor", hint: "Freelance or contract income", icon: Laptop },
  { value: "self-employed", label: "Self Employed", hint: "Sole proprietor / gig work", icon: Briefcase },
  { value: "business-owner", label: "Business Owner", hint: "Single-member LLC profits", icon: Building2 },
];

const filingOptions: { value: FilingStatus; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "mfj", label: "Married filing jointly" },
  { value: "hoh", label: "Head of household" },
  { value: "mfs", label: "Married filing separately" },
];

const stepLabels = ["Employment type", "Annual income", "Tax withheld", "Filing information", "Your estimate"];

function MoneyInput({ id, label, value, onChange, hint }: { id: string; label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy-900">
        {label}
      </label>
      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-display text-2xl font-bold text-subtle">$</span>
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^\d]/g, "").slice(0, 9);
            onChange(digits ? Number(digits).toLocaleString("en-US") : "");
          }}
          className="h-16 w-full rounded-2xl border border-line-strong bg-white pl-10 pr-4 font-display text-3xl font-bold text-navy-900 tabular-nums placeholder:text-line-strong focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-600/12"
          placeholder="0"
          aria-describedby={hint ? `${id}-hint` : undefined}
        />
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-[13px] text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

const num = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;

export function RefundEstimator({ headingLevel = "h2", id = "estimator" }: { headingLevel?: "h1" | "h2"; id?: string }) {
  const [step, setStep] = useState(0);
  const [employmentType, setEmploymentType] = useState<EmploymentType | null>(null);
  const [income, setIncome] = useState("");
  const [withheld, setWithheld] = useState("");
  const [estPayments, setEstPayments] = useState("");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [dependents, setDependents] = useState(0);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const selfEmployed = employmentType && employmentType !== "w2";
  const canNext = [!!employmentType, num(income) > 0, true, true][step] ?? true;
  const H = headingLevel;

  const compute = async () => {
    const input = {
      employmentType: employmentType!,
      income: num(income),
      withheld: num(withheld),
      estimatedPayments: num(estPayments),
      filingStatus,
      dependents,
    };
    setLoading(true);
    setError(null);
    setStep(4);
    try {
      const res = await fetch("/api/estimate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error);
      setResult(json.result);
    } catch {
      // Fall back to the same calculation in the browser.
      setResult(calculateEstimate(input));
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const next = () => (step === 3 ? compute() : setStep((s) => s + 1));
  const restart = () => {
    setStep(0);
    setResult(null);
    setShowForm(false);
  };

  return (
    <section id={id} className="section-y bg-canvas" aria-labelledby={`${id}-heading`}>
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center" data-reveal>
          <p className="eyebrow">Free refund estimator</p>
          <H id={`${id}-heading`} className="h-section mt-3">
            See What Your Tax Situation Could Look Like
          </H>
          <p className="lead-copy mt-4">Five quick steps. No sign-up required. Get a ballpark federal estimate in under a minute.</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl overflow-hidden rounded-[24px] border border-line bg-white shadow-[var(--shadow-lift)] lg:grid-cols-[280px_1fr]">
          {/* Steps rail */}
          <aside className="border-b border-line bg-navy-900 p-5 text-white lg:border-b-0 lg:border-r lg:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50" aria-live="polite">
              Step {Math.min(step + 1, 5)} of 5
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10 lg:hidden" aria-hidden>
              <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${((step + 1) / 5) * 100}%` }} />
            </div>
            <ol className="mt-6 hidden space-y-1 lg:block">
              {stepLabels.map((label, i) => (
                <li key={label} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors", i === step ? "bg-white/10 font-semibold text-white" : i < step ? "text-white/80" : "text-white/40")}>
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                      i < step ? "bg-success-600 text-white" : i === step ? "bg-brand-600 text-white" : "border border-white/20",
                    )}
                  >
                    {i < step ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}
                  </span>
                  {label}
                </li>
              ))}
            </ol>
            <p className="mt-8 hidden text-[12px] leading-relaxed text-white/50 lg:block">
              Uses 2025 federal tax brackets and standard deductions. State taxes are not included.
            </p>
          </aside>

          {/* Panel */}
          <div className="p-5 sm:p-8 lg:p-10">
            <div className="min-h-[340px]">
              {step === 0 && (
                <fieldset>
                  <legend className="font-display text-xl font-bold text-navy-900 sm:text-2xl">How do you earn most of your income?</legend>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {employmentOptions.map((o) => (
                      <label
                        key={o.value}
                        className={cn(
                          "flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-600/20",
                          employmentType === o.value ? "border-brand-600 bg-brand-50/60 ring-1 ring-brand-600" : "border-line hover:border-brand-200",
                        )}
                      >
                        <input type="radio" name="employment" value={o.value} className="sr-only" checked={employmentType === o.value} onChange={() => setEmploymentType(o.value)} />
                        <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", employmentType === o.value ? "bg-brand-600 text-white" : "bg-canvas text-navy-900")}>
                          <o.icon className="size-5" strokeWidth={1.75} aria-hidden />
                        </span>
                        <span>
                          <span className="block font-semibold text-navy-900">{o.label}</span>
                          <span className="block text-[13px] text-muted">{o.hint}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 1 && (
                <div>
                  <h3 className="text-xl font-bold sm:text-2xl">What's your expected annual income?</h3>
                  <p className="mt-2 text-[15px] text-muted">{selfEmployed ? "Enter your net profit (income minus business expenses)." : "Enter your total wages before taxes (Box 1 of your W-2)."}</p>
                  <div className="mt-6">
                    <MoneyInput id="income" label={selfEmployed ? "Net self-employment income" : "Annual wages"} value={income} onChange={setIncome} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[45000, 75000, 110000, 160000].map((v) => (
                      <button key={v} type="button" onClick={() => setIncome(v.toLocaleString("en-US"))} className="rounded-full border border-line px-3 py-1.5 text-sm font-medium text-muted hover:border-brand-200 hover:text-navy-900">
                        {formatCurrency(v)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="text-xl font-bold sm:text-2xl">How much federal tax has been paid?</h3>
                  <p className="mt-2 text-[15px] text-muted">
                    {selfEmployed ? "Include any federal withholding and quarterly estimated payments." : "Find this in Box 2 of your W-2, or on your latest pay stub (year-to-date federal tax)."}
                  </p>
                  <div className="mt-6 grid gap-5">
                    <MoneyInput id="withheld" label="Federal income tax withheld" value={withheld} onChange={setWithheld} hint="Leave blank or 0 if nothing was withheld." />
                    {selfEmployed && <MoneyInput id="estPayments" label="Estimated tax payments made" value={estPayments} onChange={setEstPayments} />}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="text-xl font-bold sm:text-2xl">A few basics about your filing</h3>
                  <fieldset className="mt-6">
                    <legend className="text-sm font-medium text-navy-900">Filing status</legend>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {filingOptions.map((o) => (
                        <label
                          key={o.value}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-[15px] transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-600/20",
                            filingStatus === o.value ? "border-brand-600 bg-brand-50/60 font-semibold text-navy-900" : "border-line text-ink hover:border-brand-200",
                          )}
                        >
                          <input type="radio" name="filing" value={o.value} checked={filingStatus === o.value} onChange={() => setFilingStatus(o.value)} className="size-4 accent-brand-600" />
                          {o.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <div className="mt-6">
                    <p id="dep-label" className="text-sm font-medium text-navy-900">
                      Qualifying children under 17
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-xl border border-line p-1" role="group" aria-labelledby="dep-label">
                      <Button type="button" variant="ghost" size="icon" onClick={() => setDependents((d) => Math.max(0, d - 1))} aria-label="Fewer children" disabled={dependents === 0}>
                        <Minus aria-hidden />
                      </Button>
                      <output className="w-10 text-center font-display text-xl font-bold tabular-nums" aria-live="polite">
                        {dependents}
                      </output>
                      <Button type="button" variant="ghost" size="icon" onClick={() => setDependents((d) => Math.min(10, d + 1))} aria-label="More children">
                        <Plus aria-hidden />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  {loading || !result ? (
                    <div className="grid min-h-[300px] place-items-center text-center">
                      <div>
                        <Loader2 className="mx-auto size-8 animate-spin text-brand-600" aria-hidden />
                        <p className="mt-4 font-medium text-navy-900">Calculating your estimate…</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div role="alert" className="flex items-start gap-3 rounded-xl bg-danger-50 p-4 text-danger-600">
                      <AlertCircle className="size-5" aria-hidden /> {error}
                    </div>
                  ) : showForm ? (
                    <div>
                      <h3 className="text-xl font-bold sm:text-2xl">Get your detailed estimate</h3>
                      <p className="mt-2 text-[15px] text-muted">A tax professional will review your situation and follow up with a detailed estimate.</p>
                      <LeadForm className="mt-6 border-0 p-0 shadow-none sm:p-0" defaultService="refund-estimate" source="refund-estimator" estimate={{ ...result, employmentType, filingStatus, dependents }} submitLabel="Get My Detailed Estimate" showUpload={false} />
                      <button type="button" onClick={() => setShowForm(false)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-900">
                        <ArrowLeft className="size-4" aria-hidden /> Back to estimate
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-muted">Estimated {result.taxYear} federal {result.type === "refund" ? "refund" : "tax due"}</p>
                      <p className={cn("mt-2 font-display text-5xl font-extrabold tabular-nums sm:text-6xl", result.type === "refund" ? "text-success-700" : "text-navy-900")}>
                        {formatCurrency(result.amount)}
                      </p>
                      <p className="mt-2 text-[15px] text-muted">
                        {result.type === "refund" ? "You may be due a refund based on what you entered." : "You may owe additional federal tax based on what you entered."}
                      </p>

                      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {[
                          ["Taxable income", formatCurrency(result.taxableIncome)],
                          ["Standard deduction", formatCurrency(result.standardDeduction)],
                          ["Income tax", formatCurrency(result.incomeTax)],
                          ...(result.selfEmploymentTax ? [["Self-employment tax", formatCurrency(result.selfEmploymentTax)]] : []),
                          ...(result.childTaxCredit ? [["Child tax credit", `−${formatCurrency(result.childTaxCredit)}`]] : []),
                          ["Payments & withholding", formatCurrency(result.totalPayments)],
                          ["Effective rate", `${result.effectiveRate}%`],
                          ["Marginal bracket", `${result.marginalRate}%`],
                        ].map(([k, v]) => (
                          <div key={k} className="rounded-xl bg-canvas p-3">
                            <dt className="text-[12px] text-muted">{k}</dt>
                            <dd className="mt-0.5 font-display font-bold tabular-nums text-navy-900">{v}</dd>
                          </div>
                        ))}
                      </dl>

                      <div className="mt-6 flex items-start gap-3 rounded-xl border border-warn-700/15 bg-warn-50 p-4 text-[13px] leading-relaxed text-warn-700">
                        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                        <p>
                          <strong>This is an estimate only.</strong> It uses simplified federal rules and the information you entered. It excludes state taxes, itemized
                          deductions and many credits. Your final result depends on complete tax information reviewed by a tax professional. Refunds are not guaranteed.
                        </p>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button size="lg" onClick={() => setShowForm(true)}>
                          Get My Detailed Estimate <ArrowRight aria-hidden />
                        </Button>
                        <Button size="lg" variant="ghost" onClick={restart}>
                          <RotateCcw aria-hidden /> Start over
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {step < 4 && (
              <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
                <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className={step === 0 ? "invisible" : undefined}>
                  <ArrowLeft aria-hidden /> Back
                </Button>
                <Button size="lg" onClick={next} disabled={!canNext}>
                  {step === 3 ? "See My Estimate" : "Continue"} <ArrowRight aria-hidden />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
