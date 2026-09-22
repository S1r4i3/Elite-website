import { site } from "@/lib/site";

/** Floating WhatsApp chat button (opens WhatsApp with a pre-filled message). */
export function WhatsAppButton() {
  const href = `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(site.whatsapp.message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on WhatsApp (${site.whatsapp.display})`}
      data-magnetic
      className="group fixed bottom-24 right-4 z-40 flex items-center gap-2 sm:bottom-6 sm:right-6"
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-navy-900 opacity-0 shadow-[var(--shadow-lift)] transition group-hover:translate-x-0 group-hover:opacity-100 sm:block">
        Chat with us
      </span>
      <span className="relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-6px_rgb(37_211_102/0.6)] transition group-hover:scale-105">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.4s]" aria-hidden />
        <svg viewBox="0 0 32 32" className="relative size-8" fill="currentColor" aria-hidden>
          <path d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.53 1.74 6.5L3 29l6.68-1.75A12.96 12.96 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.64c-2 0-3.95-.54-5.66-1.55l-.4-.24-3.96 1.04 1.06-3.86-.26-.4A10.62 10.62 0 0 1 5.38 16c0-5.87 4.78-10.64 10.66-10.64 5.87 0 10.64 4.77 10.64 10.64 0 5.88-4.77 10.64-10.64 10.64Zm5.84-7.97c-.32-.16-1.89-.93-2.18-1.04-.3-.1-.5-.16-.72.16-.21.32-.83 1.04-1.01 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59a9.62 9.62 0 0 1-1.78-2.2c-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.66 0 1.57 1.15 3.09 1.3 3.3.16.21 2.25 3.44 5.46 4.82.76.33 1.36.53 1.82.68.77.24 1.46.2 2.01.13.61-.1 1.89-.77 2.15-1.52.27-.74.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37Z" />
        </svg>
      </span>
    </a>
  );
}
