import { getCurrentCustomer } from "@/lib/current-customer";
import { portalLiveStatus, subscribeCustomer, type PortalChange } from "@/lib/live";
import { serviceRoleConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/me/live — Server-Sent Events: changes to the signed-in client's documents and profile. */
export async function GET(req: Request) {
  const customer = await getCurrentCustomer();
  if (!customer) return new Response("Unauthorized", { status: 401 });
  if (!serviceRoleConfigured()) return new Response("Live updates are not configured", { status: 503 });

  const enc = new TextEncoder();
  let cleanup = () => {};
  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          cleanup();
        }
      };
      const unsubscribe = subscribeCustomer(customer.id, (e: PortalChange) => send("change", e));
      const ping = setInterval(() => send("ping", { status: portalLiveStatus() }), 20000);
      send("hello", { status: portalLiveStatus() });
      cleanup = () => {
        clearInterval(ping);
        unsubscribe();
      };
      req.signal.addEventListener("abort", () => {
        cleanup();
        try {
          controller.close();
        } catch {}
      });
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    },
  });
}
