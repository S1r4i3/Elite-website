"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, Loader2, LogIn, LogOut, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export type Account = { firstName: string; lastName?: string; email: string } | null;

/** Header account control: "Login / Register" when signed out, avatar menu with Sign out when signed in. */
export function AccountMenu({ account, onSignedOut }: { account: Account; onSignedOut: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  if (!account) {
    return (
      <Link
        href="/login"
        className="group hidden h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border-2 border-brand-600 px-4 text-sm font-semibold text-brand-600 transition hover:-translate-y-0.5 hover:bg-brand-600 hover:text-white sm:inline-flex"
      >
        <LogIn className="size-4" aria-hidden />
        <span className="xl:hidden 2xl:inline">Login / Register</span>
        <span className="hidden xl:inline 2xl:hidden">Login</span>
      </Link>
    );
  }

  const initials = `${account.firstName[0] ?? ""}${account.lastName?.[0] ?? ""}`.toUpperCase() || "U";

  const signOut = async () => {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setBusy(false);
    setOpen(false);
    onSignedOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-11 items-center gap-2 rounded-xl py-1 pl-1 pr-2.5 text-sm font-semibold text-navy-900 transition hover:bg-canvas"
      >
        <span className="grid size-9 place-items-center rounded-full bg-brand-600 text-[13px] font-bold text-white ring-2 ring-brand-100">{initials}</span>
        <span className="max-w-[110px] truncate xl:sr-only 2xl:not-sr-only">{account.firstName}</span>
        <ChevronDown className={cn("size-4 text-subtle transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 animate-fade-up overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-lift)]">
          <div className="flex items-center gap-3 border-b border-line bg-canvas/60 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{initials}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-navy-900">
                {account.firstName} {account.lastName}
              </p>
              <p className="truncate text-xs text-muted">{account.email}</p>
            </div>
          </div>
          <div className="p-2">
            <Link role="menuitem" href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-canvas">
              <LayoutDashboard className="size-[18px] text-brand-600" aria-hidden /> My Dashboard
            </Link>
            <Link role="menuitem" href="/dashboard/my-documents" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-canvas">
              <UserRound className="size-[18px] text-brand-600" aria-hidden /> My Documents
            </Link>
            <button role="menuitem" type="button" onClick={signOut} disabled={busy} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-danger-600 hover:bg-danger-50">
              {busy ? <Loader2 className="size-[18px] animate-spin" aria-hidden /> : <LogOut className="size-[18px]" aria-hidden />} Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
