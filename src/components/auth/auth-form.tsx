"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";
import { forwardRef, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Info, Loader2, Lock, Mail, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpInput } from "./otp-input";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/lib/validation/auth";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api-client";
import { hasAuthCookie } from "@/lib/auth-cookie";

export type AuthTab = "login" | "register";

/* ───────── shared bits ───────── */

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-danger-600" role="alert">
      {msg}
    </p>
  );
}

function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-danger-600/20 bg-danger-50 p-3 text-sm text-danger-600" role="alert">
      {children}
    </div>
  );
}

export const PasswordInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input ref={ref} type={show ? "text" : "password"} className="pr-11" {...props} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-subtle transition hover:bg-canvas hover:text-navy-900"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="size-[18px]" aria-hidden /> : <Eye className="size-[18px]" aria-hidden />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

async function postJson(url: string, body: unknown) {
  try {
    // 20 s timeout: a stalled request always ends with a clear message and the button comes back.
    const res = await apiFetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, json } as { ok: boolean; json: { error?: string; code?: string; retryAfter?: number; devCode?: string; devLink?: string } };
  } catch (e) {
    return { ok: false, json: { error: (e as Error).message || "Network error. Please check your connection and try again." } };
  }
}

function useCooldown() {
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);
  return [cooldown, setCooldown] as const;
}

function DevCodeNote({ code }: { code: string | null }) {
  if (!code) return null;
  return (
    <p className="mt-5 flex items-start gap-2 rounded-xl border border-warn-700/20 bg-warn-50 p-3 text-sm text-warn-700">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>
        Test mode: your code is <strong className="tracking-widest">{code}</strong>
      </span>
    </p>
  );
}

function Done({ title, body }: { title: string; body: string }) {
  return (
    <div className="animate-fade-up py-10 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-50 text-success-600">
        <CheckCircle2 className="size-9" aria-hidden />
      </span>
      <h2 className="mt-5 text-2xl font-extrabold">{title}</h2>
      <p className="mt-2 text-muted">{body}</p>
      <Loader2 className="mx-auto mt-5 size-5 animate-spin text-brand-600" aria-hidden />
    </div>
  );
}

/* ───────── Tabs card ───────── */

export function AuthCard({ initialTab }: { initialTab: AuthTab }) {
  const [tab, setTab] = useState<AuthTab>(initialTab);
  const [locked, setLocked] = useState(false); // hide tabs during email verification

  const switchTo = (t: AuthTab) => {
    setTab(t);
    if (typeof window !== "undefined") window.history.replaceState(null, "", `/${t}${window.location.search}`);
  };

  return (
    <div>
      {!locked && (
        <div role="tablist" aria-label="Login or register" className="grid grid-cols-2 rounded-2xl bg-canvas p-1.5">
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tab === t}
              onClick={() => switchTo(t)}
              className={cn(
                "h-11 rounded-xl text-[15px] font-semibold transition-all",
                tab === t ? "bg-white text-brand-600 shadow-[var(--shadow-soft)]" : "text-muted hover:text-navy-900",
              )}
            >
              {t === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>
      )}
      <div className={cn(!locked && "mt-7")}>
        {tab === "login" ? <LoginPanel onRegister={() => switchTo("register")} /> : <RegisterPanel onLogin={() => switchTo("login")} onLock={setLocked} />}
      </div>
    </div>
  );
}

/* ───────── Login ───────── */

