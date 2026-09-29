import { appUrl } from "@/lib/app-url";
import { NextResponse } from "next/server";
import { getRepository, repositoryName } from "@/lib/db";
import { emailConfigured } from "@/lib/email";
import { storageDriver } from "@/lib/storage";
import { supabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Setup check: database, auth, email, storage. No secrets are returned. */
export async function GET() {
  const repo = getRepository();
  const base = {
    db: repositoryName(),
    auth: supabaseConfigured() ? "supabase" : "not configured",
    storage: storageDriver(),
    email: emailConfigured() ? "smtp configured" : "supabase only",
    adminApi: process.env.ADMIN_API_TOKEN ? "enabled" : "disabled",
    appUrl: appUrl(),
  };
  try {
    await repo.stats();
    return NextResponse.json({ ok: true, ...base });
  } catch (err) {
    return NextResponse.json({ ok: false, ...base, error: (err as Error).message }, { status: 503 });
  }
}
