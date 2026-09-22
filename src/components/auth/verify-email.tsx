"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, MailWarning } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Landing page for the "Verify Email Address" button: confirms the link, then sends the visitor to the website. */
export function VerifyEmail() {
  const router = useRouter();
  const params = useSearchParams();
  const started = useRef(false);
  const [state, setState] = useState<{ status: "working" | "ok" | "error"; message?: string; code?: string }>({ status: "working" });

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const email = params.get("email") || "";
    const token = params.get("token") || "";
    fetch("/api/auth/verify-email", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, token }) })
      .then(async (r) => ({ ok: r.ok, json: await r.json().catch(() => ({})) }))
      .then(({ ok, json }) => {
        if (!ok) return setState({ status: "error", message: json.error, code: json.code });
        setState({ status: "ok" });
        setTimeout(() => {
          router.replace("/?verified=1");
          router.refresh();
        }, 1500);
      })
      .catch(() => setState({ status: "error", message: "Network error. Please try again." }));
  }, [params, router]);

  if (state.status === "working") {
    return (
      <div>
        <Loader2 className="mx-auto size-10 animate-spin text-brand-600" aria-hidden />
        <h1 className="mt-5 text-2xl font-extrabold">Verifying your email…</h1>
      </div>
    );
  }
  if (state.status === "ok") {
    return (
      <div className="animate-fade-up">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-50 text-success-600">
          <CheckCircle2 className="size-9" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold">Email verified!</h1>
        <p className="mt-2 text-muted">Your account is active. Taking you to the website…</p>
      </div>
    );
  }
  return (
    <div className="animate-fade-up">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-50 text-brand-600">
        <MailWarning className="size-8" aria-hidden />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold">{state.code === "ALREADY_VERIFIED" ? "Already verified" : "Link not valid"}</h1>
      <p className="mt-2 text-muted">
        {state.message}{" "}
        {state.code !== "ALREADY_VERIFIED" && "Please register again to get a new verification email."}
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        {state.code === "ALREADY_VERIFIED" ? (
          <Button asChild>
            <Link href="/login">Log in</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/register">Register again</Link>
          </Button>
        )}
        <Button asChild variant="secondary">
          <Link href="/">Go to website</Link>
        </Button>
      </div>
    </div>
  );
}
