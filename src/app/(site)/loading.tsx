export default function Loading() {
  return (
    <div className="container-x py-16" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-32 rounded bg-canvas" />
        <div className="h-12 w-3/4 max-w-2xl rounded-xl bg-canvas" />
        <div className="h-5 w-2/3 max-w-xl rounded bg-canvas" />
        <div className="grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-canvas" />
          ))}
        </div>
      </div>
    </div>
  );
}
