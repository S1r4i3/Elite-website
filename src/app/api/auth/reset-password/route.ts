import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { checkOtp } from "@/lib/otp";
import { hashPassword } from "@/lib/password";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { resetSchema } from "@/lib/validation/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`reset:${clientIp(req)}`, 20, 10 * 60_000).ok) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please wait a few minutes." }, { status: 429 });
  }
  const parsed = resetSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Please check your details." }, { status: 400 });
  }
  const { email, code, password } = parsed.data;
  const repo = getRepository();
  const customer = await repo.findCustomerByEmail(email);
  if (!customer) return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });

  const result = await checkOtp(email, "reset", code);
  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: result.status });

  await repo.setCustomerPassword(customer.id, await hashPassword(password));
  await repo.touchCustomerLogin(customer.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(customer.id), sessionCookieOptions);
  return res;
}
