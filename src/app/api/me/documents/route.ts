import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/current-customer";
import { storePortalFile, publicDoc } from "@/lib/portal-server";
import { documentTypes, portalTaxYears } from "@/lib/portal";
import { rateLimit } from "@/lib/rate-limit";
import path from "node:path";
import { supabaseStorageEnabled } from "@/lib/storage";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DOCUMENTS_BUCKET } from "@/lib/supabase/config";
import { UPLOAD_LIMITS } from "@/lib/validation/upload";

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

/**
 * Client uploads a document.
 *  • JSON { key, name, category, taxYear } — the file was already sent to storage via /api/me/documents/sign
 *  • multipart: file, category, taxYear — small files / local development
 */
export async function POST(req: Request) {
  const me = await getCurrentCustomer();
  if (!me) return NextResponse.json({ ok: false, error: "Please log in again." }, { status: 401 });
  if (!rateLimit(`portal-upload:${me.id}`, 40, 60_000).ok) {
    return NextResponse.json({ ok: false, error: "Too many uploads. Please wait a moment." }, { status: 429 });
  }
  if ((req.headers.get("content-type") || "").includes("application/json")) return fromSignedUpload(req, me.id);
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

/** Records a file the browser uploaded straight to Supabase Storage. */
async function fromSignedUpload(req: Request, customerId: string) {
  if (!supabaseStorageEnabled()) return NextResponse.json({ ok: false, error: "Invalid upload." }, { status: 400 });
  const b = (await req.json().catch(() => null)) as Record<string, string> | null;
  const key = String(b?.key || "");
  const name = String(b?.name || "").slice(0, 200);
  // Only keys we signed for this client: portal/{customerId}/{uuid}{ext}
  const m = key.match(/^portal\/([^/]+)\/([0-9a-f-]{36})(\.[a-z]+)$/);
  if (!m || m[1] !== customerId || path.extname(name).toLowerCase() !== m[3]) {
    return NextResponse.json({ ok: false, error: "Invalid upload." }, { status: 400 });
  }
  const bucket = supabaseAdmin().storage.from(DOCUMENTS_BUCKET);
  const { data: info, error } = await bucket.info(key);
  if (error || !info) return NextResponse.json({ ok: false, error: "The file didn't arrive. Please upload it again." }, { status: 400 });
  const size = Number(info.size ?? 0);
  if (!size || size > UPLOAD_LIMITS.maxBytes) {
    await bucket.remove([key]);
    return NextResponse.json({ ok: false, error: "File is larger than 15 MB." }, { status: 413 });
  }
  const rawCat = String(b?.category || "other");
  const rawYear = String(b?.taxYear || "");
  try {
    const doc = await getRepository().createPortalDocument({
      id: m[2],
      storageKey: key,
      originalName: name,
      mimeType: String(info.contentType || "application/octet-stream"),
      size,
      customerId,
      kind: "upload",
      category: documentTypes.some((t) => t.value === rawCat) ? rawCat : "other",
      taxYear: portalTaxYears.includes(rawYear) ? rawYear : null,
      note: null,
    });
    return NextResponse.json({ ok: true, id: doc.id, document: publicDoc(doc) }, { status: 201 });
  } catch (err) {
    console.error("[api/me/documents] record failed", err);
    return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}
