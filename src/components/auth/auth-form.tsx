"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, Info, Loader2, Mail, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpInput } from "./otp-input";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/lib/validation/auth";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-danger-600" role="alert">
      {msg}
    </p>
  );
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState<"details" | "code" | "done">("details");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState<LoginInput | RegisterInput | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorLink, setErrorLink] = useState<{ href: string; label: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver((mode === "login" ? loginSchema : registerSchema) as typeof registerSchema),
    defaultValues: { email: params.get("email") || "" } as RegisterInput,
  });
  const { register, handleSubmit, formState } = form;
  const errors = formState.errors;

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const requestCode = async (data: LoginInput | RegisterInput) => {
    setLoading(true);
    setError(null);
    setErrorLink(null);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, mode }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        if (json.code === "NO_ACCOUNT") setErrorLink({ href: `/register?email=${encodeURIComponent(data.email)}`, label: "Create an account" });
        if (json.code === "ACCOUNT_EXISTS") setErrorLink({ href: `/login?email=${encodeURIComponent(data.email)}`, label: "Log in instead" });
        if (json.retryAfter) setCooldown(json.retryAfter);
        return false;
      }
      setDevCode(json.devCode ?? null);
      setEmail(data.email.trim().toLowerCase());
      setDetails(data);
      setCode("");
      setCooldown(60);
      setStep("code");
      return true;
    } catch {
      setError("Network error. Please check your connection and try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verify = async (value = code) => {
    if (value.length !== 6 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, email, code: value }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Verification failed.");
        setCode("");
        return;
      }
      setStep("done");
      const next = params.get("next");
      setTimeout(() => {
        router.replace(next && next.startsWith("/dashboard") ? next : "/dashboard");
        router.refresh();
      }, 900);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "done") {
    return (
      <div className="py-10 text-center animate-fade-up">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-50 text-success-600">
          <CheckCircle2 className="size-9" aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold">{mode === "register" ? "Account created!" : "Welcome back!"}</h2>
        <p className="mt-2 text-muted">Taking you to your dashboard…</p>
        <Loader2 className="mx-auto mt-5 size-5 animate-spin text-brand-600" aria-hidden />
      </div>
    );
  }

  if (step === "code") {
    return (
      <div className="animate-fade-up">
        <button
          type="button"
          onClick={() => {
            setStep("details");
            setError(null);
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-900"
        >
          <ArrowLeft className="size-4" aria-hidden /> Change email
        </button>
        <span className="mt-6 grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Mail className="size-7" aria-hidden />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold">Check your email</h1>
        <p className="mt-2 text-muted">
          We sent a 6-digit code to <span className="font-semibold text-navy-900">{email}</span>. It expires in 10 minutes.
        </p>

        {devCode && (
          <p className="mt-5 flex items-start gap-2 rounded-xl border border-warn-700/20 bg-warn-50 p-3 text-sm text-warn-700">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              Development mode (email not configured): your code is <strong className="tracking-widest">{devCode}</strong>
            </span>
          </p>
        )}

        <form
          className="mt-7"
          onSubmit={(e) => {
            e.preventDefault();
            verify();
          }}
        >
          <OtpInput value={code} onChange={setCode} onComplete={verify} disabled={loading} invalid={!!error} describedBy={error ? "otp-error" : undefined} />
          <FieldError id="otp-error" msg={error ?? undefined} />
          <Button type="submit" size="lg" className="btn-shine mt-6 w-full" disabled={loading || code.length !== 6}>
            {loading ? <Loader2 className="animate-spin" aria-hidden /> : null}
            {mode === "register" ? "Verify & create account" : "Verify & log in"}
            {!loading && <ArrowRight aria-hidden />}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Didn&apos;t get it? Check spam, or{" "}
          <button
            type="button"
            disabled={cooldown > 0 || loading || !details}
            onClick={() => details && requestCode(details)}
            className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:text-subtle"
          >
            <RotateCw className={cn("size-3.5", loading && "animate-spin")} aria-hidden />
            {cooldown > 0 ? `resend in ${cooldown}s` : "resend code"}
          </button>
        </p>
      </div>
    );
  }

  const err = (k: keyof RegisterInput) => (errors[k]?.message as string | undefined) ?? undefined;
  const aria = (k: keyof RegisterInput) => ({ "aria-invalid": !!errors[k] || undefined, "aria-describedby": errors[k] ? `${k}-error` : undefined });

  return (
    <div className="animate-fade-up">
      <p className="eyebrow">{mode === "login" ? "Client login" : "Create account"}</p>
      <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="mt-2 text-muted">
        {mode === "login"
          ? "Enter your email and we'll send you a one-time code. No password needed."
          : "Track your filing, share documents and message your tax professional — all in one place."}
      </p>

      <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit((d) => requestCode(d))}>
        {mode === "register" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" autoComplete="given-name" {...register("firstName")} {...aria("firstName")} />
              <FieldError id="firstName-error" msg={err("firstName")} />
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" autoComplete="family-name" {...register("lastName")} {...aria("lastName")} />
              <FieldError id="lastName-error" msg={err("lastName")} />
            </div>
          </div>
        )}
        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-subtle" aria-hidden />
            <Input id="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" className="pl-10" {...register("email")} {...aria("email")} />
          </div>
          <FieldError id="email-error" msg={err("email")} />
        </div>
        {mode === "register" && (
          <>
            <div>
              <Label htmlFor="phone">
                Phone <span className="font-normal text-subtle">(optional)</span>
              </Label>
              <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+1" {...register("phone")} {...aria("phone")} />
              <FieldError id="phone-error" msg={err("phone")} />
            </div>
            <div>
              <label className="flex items-start gap-3 text-sm text-muted">
                <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-brand-600" {...register("consent")} {...aria("consent")} />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="font-medium text-brand-600 hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-medium text-brand-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              <FieldError id="consent-error" msg={err("consent")} />
            </div>
          </>
        )}

        {error && (
          <div className="rounded-xl border border-danger-600/20 bg-danger-50 p-3 text-sm text-danger-600" role="alert">
            {error}{" "}
            {errorLink && (
              <Link href={errorLink.href} className="font-semibold underline">
                {errorLink.label}
              </Link>
            )}
          </div>
        )}

        <Button type="submit" size="lg" className="btn-shine w-full" disabled={loading || cooldown > 0}>
          {loading ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {cooldown > 0 && !loading ? `Try again in ${cooldown}s` : "Send verification code"}
          {!loading && cooldown <= 0 && <ArrowRight aria-hidden />}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            New to Elite Tax?{" "}
            <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
