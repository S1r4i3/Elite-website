import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { downloadResponse } from "@/lib/portal-server";
import { deleteObject } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const doc = await getRepository().getPortalDocument((await params).id);
  if (!doc) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return downloadResponse(doc, new URL(req.url).searchParams.get("view") === "1");
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const doc = await getRepository().getPortalDocument((await params).id);
  if (!doc) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  await getRepository().deletePortalDocument(doc.id);
  await deleteObject(doc.storageKey).catch(() => {});
  return NextResponse.json({ ok: true });
}
