import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { requireApiToken } from "@/lib/api-auth";
import { apiDocument } from "@/lib/api-shapes";
import { deleteObject } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STATUSES = ["awaiting_review", "approved", "changes_requested"] as const;

/** GET one document's details. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  const doc = await getRepository().getPortalDocument((await params).id);
  if (!doc) return NextResponse.json({ ok: false, error: "Document not found" }, { status: 404 });
  return NextResponse.json({ ok: true, document: apiDocument(doc) });
}

/** PATCH a document's note or draft status. Body: { note?, status? } */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  const body = (await req.json().catch(() => ({}))) as { note?: string; status?: string };
  if (body.status && !STATUSES.includes(body.status as (typeof STATUSES)[number])) {
    return NextResponse.json({ ok: false, error: `status must be one of ${STATUSES.join(", ")}` }, { status: 400 });
  }
  const doc = await getRepository().updatePortalDocument((await params).id, {
    note: body.note,
    status: body.status as (typeof STATUSES)[number] | undefined,
  });
  if (!doc) return NextResponse.json({ ok: false, error: "Document not found" }, { status: 404 });
  return NextResponse.json({ ok: true, document: apiDocument(doc) });
}

/** DELETE a document and its stored file. */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  const repo = getRepository();
  const doc = await repo.getPortalDocument((await params).id);
  if (!doc) return NextResponse.json({ ok: false, error: "Document not found" }, { status: 404 });
  await deleteObject(doc.storageKey).catch(() => {});
  await repo.deletePortalDocument(doc.id);
  return NextResponse.json({ ok: true });
}
