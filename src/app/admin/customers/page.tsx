import Link from "next/link";
import { Search, Users } from "lucide-react";
import { getRepository } from "@/lib/db";
import { LogoMark } from "@/components/layout/logo";
import { LogoutButton } from "../admin-controls";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const repo = getRepository();
  const customers = await repo.listCustomers(q);
  for (const c of customers) if (!c.clientId) c.clientId = await repo.assignClientId(c.id);
  const docs = await Promise.all(customers.map((c) => repo.listPortalDocuments(c.id)));

  return (
    <div>
      <header className="border-b border-line bg-white">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark />
            <Link href="/admin" className="rounded-lg px-2.5 py-1 text-sm font-semibold text-muted hover:bg-canvas">
              Leads
            </Link>
            <span className="font-display font-extrabold text-navy-900">Clients</span>
            <Link href="/admin/inquiries" className="rounded-lg px-2.5 py-1 text-sm font-semibold text-muted hover:bg-canvas">
              Inquiries
            </Link>
          </div>
          <LogoutButton />
        </div>
      </header>
      <div className="container-x py-8">
        <form className="flex gap-2" action="/admin/customers">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />
            <input name="q" defaultValue={q} placeholder="Search name, email or phone" aria-label="Search clients" className="h-11 w-full rounded-xl border border-line-strong bg-white pl-9 pr-3 text-sm" />
          </div>
          <button className="h-11 rounded-xl bg-navy-900 px-5 text-sm font-semibold text-white">Search</button>
        </form>

        {customers.length === 0 ? (
          <div className="card mt-6 grid place-items-center p-14 text-center">
            <Users className="size-8 text-brand-600" aria-hidden />
            <p className="mt-3 font-semibold">No client accounts {q ? "match your search" : "yet"}</p>
          </div>
        ) : (
          <div className="card mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Client ID</th>
                  <th className="px-4 py-3 font-semibold">Client</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Uploads</th>
                  <th className="px-4 py-3 font-semibold">Drafts</th>
                  <th className="px-4 py-3 font-semibold">Finals</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {customers.map((c, i) => {
                  const d = docs[i];
                  const changes = d.some((x) => x.kind === "draft" && x.status === "changes_requested");
                  return (
                    <tr key={c.id} className="hover:bg-canvas/50">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-navy-900">{c.clientId ?? "—"}</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/customers/${c.id}`} className="font-semibold text-navy-900 hover:text-brand-600">
                          {c.firstName} {c.lastName}
                        </Link>
                        <p className="text-xs text-muted">{c.email}</p>
                      </td>
                      <td className="px-4 py-3 text-muted">{c.phone || "—"}</td>
                      <td className="px-4 py-3">{d.filter((x) => x.kind === "upload").length}</td>
                      <td className="px-4 py-3">
                        {d.filter((x) => x.kind === "draft").length}
                        {changes && <span className="ml-2 rounded-full bg-warn-50 px-2 py-0.5 text-xs font-semibold text-warn-700">changes requested</span>}
                      </td>
                      <td className="px-4 py-3">{d.filter((x) => x.kind === "final").length}</td>
                      <td className="px-4 py-3 text-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
