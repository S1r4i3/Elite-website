"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, Menu, Phone, X, ArrowRight, UserRound, LogIn, LogOut } from "lucide-react";
import { AccountMenu, type Account } from "./account-menu";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { mainNav, primaryCta } from "@/lib/navigation";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { hasAuthCookie } from "@/lib/auth-cookie";
import { apiJson } from "@/lib/api-client";
import { signOut } from "@/lib/sign-out";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const [account, setAccount] = useState<Account>(null);

  // Who's signed in. Anonymous visitors (no Supabase session cookie) make no request at all;
  // signed-in visitors ask once, and again only when the session cookie appears/disappears
  // (e.g. right after login or logout) — not on every page change as before.
  const knownSession = useRef<boolean | null>(null);
  useEffect(() => {
    const has = hasAuthCookie();
    if (has === knownSession.current) return;
    knownSession.current = has;
    if (!has) {
      setAccount(null);
      return;
    }
    let cancelled = false;
    apiJson<{ customer: Account }>("/api/auth/me", { cache: "no-store" }, 8_000)
      .then((j) => !cancelled && setAccount(j.customer ?? null))
      .catch(() => {
        knownSession.current = null; // try again on the next navigation
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled || mobileOpen ? "border-line bg-white/90 backdrop-blur-xl" : "border-transparent bg-white/70 backdrop-blur",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <Logo priority />

        <nav ref={navRef} aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {mainNav.map((item, i) => (
              <li key={item.label} className="relative" onMouseEnter={() => item.children && setOpenMenu(i)} onMouseLeave={() => item.children && setOpenMenu(null)}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={openMenu === i}
                      aria-controls={`menu-${i}`}
                      onClick={() => setOpenMenu(openMenu === i ? null : i)}
                      className={cn(
                        "flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-[14px] font-medium transition-colors hover:text-brand-600",
                        isActive(item.href) || openMenu === i ? "text-navy-900" : "text-muted",
                      )}
                    >
                      {item.label}
                      <ChevronDown className={cn("size-3.5 transition-transform", openMenu === i && "rotate-180")} aria-hidden />
                    </button>
                    <div
                      id={`menu-${i}`}
                      className={cn(
                        "absolute left-1/2 top-full w-[380px] -translate-x-1/2 pt-3 transition-all duration-200",
                        openMenu === i ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
                      )}
                    >
                      <div className="card overflow-hidden p-2 shadow-[var(--shadow-lift)]">
                        <ul>
                          {item.children.map((c) => (
                            <li key={c.href}>
                              <Link href={c.href} className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-canvas">
                                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                                  <Icon name={c.icon || "FileText"} className="size-[18px]" />
                                </span>
                                <span>
                                  <span className="block text-sm font-semibold text-navy-900">{c.label}</span>
                                  {c.description && <span className="block text-[13px] text-muted">{c.description}</span>}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link href={item.href} className="mt-1 flex items-center justify-between rounded-xl bg-canvas px-4 py-3 text-sm font-semibold text-navy-900 hover:text-brand-600">
                          View all {item.label.toLowerCase()}
                          <ArrowRight className="size-4" aria-hidden />
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-[14px] font-medium text-muted transition-colors hover:text-brand-600"
                    >
                      {item.label}
                      <ExternalLink className="size-3.5" aria-hidden />
                      <span className="sr-only">(opens the IRS website in a new tab)</span>
                    </a>
                  ) : (
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "block whitespace-nowrap rounded-lg px-2.5 py-2 text-[14px] font-medium transition-colors hover:text-brand-600",
                      isActive(item.href) ? "text-navy-900" : "text-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                  )
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <AccountMenu account={account} onSignedOut={() => setAccount(null)} />
          <Button asChild size="md" className="hidden sm:inline-flex">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="!size-5" /> : <Menu className="!size-5" />}
          </Button>
        </div>
      </div>
    </header>

      {/* Mobile menu (outside <header>: backdrop-filter would trap position:fixed) */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col bg-white transition-all duration-300 lg:top-[72px] xl:hidden",
          mobileOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden={!mobileOpen}
      >
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <ul className="divide-y divide-line">
            {mainNav.map((item, i) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-4 text-left text-[17px] font-semibold text-navy-900"
                      aria-expanded={mobileGroup === i}
                      onClick={() => setMobileGroup(mobileGroup === i ? null : i)}
                      tabIndex={mobileOpen ? 0 : -1}
                    >
                      {item.label}
                      <ChevronDown className={cn("size-5 text-subtle transition-transform", mobileGroup === i && "rotate-180")} aria-hidden />
                    </button>
                    {mobileGroup === i && (
                      <ul className="grid gap-1 pb-4">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-[15px] text-ink hover:bg-canvas">
                              <Icon name={c.icon || "FileText"} className="size-[18px] text-brand-600" />
                              {c.label}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link href={item.href} className="flex items-center gap-2 px-2 py-2.5 text-[15px] font-semibold text-brand-600">
                            View all <ArrowRight className="size-4" aria-hidden />
                          </Link>
                        </li>
                      </ul>
                    )}
                  </>
                ) : (
                  item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={mobileOpen ? 0 : -1}
                      className="flex items-center gap-2 py-4 text-[17px] font-semibold text-navy-900"
                    >
                      {item.label}
                      <ExternalLink className="size-4 text-brand-600" aria-hidden />
                      <span className="sr-only">(opens the IRS website in a new tab)</span>
                    </a>
                  ) : (
                  <Link href={item.href} tabIndex={mobileOpen ? 0 : -1} className="block py-4 text-[17px] font-semibold text-navy-900">
                    {item.label}
                  </Link>
                  )
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid gap-3 border-t border-line p-4 sm:px-6">
          {account ? (
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="secondary" size="lg" className="w-full">
                <Link href="/dashboard" tabIndex={mobileOpen ? 0 : -1}>
                  <UserRound aria-hidden /> My account
                </Link>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full text-danger-600"
                tabIndex={mobileOpen ? 0 : -1}
                loading={signingOut}
                loadingText="Signing out…"
                onClick={async () => {
                  setSigningOut(true);
                  if (!(await signOut())) return setSigningOut(false);
                  setAccount(null);
                  setMobileOpen(false);
                  window.location.href = "/";
                }}
              >
                <LogOut aria-hidden /> Sign out
              </Button>
            </div>
          ) : (
            <Button asChild variant="secondary" size="lg" className="w-full border-2 border-brand-600 text-brand-600">
              <Link href="/login" tabIndex={mobileOpen ? 0 : -1}>
                <LogIn aria-hidden /> Login / Register
              </Link>
            </Button>
          )}
          <Button asChild size="lg" className="w-full">
            <Link href={primaryCta.href} tabIndex={mobileOpen ? 0 : -1}>{primaryCta.label}</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="w-full">
            <a href={site.phone.href} tabIndex={mobileOpen ? 0 : -1}>
              <Phone aria-hidden /> Call {site.phone.display}
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
