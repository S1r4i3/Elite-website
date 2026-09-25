import "server-only";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { serviceRoleConfigured, supabaseAdmin } from "@/lib/supabase/admin";

/**
 * One Supabase Realtime subscription per server process on the client's
 * documents and profile, fanned out per customer through /api/me/live (SSE).
 */
export type PortalChange = {
  table: "portal_documents" | "profiles";
  type: "INSERT" | "UPDATE" | "DELETE";
  id: string;
  kind?: string;
  name?: string;
  status?: string | null;
};

type Listener = (e: PortalChange) => void;
type Hub = { byCustomer: Map<string, Set<Listener>>; channel: RealtimeChannel | null; status: string };

const g = globalThis as unknown as { __ebtPortalHub?: Hub };
const hub: Hub = (g.__ebtPortalHub ??= { byCustomer: new Map(), channel: null, status: "idle" });

function emit(customerId: string | undefined, e: PortalChange) {
  if (!customerId) return;
  for (const l of hub.byCustomer.get(customerId) ?? []) l(e);
}

function ensureChannel() {
  if (hub.channel || !serviceRoleConfigured()) return;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  hub.channel = supabaseAdmin()
    .channel("portal-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "portal_documents" }, (p) => {
      const row: any = p.eventType === "DELETE" ? p.old : p.new;
      emit(row?.customer_id, {
        table: "portal_documents",
        type: p.eventType as PortalChange["type"],
        id: row?.id ?? "",
        kind: row?.kind,
        name: row?.original_name,
        status: row?.status ?? null,
      });
    })
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles" }, (p) => {
      const row: any = p.new;
      emit(row?.id, { table: "profiles", type: "UPDATE", id: row?.id ?? "" });
    })
    .subscribe((status, err) => {
      hub.status = status;
      if (err) console.error("[portal-live] realtime:", err.message);
      if (status === "CLOSED" || status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        const old = hub.channel;
        hub.channel = null;
        if (old) supabaseAdmin().removeChannel(old).catch(() => {});
        if (hub.byCustomer.size) setTimeout(ensureChannel, 3000);
      }
    });
}

export function subscribeCustomer(customerId: string, listener: Listener) {
  let set = hub.byCustomer.get(customerId);
  if (!set) hub.byCustomer.set(customerId, (set = new Set()));
  set.add(listener);
  ensureChannel();
  return () => {
    set!.delete(listener);
    if (set!.size === 0) hub.byCustomer.delete(customerId);
  };
}

export const portalLiveStatus = () => hub.status;
