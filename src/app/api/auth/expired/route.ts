import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

/**
 * Signs out a session whose account no longer exists (or was removed from the
 * database) and sends the visitor to the login page.
 *
 * Without this, middleware — which only checks the cookie signature — keeps
 * sending a "signed in" visitor to /dashboard, while /dashboard can't find the
 * account and sends them back to /login: an endless 307 loop.
 */
export async function GET(req: Request) {
  const url = new URL("/login", req.url);
  url.searchParams.set("expired", "1");
  const next = new URL(req.url).searchParams.get("next");
  if (next && next.startsWith("/")) url.searchParams.set("next", next);
  const res = NextResponse.redirect(url);
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
