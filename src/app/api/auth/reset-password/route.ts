import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { resetSchema } from "@/lib/validation/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** Verifies the 6-digit recovery code from the email, then sets the new password. */
export async function POST(req: Request) {
  if (!rateLimit(`reset:${clientIp(req)}`, 20, 10 * 60_000).ok) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please wait a few minutes." }, { status: 429 });
  }
  const parsed = resetSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Please check your details." }, { status: 400 });
  }
  const { email, code, password } = parsed.data;

  const supabase = await supabaseServer();
  const { error: otpError } = await supabase.auth.verifyOtp({ email, token: code, type: "recovery" });
  if (otpError) {
    return NextResponse.json({ ok: false, error: "That code is invalid or has expired. Please request a new one." }, { status: 400 });
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
