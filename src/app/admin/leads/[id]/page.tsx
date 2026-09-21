import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { getRepository } from "@/lib/db";
import { serviceOptions, customerTypeOptions } from "@/lib/services";
import { StatusSelect } from "../../admin-controls";
import { formatBytes } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const lead = await getRepository().getLead((await params).id);
  if (!lead) notFound();
  const rows: [string, React.ReactNode][] = [
    ["Email", <a key="e" href={`mailto:${lead.email}`} className="text-brand-600">{lead.email}</a>],
    ["Phone", <a key="p" href={`tel:${lead.phone}`} className="text-brand-600">{lead.phone}</a>],
    ["Service", serviceOptions.find((o) => o.value === lead.service)?.label ?? lead.service],
    ["Customer type", customerTypeOptions.find((o) => o.value === lead.customerType)?.label ?? lead.customerType],
    ["Tax year", lead.taxYear],
    ["Source", lead.source ?? "—"],
    ["Received", new Date(lead.createdAt).toLocaleString("en-US")],
  ];
  return (
    <div className="container-x max-w-4xl py-8">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-900">
        <ArrowLeft className="size-4" aria-hidden /> All leads
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">
          {lead.firstName} {lead.lastName}
        </h1>
        <StatusSelect id={lead.id} status={lead.status} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <dl className="card divide-y divide-line">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-5 py-3 text-sm">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right font-medium text-navy-900">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="text-base font-bold">Message</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{lead.message || "No message."}</p>
          </div>
          <div className="card p-5">
            <h2 className="text-base font-bold">Documents ({lead.documents?.length ?? 0})</h2>
            {lead.documents?.length ? (
              <ul className="mt-3 space-y-2">
                {lead.documents.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 rounded-lg bg-canvas p-2.5 text-sm">
                    <FileText className="size-4 text-brand-600" aria-hidden />
                    <span className="min-w-0 flex-1 truncate">{d.originalName}</span>
                    <span className="text-xs text-muted">{d.category} · {formatBytes(d.size)}</span>
                    <a href={`/api/admin/documents/${d.id}`} className="grid size-8 place-items-center rounded-md hover:bg-white" aria-label={`Download ${d.originalName}`}>
                      <Download className="size-4" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">No documents uploaded.</p>
            )}
          </div>
          {lead.estimate && (
            <div className="card p-5">
              <h2 className="text-base font-bold">Estimator result</h2>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-canvas p-3 text-xs">{JSON.stringify(lead.estimate, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
