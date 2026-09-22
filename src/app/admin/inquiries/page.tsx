import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { getRepository } from "@/lib/db";
import { LogoMark } from "@/components/layout/logo";
import { LogoutButton } from "../admin-controls";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await getRepository().listInquiries(500);
  return (
    <div>
      <header className="border-b border-line bg-white">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark />
            <Link href="/admin" className="rounded-lg px-2.5 py-1 text-sm font-semibold text-muted hover:bg-canvas">
              Leads
            </Link>
            <Link href="/admin/customers" className="rounded-lg px-2.5 py-1 text-sm font-semibold text-muted hover:bg-canvas">
              Clients
            </Link>
            <span className="font-display font-extrabold text-navy-900">Inquiries</span>
          </div>
          <LogoutButton />
        </div>
      </header>
      <div className="container-x py-8">
        <p className="text-sm text-muted">Messages from the website pop-up form ({inquiries.length}).</p>
        {inquiries.length === 0 ? (
          <div className="card mt-6 grid place-items-center p-14 text-center">
            <MessageCircle className="size-8 text-brand-600" aria-hidden />
            <p className="mt-3 font-semibold">No inquiries yet</p>
          </div>
        ) : (
          <div className="card mt-6 overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Mobile</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Message</th>
                  <th className="px-4 py-3 font-semibold">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {inquiries.map((i) => (
                  <tr key={i.id} className="align-top">
                    <td className="px-4 py-3 font-semibold text-navy-900">{i.name}</td>
                    <td className="px-4 py-3">
                      <a href={`tel:${i.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 text-brand-600 hover:underline">
                        <Phone className="size-3.5" aria-hidden /> {i.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {i.email ? (
                        <a href={`mailto:${i.email}`} className="inline-flex items-center gap-1.5 text-brand-600 hover:underline">
                          <Mail className="size-3.5" aria-hidden /> {i.email}
                        </a>
                      ) : (
                        <span className="text-subtle">—</span>
                      )}
                    </td>
                    <td className="max-w-md px-4 py-3 text-ink">{i.message || <span className="text-subtle">—</span>}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {new Date(i.createdAt).toLocaleString()}
                      {i.page && <p className="text-xs text-subtle">from {i.page}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
