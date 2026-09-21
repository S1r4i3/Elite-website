import { Star, Users, Award } from "lucide-react";
import { site } from "@/lib/site";
import { Counter } from "./counter";
import { cn } from "@/lib/utils";

export function TrustStats({ className, dark = false }: { className?: string; dark?: boolean }) {
  if (!site.stats.show) return null;
  const { customers, rating, years } = site.stats;
  const items = [
    { icon: Users, value: customers.value, suffix: customers.suffix, label: customers.label, decimals: 0 },
    { icon: Star, value: rating.value, suffix: rating.suffix, label: rating.label, decimals: 1 },
    { icon: Award, value: years.value, suffix: years.suffix, label: years.label, decimals: 0 },
  ];
  return (
    <div className={className}>
      <ul className="grid grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-4">
        {items.map(({ icon: I, ...s }) => (
          <li key={s.label} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <span className={cn("hidden size-10 shrink-0 place-items-center rounded-xl sm:grid", dark ? "bg-white/10 text-white" : "bg-brand-50 text-brand-600")}>
              <I className="size-[18px]" strokeWidth={2} aria-hidden />
            </span>
            <div>
              <p className={cn("font-display text-xl font-extrabold leading-none", dark ? "text-white" : "text-navy-900")}>
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </p>
              <p className={cn("mt-1 text-[13px]", dark ? "text-white/60" : "text-muted")}>{s.label}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
