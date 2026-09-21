import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { getRepository } from "@/lib/db";
import { saveObject } from "@/lib/storage";
import { UPLOAD_LIMITS } from "@/lib/validation/upload";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const CATEGORIES = new Set(["w2", "1099", "prior-return", "pay-stubs", "irs-notice", "other"]);

export async function POST(req: Request) {
  const limit = rateLimit(`upload:${clientIp(req)}`, 30, 60_000);
  if (!limit.ok) return NextResponse.json({ ok: false, error: "Too many uploads. Please wait a moment." }, { status: 429 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "No file received." }, { status: 400 });
  if (file.size === 0) return NextResponse.json({ ok: false, error: "This file is empty." }, { status: 400 });
  if (file.size > UPLOAD_LIMITS.maxBytes) {
    return NextResponse.json({ ok: false, error: "File is larger than 15 MB." }, { status: 413 });
  }

  const ext = path.extname(file.name).toLowerCase();
  const allowedExt = Object.values(UPLOAD_LIMITS.accept).flat();
  if (!allowedExt.includes(ext)) {
    return NextResponse.json({ ok: false, error: "Unsupported file type. Use PDF, JPG, PNG, HEIC, DOC(X), XLS(X) or CSV." }, { status: 415 });
  }

  const rawCategory = String(form.get("category") || "other");
  const category = CATEGORIES.has(rawCategory) ? rawCategory : "other";

  try {
    const id = randomUUID();
    const now = new Date();
    const key = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${id}${ext}`;
    await saveObject(key, Buffer.from(await file.arrayBuffer()));
    const doc = await getRepository().createDocument({
      id,
      leadId: null,
      originalName: file.name.slice(0, 200),
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      category,
      storageKey: key,
    });
    return NextResponse.json({ ok: true, id: doc.id, name: doc.originalName, size: doc.size }, { status: 201 });
  } catch (err) {
    console.error("[api/uploads] failed", err);
    return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}
