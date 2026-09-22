import "server-only";
import { cookies } from "next/headers";
import { getRepository } from "@/lib/db";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/** The signed-in customer for this request, or null. Older accounts get their client ID on first use. */
export async function getCurrentCustomer() {
  const id = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!id) return null;
  const repo = getRepository();
  const customer = await repo.getCustomer(id);
  if (customer && !customer.clientId) customer.clientId = await repo.assignClientId(customer.id);
  return customer;
}
