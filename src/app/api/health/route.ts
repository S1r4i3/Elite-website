import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { emailConfigured } from "@/lib/email";
import { storageDriver } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Setup check: is the database reachable, is email configured, where do uploads go? No secrets are returned. */
export async function GET() {
  const repo = getRepository();
  const base = {
    db: repo.driver,
    email: emailConfigured() ? "configured" : "not configured",
    storage: storageDriver(),
    adminApi: process.env.ADMIN_API_TOKEN ? "enabled" : "disabled",
    appUrl: process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || null,
  };
  try {
    await repo.stats();
    return NextResponse.json({ ok: true, ...base });
  } catch (err) {
    return NextResponse.json({ ok: false, ...base, error: (err as Error).message }, { status: 503 });
  }
}
