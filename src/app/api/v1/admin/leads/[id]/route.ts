import { NextResponse } from "next/server";
import { getRepository, leadStatuses, type LeadStatus } from "@/lib/db";
import { requireApiToken } from "@/lib/api-auth";
import { apiLead } from "@/lib/api-shapes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET one lead with its attached documents. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  const lead = await getRepository().getLead((await params).id);
  if (!lead) return NextResponse.json({ ok: false, error: "Lead not found" }, { status: 404 });
  return NextResponse.json({ ok: true, lead: apiLead(lead) });
}

/** PATCH a lead's status. Body: { status } */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  const { status } = (await req.json().catch(() => ({}))) as { status?: LeadStatus };
  if (!status || !leadStatuses.includes(status)) {
    return NextResponse.json({ ok: false, error: `status must be one of ${leadStatuses.join(", ")}` }, { status: 400 });
  }
  const lead = await getRepository().updateLeadStatus((await params).id, status);
  if (!lead) return NextResponse.json({ ok: false, error: "Lead not found" }, { status: 404 });
  return NextResponse.json({ ok: true, lead: apiLead(lead) });
}
