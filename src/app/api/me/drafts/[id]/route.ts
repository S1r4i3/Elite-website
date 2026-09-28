import { NextResponse } from "next/server";
import { z } from "zod";
import { getRepository } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/current-customer";
import { publicDoc } from "@/lib/portal-server";
import { serviceRoleConfigured, supabaseAdmin } from "@/lib/supabase/admin";

/**
 * When the case is waiting for this client's approval, their decision moves the workflow:
 *   approve → Tax Filer (e-file)      request changes → back to the same Tax Preparer
 * The rules live in the database (public.wf_transition).
 */
async function advanceWorkflow(customerId: string, email: string, approve: boolean, comment?: string) {
  if (!serviceRoleConfigured()) return;
  const db = supabaseAdmin();
  const { data: profile } = await db.from("profiles").select("stage").eq("id", customerId).maybeSingle();
  if (profile?.stage !== "client_review") return;
  const { error } = await db.rpc("wf_transition", {
    p_client: customerId,
    p_action: approve ? "client_approve" : "client_reject",
    p_actor: email,
    p_note: approve ? null : comment ?? null,
  });
  if (error) console.error("[drafts] workflow transition failed:", error.message);
}

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
  await advanceWorkflow(me.id, me.email, parsed.data.action === "approve", parsed.data.action === "request_changes" ? parsed.data.comment : undefined);
  return NextResponse.json({ ok: true, document: updated ? publicDoc(updated) : null });
}
