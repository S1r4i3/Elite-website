"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { usePathname } from "next/navigation";
import { CheckCircle2, Loader2, Mail, MessageCircle, Phone, Send, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { site } from "@/lib/site";

const KEY = "ebt:inquiry-popup"; // "sent" once the visitor subscribes
const FIRST_DELAY = 5_000; // first appearance: 5 seconds
const REPEAT_EVERY = 60_000; // then every 1 minute until they subscribe
const HIDE_ON = ["/login", "/register", "/forgot-password", "/verify-email", "/get-started", "/contact"];

/**
 * Subscribe pop-up: name, mobile number, email and an optional message.
 * Appears 5 seconds after the visitor lands, then again every minute until they subscribe.
 */
export function InquiryPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const subscribed = useRef(false);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (HIDE_ON.some((p) => pathname.startsWith(p))) return;
    try {
      if (localStorage.getItem(KEY) === "sent") return;
    } catch {}
    const show = () => {
      if (!subscribed.current) setOpen(true);
    };
    const first = setTimeout(show, FIRST_DELAY);
    const repeat = setInterval(show, REPEAT_EVERY);
    return () => {
      clearTimeout(first);
      clearInterval(repeat);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => firstField.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, phone, email, message, page: pathname, website: hp }),
    }).catch(() => null);
    const json = res ? await res.json().catch(() => ({})) : {};
    setBusy(false);
    if (!res || !res.ok) return setError(json.error || "Something went wrong. Please try again.");
    setSent(true);
    track("contact_form_submit", { form: "inquiry", page: pathname });
    subscribed.current = true;
    try {
      localStorage.setItem(KEY, "sent");
    } catch {}
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="inq-title">
      <button type="button" className="absolute inset-0 animate-[fade-in_0.3s_ease] bg-navy-950/60 backdrop-blur-sm" aria-label="Close" onClick={close} />
      <div className="relative w-full max-w-md animate-fade-up overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="slate-bg relative overflow-hidden px-6 pb-6 pt-7 text-white sm:px-8">
          <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand-600/35 blur-3xl" aria-hidden />
          <button type="button" onClick={close} className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white" aria-label="Close">
            <X className="size-4" />
          </button>
          <span className="relative grid size-11 place-items-center rounded-2xl bg-brand-600 text-white">
            <MessageCircle className="size-5" aria-hidden />
          </span>
          <h2 id="inq-title" className="relative mt-4 text-2xl font-extrabold text-white">
            {sent ? "Thank you!" : "Subscribe"}
          </h2>
          <p className="relative mt-1 text-sm text-white/70">
            {sent
              ? "We've received your details. A tax professional will get back to you shortly."
              : "Leave your details and a tax professional from Elite B Tax Services will get in touch."}
          </p>
        </div>

        {sent ? (
          <div className="p-6 text-center sm:p-8">
            <CheckCircle2 className="mx-auto size-12 text-success-600" aria-hidden />
            <p className="mt-3 text-sm text-muted">
              Need us sooner? Call{" "}
              <a href={site.phone.href} className="font-semibold text-brand-600">
                {site.phone.display}
              </a>
            </p>
            <Button className="mt-6 w-full" onClick={close}>
              Continue browsing
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3 p-6 sm:p-8">
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />
              <Input
                ref={firstField}
                id="inq-name"
                aria-label="Name"
                autoComplete="name"
                className="pl-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={80}
                placeholder="Name"
              />
            </div>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />
              <Input
                id="inq-phone"
                aria-label="Phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="pl-10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                minLength={7}
                maxLength={20}
                placeholder="Phone"
              />
            </div>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />
              <Input
                id="inq-email"
                aria-label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={160}
                placeholder="Email"
              />
            </div>
            <Textarea id="inq-msg" aria-label="Message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} placeholder="Message (optional)" />
            <input type="text" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" className="absolute -left-[9999px]" aria-hidden />
            {error && (
              <p className="text-sm text-danger-600" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" className="btn-shine w-full" disabled={busy}>
              {busy ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />} Submit
            </Button>
            <button type="button" onClick={close} className="w-full text-center text-sm font-medium text-muted hover:text-navy-900">
              Close
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