function LoginPanel({ onRegister }: { onRegister: () => void }) {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [needsReset, setNeedsReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState, getValues } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: params.get("email") || "", password: "", remember: true },
  });
  const errors = formState.errors;

  useEffect(() => {
    const next = params.get("next");
    router.prefetch(next && next.startsWith("/dashboard") ? next : "/dashboard");
  }, [router, params]);

  const submit = handleSubmit(async (data) => {
    setLoading(true);
    setError(null);
    setNeedsReset(false);
    const { ok, json } = await postJson("/api/auth/login", data);
    if (!ok) {
      setLoading(false);
      setError(json.error || "Login failed.");
      setNeedsReset(json.code === "NO_PASSWORD");
      return;
    }
    setDone(true);
    const next = params.get("next");
    const dest = next && next.startsWith("/dashboard") ? next : "/dashboard";
    // Navigate immediately with fresh session
    window.location.assign(dest);
  });

  if (done) return <Done title="Welcome back!" body="Taking you to your dashboard…" />;

  return (
    <div className="animate-fade-up">
      <h1 className="text-center text-2xl font-extrabold sm:text-[26px]">Already a client? Log in to continue.</h1>
      <form className="mt-7 space-y-5" noValidate onSubmit={submit}>
        <div>
          <Label htmlFor="login-email">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-subtle" aria-hidden />
            <Input id="login-email" type="email" inputMode="email" autoComplete="email" placeholder="email@example.com" className="pl-10" aria-invalid={!!errors.email || undefined} aria-describedby={errors.email ? "login-email-error" : undefined} {...register("email")} />
          </div>
          <FieldError id="login-email-error" msg={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="login-password">Password</Label>
          <PasswordInput id="login-password" autoComplete="current-password" placeholder="Password" aria-invalid={!!errors.password || undefined} aria-describedby={errors.password ? "login-password-error" : undefined} {...register("password")} />
          <FieldError id="login-password-error" msg={errors.password?.message} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2.5 text-sm text-muted">
            <input type="checkbox" className="size-4 accent-brand-600" {...register("remember")} /> Remember me
          </label>
          <Link href={`/forgot-password${getValues("email") ? `?email=${encodeURIComponent(getValues("email"))}` : ""}`} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Forgot password?
          </Link>
        </div>
        {error && (
          <Alert>
            {error}{" "}
            {needsReset && (
              <Link href={`/forgot-password?email=${encodeURIComponent(getValues("email"))}`} className="font-semibold underline">
                Set a password
              </Link>
            )}
          </Alert>
        )}
        <Button type="submit" size="lg" className="btn-shine w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" aria-hidden /> Signing in…
            </>
          ) : (
            <>
              <Lock aria-hidden /> Log in
            </>
          )}
        </Button>
      </form>
      <p className="mt-7 text-center text-sm text-muted">
        New to Elite Tax?{" "}
        <button type="button" onClick={onRegister} className="font-semibold text-brand-600 hover:text-brand-700">
          Create an account
        </button>
      </p>
    </div>
  );
}

/* ───────── Register ───────── */

