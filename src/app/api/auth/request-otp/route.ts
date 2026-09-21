import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { issueOtp } from "@/lib/otp";
import { emailConfigured, sendOtpEmail } from "@/lib/email";
import { requestOtpSchema } from "@/lib/validation/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`otp-ip:${clientIp(req)}`, 8, 10 * 60_000).ok) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please wait a few minutes and try again." }, { status: 429 });
  }
  const parsed = requestOtpSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Please check your details." }, { status: 400 });
  }
  const input = parsed.data;
  const repo = getRepository();
  const existing = await repo.findCustomerByEmail(input.email);

  if (input.mode === "login" && !existing) {
    return NextResponse.json({ ok: false, code: "NO_ACCOUNT", error: "We couldn't find an account with this email. Please create one." }, { status: 404 });
  }
  if (input.mode === "register" && existing) {
    return NextResponse.json({ ok: false, code: "ACCOUNT_EXISTS", error: "An account with this email already exists. Please log in instead." }, { status: 409 });
  }

  const devMode = !emailConfigured() && process.env.NODE_ENV !== "production";
  if (!emailConfigured() && !devMode) {
    return NextResponse.json({ ok: false, error: "Email sign-in is temporarily unavailable. Please call us." }, { status: 503 });
  }

  const payload =
    input.mode === "register"
      ? { firstName: input.firstName, lastName: input.lastName, phone: input.phone || null }
      : null;
  const issued = await issueOtp(input.email, input.mode, payload);
  if ("retryAfter" in issued) {
    return NextResponse.json({ ok: false, retryAfter: issued.retryAfter, error: `Please wait ${issued.retryAfter}s before requesting another code.` }, { status: 429 });
  }

  if (devMode) {
    console.info(`[auth] DEV OTP for ${input.email} (${input.mode}): ${issued.code}`);
    return NextResponse.json({ ok: true, devCode: issued.code });
  }

  try {
    const name = input.mode === "register" ? input.firstName : existing?.firstName;
    await sendOtpEmail(input.email, issued.code, input.mode, name);
  } catch (err) {
    console.error("[auth] failed to send OTP email", err);
    await repo.deleteOtp(input.email, input.mode);
    return NextResponse.json({ ok: false, error: "We couldn't send the email. Please try again shortly." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
