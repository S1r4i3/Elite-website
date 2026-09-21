import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  as: As = "h2",
  dark = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
  as?: "h1" | "h2";
  dark?: boolean;
}) {
  return (
    <div data-reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className={cn("eyebrow", dark && "text-brand-200")}>{eyebrow}</p>}
      <As className={cn("h-section mt-3", dark && "text-white")}>{title}</As>
      {subtitle && <p className={cn("lead-copy mt-4", dark && "text-white/70")}>{subtitle}</p>}
    </div>
  );
}
