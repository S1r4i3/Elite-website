import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { serviceRoleConfigured, supabaseAdmin } from "@/lib/supabase/admin";
import { appUrl } from "@/lib/app-url";
import { forgotSchema, registerSchema } from "@/lib/validation/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendOtpEmail, sendVerificationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const isDev = process.env.NODE_ENV !== "production";

/** Supabase's own mailer failed (SMTP login, blocked IP, provider down…). */
const isMailerFailure = (e: { status?: number; message?: string; code?: string } | null) =>
  !!e && (e.status === 500 || /sending|smtp|email.*(send|deliver)/i.test(e.message ?? "") || e.code === "unexpected_failure");

const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status });

/**
 * `register` — creates the account and emails a "Verify Email Address" link.
 * `reset`    — emails a 6-digit recovery code.
 *
 * Primary path: Supabase Auth sends the email (Authentication → SMTP settings).
 * Fallback: if Supabase can't send it, we create the link/code with the service
 * role and send it through our own SMTP (SMTP_* in .env). In development, when
 * no email can be sent at all, the link/code is returned so you can keep testing.
 */
export async function POST(req: Request) {
  if (!rateLimit(`otp-ip:${clientIp(req)}`, 8, 10 * 60_000).ok) {
    return json({ ok: false, error: "Too many requests. Please wait a few minutes and try again." }, 429);
  }

  const body = (await req.json().catch(() => ({}))) as { mode?: string };
  const mode = z.enum(["register", "reset"]).safeParse(body.mode);
  if (!mode.success) return json({ ok: false, error: "Invalid request." }, 400);

  try {
    return mode.data === "register" ? await register(body) : await reset(body);
  } catch (err) {
    // Never fail silently: log the cause and tell the visitor something useful.
    console.error(`[request-otp:${mode.data}] unexpected error:`, err);
    return json({ ok: false, error: "We couldn't reach our sign-up service. Please try again in a minute." }, 500);
  }
}

/* ───────────────────────── register ───────────────────────── */

async function register(body: unknown) {
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, error: parsed.error.issues[0]?.message || "Please check your details." }, 400);
  const d = parsed.data;
  const email = d.email.trim().toLowerCase();
  const metadata = {
    first_name: d.firstName,
    last_name: d.lastName,
    phone: d.phone,
    dob: d.dob,
    state: d.state,
    country: d.country,
    address: d.address,
  };
  const next = "/dashboard?verified=1";

  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: d.password,
    options: { emailRedirectTo: `${appUrl()}/auth/callback?next=${encodeURIComponent(next)}`, data: metadata },
  });

  if (!error) {
    // Supabase returns a user with no identities when the email is already registered.
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return json({ ok: false, code: "ACCOUNT_EXISTS", error: "An account with this email already exists. Please log in instead." }, 409);
    }
    return json({ ok: true });
  }

  if (error.status === 429) {
    return json({ ok: false, error: "Too many verification emails were sent. Please wait a minute and try again.", retryAfter: 60 }, 429);
  }
  if (!isMailerFailure(error) || !serviceRoleConfigured()) {
    console.error("[register] signUp failed:", error.message);
    return json({ ok: false, error: friendly(error.message) }, 400);
  }

  // ── Fallback: Supabase couldn't send the email. Create the link ourselves. ──
  console.warn("[register] Supabase could not send the verification email:", error.message, "— using fallback");
  const admin = supabaseAdmin();
  let hashedToken: string | undefined;

  const signup = await admin.auth.admin.generateLink({ type: "signup", email, password: d.password, options: { data: metadata } });
  if (!signup.error) {
    hashedToken = signup.data.properties?.hashed_token;
  } else if (/already|registered|exists/i.test(signup.error.message)) {
    // The address exists. Confirmed → tell them to log in; unconfirmed → refresh password + send a new link.
    const { data: existing } = await admin.from("profiles").select("id").ilike("email", email).maybeSingle();
    const user = existing?.id ? (await admin.auth.admin.getUserById(existing.id)).data.user : null;
    if (!user || user.email_confirmed_at) {
      return json({ ok: false, code: "ACCOUNT_EXISTS", error: "An account with this email already exists. Please log in instead." }, 409);
    }
    await admin.auth.admin.updateUserById(user.id, { password: d.password, user_metadata: metadata });
    const magic = await admin.auth.admin.generateLink({ type: "magiclink", email });
    if (magic.error) return json({ ok: false, error: friendly(magic.error.message) }, 400);
    hashedToken = magic.data.properties?.hashed_token;
    return deliverLink(email, d.firstName, hashedToken, "magiclink", next);
  } else {
    console.error("[register] generateLink failed:", signup.error.message);
    return json({ ok: false, error: friendly(signup.error.message) }, 400);
  }
  return deliverLink(email, d.firstName, hashedToken, "signup", next);
}

async function deliverLink(email: string, name: string, hashedToken: string | undefined, type: "signup" | "magiclink", next: string) {
  if (!hashedToken) return json({ ok: false, error: "We couldn't create your verification link. Please try again." }, 500);
  const link = `${appUrl()}/auth/callback?token_hash=${encodeURIComponent(hashedToken)}&type=${type}&next=${encodeURIComponent(next)}`;
  try {
    await sendVerificationEmail(email, link, name);
    return json({ ok: true });
  } catch (err) {
    console.error("[register] fallback email failed:", (err as Error).message);
    if (isDev) {
      console.warn(`[register] DEV verification link for ${email}:\n${link}`);
      return json({ ok: true, devLink: link });
    }
    return json(
      { ok: false, error: "Your account was created, but we couldn't send the verification email. Please try again in a few minutes or contact us." },
      502,
    );
  }
}

/* ───────────────────────── reset ───────────────────────── */

async function reset(body: unknown) {
  const parsed = forgotSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, error: parsed.error.issues[0]?.message || "Please enter a valid email." }, 400);
  const email = parsed.data.email.trim().toLowerCase();

  const supabase = await supabaseServer();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl()}/auth/callback?next=${encodeURIComponent("/dashboard/profile")}`,
  });
  if (error?.status === 429) return json({ ok: false, error: "Please wait a moment before requesting another code.", retryAfter: 60 }, 429);

  if (error && isMailerFailure(error) && serviceRoleConfigured()) {
    console.warn("[reset] Supabase could not send the recovery email:", error.message, "— using fallback");
    const link = await supabaseAdmin().auth.admin.generateLink({ type: "recovery", email });
    const code = link.data?.properties?.email_otp;
    if (code) {
      try {
        await sendOtpEmail(email, code, "reset");
      } catch (err) {
        console.error("[reset] fallback email failed:", (err as Error).message);
        if (isDev) return json({ ok: true, devCode: code });
      }
    }
  }
  // Always report success: never reveal whether an email is registered.
  return json({ ok: true });
}

function friendly(message: string) {
  if (/password/i.test(message)) return message;
  if (/invalid.*email|email.*invalid/i.test(message)) return "Please enter a valid email address.";
  return "We couldn't create your account right now. Please try again in a moment.";
}
