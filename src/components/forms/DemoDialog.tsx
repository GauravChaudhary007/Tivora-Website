"use client";

import { useEffect, useRef, useState } from "react";
import { DemoForm } from "./DemoForm";

/**
 * Every link to /contact/ opens the demo form in a native <dialog> instead of leaving the page.
 * The link still works without JS, with modifier keys (new tab) and on /contact/ itself.
 */
export function DemoDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [trade, setTrade] = useState<string | null>(null); // null = closed, so the form mounts fresh each open

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.target === "_blank") return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || url.pathname !== "/contact/" || location.pathname === "/contact/") return;
      // Capture phase + stopPropagation: next/link's own click handler would otherwise route to /contact/.
      e.preventDefault();
      e.stopPropagation();
      opener.current = a;
      setTrade(url.searchParams.get("trade") ?? "");
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (trade !== null && !dialog.current?.open) dialog.current?.showModal();
  }, [trade]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="demo-dialog-title"
      onClose={() => {
        setTrade(null);
        opener.current?.focus();
      }}
      onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      className="m-auto max-h-[92svh] w-[min(42rem,calc(100vw-2rem))] overflow-y-auto rounded-xl bg-ground p-0 text-ink shadow-frame backdrop:bg-night/70 backdrop:backdrop-blur-sm"
    >
      {trade !== null && (
        <div className="p-5 sm:p-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 id="demo-dialog-title" className="text-h3">Request a demo</h2>
              <p className="mt-1 text-small text-muted">Tell us about your business and we will call you back.</p>
            </div>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-rule hover:bg-tint"
            >
              <svg viewBox="0 0 24 24" className="size-5 stroke-current" fill="none" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <DemoForm trade={trade || undefined} />
        </div>
      )}
    </dialog>
  );
}
