import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { requireApiToken } from "@/lib/api-auth";
import { apiDocument } from "@/lib/api-shapes";
import { storePortalFile } from "@/lib/portal-server";
import { portalTaxYears } from "@/lib/portal";
import { onDocumentShared } from "@/lib/notify";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET a client's documents. ?kind=upload|draft|final */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  const kind = new URL(req.url).searchParams.get("kind") as "upload" | "draft" | "final" | null;
  const docs = await getRepository().listPortalDocuments((await params).id, kind ?? undefined);
  return NextResponse.json({ ok: true, rows: docs.map(apiDocument) });
}

/**
 * POST a draft estimation or final document to a client (multipart/form-data).
 * Fields: file (required), kind=draft|final, note, taxYear
 * The file shows up in that client's dashboard immediately.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  const repo = getRepository();
  const customer = await repo.getCustomer((await params).id);
  if (!customer) return NextResponse.json({ ok: false, error: "Client not found" }, { status: 404 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ ok: false, error: "Send this as multipart/form-data." }, { status: 400 });
  const kind = String(form.get("kind") || "");
  if (kind !== "draft" && kind !== "final") return NextResponse.json({ ok: false, error: "kind must be 'draft' or 'final'." }, { status: 400 });

  const stored = await storePortalFile(form.get("file"), customer.id);
  if (stored.error) return stored.error;
  const year = String(form.get("taxYear") || "");
  const doc = await repo.createPortalDocument({
    ...stored.file,
    customerId: customer.id,
    kind,
    category: null,
    taxYear: portalTaxYears.includes(year) ? year : null,
    note: String(form.get("note") || "").trim().slice(0, 2000) || null,
    status: kind === "draft" ? "awaiting_review" : null,
  });
  void onDocumentShared(customer, doc);
  return NextResponse.json({ ok: true, document: apiDocument(doc) }, { status: 201 });
}
