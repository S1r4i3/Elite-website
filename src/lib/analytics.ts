/**
 * Tiny analytics helper. Sends GA4 events only when NEXT_PUBLIC_GA_ID is set and gtag has loaded;
 * otherwise it does nothing, so the site never waits on analytics.
 *
 * Events: generate_lead, contact_form_submit, consultation_request, phone_click, email_click,
 * whatsapp_click, get_started, service_page_view, sign_up.
 */
type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Creates the standard gtag queue once; gtag.js (loaded later) reads it, so early events are kept. */
export function ensureGtag() {
  if (typeof window === "undefined" || !GA_ID) return false;
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
  }
  return true;
}

export function track(event: string, params: Params = {}) {
  if (!ensureGtag()) return;
  try {
    window.gtag!("event", event, params);
  } catch {
    /* analytics must never break the page */
  }
}
