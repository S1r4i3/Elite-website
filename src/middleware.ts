import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/auth";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Customer area
  if (pathname.startsWith("/dashboard") || pathname === "/login" || pathname === "/register") {
    const signedIn = !!(await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value));
    if (pathname.startsWith("/dashboard") && !signedIn) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    if ((pathname === "/login" || pathname === "/register") && signedIn) {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Admin area
  if (pathname === "/admin/login") return NextResponse.next();
  const ok = await isValidAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);
  if (ok) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*", "/dashboard", "/dashboard/:path*", "/login", "/register"] };
