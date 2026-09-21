import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getRepository, leadStatuses } from "@/lib/db";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/auth";

export const runtime = "nodejs";

async function authorized() {
  return isValidAdminToken((await cookies()).get(ADMIN_COOKIE)?.value);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorized())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const lead = await getRepository().getLead((await params).id);
  return lead ? NextResponse.json({ ok: true, lead }) : NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
}

const patchSchema = z.object({ status: z.enum(leadStatuses as [string, ...string[]]) });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorized())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 422 });
  const lead = await getRepository().updateLeadStatus((await params).id, parsed.data.status as (typeof leadStatuses)[number]);
  return lead ? NextResponse.json({ ok: true, lead }) : NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
}
