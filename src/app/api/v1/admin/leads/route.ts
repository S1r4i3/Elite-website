import { NextResponse } from "next/server";
import { getRepository, leadStatuses, type LeadStatus } from "@/lib/db";
import { pagination, requireApiToken } from "@/lib/api-auth";
import { apiLead } from "@/lib/api-shapes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET "Get Started" form submissions. ?status=new|contacted|…&search=&limit=&offset= */
export async function GET(req: Request) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const { limit, offset } = pagination(url);
  const status = url.searchParams.get("status") as LeadStatus | null;
  const { leads, total } = await getRepository().listLeads({
    status: status && leadStatuses.includes(status) ? status : undefined,
    search: url.searchParams.get("search") || undefined,
    limit,
    offset,
  });
  return NextResponse.json({ ok: true, total, limit, offset, rows: leads.map(apiLead) });
}
