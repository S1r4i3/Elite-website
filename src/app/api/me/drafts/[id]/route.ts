import { NextResponse } from "next/server";
import { z } from "zod";
import { getRepository } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/current-customer";
import { publicDoc } from "@/lib/portal-server";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("approve") }),
  z.object({ action: z.literal("request_changes"), comment: z.string().trim().min(3, "Please tell us what should change.").max(2000) }),
]);

/** Client approves a draft estimate or requests changes. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentCustomer();
  if (!me) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });
  const doc = await getRepository().getPortalDocument((await params).id);
  if (!doc || doc.customerId !== me.id || doc.kind !== "draft") return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Invalid request." }, { status: 400 });
  const updated = await getRepository().updatePortalDocument(
    doc.id,
    parsed.data.action === "approve" ? { status: "approved", clientComment: null } : { status: "changes_requested", clientComment: parsed.data.comment },
  );
  return NextResponse.json({ ok: true, document: updated ? publicDoc(updated) : null });
}
