"use client";

import { useEffect, useState } from "react";

/** U.S. time zones east to west, then the India processing team. */
const ZONES = [
  { label: "ET", tz: "America/New_York", title: "Eastern time" },
  { label: "CT", tz: "America/Chicago", title: "Central time" },
  { label: "MT", tz: "America/Denver", title: "Mountain time" },
  { label: "PT", tz: "America/Los_Angeles", title: "Pacific time" },
  { label: "AKT", tz: "America/Anchorage", title: "Alaska time" },
  { label: "HT", tz: "Pacific/Honolulu", title: "Hawaii time" },
  { label: "IST", tz: "Asia/Kolkata", title: "India Standard Time" },
];

const time = (tz: string, now: Date) =>
  new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true }).format(now).toLowerCase();

/**
 * Small live clock strip for the client portal header.
 * Rendered only after mount, so the server and browser never disagree about the time.
 */
export function TimeZones({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-x-1 gap-y-1 rounded-xl border border-line bg-white px-2.5 py-1.5 ${className}`}
      aria-label="Current time by zone"
    >
      {ZONES.map((z, i) => (
        <span key={z.label} className="flex items-center" title={z.title}>
          {i > 0 && <span className="mx-1 h-3 w-px bg-line" aria-hidden />}
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-subtle">{z.label}</span>
          <time dateTime={now.toISOString()} className="ml-1 font-mono text-[11px] font-medium tabular-nums text-navy-900">
            {time(z.tz, now)}
          </time>
        </span>
      ))}
    </div>
  );
}
