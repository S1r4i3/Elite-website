import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentCustomer } from "@/lib/current-customer";
import { supabaseServer } from "@/lib/supabase/server";
import { passwordRule } from "@/lib/validation/auth";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const schema = z
  .object({ currentPassword: z.string().max(128).optional(), newPassword: passwordRule, confirmPassword: z.string() })
  .refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

/** Changes the signed-in client's password in Supabase Auth. */
export async function POST(req: Request) {
  const me = await getCurrentCustomer();
  if (!me) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });
  if (!rateLimit(`pw-change:${me.id}`, 8, 10 * 60_000).ok) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try again later." }, { status: 429 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message }, { status: 400 });

  const supabase = await supabaseServer();

  // Confirm the current password by re-authenticating with it.
  const { error: checkError } = await supabase.auth.signInWithPassword({
    email: me.email,
    password: parsed.data.currentPassword || "",
  });
  if (checkError) return NextResponse.json({ ok: false, error: "Your current password is incorrect." }, { status: 400 });

  const { error } = await supabase.auth.updateUser({ password: parsed.data.newPassword });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
