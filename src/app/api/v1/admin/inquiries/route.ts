import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { pagination, requireApiToken } from "@/lib/api-auth";
import { apiInquiry } from "@/lib/api-shapes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET submissions from the website Subscribe pop-up (name, phone, email, message). */
export async function GET(req: Request) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  const { limit, offset } = pagination(new URL(req.url), 200);
  const all = await getRepository().listInquiries(limit + offset);
  return NextResponse.json({ ok: true, total: all.length, limit, offset, rows: all.slice(offset).map(apiInquiry) });
}
