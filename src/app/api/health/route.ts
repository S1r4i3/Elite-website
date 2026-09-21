import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const repo = getRepository();
  try {
    await repo.stats();
    return NextResponse.json({ ok: true, db: repo.driver });
  } catch {
    return NextResponse.json({ ok: false, db: repo.driver }, { status: 503 });
  }
}
