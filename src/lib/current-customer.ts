import "server-only";
import { cache } from "react";
import { getRepository } from "@/lib/db";
import { supabaseServer } from "@/lib/supabase/server";

/** The signed-in user's id from a verified JWT (local check, no network when possible). Cached per request. */
export const getCurrentUserId = cache(async (): Promise<string | null> => {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;
  return data.claims.sub;
});

/**
 * The signed-in client for this request, or null. Cached per request, so a page and
 * its components can all call it without extra database round-trips.
 * Identity comes from Supabase Auth; their details come from `public.profiles`.
 */
export const getCurrentCustomer = cache(async () => {
  const id = await getCurrentUserId();
  if (!id) return null;
  const repo = getRepository();
  const customer = await repo.getCustomer(id);
  if (!customer) return null;
  if (!customer.clientId) customer.clientId = await repo.assignClientId(customer.id);
  return customer;
});
