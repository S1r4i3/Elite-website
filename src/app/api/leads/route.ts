import { NextResponse } from "next/server";
import { getRepository, type LeadStatus, leadStatuses } from "@/lib/db";
import { leadSchema } from "@/lib/validation/lead";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { onLeadCreated } from "@/lib/notify";
import { isValidAdminToken, ADMIN_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limit = rateLimit(`lead:${clientIp(req)}`, 6, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const d = parsed.data;
  // Honeypot filled → pretend success, store nothing.
  if (d.website) return NextResponse.json({ ok: true, id: "ignored" });

  try {
    const lead = await getRepository().createLead(
      {
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email.toLowerCase(),
        phone: d.phone,
        service: d.service,
        customerType: d.customerType,
        taxYear: d.taxYear,
        message: d.message || null,
        source: d.source || null,
        estimate: d.estimate ?? null,
      },
      d.documentIds ?? [],
    );
    void onLeadCreated(lead);
    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (err) {
    console.error("[api/leads] create failed", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your request right now. Please try again or call us." },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!(await isValidAdminToken(token))) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const status = url.searchParams.get("status") as LeadStatus | null;
  const { leads, total } = await getRepository().listLeads({
    status: status && leadStatuses.includes(status) ? status : undefined,
    search: url.searchParams.get("q") || undefined,
    limit: Math.min(Number(url.searchParams.get("limit") || 50), 200),
    offset: Number(url.searchParams.get("offset") || 0),
  });
  return NextResponse.json({ ok: true, total, leads });
}
