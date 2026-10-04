import type { SVGProps } from "react";

/** Simple chat-bubble glyph used to denote WhatsApp (lucide no longer ships brand icons). */
export function WhatsAppGlyph({ className = "size-4", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M3.5 20.5 5 16.3A8.5 8.5 0 1 1 8 19.2Z" />
      <path d="M9 9.5c0 2.8 2.7 5.5 5.5 5.5l1.2-1.4-1.9-1-.9.8c-1-.4-2-1.4-2.4-2.4l.8-.9-1-1.9Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
