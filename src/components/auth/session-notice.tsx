"use client";

import { useSearchParams } from "next/navigation";
import { Info } from "lucide-react";

/** Explains why someone landed back on the login page after their session was cleared. */
export function SessionNotice() {
  const expired = useSearchParams().get("expired");
  if (!expired) return null;
  return (
    <p className="mb-5 flex items-start gap-2.5 rounded-xl border border-warn-700/20 bg-warn-50 px-4 py-3 text-sm text-warn-700" role="status">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      Your session has ended. Please sign in again to continue.
    </p>
  );
}
