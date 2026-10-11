import { site } from "@/content/site";

/** Permanent chat button, bottom right on every page. Opens WhatsApp in a new tab. */
export function WhatsAppButton() {
  return (
    <a
      href={site.whatsapp.href}
      target="_blank"
      rel="noopener"
      aria-label={`Chat with us on WhatsApp, ${site.whatsapp.label}`}
      className="fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-frame transition-transform duration-(--duration-fast) hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <svg viewBox="0 0 24 24" className="size-8" fill="currentColor" aria-hidden="true">
        <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.300.5 1.700.6.7.2 1.400.2 1.900.1.600-.1 1.800-.7 2-1.400.3-.7.3-1.300.2-1.400-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.600 15L2 22l5.200-1.400A10 10 0 1 0 12 2zm0 18.200c-1.500 0-3-.4-4.200-1.200l-.3-.2-3.100.8.8-3-.2-.3A8.200 8.200 0 1 1 12 20.200z" />
      </svg>
    </a>
  );
}
