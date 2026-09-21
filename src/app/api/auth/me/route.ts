import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/current-customer";

export const dynamic = "force-dynamic";

export async function GET() {
  const c = await getCurrentCustomer();
  return NextResponse.json(
    { customer: c ? { firstName: c.firstName, lastName: c.lastName, email: c.email } : null },
    { headers: { "cache-control": "no-store" } },
  );
}
