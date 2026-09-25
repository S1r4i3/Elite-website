import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

let admin: SupabaseClient | undefined;

/**
 * Service-role client: bypasses row-level security.
 * Server-side only — the key must never reach the browser.
 */
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) throw new Error("SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL must be set");
  if (!admin) {
    admin = createClient(SUPABASE_URL, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return admin;
}

export const serviceRoleConfigured = () => Boolean(SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
