import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { pagination, requireApiToken } from "@/lib/api-auth";
import { apiClient } from "@/lib/api-shapes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET /api/v1/admin/clients?search=&limit=&offset= — every registered client. */
export async function GET(req: Request) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const { limit, offset } = pagination(url);
  const all = await getRepository().listCustomers(url.searchParams.get("search") || undefined);
  const rows = all.slice(offset, offset + limit).map(apiClient);
  return NextResponse.json({ ok: true, total: all.length, limit, offset, rows });
}
