import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions, SHORT_SESSION_MAX_AGE } from "@/lib/session";
import { loginSchema } from "@/lib/validation/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Please check your details." }, { status: 400 });
  }
  const { email, password, remember } = parsed.data;
  if (!rateLimit(`login-ip:${clientIp(req)}`, 20, 10 * 60_000).ok || !rateLimit(`login-email:${email}`, 8, 10 * 60_000).ok) {
    return NextResponse.json({ ok: false, error: "Too many login attempts. Please wait a few minutes or reset your password." }, { status: 429 });
  }

  const customer = await getRepository().findCustomerByEmail(email);
  if (customer && !customer.passwordHash) {
    return NextResponse.json(
      { ok: false, code: "NO_PASSWORD", error: "This account doesn't have a password yet. Use \"Forgot password?\" to set one." },
      { status: 400 },
    );
  }
  if (!customer || !(await verifyPassword(password, customer.passwordHash))) {
    return NextResponse.json({ ok: false, error: "Incorrect email or password." }, { status: 401 });
  }

  await getRepository().touchCustomerLogin(customer.id);
  const maxAge = remember ? sessionCookieOptions.maxAge : SHORT_SESSION_MAX_AGE;
  const res = NextResponse.json({ ok: true, customer: { firstName: customer.firstName, email: customer.email } });
  // Without "Remember me" the cookie ends with the browser session (and the token itself expires within a day).
  const { maxAge: _ignored, ...cookieBase } = sessionCookieOptions;
  res.cookies.set(SESSION_COOKIE, await createSessionToken(customer.id, maxAge), remember ? sessionCookieOptions : cookieBase);
  return res;
}
