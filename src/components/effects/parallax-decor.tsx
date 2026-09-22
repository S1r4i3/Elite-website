import { cn } from "@/lib/utils";

/**
 * Decorative shapes that drift at different speeds while scrolling (scroll parallax) and
 * follow the mouse slightly (depth). Place inside a `relative isolate overflow-hidden` section.
 */
export function ParallaxDecor({ variant = "light", flip = false }: { variant?: "light" | "dark"; flip?: boolean }) {
  const ring = variant === "dark" ? "border-white/10" : "border-brand-600/15";
  const dots = variant === "dark" ? "rgb(255 255 255 / 0.18)" : "rgb(200 16 46 / 0.22)";
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden md:block" aria-hidden>
      {/* big soft blob */}
      <div className={cn("absolute top-[8%]", flip ? "-left-40" : "-right-40")} data-parallax="0.18" suppressHydrationWarning>
        <div data-depth="18" suppressHydrationWarning className={cn("size-[420px] rounded-full blur-3xl", variant === "dark" ? "bg-brand-600/20" : "bg-brand-600/[0.07]")} />
      </div>
      {/* outlined ring */}
      <div className={cn("absolute top-[55%]", flip ? "right-[4%]" : "left-[3%]")} data-parallax="-0.12" suppressHydrationWarning>
        <div data-depth="-26" suppressHydrationWarning className={cn("size-40 rounded-full border-2", ring)} />
      </div>
      {/* dot grid */}
      <div className={cn("absolute top-[12%]", flip ? "right-[6%]" : "left-[5%]")} data-parallax="0.3" suppressHydrationWarning>
        <div data-depth="12" suppressHydrationWarning className="size-28 opacity-80" style={{ backgroundImage: `radial-gradient(${dots} 1.5px, transparent 1.6px)`, backgroundSize: "14px 14px" }} />
      </div>
      {/* small solid accent */}
      <div className={cn("absolute bottom-[10%]", flip ? "left-[8%]" : "right-[9%]")} data-parallax="-0.22" suppressHydrationWarning>
        <div data-depth="30" suppressHydrationWarning className="size-4 rotate-45 rounded-[4px] bg-brand-600/60 shadow-[0_0_24px_rgb(200_16_46/0.5)]" />
      </div>
      {/* plus sign */}
      <div className={cn("absolute top-[35%]", flip ? "left-[12%]" : "right-[14%]")} data-parallax="0.4" suppressHydrationWarning>
        <div data-depth="-16" suppressHydrationWarning className={cn("text-4xl font-light", variant === "dark" ? "text-white/15" : "text-brand-600/20")}>+</div>
      </div>
    </div>
  );
}
