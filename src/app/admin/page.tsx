import Link from "next/link";
import { Inbox, Search, Paperclip } from "lucide-react";
import { getRepository, leadStatuses, type LeadStatus } from "@/lib/db";
import { serviceOptions, customerTypeOptions } from "@/lib/services";
import { LogoMark } from "@/components/layout/logo";
import { StatusSelect, LogoutButton } from "./admin-controls";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const serviceLabel = (v: string) => serviceOptions.find((o) => o.value === v)?.label ?? v;

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const sp = await searchParams;
  const status = leadStatuses.includes(sp.status as LeadStatus) ? (sp.status as LeadStatus) : undefined;
  const repo = getRepository();
  let data: Awaited<ReturnType<typeof repo.listLeads>> | null = null;
  let stats: Awaited<ReturnType<typeof repo.stats>> | null = null;
  let failed = false;
  try {
    [data, stats] = await Promise.all([repo.listLeads({ status, search: sp.q, limit: 100 }), repo.stats()]);
  } catch (e) {
    console.error(e);
    failed = true;
  }

  return (
    <div>
      <header className="border-b border-line bg-white">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="font-display font-extrabold text-navy-900">Leads</span>
            <Link href="/admin/customers" className="rounded-lg px-2.5 py-1 text-sm font-semibold text-brand-600 hover:bg-brand-50">
              Clients →
            </Link>
            <Link href="/admin/inquiries" className="rounded-lg px-2.5 py-1 text-sm font-semibold text-brand-600 hover:bg-brand-50">
              Inquiries →
            </Link>
            <span className="rounded-full bg-canvas px-2 py-0.5 text-xs text-muted">{repo.driver === "postgres" ? "PostgreSQL" : "File store (dev)"}</span>
          </div>
          <LogoutButton />
        </div>
      </header>
      <div className="container-x py-8">
        {stats && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[["All leads", stats.total, undefined], ...leadStatuses.map((s) => [s, stats![s], s])].map(([label, n, s]) => (
              <Link
                key={String(label)}
                href={s ? `/admin?status=${s}` : "/admin"}
                className={cn("card p-4 transition hover:border-brand-200", status === s && "border-brand-600 ring-1 ring-brand-600")}
              >
                <p className="text-xs capitalize text-muted">{String(label)}</p>
                <p className="mt-1 font-display text-2xl font-extrabold text-navy-900">{Number(n)}</p>
              </Link>
            ))}
          </div>
        )}

        <form className="mt-6 flex gap-2" action="/admin">
          {status && <input type="hidden" name="status" value={status} />}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />
            <input name="q" defaultValue={sp.q} placeholder="Search name, email or phone" aria-label="Search leads" className="h-11 w-full rounded-xl border border-line-strong bg-white pl-9 pr-3 text-sm" />
          </div>
          <button className="h-11 rounded-xl bg-navy-900 px-4 text-sm font-semibold text-white">Search</button>
        </form>

        <div className="card mt-6 overflow-hidden">
          {failed ? (
            <p className="p-10 text-center text-danger-600">Couldn&apos;t load leads. Check the database connection.</p>
          ) : !data || data.leads.length === 0 ? (
            <div className="p-14 text-center">
              <Inbox className="mx-auto size-10 text-subtle" strokeWidth={1.5} aria-hidden />
              <p className="mt-4 font-semibold text-navy-900">No leads yet</p>
              <p className="mt-1 text-sm text-muted">New form submissions will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-canvas text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Contact</th>
                    <th className="px-4 py-3 font-semibold">Service</th>
                    <th className="px-4 py-3 font-semibold">Type / Year</th>
                    <th className="px-4 py-3 font-semibold">Received</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {data.leads.map((l) => (
                    <tr key={l.id} className="hover:bg-canvas/60">
                      <td className="px-4 py-3">
                        <Link href={`/admin/leads/${l.id}`} className="font-semibold text-navy-900 hover:text-brand-600">
                          {l.firstName} {l.lastName}
                        </Link>
                        {!!l.documents?.length && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted">
                            <Paperclip className="size-3" aria-hidden /> {l.documents.length}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        <a href={`mailto:${l.email}`} className="block hover:text-brand-600">{l.email}</a>
                        <a href={`tel:${l.phone}`} className="block hover:text-brand-600">{l.phone}</a>
                      </td>
                      <td className="px-4 py-3">{serviceLabel(l.service)}</td>
                      <td className="px-4 py-3 text-muted">
                        {customerTypeOptions.find((o) => o.value === l.customerType)?.label ?? l.customerType} · {l.taxYear}
                      </td>
                      <td className="px-4 py-3 text-muted">{new Date(l.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</td>
                      <td className="px-4 py-3">
                        <StatusSelect id={l.id} status={l.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {data && <p className="mt-3 text-xs text-muted">Showing {data.leads.length} of {data.total}</p>}
      </div>
    </div>
  );
}
