import { NextResponse } from "next/server";
import { z } from "zod";
import { getRepository } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/current-customer";
import { hashPassword, verifyPassword } from "@/lib/password";
import { passwordRule } from "@/lib/validation/auth";
import { rateLimit } from "@/lib/rate-limit";

const schema = z
  .object({ currentPassword: z.string().max(128).optional(), newPassword: passwordRule, confirmPassword: z.string() })
  .refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

export async function POST(req: Request) {
  const me = await getCurrentCustomer();
  if (!me) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });
  if (!rateLimit(`pw-change:${me.id}`, 8, 10 * 60_000).ok) return NextResponse.json({ ok: false, error: "Too many attempts. Try again later." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message }, { status: 400 });
  if (me.passwordHash && !(await verifyPassword(parsed.data.currentPassword || "", me.passwordHash))) {
    return NextResponse.json({ ok: false, error: "Your current password is incorrect." }, { status: 400 });
  }
  await getRepository().setCustomerPassword(me.id, await hashPassword(parsed.data.newPassword));
  return NextResponse.json({ ok: true });
}
