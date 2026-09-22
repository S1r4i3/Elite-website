"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";

/** Shows "Email verified" after the verification link lands on the website (?verified=1). */
export function VerifiedToast() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (params.get("verified") !== "1") return;
    setShow(true);
    router.replace(pathname, { scroll: false });
    const t = setTimeout(() => setShow(false), 7000);
    return () => clearTimeout(t);
  }, [params, pathname, router]);

  if (!show) return null;
  return (
    <div role="status" className="fixed inset-x-4 top-20 z-[60] mx-auto flex max-w-md animate-fade-up items-start gap-3 rounded-2xl border border-success-600/20 bg-white p-4 shadow-[var(--shadow-lift)] lg:top-24">
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success-600" aria-hidden />
      <div className="flex-1">
        <p className="font-semibold text-navy-900">Email verified — welcome to Elite Tax!</p>
        <p className="mt-0.5 text-sm text-muted">Your account is active and you're signed in.</p>
      </div>
      <button type="button" onClick={() => setShow(false)} aria-label="Dismiss" className="text-subtle hover:text-navy-900">
        <X className="size-4" />
      </button>
    </div>
  );
}
