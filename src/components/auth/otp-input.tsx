"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Six single-digit boxes with paste, arrow-key and backspace support. */
export function OtpInput({
  value,
  onChange,
  onComplete,
  disabled,
  invalid,
  describedBy,
}: {
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");

  const setAt = (i: number, d: string) => {
    const next = digits.slice();
    next[i] = d;
    const joined = next.join("").slice(0, 6);
    onChange(joined);
    if (/^\d{6}$/.test(joined)) onComplete?.(joined);
  };

  const fill = (text: string, from = 0) => {
    const clean = text.replace(/\D/g, "").slice(0, 6 - from);
    if (!clean) return;
    const next = digits.slice();
    clean.split("").forEach((d, k) => (next[from + k] = d));
    const joined = next.join("");
    onChange(joined);
    refs.current[Math.min(from + clean.length, 5)]?.focus();
    if (joined.length === 6) onComplete?.(joined);
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-3" role="group" aria-label="6-digit verification code">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={6}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          autoFocus={i === 0}
          className={cn(
            "otp-box h-14 w-full min-w-0 rounded-xl border border-line-strong bg-white text-center font-display text-2xl font-extrabold text-navy-900 transition-all focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-600/12 disabled:bg-canvas sm:h-16",
            d && "border-navy-900/40 bg-brand-50/40",
            invalid && "animate-[shake_0.35s] border-danger-600",
          )}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "");
            if (v.length > 1) return fill(v, i);
            setAt(i, v);
            if (v && i < 5) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i] && i > 0) {
              e.preventDefault();
              refs.current[i - 1]?.focus();
              setAt(i - 1, "");
            } else if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
            else if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
          }}
          onPaste={(e) => {
            e.preventDefault();
            fill(e.clipboardData.getData("text"), 0);
          }}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
