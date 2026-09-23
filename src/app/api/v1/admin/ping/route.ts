import { NextResponse } from "next/server";
import { requireApiToken } from "@/lib/api-auth";
import { getRepository } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Connectivity + credential check for the admin dashboard. */
export async function GET(req: Request) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  return NextResponse.json({ ok: true, service: "elite-b-tax-website", driver: getRepository().driver, time: new Date().toISOString() });
}
