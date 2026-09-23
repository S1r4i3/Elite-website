import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { requireApiToken } from "@/lib/api-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET counters for the admin dashboard home page. */
export async function GET(req: Request) {
  const denied = requireApiToken(req);
  if (denied) return denied;
  const repo = getRepository();
  const [leads, clients, inquiries, docs] = await Promise.all([
    repo.stats(),
    repo.listCustomers(),
    repo.listInquiries(500),
    repo.countPortalDocuments(),
  ]);
  const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return NextResponse.json({
    ok: true,
    stats: {
      clients: clients.length,
      clientsLast30Days: clients.filter((c) => new Date(c.createdAt).getTime() >= since).length,
      verifiedClients: clients.filter((c) => c.emailVerifiedAt).length,
      inquiries: inquiries.length,
      leads: leads.total,
      leadsByStatus: { new: leads.new, contacted: leads.contacted, qualified: leads.qualified, converted: leads.converted, closed: leads.closed },
      documents: docs,
    },
  });
}
