import { Check, FileText, Lock, ShieldCheck, TrendingUp, Loader2 } from "lucide-react";

/** Illustrative product visual (no real client data). */
export function HeroVisual() {
  const steps = [
    { label: "Documents received", state: "done" },
    { label: "Professional review", state: "active" },
    { label: "E-file", state: "todo" },
    { label: "Accepted", state: "todo" },
  ] as const;
  const docs = [
    { name: "W-2 — Employer.pdf", size: "182 KB", done: true },
    { name: "1099-INT — Bank.pdf", size: "96 KB", done: true },
    { name: "1098-T — University.pdf", size: "240 KB", done: false },
  ];
  return (
    <div className="relative mx-auto max-w-[560px] animate-fade-up [animation-delay:120ms]" role="img" aria-label="Illustration of the Elite Tax client dashboard showing filing progress, uploaded documents, a refund estimate and professional review">
      {/* Main card */}
      <div className="card relative overflow-hidden p-5 shadow-[var(--shadow-lift)] sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-subtle">Tax return</p>
            <p className="mt-1 font-display text-lg font-extrabold text-navy-900">2025 Federal & State</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
            <span className="size-1.5 animate-pulse rounded-full bg-brand-600" /> In review
          </span>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-xs text-muted">
            <span>Filing progress</span>
            <span className="font-semibold text-navy-900">65%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-canvas">
            <div className="h-full w-[65%] rounded-full bg-brand-600" />
          </div>
          <ol className="mt-4 grid grid-cols-4 gap-2">
            {steps.map((s) => (
              <li key={s.label} className="text-center">
                <span
                  className={
                    s.state === "done"
                      ? "mx-auto grid size-7 place-items-center rounded-full bg-success-600 text-white"
                      : s.state === "active"
                        ? "mx-auto grid size-7 place-items-center rounded-full border-2 border-brand-600 bg-white text-brand-600"
                        : "mx-auto grid size-7 place-items-center rounded-full border border-line-strong bg-white text-subtle"
                  }
                >
                  {s.state === "done" ? <Check className="size-3.5" strokeWidth={3} /> : s.state === "active" ? <Loader2 className="size-3.5 animate-spin" /> : <span className="size-1.5 rounded-full bg-current" />}
                </span>
                <span className="mt-1.5 block text-[10.5px] leading-tight text-muted sm:text-[11px]">{s.label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-5 space-y-2 border-t border-line pt-4">
          {docs.map((d) => (
            <div key={d.name} className="flex items-center gap-3 rounded-xl bg-canvas/70 px-3 py-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-white text-brand-600 shadow-sm">
                <FileText className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-navy-900">{d.name}</p>
                {d.done ? (
                  <p className="text-[11px] text-subtle">{d.size}</p>
                ) : (
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white">
                    <div className="h-full w-2/3 rounded-full bg-brand-600" />
                  </div>
                )}
              </div>
              {d.done ? <Check className="size-4 text-success-600" strokeWidth={2.5} /> : <span className="text-[11px] font-medium text-brand-600">68%</span>}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-[12px] text-muted">
          <Lock className="size-3.5 text-success-600" /> Secure document handling
        </div>
      </div>

      {/* Refund estimate */}
      <div className="card absolute -bottom-8 -left-2 w-[210px] p-4 shadow-[var(--shadow-lift)] sm:-left-10 sm:w-[230px]">
        <p className="text-[11px] font-medium uppercase tracking-wider text-subtle">Refund estimate</p>
        <p className="mt-1 font-display text-2xl font-extrabold text-navy-900">$2,480</p>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-success-700">
          <TrendingUp className="size-3" /> Example estimate
        </p>
        <div className="mt-3 flex h-10 items-end gap-1">
          {[30, 45, 38, 60, 52, 72, 88].map((h, i) => (
            <span key={i} className={i === 6 ? "flex-1 rounded-sm bg-brand-600" : "flex-1 rounded-sm bg-brand-100"} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      {/* Professional review */}
      <div className="card absolute -right-2 -top-6 flex items-center gap-3 p-3 pr-4 shadow-[var(--shadow-lift)] sm:-right-8">
        <span className="grid size-9 place-items-center rounded-full bg-navy-900 text-xs font-bold text-white">TP</span>
        <div>
          <p className="text-[13px] font-semibold text-navy-900">Professional review</p>
          <p className="flex items-center gap-1 text-[11px] text-muted">
            <ShieldCheck className="size-3 text-brand-600" /> Checked before filing
          </p>
        </div>
      </div>
    </div>
  );
}
