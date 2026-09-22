import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/current-customer";
import { downloadResponse } from "@/lib/portal-server";
import { deleteObject } from "@/lib/storage";

export const runtime = "nodejs";

async function ownDoc(id: string) {
  const me = await getCurrentCustomer();
  if (!me) return { error: NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 }) };
  const doc = await getRepository().getPortalDocument(id);
  if (!doc || doc.customerId !== me.id) return { error: NextResponse.json({ ok: false, error: "Not found" }, { status: 404 }) };
  return { doc };
}

/** Download (or ?view=1 to open inline) one of your documents. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const r = await ownDoc((await params).id);
  if (r.error) return r.error;
  return downloadResponse(r.doc, new URL(req.url).searchParams.get("view") === "1");
}

/** Clients may delete only files they uploaded themselves. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const r = await ownDoc((await params).id);
  if (r.error) return r.error;
  if (r.doc.kind !== "upload") return NextResponse.json({ ok: false, error: "Only your own uploads can be deleted." }, { status: 403 });
  await getRepository().deletePortalDocument(r.doc.id);
  await deleteObject(r.doc.storageKey).catch(() => {});
  return NextResponse.json({ ok: true });
}
