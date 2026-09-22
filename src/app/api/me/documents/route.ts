import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/current-customer";
import { storePortalFile, publicDoc } from "@/lib/portal-server";
import { documentTypes, portalTaxYears } from "@/lib/portal";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** List the signed-in client's portal documents (?kind=upload|draft|final). */
export async function GET(req: Request) {
  const me = await getCurrentCustomer();
  if (!me) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });
  const kind = new URL(req.url).searchParams.get("kind");
  const docs = await getRepository().listPortalDocuments(me.id, kind === "upload" || kind === "draft" || kind === "final" ? kind : undefined);
  return NextResponse.json({ ok: true, documents: docs.map(publicDoc) });
}

/** Client uploads a document (multipart: file, category, taxYear). */
export async function POST(req: Request) {
  const me = await getCurrentCustomer();
  if (!me) return NextResponse.json({ ok: false, error: "Please log in again." }, { status: 401 });
  if (!rateLimit(`portal-upload:${me.id}`, 40, 60_000).ok) {
    return NextResponse.json({ ok: false, error: "Too many uploads. Please wait a moment." }, { status: 429 });
  }
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid upload." }, { status: 400 });
  }
  const stored = await storePortalFile(form.get("file"), me.id);
  if (stored.error) return stored.error;
  const rawCat = String(form.get("category") || "other");
  const rawYear = String(form.get("taxYear") || "");
  try {
    const doc = await getRepository().createPortalDocument({
      ...stored.file,
      customerId: me.id,
      kind: "upload",
      category: documentTypes.some((t) => t.value === rawCat) ? rawCat : "other",
      taxYear: portalTaxYears.includes(rawYear) ? rawYear : null,
      note: null,
    });
    return NextResponse.json({ ok: true, id: doc.id, document: publicDoc(doc) }, { status: 201 });
  } catch (err) {
    console.error("[api/me/documents] failed", err);
    return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}
