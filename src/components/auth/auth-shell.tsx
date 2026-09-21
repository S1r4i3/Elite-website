import { Suspense } from "react";
import { BadgeCheck, Clock, FolderLock, MessagesSquare, ShieldCheck } from "lucide-react";
import { AuthForm } from "./auth-form";

const perks = [
  { icon: Clock, title: "Track your filing", body: "See each step from documents to IRS acceptance." },
  { icon: FolderLock, title: "Share documents securely", body: "No email attachments — upload from phone or computer." },
  { icon: MessagesSquare, title: "Talk to your preparer", body: "Secure messages with your tax professional." },
];

export function AuthShell({ mode }: { mode: "login" | "register" }) {
  return (
    <section className="bg-canvas">
      <div className="container-x py-10 sm:py-14 lg:py-20">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-lift)] lg:grid-cols-2">
          {/* Brand panel */}
          <div className="slate-bg relative hidden overflow-hidden p-10 text-white lg:block">
            <div className="grid-bg-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_80%_60%_at_30%_20%,black,transparent)]" aria-hidden />
            <div className="pointer-events-none absolute -bottom-32 -left-24 size-80 animate-pulse rounded-full bg-brand-600/25 blur-3xl" aria-hidden />
            <div className="relative flex h-full flex-col">
              <span className="float-y inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold">
                <BadgeCheck className="size-3.5" aria-hidden /> IRS authorized e-file provider
              </span>
              <h2 className="mt-8 text-3xl font-extrabold leading-tight text-white">
                Your taxes, <span className="text-shimmer">one secure place.</span>
              </h2>
              <ul className="stagger mt-8 space-y-5">
                {perks.map(({ icon: I, title, body }) => (
                  <li key={title} className="flex gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-brand-200">
                      <I className="size-5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-semibold text-white">{title}</p>
                      <p className="mt-0.5 text-sm text-white/65">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-auto flex items-center gap-2 pt-10 text-sm text-white/60">
                <ShieldCheck className="size-4 text-brand-300" aria-hidden /> Password-free sign in with a one-time email code.
              </p>
            </div>
          </div>
          {/* Form */}
          <div className="p-6 sm:p-10 lg:p-12">
            <Suspense>
              <AuthForm mode={mode} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
