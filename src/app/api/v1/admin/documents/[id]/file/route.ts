import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { requireApiToken } from "@/lib/api-auth";
import { downloadResponse } from "@/lib/portal-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET the actual file. ?view=1 opens it inline instead of downloading. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  const doc = await getRepository().getPortalDocument((await params).id);
  if (!doc) return NextResponse.json({ ok: false, error: "Document not found" }, { status: 404 });
  return downloadResponse(doc, new URL(req.url).searchParams.get("view") === "1");
}
