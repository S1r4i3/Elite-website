"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Change = { table: string; type: string; id: string; kind?: string; name?: string; status?: string | null };

const describe = (c: Change) => {
  if (c.table !== "portal_documents" || c.type === "DELETE") return null;
  if (c.type === "INSERT" && c.kind === "draft") return `New draft estimation ready for review${c.name ? `: ${c.name}` : ""}`;
  if (c.type === "INSERT" && c.kind === "final") return `Your final documents are ready${c.name ? `: ${c.name}` : ""}`;
  if (c.type === "UPDATE" && c.kind !== "upload") return `Updated by our team${c.name ? `: ${c.name}` : ""}`;
  return null;
};

/**
 * Keeps the client dashboard in sync with the admin panel: when our team shares
 * a draft/final or edits a document, the page refreshes itself and shows a notice.
 */
export function PortalLive() {
  const router = useRouter();
  const [live, setLive] = useState(false);
  const [notes, setNotes] = useState<{ id: number; text: string }[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let es: EventSource | null = null;
    let retry: ReturnType<typeof setTimeout> | null = null;
    let closed = false;
    const connect = () => {
      es = new EventSource("/api/me/live");
      es.addEventListener("hello", () => setLive(true));
      es.addEventListener("ping", () => setLive(true));
      es.addEventListener("change", (m) => {
        const c = JSON.parse((m as MessageEvent).data) as Change;
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => router.refresh(), 250);
        const text = describe(c);
        if (text) {
          const id = Date.now() + Math.random();
          setNotes((n) => [...n.slice(-2), { id, text }]);
          setTimeout(() => setNotes((n) => n.filter((x) => x.id !== id)), 7000);
        }
      });
      es.onerror = () => {
        es?.close();
        if (closed) return;
        setLive(false);
        retry = setTimeout(connect, 5000);
      };
    };
    connect();
    return () => {
      closed = true;
      es?.close();
      if (retry) clearTimeout(retry);
    };
  }, [router]);

  return (
    <>
      <span
        title={live ? "Connected — updates from our team appear instantly" : "Reconnecting…"}
        className={
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold " +
          (live ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-line bg-white text-muted")
        }
      >
        <span className={"size-1.5 rounded-full " + (live ? "bg-emerald-500" : "bg-slate-300")} aria-hidden />
        {live ? "Live" : "Connecting…"}
      </span>
      {notes.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 flex max-w-sm flex-col gap-2" role="status" aria-live="polite">
          {notes.map((n) => (
            <div key={n.id} className="rounded-xl bg-navy-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
              {n.text}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
