import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRepository } from "@/lib/db";
import { readObject } from "@/lib/storage";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isValidAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const doc = await getRepository().getDocument((await params).id);
  if (!doc) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  try {
    const data = await readObject(doc.storageKey);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(doc.originalName)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "File missing from storage" }, { status: 410 });
  }
}
