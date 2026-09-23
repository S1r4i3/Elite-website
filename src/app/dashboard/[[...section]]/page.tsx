import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Circle,
  FileCheck2,
  FileText,
  FolderOpen,
  Globe,
  LayoutDashboard,
  Phone,
  UploadCloud,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { accountSections, allDashboardSections, dashboardSections } from "@/lib/dashboard/config";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn, formatBytes } from "@/lib/utils";
import { getCurrentCustomer } from "@/lib/current-customer";
import { getRepository, type PortalDocument } from "@/lib/db";
import { documentTypeLabel } from "@/lib/portal";
import { LogoutButton } from "../logout-button";
import { UploadSection } from "@/components/dashboard/upload-section";
import { ProfileForm, PasswordForm } from "@/components/dashboard/profile-forms";
import { DocActions } from "@/components/dashboard/doc-actions";
import { DraftCard } from "@/components/dashboard/draft-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { TimeZones } from "@/components/dashboard/time-zones";

export const dynamic = "force-dynamic";

const icons: Record<string, LucideIcon> = { LayoutDashboard, UploadCloud, FolderOpen, Calculator, FileCheck2, UserRound };
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export default async function DashboardPage({ params }: { params: Promise<{ section?: string[] }> }) {
  const slug = (await params).section?.[0] ?? "";
  const current = allDashboardSections.find((s) => s.slug === slug);
  if (!current || ((await params).section?.length ?? 0) > 1) notFound();
  const customer = await getCurrentCustomer();
  // The cookie is valid but the account is gone (deleted, or a fresh database):
  // clear the session instead of bouncing between /dashboard and /login.
  if (!customer) redirect(`/api/auth/expired?next=/dashboard${slug ? `/${slug}` : ""}`);

  const all = await getRepository().listPortalDocuments(customer.id);
  const uploads = all.filter((d) => d.kind === "upload");
  const drafts = all.filter((d) => d.kind === "draft");
  const finals = all.filter((d) => d.kind === "final");
  const pendingDrafts = drafts.filter((d) => d.status === "awaiting_review").length;
  const initials = `${customer.firstName[0] ?? ""}${customer.lastName[0] ?? ""}`.toUpperCase();
  const counts: Record<string, number> = { "my-documents": uploads.length, "draft-estimation": pendingDrafts, "final-documents": finals.length };
  const CurrentIcon = icons[current.icon];

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[272px_1fr]">
      {/* Sidebar */}
      <aside className="slate-bg relative text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="flex h-16 items-center justify-between px-5 lg:h-20">
          <Logo light />
          <LogoutButton className="text-white/70 hover:bg-white/10 hover:text-white lg:hidden" />
        </div>
        <nav aria-label="Client portal" className="overflow-x-auto px-3 pb-3 lg:flex-1 lg:pb-0">
          <div className="flex gap-1 lg:block">
          <p className="hidden px-3 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 lg:block">Client portal</p>
          <ul className="flex gap-1 lg:flex-col">
            {dashboardSections.map((s) => {
              const I = icons[s.icon];
              const active = s.slug === slug;
              const n = counts[s.slug];
              return (
                <li key={s.slug}>
                  <Link
                    href={`/dashboard${s.slug ? `/${s.slug}` : ""}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      active ? "bg-brand-600 text-white shadow-lg shadow-black/20" : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <I className="size-[18px]" aria-hidden />
                    <span className="flex-1">{s.label}</span>
                    {!!n && (
                      <span
                        className={cn(
                          "grid min-w-6 place-items-center rounded-full px-1.5 text-[11px] font-bold",
                          active ? "bg-white/25 text-white" : s.slug === "draft-estimation" ? "bg-brand-500 text-white" : "bg-white/10 text-white/80",
                        )}
                      >
                        {n}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="hidden px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 lg:block">Account</p>
          <ul className="flex gap-1 lg:flex-col">
            {accountSections.map((s) => {
              const I = icons[s.icon];
              const active = s.slug === slug;
              return (
                <li key={s.slug}>
                  <Link
                    href={`/dashboard/${s.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      active ? "bg-brand-600 text-white shadow-lg shadow-black/20" : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <I className="size-[18px]" aria-hidden /> {s.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          </div>
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white ring-2 ring-white/10">{initials}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="truncate text-xs text-white/55">{customer.email}</p>
            </div>
          </div>
          {customer.clientId && (
            <p className="mt-3 flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs text-white/60">
              Client ID <span className="font-mono text-[13px] font-semibold tracking-wide text-white">{customer.clientId}</span>
            </p>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href="/" className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
              <Globe className="size-4" aria-hidden /> Website
            </Link>
            <LogoutButton className="justify-center text-white/70 hover:bg-white/10 hover:text-white" />
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="bg-canvas p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">
                {slug === "" ? "Welcome back," : "Client portal"} {slug === "" && <span className="font-semibold text-navy-900">{customer.firstName}</span>}
                {customer.clientId && (
                  <span className="ml-2 inline-flex items-center rounded-full border border-line bg-white px-2.5 py-0.5 font-mono text-xs font-semibold text-navy-900">
                    {customer.clientId}
                  </span>
                )}
              </p>
              <h1 className="mt-1 flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
                <CurrentIcon className="size-7 text-brand-600" aria-hidden /> {current.label}
              </h1>
              <p className="mt-2 max-w-2xl text-muted">{current.description}</p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <TimeZones className="justify-start sm:justify-end" />
              {slug === "" && (
                <Button asChild className="btn-shine">
                  <Link href="/dashboard/upload-documents">
                    <UploadCloud aria-hidden /> Upload documents
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="mt-8">
            {slug === "" && <Overview uploads={uploads} drafts={drafts} finals={finals} />}
            {slug === "upload-documents" && (
              <UploadSection counts={uploads.reduce<Record<string, number>>((m, d) => ((m[d.category ?? "other"] = (m[d.category ?? "other"] ?? 0) + 1), m), {})} />
            )}
            {slug === "profile" && (
              <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <ProfileForm
                    initial={{
                      firstName: customer.firstName,
                      lastName: customer.lastName,
                      email: customer.email,
                      phone: customer.phone ?? "",
                      dob: customer.dob ?? "",
                      state: customer.state ?? "",
                      country: customer.country ?? "",
                      address: customer.address ?? "",
                    }}
                  />
                </div>
                <div className="lg:col-span-2">
                  <PasswordForm hasPassword={!!customer.passwordHash} />
                </div>
              </div>
            )}
            {slug === "my-documents" && <MyDocuments docs={uploads} />}
            {slug === "draft-estimation" && <Drafts drafts={drafts} />}
            {slug === "final-documents" && <Finals finals={finals} />}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ───────── Sections ───────── */

function Overview({ uploads, drafts, finals }: { uploads: PortalDocument[]; drafts: PortalDocument[]; finals: PortalDocument[] }) {
  const pending = drafts.filter((d) => d.status === "awaiting_review").length;
  const approved = drafts.some((d) => d.status === "approved");
  const steps = [
    { label: "Account created", done: true },
    { label: "Documents uploaded", done: uploads.length > 0 },
    { label: "Draft estimate ready", done: drafts.length > 0 },
    { label: "Draft approved", done: approved },
    { label: "Final documents", done: finals.length > 0 },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const next = steps.find((s) => !s.done);
  const stats = [
    { label: "Documents uploaded", value: uploads.length, href: "/dashboard/my-documents", icon: FolderOpen },
    { label: "Drafts to review", value: pending, href: "/dashboard/draft-estimation", icon: Calculator, highlight: pending > 0 },
    { label: "Final documents", value: finals.length, href: "/dashboard/final-documents", icon: FileCheck2 },
  ];
  const recent = [...uploads, ...drafts, ...finals].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  return (
    <div className="space-y-6">
      {pending > 0 && (
        <Link href="/dashboard/draft-estimation" className="group flex items-center gap-4 rounded-2xl border border-brand-200 bg-brand-50 p-4 transition hover:border-brand-600 sm:p-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
            <Calculator className="size-5" aria-hidden />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-navy-900">Your draft estimate is ready for review</p>
            <p className="text-sm text-muted">Check the numbers, then approve it or request changes.</p>
          </div>
          <ArrowRight className="size-5 text-brand-600 transition group-hover:translate-x-1" aria-hidden />
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, href, icon: I, highlight }) => (
          <Link key={label} href={href} className={cn("card card-hover flex items-center gap-4 p-5", highlight && "border-brand-200")}>
            <span className={cn("grid size-12 place-items-center rounded-2xl", highlight ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600")}>
              <I className="size-6" aria-hidden />
            </span>
            <div>
              <p className="font-display text-3xl font-extrabold leading-none text-navy-900">{value}</p>
              <p className="mt-1 text-sm text-muted">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Progress */}
        <section className="card p-6 lg:col-span-3" aria-labelledby="progress-h">
          <div className="flex items-center justify-between">
            <h2 id="progress-h" className="text-lg font-bold">Filing progress</h2>
            <span className="text-sm font-semibold text-brand-600">
              {doneCount}/{steps.length} steps
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-canvas">
            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
          </div>
          <ol className="mt-6 space-y-4">
            {steps.map((s) => (
              <li key={s.label} className="flex items-center gap-3">
                {s.done ? <CheckCircle2 className="size-5 text-success-600" aria-hidden /> : <Circle className={cn("size-5", s === next ? "text-brand-600" : "text-line-strong")} aria-hidden />}
                <span className={cn("text-sm", s.done ? "font-medium text-navy-900" : s === next ? "font-semibold text-brand-700" : "text-muted")}>
                  {s.label}
                  {s === next && <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs">Next</span>}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Help */}
        <section className="slate-bg relative overflow-hidden rounded-[var(--radius-card)] p-6 text-white lg:col-span-2" aria-labelledby="help-h">
          <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand-600/30 blur-3xl" aria-hidden />
          <h2 id="help-h" className="relative text-lg font-bold text-white">Need help?</h2>
          <p className="relative mt-2 text-sm text-white/70">Not sure which documents to send? Talk to a tax professional.</p>
          <div className="relative mt-5 grid gap-2">
            <a href={site.phone.href} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15">
              <Phone className="size-4 text-brand-300" aria-hidden /> {site.phone.display}
            </a>
            <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15">
              <FileText className="size-4 text-brand-300" aria-hidden /> {site.email}
            </a>
          </div>
        </section>
      </div>

      <section className="card p-6" aria-labelledby="recent-h">
        <h2 id="recent-h" className="text-lg font-bold">Recent activity</h2>
        {recent.length === 0 ? (
          <Empty
            icon={UploadCloud}
            title="Nothing here yet"
            body="Start by uploading your W-2s, 1099s and other tax documents."
            cta={{ href: "/dashboard/upload-documents", label: "Upload documents" }}
          />
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {recent.map((d) => (
              <li key={d.id} className="flex items-center gap-3 py-3">
                <KindIcon kind={d.kind} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-navy-900">{d.originalName}</p>
                  <p className="text-xs text-muted">
                    {d.kind === "upload" ? "You uploaded" : d.kind === "draft" ? "Draft estimate shared" : "Final document shared"} · {fmtDate(d.createdAt)}
                  </p>
                </div>
                {d.kind === "draft" && <StatusBadge status={d.status} />}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function MyDocuments({ docs }: { docs: PortalDocument[] }) {
  if (docs.length === 0) {
    return (
      <div className="card">
        <Empty icon={FolderOpen} title="No documents yet" body="Documents you upload from the Upload Documents page will appear here." />
      </div>
    );
  }
  const years = Array.from(new Set(docs.map((d) => d.taxYear ?? "Other"))).sort().reverse();
  return (
    <div className="space-y-6">
      {years.map((y) => (
        <section key={y} className="card overflow-hidden">
          <h2 className="border-b border-line bg-canvas/60 px-5 py-3 text-sm font-bold text-navy-900">{y === "Other" ? "No tax year" : `Tax year ${y}`}</h2>
          <ul className="divide-y divide-line">
            {docs
              .filter((d) => (d.taxYear ?? "Other") === y)
              .map((d) => (
                <li key={d.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <KindIcon kind="upload" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-navy-900">{d.originalName}</p>
                    <p className="text-xs text-muted">
                      {documentTypeLabel(d.category)} · {formatBytes(d.size)} · {fmtDate(d.createdAt)}
                    </p>
                  </div>
                  <DocActions id={d.id} name={d.originalName} canDelete />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Drafts({ drafts }: { drafts: PortalDocument[] }) {
  if (drafts.length === 0) {
    return (
      <div className="card">
        <Empty
          icon={Calculator}
          title="No draft estimate yet"
          body="Once we've reviewed your documents, your tax professional will share a draft estimate here for you to review and approve."
        />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {drafts.map((d) => (
        <DraftCard
          key={d.id}
          draft={{ id: d.id, name: d.originalName, size: d.size, taxYear: d.taxYear, note: d.note, status: d.status, clientComment: d.clientComment, createdAt: d.createdAt }}
        />
      ))}
    </div>
  );
}

function Finals({ finals }: { finals: PortalDocument[] }) {
  if (finals.length === 0) {
    return (
      <div className="card">
        <Empty icon={FileCheck2} title="No final documents yet" body="After you approve your draft, we'll file your return and share the final copies here." />
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {finals.map((d) => (
        <article key={d.id} className="card card-hover flex flex-col p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-success-50 text-success-600">
              <FileCheck2 className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold">{d.originalName}</h3>
              <p className="mt-0.5 text-xs text-muted">
                {d.taxYear ? `Tax year ${d.taxYear} · ` : ""}
                {formatBytes(d.size)} · {fmtDate(d.createdAt)}
              </p>
            </div>
          </div>
          {d.note && <p className="mt-3 flex-1 rounded-xl bg-canvas p-3 text-sm text-ink">{d.note}</p>}
          <DocActions id={d.id} name={d.originalName} className="mt-4 border-t border-line pt-3" />
        </article>
      ))}
    </div>
  );
}

/* ───────── bits ───────── */

function KindIcon({ kind }: { kind: PortalDocument["kind"] }) {
  const map = { upload: [FileText, "bg-canvas text-navy-900"], draft: [Calculator, "bg-brand-50 text-brand-600"], final: [FileCheck2, "bg-success-50 text-success-600"] } as const;
  const [I, cls] = map[kind];
  return (
    <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", cls)}>
      <I className="size-[18px]" aria-hidden />
    </span>
  );
}

function Empty({ icon: I, title, body, cta }: { icon: LucideIcon; title: string; body: string; cta?: { href: string; label: string } }) {
  return (
    <div className="grid place-items-center px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <I className="size-7" strokeWidth={1.6} aria-hidden />
      </span>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted">{body}</p>
      {cta && (
        <Button asChild className="mt-6">
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
      )}
    </div>
  );
}
