import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LayoutDashboard, ListChecks, FolderOpen, MessagesSquare, CreditCard, FileArchive, LifeBuoy, Construction, type LucideIcon } from "lucide-react";
import { dashboardSections } from "@/lib/dashboard/config";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { getCurrentCustomer } from "@/lib/current-customer";
import { LogoutButton } from "../logout-button";

const icons: Record<string, LucideIcon> = { LayoutDashboard, ListChecks, FolderOpen, MessagesSquare, CreditCard, FileArchive, LifeBuoy };

export const dynamic = "force-dynamic";

export default async function DashboardPage({ params }: { params: Promise<{ section?: string[] }> }) {
  const slug = (await params).section?.[0] ?? "";
  const current = dashboardSections.find((s) => s.slug === slug);
  if (!current) notFound();
  const CurrentIcon = icons[current.icon];
  const customer = await getCurrentCustomer();
  if (!customer) redirect(`/login?next=/dashboard${slug ? `/${slug}` : ""}`);
  const initials = `${customer.firstName[0] ?? ""}${customer.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-line bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center px-5">
          <Logo />
        </div>
        <nav aria-label="Dashboard" className="overflow-x-auto px-3 pb-3 lg:pb-0">
          <ul className="flex gap-1 lg:flex-col">
            {dashboardSections.map((s) => {
              const I = icons[s.icon];
              const active = s.slug === slug;
              return (
                <li key={s.slug}>
                  <Link
                    href={`/dashboard${s.slug ? `/${s.slug}` : ""}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium",
                      active ? "bg-brand-50 text-brand-700" : "text-muted hover:bg-canvas hover:text-navy-900",
                    )}
                  >
                    <I className="size-[18px]" aria-hidden /> {s.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto hidden border-t border-line p-4 lg:block">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{initials}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-navy-900">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="truncate text-xs text-muted">{customer.email}</p>
            </div>
          </div>
          <LogoutButton className="mt-3 w-full" />
        </div>
      </aside>
      <main className="p-5 sm:p-8 lg:p-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm text-muted">
            Welcome back, <span className="font-semibold text-navy-900">{customer.firstName}</span>
          </p>
          <LogoutButton className="lg:hidden" />
        </div>
        <h1 className="flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
          <CurrentIcon className="size-7 text-brand-600" aria-hidden /> {current.label}
        </h1>
        <div className="card mt-8 grid place-items-center p-10 text-center sm:p-16">
          <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <Construction className="size-7" strokeWidth={1.5} aria-hidden />
          </span>
          <h2 className="mt-5 text-xl font-bold">Client portal coming soon</h2>
          <p className="mt-2 max-w-md text-muted">{current.empty}</p>
          <p className="mt-1 text-xs text-subtle">
            Planned endpoint: <code className="rounded bg-canvas px-1.5 py-0.5">{current.api}</code>
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/get-started">Start a request</Link>
            </Button>
            <Button asChild variant="secondary">
              <a href={site.phone.href}>Call {site.phone.display}</a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
