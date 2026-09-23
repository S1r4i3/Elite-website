import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { requireApiToken } from "@/lib/api-auth";
import { apiClient, apiDocument } from "@/lib/api-shapes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET one client, with their uploads, drafts and final documents. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  const repo = getRepository();
  const customer = await repo.getCustomer((await params).id);
  if (!customer) return NextResponse.json({ ok: false, error: "Client not found" }, { status: 404 });
  const docs = await repo.listPortalDocuments(customer.id);
  return NextResponse.json({
    ok: true,
    client: apiClient(customer),
    documents: {
      uploads: docs.filter((d) => d.kind === "upload").map(apiDocument),
      drafts: docs.filter((d) => d.kind === "draft").map(apiDocument),
      finals: docs.filter((d) => d.kind === "final").map(apiDocument),
    },
  });
}

/** PATCH a client's profile details. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  const body = (await req.json().catch(() => ({}))) as Record<string, string | undefined>;
  const patch = {
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
    dob: body.dob,
    state: body.state,
    country: body.country,
    address: body.address,
  };
  const updated = await getRepository().updateCustomerProfile((await params).id, patch);
  if (!updated) return NextResponse.json({ ok: false, error: "Client not found" }, { status: 404 });
  return NextResponse.json({ ok: true, client: apiClient(updated) });
}
