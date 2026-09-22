import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/auth";

/** Returns an error response when the request isn't from a signed-in admin. */
export async function requireAdmin() {
  if (await isValidAdminToken((await cookies()).get(ADMIN_COOKIE)?.value)) return null;
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}
