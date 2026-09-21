import "server-only";
import { cookies } from "next/headers";
import { getRepository } from "@/lib/db";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/** The signed-in customer for this request, or null. */
export async function getCurrentCustomer() {
  const id = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  return id ? getRepository().getCustomer(id) : null;
}
