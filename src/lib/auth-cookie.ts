/**
 * True when the browser holds a Supabase session cookie (sb-<project>-auth-token, possibly chunked .0/.1).
 * Lets client components skip /api/auth/me entirely for anonymous visitors — most of the site's traffic.
 * It only says "maybe signed in"; the server still verifies the session.
 */
export function hasAuthCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(/;\s*/).some((c) => /^sb-[^=]+-auth-token(\.\d+)?=./.test(c));
}