function RegisterPanel({ onLogin, onLock }: { onLogin: () => void; onLock: (v: boolean) => void }) {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "sent">("details");
  const [details, setDetails] = useState<RegisterInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useCooldown();
  const [devLink, setDevLink] = useState<string | null>(null);

  const { register, handleSubmit, formState } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { country: "United States" },
  });
  const errors = formState.errors;
  const aria = (k: keyof RegisterInput) => ({ "aria-invalid": !!errors[k] || undefined, "aria-describedby": errors[k] ? `reg-${k}-error` : undefined });
  const err = (k: keyof RegisterInput) => errors[k]?.message as string | undefined;

  useEffect(() => onLock(step !== "details"), [step, onLock]);

  // If the link is opened in this same browser, move this tab on to the website too.
  useEffect(() => {
    if (step !== "sent") return;
    const t = setInterval(async () => {
      // No session cookie yet → the link hasn't been opened in this browser; skip the server round-trip.
      if (!hasAuthCookie()) return;
      const me = await apiFetch("/api/auth/me", { cache: "no-store" }, 8_000).then((r) => r.json()).catch(() => null);
      if (me?.customer) {
        clearInterval(t);
        router.replace("/dashboard?verified=1");
        router.refresh();
      }
    }, 4000);
    return () => clearInterval(t);
  }, [step, router]);

  const sendLink = async (data: RegisterInput, isResend = false) => {
    setLoading(true);
    setError(null);
    setExists(false);
    setResent(false);
    const { ok, json } = await postJson("/api/auth/request-otp", { ...data, mode: "register" });
    setLoading(false);
    if (!ok) {
      setError(json.error || "Something went wrong. Please try again.");
      setExists(json.code === "ACCOUNT_EXISTS");
      if (json.retryAfter) setCooldown(json.retryAfter);
      return;
    }
    setDevLink(json.devLink ?? null);
    setDetails(data);
    setCooldown(60);
    setResent(isResend);
    if (!isResend) track("sign_up", { method: "email" });
    setStep("sent");
  };

  if (step === "sent" && details) {
    return (
      <div className="animate-fade-up text-center">
        <span className="relative mx-auto grid size-20 place-items-center rounded-full bg-brand-50 text-brand-600">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-100 opacity-60" aria-hidden />
          <Mail className="relative size-9" aria-hidden />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold">Verify your email</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          We&apos;ve sent a verification email to <span className="font-semibold text-navy-900">{details.email}</span>. Click the{" "}
          <span className="font-semibold text-navy-900">Verify Email Address</span> button in that email to activate your account — you&apos;ll be taken
          straight to the website.
        </p>
        <ol className="mx-auto mt-7 max-w-sm space-y-3 text-left text-sm text-muted">
          {["Open the email from Elite B Tax Services", "Click “Verify Email Address”", "You're signed in and back on the website"].map((t, i) => (
            <li key={t} className="flex items-center gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">{i + 1}</span> {t}
            </li>
          ))}
        </ol>
        {devLink && (
          <p className="mt-6 flex items-start gap-2 rounded-xl border border-warn-700/20 bg-warn-50 p-3 text-left text-sm text-warn-700">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              Test mode: <a href={devLink} className="font-semibold underline">open verification link</a>
            </span>
          </p>
        )}
        {resent && <p className="mt-6 text-sm font-medium text-success-700">A new verification email is on its way.</p>}
        {error && <div className="mt-6 text-left"><Alert>{error}</Alert></div>}
        <p className="mt-7 text-sm text-muted">
          Didn&apos;t get it? Check your spam folder, or{" "}
          <button type="button" disabled={cooldown > 0 || loading} onClick={() => sendLink(details, true)} className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:text-subtle">
            <RotateCw className={cn("size-3.5", loading && "animate-spin")} aria-hidden />
            {cooldown > 0 ? `resend in ${cooldown}s` : "resend email"}
          </button>
        </p>
        <button type="button" onClick={() => { setStep("details"); setError(null); }} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-900">
          <ArrowLeft className="size-4" aria-hidden /> Wrong email? Go back
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <h1 className="text-center text-2xl font-extrabold sm:text-[26px]">New here? Create your account.</h1>
      <form className="mt-7 grid gap-x-4 gap-y-5 sm:grid-cols-2" noValidate onSubmit={handleSubmit((d) => sendLink(d))}>
        <div>
          <Label htmlFor="reg-firstName">First name</Label>
          <Input id="reg-firstName" autoComplete="given-name" placeholder="First name" {...register("firstName")} {...aria("firstName")} />
          <FieldError id="reg-firstName-error" msg={err("firstName")} />
        </div>
        <div>
          <Label htmlFor="reg-lastName">Last name</Label>
          <Input id="reg-lastName" autoComplete="family-name" placeholder="Last name" {...register("lastName")} {...aria("lastName")} />
          <FieldError id="reg-lastName-error" msg={err("lastName")} />
        </div>
        <div>
          <Label htmlFor="reg-phone">Phone</Label>
          <Input id="reg-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+1" {...register("phone")} {...aria("phone")} />
          <FieldError id="reg-phone-error" msg={err("phone")} />
        </div>
        <div>
          <Label htmlFor="reg-email">Email</Label>
          <Input id="reg-email" type="email" inputMode="email" autoComplete="email" placeholder="email@example.com" {...register("email")} {...aria("email")} />
          <FieldError id="reg-email-error" msg={err("email")} />
        </div>
        <div>
          <Label htmlFor="reg-dob">Date of birth</Label>
          <Input id="reg-dob" type="date" autoComplete="bday" max={new Date().toISOString().slice(0, 10)} {...register("dob")} {...aria("dob")} />
          <FieldError id="reg-dob-error" msg={err("dob")} />
        </div>
        <div>
          <Label htmlFor="reg-state">State</Label>
          <Input id="reg-state" autoComplete="address-level1" placeholder="State" {...register("state")} {...aria("state")} />
          <FieldError id="reg-state-error" msg={err("state")} />
        </div>
        <div>
          <Label htmlFor="reg-country">Country</Label>
          <Input id="reg-country" autoComplete="country-name" placeholder="Country" {...register("country")} {...aria("country")} />
          <FieldError id="reg-country-error" msg={err("country")} />
        </div>
        <div>
          <Label htmlFor="reg-address">Address</Label>
          <Input id="reg-address" autoComplete="street-address" placeholder="Street address, city, ZIP" {...register("address")} {...aria("address")} />
          <FieldError id="reg-address-error" msg={err("address")} />
        </div>
        <div>
          <Label htmlFor="reg-password">Password</Label>
          <PasswordInput id="reg-password" autoComplete="new-password" placeholder="Password" {...register("password")} {...aria("password")} />
          <FieldError id="reg-password-error" msg={err("password") ?? undefined} />
          {!err("password") && <p className="mt-1.5 text-xs text-subtle">8+ characters with a letter and a number.</p>}
        </div>
        <div>
          <Label htmlFor="reg-confirmPassword">Confirm password</Label>
          <PasswordInput id="reg-confirmPassword" autoComplete="new-password" placeholder="Confirm password" {...register("confirmPassword")} {...aria("confirmPassword")} />
          <FieldError id="reg-confirmPassword-error" msg={err("confirmPassword")} />
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm text-muted">
            <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-brand-600" {...register("consent")} {...aria("consent")} />
            <span>
              I agree to the <Link href="/terms" className="font-medium text-brand-600 hover:underline">Terms</Link> and{" "}
              <Link href="/privacy" className="font-medium text-brand-600 hover:underline">Privacy Policy</Link>.
            </span>
          </label>
          <FieldError id="reg-consent-error" msg={err("consent")} />
        </div>
        {error && (
          <div className="sm:col-span-2">
            <Alert>
              {error}{" "}
              {exists && (
                <button type="button" onClick={onLogin} className="font-semibold underline">
                  Log in instead
                </button>
              )}
            </Alert>
          </div>
        )}
        <div className="sm:col-span-2">
          <Button type="submit" size="lg" className="btn-shine w-full" disabled={loading || cooldown > 0}>
            {loading ? (
              <>
                <Loader2 className="animate-spin" aria-hidden /> Creating account…
              </>
            ) : cooldown > 0 ? (
              `Try again in ${cooldown}s`
            ) : (
              <>
                Register <ArrowRight aria-hidden />
              </>
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-subtle">We&apos;ll email you a link to verify your address before your account is activated.</p>
        </div>
      </form>
    </div>
  );
}

/* ───────── Forgot password ───────── */

export function ForgotPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState<"email" | "reset" | "done">("email");
  const [email, setEmail] = useState(params.get("email") || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useCooldown();
  const [devCode, setDevCode] = useState<string | null>(null);

  const sendCode = async () => {
    setLoading(true);
    setError(null);
    const { ok, json } = await postJson("/api/auth/request-otp", { mode: "reset", email });
    setLoading(false);
    if (!ok) {
      setError(json.error || "Something went wrong.");
      if (json.retryAfter) setCooldown(json.retryAfter);
      return;
    }
    setDevCode(json.devCode ?? null);
    setCooldown(60);
    setStep("reset");
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { ok, json } = await postJson("/api/auth/reset-password", { email, code, password, confirmPassword: confirm });
    setLoading(false);
    if (!ok) return setError(json.error || "Couldn't reset your password.");
    setStep("done");
    setTimeout(() => {
      router.replace("/dashboard");
      router.refresh();
    }, 1200);
  };

  if (step === "done") return <Done title="Password updated!" body="You're signed in. Taking you to your dashboard…" />;

  return (
    <div className="animate-fade-up">
      <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-900">
        <ArrowLeft className="size-4" aria-hidden /> Back to login
      </Link>
      <span className="mt-6 grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Lock className="size-7" aria-hidden />
      </span>
      <h1 className="mt-5 text-3xl font-extrabold">{step === "email" ? "Forgot your password?" : "Set a new password"}</h1>
      <p className="mt-2 text-muted">
        {step === "email" ? (
          "Enter your account email and we'll send you a 6-digit code to reset it."
        ) : (
          <>
            Enter the code we sent to <span className="font-semibold text-navy-900">{email}</span> and choose a new password.
          </>
        )}
      </p>
      <DevCodeNote code={devCode} />

      {step === "email" ? (
        <form className="mt-7 space-y-5" onSubmit={(e) => { e.preventDefault(); sendCode(); }}>
          <div>
            <Label htmlFor="fp-email">Email address</Label>
            <Input id="fp-email" type="email" autoComplete="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          {error && <Alert>{error}</Alert>}
          <Button type="submit" size="lg" className="btn-shine w-full" disabled={loading || cooldown > 0 || !email}>
            {loading && <Loader2 className="animate-spin" aria-hidden />} {cooldown > 0 && !loading ? `Try again in ${cooldown}s` : "Send reset code"}
          </Button>
        </form>
      ) : (
        <form className="mt-7 space-y-5" onSubmit={reset}>
          <div>
            <Label>Verification code</Label>
            <OtpInput value={code} onChange={setCode} disabled={loading} invalid={!!error} />
          </div>
          <div>
            <Label htmlFor="fp-password">New password</Label>
            <PasswordInput id="fp-password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <p className="mt-1.5 text-xs text-subtle">8+ characters with a letter and a number.</p>
          </div>
          <div>
            <Label htmlFor="fp-confirm">Confirm new password</Label>
            <PasswordInput id="fp-confirm" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
          {error && <Alert>{error}</Alert>}
          <Button type="submit" size="lg" className="btn-shine w-full" disabled={loading || code.length !== 6 || !password}>
            {loading && <Loader2 className="animate-spin" aria-hidden />} Update password
          </Button>
          <p className="text-center text-sm text-muted">
            <button type="button" disabled={cooldown > 0 || loading} onClick={sendCode} className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:text-subtle">
              <RotateCw className="size-3.5" aria-hidden /> {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
