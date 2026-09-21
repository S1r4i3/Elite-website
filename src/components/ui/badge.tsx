import { cn } from "@/lib/utils";

export function Badge({ className, tone = "brand", ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: "brand" | "success" | "neutral" | "dark" | "warn" }) {
  const tones = {
    brand: "bg-brand-50 text-brand-700 ring-brand-100",
    success: "bg-success-50 text-success-700 ring-success-600/15",
    neutral: "bg-canvas text-muted ring-line",
    dark: "bg-white/10 text-white ring-white/15",
    warn: "bg-warn-50 text-warn-700 ring-warn-700/15",
  };
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", tones[tone], className)}
      {...props}
    />
  );
}
