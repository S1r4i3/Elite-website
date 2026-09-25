import "server-only";

/** Formspree endpoint for the "Subscribe" pop-up. Override with FORMSPREE_ENDPOINT. */
export const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT || "https://formspree.io/f/mrpblawa";

/** Forwards a submission to Formspree (which emails it to you). Throws on failure. */
export async function sendToFormspree(fields: Record<string, string | null | undefined>) {
  const body: Record<string, string> = {};
  for (const [k, v] of Object.entries(fields)) if (v) body[k] = v;
  const res = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Formspree ${res.status}: ${detail.slice(0, 300)}`);
  }
}
