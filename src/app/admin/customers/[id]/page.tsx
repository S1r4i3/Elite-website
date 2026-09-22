import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { getRepository, type PortalDocument } from "@/lib/db";
import { documentTypeLabel } from "@/lib/portal";
import { formatBytes } from "@/lib/utils";
import { LogoMark } from "@/components/layout/logo";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { LogoutButton } from "../../admin-controls";
import { AdminUploadForm, AdminDeleteDoc } from "./admin-portal-controls";

export const dynamic = "force-dynamic";

export default async function AdminCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const repo = getRepository();
  const c = await repo.getCustomer((await params).id);
  if (!c) notFound();
  const docs = await repo.listPortalDocuments(c.id);
  const group = (k: PortalDocument["kind"]) => docs.filter((d) => d.kind === k);

  const Row = ({ d }: { d: PortalDocument }) => (
    <li className="flex flex-wrap items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-navy-900">{d.originalName}</p>
        <p className="text-xs text-muted">
          {d.kind === "upload" ? documentTypeLabel(d.category) + " · " : ""}
          {d.taxYear ? `TY ${d.taxYear} · ` : ""}
          {formatBytes(d.size)} · {new Date(d.createdAt).toLocaleString()}
        </p>
        {d.note && <p className="mt-1 text-xs text-ink">Note: {d.note}</p>}
        {d.clientComment && <p className="mt-1 rounded-lg bg-warn-50 px-2 py-1 text-xs text-warn-700">Client: {d.clientComment}</p>}
      </div>
      {d.kind === "draft" && <StatusBadge status={d.status} staff />}
      <a href={`/api/admin/portal-documents/${d.id}`} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-brand-600 hover:bg-brand-50">
        <Download className="size-4" aria-hidden /> Download
      </a>
      <AdminDeleteDoc id={d.id} />
    </li>
  );

  return (
    <div>
      <header className="border-b border-line bg-white">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark />
            <Link href="/admin/customers" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-navy-900">
              <ArrowLeft className="size-4" aria-hidden /> Clients
            </Link>
          </div>
          <LogoutButton />
        </div>
      </header>
      <div className="container-x grid gap-6 py-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card p-6">
            <h1 className="text-2xl font-extrabold">
              {c.firstName} {c.lastName}
            </h1>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {[
                ["Email", c.email],
                ["Phone", c.phone],
                ["Date of birth", c.dob],
                ["State", c.state],
                ["Country", c.country],
                ["Address", c.address],
                ["Joined", new Date(c.createdAt).toLocaleDateString()],
                ["Last login", c.lastLoginAt ? new Date(c.lastLoginAt).toLocaleString() : "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="font-medium text-navy-900">{v || "—"}</dd>
                </div>
              ))}
            </dl>
          </section>
          {(
            [
              ["upload", "Client uploads"],
              ["draft", "Draft estimates"],
              ["final", "Final documents"],
            ] as const
          ).map(([k, title]) => (
            <section key={k} className="card p-6">
              <h2 className="text-lg font-bold">
                {title} <span className="text-sm font-normal text-muted">({group(k).length})</span>
              </h2>
              {group(k).length === 0 ? <p className="mt-2 text-sm text-muted">None yet.</p> : <ul className="mt-2 divide-y divide-line">{group(k).map((d) => <Row key={d.id} d={d} />)}</ul>}
            </section>
          ))}
        </div>
        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <AdminUploadForm customerId={c.id} />
        </aside>
      </div>
    </div>
  );
}
