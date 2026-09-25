import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { supabaseServer } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validation/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** Signs a client in with Supabase Auth and sets the session cookies. */
export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Please check your details." }, { status: 400 });
  }
  const { email, password } = parsed.data;
  if (!rateLimit(`login-ip:${clientIp(req)}`, 20, 10 * 60_000).ok || !rateLimit(`login-email:${email}`, 8, 10 * 60_000).ok) {
    return NextResponse.json({ ok: false, error: "Too many login attempts. Please wait a few minutes or reset your password." }, { status: 429 });
  }

  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (/email not confirmed/i.test(error.message)) {
      return NextResponse.json(
        { ok: false, code: "EMAIL_NOT_CONFIRMED", error: "Please verify your email first — check your inbox for the verification link." },
        { status: 403 },
      );
    }
    return NextResponse.json({ ok: false, error: "Incorrect email or password." }, { status: 401 });
  }

  const user = data.user;
  if (user) await getRepository().touchCustomerLogin(user.id).catch(() => {});
  return NextResponse.json({
    ok: true,
    customer: { firstName: (user?.user_metadata?.first_name as string) ?? "", email: user?.email ?? email },
  });
}
