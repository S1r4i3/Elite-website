import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/auth";

/**
 * Refreshes the Supabase session on every matched request and guards the two
 * private areas: the client portal (/dashboard) and the built-in admin pages.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  let res = NextResponse.next({ request: req });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Customer area
  if (pathname.startsWith("/dashboard") || pathname === "/login" || pathname === "/register") {
    let signedIn = false;

    if (url && key) {
      const supabase = createServerClient(url, key, {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (list) => {
            list.forEach(({ name, value }) => req.cookies.set(name, value));
            res = NextResponse.next({ request: req });
            list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
          },
        },
      });
      // getClaims() refreshes the session if needed and verifies the JWT signature locally
      // (using the project's public signing keys) — no network round-trip on every page view.
      const { data } = await supabase.auth.getClaims();
      signedIn = Boolean(data?.claims?.sub);
    }

    if (pathname.startsWith("/dashboard") && !signedIn) {
      const to = req.nextUrl.clone();
      to.pathname = "/login";
      to.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(to);
    }
    if ((pathname === "/login" || pathname === "/register") && signedIn) {
      const to = req.nextUrl.clone();
      to.pathname = "/dashboard";
      to.search = "";
      return NextResponse.redirect(to);
    }
    return res;
  }

  // Admin area (its own password + signed cookie)
  if (pathname === "/admin/login") return res;
  if (await isValidAdminToken(req.cookies.get(ADMIN_COOKIE)?.value)) return res;
  const to = req.nextUrl.clone();
  to.pathname = "/admin/login";
  to.searchParams.set("next", pathname);
  return NextResponse.redirect(to);
}

export const config = { matcher: ["/admin/:path*", "/dashboard", "/dashboard/:path*", "/login", "/register"] };
