import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** EBT brand mark (red 3D letters, transparent PNG extracted from the official logo). */
export function LogoMark({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/ebt-mark.png"
      alt=""
      width={320}
      height={162}
      priority={priority}
      sizes="80px"
      className={cn("h-8 w-auto select-none", className)}
    />
  );
}

export function Logo({ light = false, className, priority = false, showText = true }: { light?: boolean; className?: string; priority?: boolean; showText?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex shrink-0 items-center gap-3", className)}>
      <LogoMark priority={priority} className="h-8 transition-transform duration-200 group-hover:scale-[1.03] lg:h-9" />
      {showText && (
      <span className="flex flex-col leading-none">
        <span className={cn("whitespace-nowrap font-display text-[17px] font-extrabold tracking-[0.08em]", light ? "text-white" : "text-navy-900")}>
          ELITE <span className="text-brand-600">B</span> TAX
        </span>
        <span className={cn("mt-1 whitespace-nowrap text-[10.5px] font-semibold uppercase tracking-[0.22em]", light ? "text-white/60" : "text-muted")}>
          Tax Services
        </span>
      </span>
      )}
      <span className="sr-only">— Elite B Tax home</span>
    </Link>
  );
}
