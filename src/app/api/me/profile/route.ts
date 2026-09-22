import { NextResponse } from "next/server";
import { z } from "zod";
import { getRepository } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/current-customer";

const schema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name").max(60),
  lastName: z.string().trim().min(1, "Please enter your last name").max(60),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(25).regex(/^[+()\-.\s\d]+$/, "Please enter a valid phone number"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter your date of birth"),
  state: z.string().trim().min(1, "Please enter your state").max(80),
  country: z.string().trim().min(1, "Please enter your country").max(80),
  address: z.string().trim().min(1, "Please enter your address").max(200),
});

export async function PATCH(req: Request) {
  const me = await getCurrentCustomer();
  if (!me) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message }, { status: 400 });
  await getRepository().updateCustomerProfile(me.id, parsed.data);
  return NextResponse.json({ ok: true });
}
