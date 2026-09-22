import { NextResponse } from "next/server";
import { z } from "zod";
import { getRepository } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { onInquiryCreated } from "@/lib/notify";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid mobile number")
    .max(20)
    .regex(/^[+()\-.\s\d]+$/, "Please enter a valid mobile number"),
  message: z.string().trim().max(1000, "Please keep your message under 1,000 characters").optional().or(z.literal("")),
  page: z.string().max(200).optional(),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});

export async function POST(req: Request) {
  if (!rateLimit(`inquiry:${clientIp(req)}`, 5, 10 * 60_000).ok) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Please check your details." }, { status: 400 });
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true });
  try {
    const inquiry = await getRepository().createInquiry({ name: d.name, phone: d.phone, message: d.message || null, page: d.page || null });
    void onInquiryCreated(inquiry);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[api/inquiries] failed", err);
    return NextResponse.json({ ok: false, error: "We couldn't send your message. Please try again or call us." }, { status: 500 });
  }
}
