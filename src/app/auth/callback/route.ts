import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Where every Supabase email link lands: "Verify Email Address", password
 * recovery and magic links. Exchanges the one-time token for a session and
 * sends the visitor on to the website, already signed in.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/?verified=1";

  const supabase = await supabaseServer();
  let failed: string | null = null;

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    failed = error?.message ?? null;
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    failed = error?.message ?? null;
  } else {
    failed = "This link is missing its verification token.";
  }

  if (failed) {
    const login = new URL("/login", url.origin);
    login.searchParams.set("verify_error", "1");
    return NextResponse.redirect(login);
  }
  return NextResponse.redirect(new URL(next, url.origin));
}
