import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { pagination, requireApiToken } from "@/lib/api-auth";
import { apiDocument } from "@/lib/api-shapes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET every client document. ?kind=upload|draft|final&clientId=&limit=&offset= */
export async function GET(req: Request) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const { limit, offset } = pagination(url, 200);
  const rows = await getRepository().listAllPortalDocuments({
    kind: (url.searchParams.get("kind") as "upload" | "draft" | "final" | null) ?? undefined,
    customerId: url.searchParams.get("clientId") ?? undefined,
    limit,
    offset,
  });
  return NextResponse.json({ ok: true, limit, offset, rows: rows.map(apiDocument) });
}
