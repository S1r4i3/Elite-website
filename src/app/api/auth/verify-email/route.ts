import { NextResponse } from "next/server";
import { z } from "zod";
import { getRepository } from "@/lib/db";
import { checkOtp } from "@/lib/otp";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(120),
  token: z.string().min(20).max(200),
});

/**
 * Called by the /verify-email page (POST, not the email link itself, so mail scanners that pre-open links
 * can't use up the token). Creates the account, signs the customer in.
 */
export async function POST(req: Request) {
  if (!rateLimit(`verify-email:${clientIp(req)}`, 20, 10 * 60_000).ok) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please wait a few minutes." }, { status: 429 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "This verification link is invalid." }, { status: 400 });
  const { email, token } = parsed.data;

  const repo = getRepository();
  const already = await repo.findCustomerByEmail(email);
  const result = await checkOtp(email, "register", token);
  if (!result.ok) {
    if (already) return NextResponse.json({ ok: false, code: "ALREADY_VERIFIED", error: "This email is already verified. Please log in." }, { status: 409 });
    const expired = /expired/i.test(result.error);
    return NextResponse.json(
      { ok: false, code: expired ? "EXPIRED" : "INVALID", error: expired ? "This verification link has expired." : "This verification link is invalid or has already been used." },
      { status: 400 },
    );
  }

  let customer = already;
  if (!customer) {
    const p = (result.payload || {}) as Record<string, string | null | undefined>;
    try {
      customer = await repo.createCustomer({
        firstName: p.firstName || "",
        lastName: p.lastName || "",
        email,
        phone: p.phone ?? null,
        dob: p.dob ?? null,
        state: p.state ?? null,
        country: p.country ?? null,
        address: p.address ?? null,
        passwordHash: p.passwordHash ?? null,
      });
    } catch (e) {
      if ((e as Error).message !== "EMAIL_EXISTS") throw e;
      customer = await repo.findCustomerByEmail(email);
    }
  }
  if (!customer) return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });

  const res = NextResponse.json({ ok: true, customer: { firstName: customer.firstName } });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(customer.id), sessionCookieOptions);
  return res;
}
