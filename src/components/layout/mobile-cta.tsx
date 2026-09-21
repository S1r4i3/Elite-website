"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { primaryCta } from "@/lib/navigation";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Sticky bottom CTA on mobile; hidden on the form, account & admin pages and until the user scrolls. */
export function MobileCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard") || pathname.startsWith("/get-started") || pathname.startsWith("/contact")) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex gap-2.5">
        <a
          href={site.phone.href}
          aria-label={`Call ${site.phone.display}`}
          className="grid size-12 shrink-0 place-items-center rounded-xl border border-line-strong text-navy-900"
        >
          <Phone className="size-5" aria-hidden />
        </a>
        <Link
          href={primaryCta.href}
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-brand-600 text-[15px] font-semibold text-white shadow-[0_6px_16px_rgb(200_16_46/0.25)]"
        >
          {primaryCta.label}
        </Link>
      </div>
    </div>
  );
}
