import "server-only";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { NextResponse } from "next/server";
import { saveObject, readObject } from "@/lib/storage";
import { UPLOAD_LIMITS, acceptedLabel } from "@/lib/validation/upload";
import type { PortalDocument } from "@/lib/db";

/** Validates an uploaded File and stores it privately. Returns storage info or an error response. */
export async function storePortalFile(file: FormDataEntryValue | null, customerId: string) {
  if (!(file instanceof File)) return { error: NextResponse.json({ ok: false, error: "No file received." }, { status: 400 }) };
  if (file.size === 0) return { error: NextResponse.json({ ok: false, error: "This file is empty." }, { status: 400 }) };
  if (file.size > UPLOAD_LIMITS.maxBytes) return { error: NextResponse.json({ ok: false, error: "File is larger than 15 MB." }, { status: 413 }) };
  const ext = path.extname(file.name).toLowerCase();
  if (!Object.values(UPLOAD_LIMITS.accept).flat().includes(ext)) {
    return { error: NextResponse.json({ ok: false, error: `Unsupported file type. Use ${acceptedLabel}.` }, { status: 415 }) };
  }
  const id = randomUUID();
  const storageKey = `portal/${customerId}/${id}${ext}`;
  await saveObject(storageKey, Buffer.from(await file.arrayBuffer()), file.type || undefined);
  return {
    file: { id, storageKey, originalName: file.name.slice(0, 200), mimeType: file.type || "application/octet-stream", size: file.size },
  };
}

export async function downloadResponse(doc: PortalDocument, inline = false) {
  try {
    const data = await readObject(doc.storageKey);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(doc.originalName)}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "File missing from storage" }, { status: 410 });
  }
}

export const publicDoc = (d: PortalDocument) => ({
  id: d.id,
  kind: d.kind,
  name: d.originalName,
  size: d.size,
  category: d.category,
  taxYear: d.taxYear,
  note: d.note,
  status: d.status,
  clientComment: d.clientComment,
  createdAt: d.createdAt,
  updatedAt: d.updatedAt,
});
