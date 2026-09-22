"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        router.replace("/login");
        router.refresh();
      }}
      className={cn("inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-danger-50 hover:text-danger-600", className)}
    >
      {busy ? <Loader2 className="size-[18px] animate-spin" aria-hidden /> : <LogOut className="size-[18px]" aria-hidden />} Sign out
    </button>
  );
}
