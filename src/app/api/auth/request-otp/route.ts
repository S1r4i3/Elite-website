import { NextResponse } from "next/server";
import { z } from "zod";
import { getRepository } from "@/lib/db";
import { issueOtp } from "@/lib/otp";
import { emailConfigured, sendOtpEmail } from "@/lib/email";
import { hashPassword } from "@/lib/password";
import { forgotSchema, registerSchema } from "@/lib/validation/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendVerificationEmail } from "@/lib/email";

/** Public base URL for links in emails: APP_URL if set, otherwise the address the visitor is using. */
function baseUrl(req: Request) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  const url = new URL(req.url);
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || url.host;
  const proto = req.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  return `${proto}://${host}`;
}

/** `register`: emails a "Verify Email Address" link for a new account. `reset`: emails a 6-digit code for a forgotten password. */
export async function POST(req: Request) {
  if (!rateLimit(`otp-ip:${clientIp(req)}`, 8, 10 * 60_000).ok) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please wait a few minutes and try again." }, { status: 429 });
  }
  const body = (await req.json().catch(() => ({}))) as { mode?: string };
  const mode = z.enum(["register", "reset"]).safeParse(body.mode);
  if (!mode.success) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  const repo = getRepository();
  let email: string;
  let payload: Record<string, unknown> | null = null;
  let name: string | undefined;

  if (mode.data === "register") {
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Please check your details." }, { status: 400 });
    const d = parsed.data;
    if (await repo.findCustomerByEmail(d.email)) {
      return NextResponse.json({ ok: false, code: "ACCOUNT_EXISTS", error: "An account with this email already exists. Please log in instead." }, { status: 409 });
    }
    email = d.email;
    name = d.firstName;
    payload = {
      firstName: d.firstName,
      lastName: d.lastName,
      phone: d.phone,
      dob: d.dob,
      state: d.state,
      country: d.country,
      address: d.address,
      passwordHash: await hashPassword(d.password),
    };
  } else {
    const parsed = forgotSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Please enter a valid email." }, { status: 400 });
    const customer = await repo.findCustomerByEmail(parsed.data.email);
    if (!customer) {
      return NextResponse.json({ ok: false, code: "NO_ACCOUNT", error: "We couldn't find an account with this email." }, { status: 404 });
    }
    email = parsed.data.email;
    name = customer.firstName;
  }

  const devMode = !emailConfigured() && process.env.NODE_ENV !== "production";
  if (!emailConfigured() && !devMode) {
    return NextResponse.json({ ok: false, error: "Email verification is temporarily unavailable. Please call us." }, { status: 503 });
  }

  const isLink = mode.data === "register";
  const issued = await issueOtp(email, mode.data, payload, { link: isLink });
  if ("retryAfter" in issued) {
    return NextResponse.json({ ok: false, retryAfter: issued.retryAfter, error: `Please wait ${issued.retryAfter}s before requesting another code.` }, { status: 429 });
  }

  const link = isLink ? `${baseUrl(req)}/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(issued.code)}` : "";

  if (devMode && isLink) {
    console.info(`\n[auth] Email not configured — verification link for ${email}:\n${link}\n`);
    return NextResponse.json({ ok: true, ...(process.env.AUTH_DEV_SHOW_CODE === "true" ? { devLink: link } : {}) });
  }
  if (devMode) {
    // Email isn't configured: the code is only printed in the server terminal (never shown in the browser
    // unless AUTH_DEV_SHOW_CODE=true), so accounts still can't be created without the real code.
    console.info(`\n[auth] Email not configured — verification code for ${email} (${mode.data}): ${issued.code}\n`);
    return NextResponse.json({ ok: true, ...(process.env.AUTH_DEV_SHOW_CODE === "true" ? { devCode: issued.code } : {}) });
  }

  try {
    if (isLink) await sendVerificationEmail(email, link, name);
    else await sendOtpEmail(email, issued.code, mode.data, name);
  } catch (err) {
    console.error("[auth] failed to send code email", err);
    await repo.deleteOtp(email, mode.data);
    return NextResponse.json({ ok: false, error: "We couldn't send the email. Please try again shortly." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
