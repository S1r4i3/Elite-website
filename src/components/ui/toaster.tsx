"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Site-wide toasts: toast.success("Saved") / toast.error("…") from any client component.
 * <Toaster /> is mounted once in the root layout. Errors stay 8 s, others 4 s.
 */
type Kind = "success" | "error" | "info";
type Item = { id: number; kind: Kind; text: string };
const EVENT = "ebt:toast";
let seq = 0;

function emit(kind: Kind, text: string) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent<Item>(EVENT, { detail: { id: ++seq, kind, text } }));
}
export const toast = {
  success: (t: string) => emit("success", t),
  error: (t: string) => emit("error", t),
  info: (t: string) => emit("info", t),
};

const ICON = { success: CheckCircle2, error: AlertCircle, info: Info };
const TONE = { success: "border-success-600/20 text-success-600", error: "border-danger-600/25 text-danger-600", info: "border-line text-brand-600" };

export function Toaster() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    const on = (e: Event) => {
      const item = (e as CustomEvent<Item>).detail;
      setItems((s) => [...s.slice(-2), item]);
      setTimeout(() => setItems((s) => s.filter((x) => x.id !== item.id)), item.kind === "error" ? 8000 : 4000);
    };
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-4 bottom-24 z-[70] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end">
      {items.map((t) => {
        const I = ICON[t.kind];
        return (
          <div
            key={t.id}
            role={t.kind === "error" ? "alert" : undefined}
            className={cn("pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-2xl border bg-white p-3.5 shadow-[var(--shadow-lift)]", TONE[t.kind])}
          >
            <I className="mt-0.5 size-5 shrink-0" aria-hidden />
            <p className="flex-1 text-sm font-medium text-navy-900">{t.text}</p>
            <button type="button" onClick={() => setItems((s) => s.filter((x) => x.id !== t.id))} aria-label="Dismiss" className="text-subtle hover:text-navy-900">
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
