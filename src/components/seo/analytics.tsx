"use client";

import Script from "next/script";
import { useEffect } from "react";
import { ensureGtag, track } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * GA4, loaded after the page is interactive and only when NEXT_PUBLIC_GA_ID is set.
 * One delegated click listener turns phone, email, WhatsApp and Get Started clicks into events.
 */
export function Analytics() {
  useEffect(() => {
    if (!ensureGtag()) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const page = window.location.pathname;
      if (href.startsWith("tel:")) track("phone_click", { page });
      else if (href.startsWith("mailto:")) track("email_click", { page });
      else if (href.includes("wa.me/")) track("whatsapp_click", { page });
      else if (href.startsWith("/get-started") || href === "#get-started") track("get_started", { page, label: a.textContent?.trim().slice(0, 60) });
      else if (href.startsWith("/contact")) track("consultation_request", { page, label: a.textContent?.trim().slice(0, 60) });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}

/** Fires once when a service page is viewed. */
export function TrackView({ event, params }: { event: string; params: Record<string, string> }) {
  useEffect(() => {
    track(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
