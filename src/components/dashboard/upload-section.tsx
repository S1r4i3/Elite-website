"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { UploadPanel } from "./upload-panel";
import { documentTypes } from "@/lib/portal";
import { cn } from "@/lib/utils";

/** Document checklist table (status per type) + upload panel. */
export function UploadSection({ counts }: { counts: Record<string, number> }) {
  const [type, setType] = useState<string>("w2");
  return (
    <div className="space-y-6">
      <UploadPanel category={type} onCategoryChange={setType} />
      <section className="card overflow-hidden" aria-labelledby="checklist-h">
        <div className="border-b border-line px-5 py-4">
          <h2 id="checklist-h" className="text-base font-bold">Document checklist</h2>
          <p className="text-sm text-muted">Upload what applies to you — we&apos;ll ask if anything is missing.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-canvas/60 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Document</th>
                <th className="px-5 py-3 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {documentTypes.map((t) => {
                const n = counts[t.value] ?? 0;
                return (
                  <tr key={t.value} className={cn(type === t.value && "bg-brand-50/50")}>
                    <td className="px-5 py-3 font-medium text-navy-900">{t.label}</td>
                    <td className="px-5 py-3 text-right">
                      {n > 0 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700">
                          <CheckCircle2 className="size-3.5" aria-hidden /> {n} uploaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                          <Circle className="size-3.5" aria-hidden /> Not uploaded
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
