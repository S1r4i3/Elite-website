"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** "Documents to have ready" as a real checklist: visitors can tick items off and see how many are ready. */
export function DocumentChecklist({ items }: { items: string[] }) {
  const [done, setDone] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setDone((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  return (
    <>
      <ul className="mt-5 space-y-2">
        {items.map((d, i) => {
          const on = done.has(i);
          return (
            <li key={d}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(i)}
                className="-mx-2 flex w-[calc(100%+1rem)] items-start gap-3 rounded-lg px-2 py-1 text-left text-[15px] text-ink transition hover:bg-canvas"
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-4 shrink-0 place-items-center rounded border transition",
                    on ? "border-success-600 bg-success-600 text-white" : "border-line-strong",
                  )}
                  aria-hidden
                >
                  {on && <Check className="size-3" strokeWidth={3} />}
                </span>
                <span className={cn(on && "text-muted line-through decoration-muted/50")}>{d}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-[13px] font-semibold text-navy-900" aria-live="polite">
        {done.size} of {items.length} ready
      </p>
    </>
  );
}
