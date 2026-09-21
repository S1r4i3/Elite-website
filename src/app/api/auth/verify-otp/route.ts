import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { checkOtp } from "@/lib/otp";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { verifyOtpSchema } from "@/lib/validation/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`otp-verify:${clientIp(req)}`, 20, 10 * 60_000).ok) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please wait a few minutes." }, { status: 429 });
  }
  const parsed = verifyOtpSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Invalid request." }, { status: 400 });
  }
  const { mode, email, code } = parsed.data;
  const result = await checkOtp(email, mode, code);
  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: result.status });

  const repo = getRepository();
  let customer = await repo.findCustomerByEmail(email);
  if (mode === "register") {
    if (!customer) {
      const p = (result.payload || {}) as { firstName?: string; lastName?: string; phone?: string | null };
      try {
        customer = await repo.createCustomer({ firstName: p.firstName || "", lastName: p.lastName || "", email, phone: p.phone ?? null });
      } catch (e) {
        if ((e as Error).message !== "EMAIL_EXISTS") throw e;
        customer = await repo.findCustomerByEmail(email);
      }
    }
  } else if (customer) {
    await repo.touchCustomerLogin(customer.id);
  }
  if (!customer) return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });

  const res = NextResponse.json({ ok: true, customer: { firstName: customer.firstName, email: customer.email } });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(customer.id), sessionCookieOptions);
  return res;
}
