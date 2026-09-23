import "server-only";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

/**
 * Machine-to-machine auth for the admin API (/api/v1/admin/*).
 * The admin dashboard sends:  Authorization: Bearer <ADMIN_API_TOKEN>
 * Returns an error response when the caller is not authorised, otherwise null.
 */
export function requireApiToken(req: Request): NextResponse | null {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected || expected.length < 24) {
    return NextResponse.json({ ok: false, error: "ADMIN_API_TOKEN is not configured on the server." }, { status: 503 });
  }
  const header = req.headers.get("authorization") || "";
  const presented = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : req.headers.get("x-api-key")?.trim() || "";
  if (!presented) return NextResponse.json({ ok: false, error: "Missing API token." }, { status: 401 });
  const a = Buffer.from(presented);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ ok: false, error: "Invalid API token." }, { status: 401 });
  }
  return null;
}

/** Parses ?limit= / ?offset= with sane bounds. */
export function pagination(url: URL, defaultLimit = 100, maxLimit = 500) {
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || defaultLimit, 1), maxLimit);
  const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);
  return { limit, offset };
}
