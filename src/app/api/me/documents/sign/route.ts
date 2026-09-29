import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { getCurrentCustomer } from "@/lib/current-customer";
import { rateLimit } from "@/lib/rate-limit";
import { supabaseStorageEnabled } from "@/lib/storage";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DOCUMENTS_BUCKET } from "@/lib/supabase/config";
import { UPLOAD_LIMITS, acceptedLabel } from "@/lib/validation/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/me/documents/sign  { name, size }
 * Step 1 of a client upload: a one-time signed URL so the browser sends the file straight to
 * Supabase Storage (Vercel functions reject request bodies over ~4.5 MB — phone photos and
 * scanned PDFs are often bigger). Step 2 is POST /api/me/documents with JSON.
 */
export async function POST(req: Request) {
  const me = await getCurrentCustomer();
  if (!me) return NextResponse.json({ ok: false, error: "Please log in again." }, { status: 401 });
  if (!supabaseStorageEnabled()) return NextResponse.json({ ok: false, direct: false }, { status: 501 });
  if (!rateLimit(`portal-sign:${me.id}`, 40, 60_000).ok) {
    return NextResponse.json({ ok: false, error: "Too many uploads. Please wait a moment." }, { status: 429 });
  }
  const b = (await req.json().catch(() => null)) as { name?: string; size?: number } | null;
  const name = String(b?.name || "");
  const size = Number(b?.size || 0);
  if (!size) return NextResponse.json({ ok: false, error: "This file is empty." }, { status: 400 });
  if (size > UPLOAD_LIMITS.maxBytes) return NextResponse.json({ ok: false, error: "File is larger than 15 MB." }, { status: 413 });
  const ext = path.extname(name).toLowerCase();
  if (!Object.values(UPLOAD_LIMITS.accept).flat().includes(ext)) {
    return NextResponse.json({ ok: false, error: `Unsupported file type. Use ${acceptedLabel}.` }, { status: 415 });
  }
  const key = `portal/${me.id}/${randomUUID()}${ext}`;
  const { data, error } = await supabaseAdmin().storage.from(DOCUMENTS_BUCKET).createSignedUploadUrl(key);
  if (error || !data) {
    console.error("[api/me/documents/sign] failed", error);
    return NextResponse.json({ ok: false, error: "Could not start the upload. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, key, signedUrl: data.signedUrl });
}
