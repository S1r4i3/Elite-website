"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

let client: ReturnType<typeof createBrowserClient> | undefined;

/** Supabase client for the browser. Reads the session from cookies written by the server. */
export function supabaseBrowser() {
  if (!client) client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}
