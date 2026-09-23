import "server-only";
import type { Customer, Lead, PortalDocument } from "@/lib/db/types";
import { sendDocumentSharedEmail, sendInquiryAlertEmail } from "@/lib/email";
import { appUrl } from "@/lib/app-url";

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
  void sendInquiryAlertEmail(inquiry).catch((err) => console.error("[inquiry] alert email failed", err));
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

/** Emails a client when the tax team shares a draft estimation or final document with them. */
export async function onDocumentShared(customer: Customer, doc: PortalDocument) {
  if (doc.kind !== "draft" && doc.kind !== "final") return;
  try {
    await sendDocumentSharedEmail(customer.email, {
      name: customer.firstName,
      kind: doc.kind,
      fileName: doc.originalName,
      note: doc.note,
      link: `${appUrl()}/dashboard/${doc.kind === "draft" ? "draft-estimation" : "final-documents"}`,
    });
  } catch (err) {
    console.error("[document] share email failed", err);
  }
}
