import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { storePortalFile, publicDoc } from "@/lib/portal-server";
import { portalTaxYears } from "@/lib/portal";

export const runtime = "nodejs";

/** Tax team uploads a draft estimate or final document to a client (multipart: file, kind, note, taxYear). */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const customer = await getRepository().getCustomer((await params).id);
  if (!customer) return NextResponse.json({ ok: false, error: "Client not found" }, { status: 404 });
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ ok: false, error: "Invalid upload." }, { status: 400 });
  const kind = String(form.get("kind"));
  if (kind !== "draft" && kind !== "final") return NextResponse.json({ ok: false, error: "Choose draft or final." }, { status: 400 });
  const stored = await storePortalFile(form.get("file"), customer.id);
  if (stored.error) return stored.error;
  const note = String(form.get("note") || "").trim().slice(0, 2000) || null;
  const year = String(form.get("taxYear") || "");
  const doc = await getRepository().createPortalDocument({
    ...stored.file,
    customerId: customer.id,
    kind,
    category: null,
    taxYear: portalTaxYears.includes(year) ? year : null,
    note,
    status: kind === "draft" ? "awaiting_review" : null,
  });
  return NextResponse.json({ ok: true, document: publicDoc(doc) }, { status: 201 });
}
