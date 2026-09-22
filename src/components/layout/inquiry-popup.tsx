"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, Loader2, MessageCircle, Phone, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { site } from "@/lib/site";

const KEY = "ebt:inquiry-popup"; // "closed" | "sent"
const HIDE_ON = ["/login", "/register", "/forgot-password", "/verify-email", "/get-started", "/contact"];

/** Welcome pop-up that invites visitors to leave their name, mobile number and a message. Shown once per visitor. */
export function InquiryPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (HIDE_ON.some((p) => pathname.startsWith(p))) return;
    let seen: string | null = null;
    try {
      seen = localStorage.getItem(KEY);
    } catch {}
    if (seen) return;
    const t = setTimeout(() => setOpen(true), 4000);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => firstField.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const remember = (v: string) => {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
  };
  const close = () => {
    setOpen(false);
    if (!sent) remember("closed");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, phone, message, page: pathname, website: hp }),
    }).catch(() => null);
    const json = res ? await res.json().catch(() => ({})) : {};
    setBusy(false);
    if (!res || !res.ok) return setError(json.error || "Something went wrong. Please try again.");
    setSent(true);
    remember("sent");
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
            {sent ? "Thank you!" : "Have a tax question?"}
          </h2>
          <p className="relative mt-1 text-sm text-white/70">
            {sent ? "We've received your message. A tax professional will call you back shortly." : "Leave your details and a tax professional from Elite B Tax Services will call you back."}
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
            <Button className="mt-6 w-full" onClick={() => setOpen(false)}>
              Continue browsing
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 p-6 sm:p-8">
            <div>
              <Label htmlFor="inq-name">Name</Label>
              <Input ref={firstField} id="inq-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={80} placeholder="Your full name" />
            </div>
            <div>
              <Label htmlFor="inq-phone">Mobile number</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />
                <Input id="inq-phone" type="tel" inputMode="tel" autoComplete="tel" className="pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} required minLength={7} maxLength={20} placeholder="+1 or +91 mobile number" />
              </div>
            </div>
            <div>
              <Label htmlFor="inq-msg">
                Message <span className="font-normal text-subtle">(optional)</span>
              </Label>
              <Textarea id="inq-msg" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} placeholder="How can we help?" />
            </div>
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
              No thanks
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
