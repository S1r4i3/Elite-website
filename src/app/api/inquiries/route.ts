import { NextResponse } from "next/server";
import { z } from "zod";
import { getRepository } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { onInquiryCreated } from "@/lib/notify";
import { sendToFormspree } from "@/lib/formspree";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid mobile number")
    .max(20)
    .regex(/^[+()\-.\s\d]+$/, "Please enter a valid mobile number"),
  email: z.string().trim().email("Please enter a valid email address").max(160),
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
  // Save for the admin dashboard AND send to Formspree (email) at the same time.
  // The visitor sees success if either one works; failures are logged.
  const email = d.email.toLowerCase();
  const [saved, forwarded] = await Promise.allSettled([
    getRepository()
      .createInquiry({ name: d.name, phone: d.phone, email, message: d.message || null, page: d.page || null })
      .then((inquiry) => void onInquiryCreated(inquiry)),
    sendToFormspree({
      name: d.name,
      phone: d.phone,
      email,
      message: d.message || "",
      page: d.page || "",
      _replyto: email,
      _subject: `New website enquiry — ${d.name}`,
    }),
  ]);
  if (saved.status === "rejected") console.error("[api/inquiries] database save failed", saved.reason);
  if (forwarded.status === "rejected") console.error("[api/inquiries] Formspree failed", forwarded.reason);
  if (saved.status === "rejected" && forwarded.status === "rejected") {
    return NextResponse.json({ ok: false, error: "We couldn't send your message. Please try again or call us." }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
