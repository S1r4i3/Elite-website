/**
 * Streams instantly while the dashboard loads the profile and documents, so signing in or
 * switching sections never shows a blank screen. Mirrors the real layout (sidebar + content).
 */
export default function DashboardLoading() {
  const bar = "animate-pulse rounded-xl bg-navy-900/[0.07]";
  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[272px_1fr]" role="status" aria-busy="true">
      <span className="sr-only">Loading your dashboard…</span>
      <aside className="slate-bg lg:sticky lg:top-0 lg:h-screen" aria-hidden>
        <div className="flex h-16 items-center px-5 lg:h-20">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-white/10" />
        </div>
        <div className="flex gap-2 overflow-hidden px-3 pb-3 lg:block lg:space-y-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-10 w-32 shrink-0 animate-pulse rounded-xl bg-white/[0.07] lg:w-auto" />
          ))}
        </div>
      </aside>
      <main className="p-4 sm:p-6 lg:p-10" aria-hidden>
        <div className={`${bar} h-8 w-64`} />
        <div className={`${bar} mt-3 h-4 w-96 max-w-full`} />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className={`${bar} h-28`} />
          ))}
        </div>
        <div className={`${bar} mt-6 h-72`} />
      </main>
    </div>
  );
}
