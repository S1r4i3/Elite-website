import "server-only";
import type { Lead } from "@/lib/db/types";

/**
 * Integration hook for new leads. Wire this to your CRM, email (e.g. Resend/SES),
 * SMS (e.g. Twilio) or automation platform. Failures never block the user's submission.
 */
export async function onLeadCreated(lead: Lead) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) {
    if (process.env.NODE_ENV !== "production") console.info(`[lead] ${lead.id} ${lead.service} ${lead.email}`);
    return;
  }
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: "lead.created", lead }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error("[lead] webhook failed", err);
  }
}

/** Sends new pop-up inquiries to the same webhook (if configured). */
export async function onInquiryCreated(inquiry: import("@/lib/db/types").Inquiry) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) {
    if (process.env.NODE_ENV !== "production") console.info(`[inquiry] ${inquiry.name} ${inquiry.phone}`);
    return;
  }
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: "inquiry.created", inquiry }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error("[inquiry] webhook failed", err);
  }
}
