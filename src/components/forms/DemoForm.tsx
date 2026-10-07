"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONSENT_LABEL, site } from "@/content/site";

const TRADES = ["Jewellery", "Paint & Coatings", "FMCG", "Pharmacy", "Automobile", "Trading", "Manufacturing", "Other"];
const SLUG_TO_TRADE: Record<string, string> = {
  jewelry: "Jewellery",
  jewellery: "Jewellery",
  general: "Trading",
  trading: "Trading",
  paint: "Paint & Coatings",
  fmcg: "FMCG",
  automobile: "Automobile",
  pharma: "Pharmacy",
  pharmacy: "Pharmacy",
  manufacturing: "Manufacturing",
};

// The form is always a light card, so it reads the same on night and light sections.
const FIELD =
  "mt-1.5 block min-h-11 w-full rounded-md border border-rule bg-paper px-3 py-2.5 text-base text-ink placeholder:text-muted scheme-light";
const LABEL = "block text-small font-bold text-ink";

type Status = "idle" | "sending" | "sent" | "error";

const TIMELINE: [string, string][] = [["1m", "Within a month"], ["1-3m", "In 1 to 3 months"], ["exploring", "Just exploring"]];
const SIZE: [string, string][] = [["small", "1-10 staff, one location"], ["medium", "11-50 staff or 2-5 locations"], ["large", "50+ staff or many branches"]];
const SOFTWARE: [string, string][] = [["excel", "Excel or paper"], ["other-erp", "Another ERP or accounting software"], ["hitech", "A HiTech product"], ["none", "Nothing yet"]];

type Touch = { utm: { source: string; medium: string; campaign: string }; landing: string; referrer: string };

// First touch is kept for the browser session, so a lead is credited to the visit that brought them in.
function firstTouch(): Touch {
  try {
    const saved = sessionStorage.getItem("tv-first-touch");
    if (saved) return JSON.parse(saved) as Touch;
  } catch {}
  const q = new URLSearchParams(window.location.search);
  const touch: Touch = {
    utm: { source: q.get("utm_source") ?? "", medium: q.get("utm_medium") ?? "", campaign: q.get("utm_campaign") ?? "" },
    landing: window.location.pathname,
    referrer: document.referrer,
  };
  try {
    sessionStorage.setItem("tv-first-touch", JSON.stringify(touch));
  } catch {}
  return touch;
}

export function DemoForm() {
  const tradeSelect = useRef<HTMLSelectElement>(null);
  const startedAt = useRef(0);
  const touch = useRef<Touch | null>(null);
  // ?trade= is read on the client, so the static HTML still ships the whole form (no useSearchParams/Suspense bailout).
  useEffect(() => {
    const t = SLUG_TO_TRADE[new URLSearchParams(window.location.search).get("trade") ?? ""];
    if (t && tradeSelect.current) tradeSelect.current.value = t;
    startedAt.current = Date.now();
    touch.current = firstTouch();
  }, []);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const body = {
      name: get("name"),
      company: get("company"),
      industry: get("industry"),
      city: get("city"),
      phone: get("phone"),
      email: get("email"),
      message: get("message"),
      timeline: get("timeline"),
      businessSize: get("businessSize"),
      currentSoftware: get("currentSoftware"),
      marketingConsent: f.get("marketingConsent") === "on",
      consentText: "v1",
      website: get("website"),
      startedAt: startedAt.current,
      utm: touch.current?.utm ?? { source: "", medium: "", campaign: "" },
      landing: touch.current?.landing ?? "",
      referrer: touch.current?.referrer ?? "",
    };
    if (!body.name || (!body.phone && !body.email)) {
      setError("Please share your name and a phone number or email.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/demo/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "We couldn't send your request right now.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-lg bg-paper p-6 text-ink shadow-card">
        <h3>Thank you.</h3>
        <p className="mt-2">We will call you back.</p>
        {site.whatsappChannel && (
          <p className="mt-2">
            <a href={site.whatsappChannel} target="_blank" rel="noopener noreferrer" className="font-bold underline">
              Follow TiVora updates on WhatsApp
            </a>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative overflow-hidden rounded-lg bg-paper p-6 text-ink shadow-card sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="df-name" className={LABEL}>Your name</label>
          <input id="df-name" name="name" required autoComplete="name" maxLength={120} className={FIELD} />
        </div>
        <div>
          <label htmlFor="df-company" className={LABEL}>Business name</label>
          <input id="df-company" name="company" autoComplete="organization" maxLength={160} className={FIELD} />
        </div>
        <div>
          <label htmlFor="df-industry" className={LABEL}>Industry</label>
          <select ref={tradeSelect} id="df-industry" name="industry" defaultValue="" className={FIELD}>
            <option value="">Select an industry</option>
            {TRADES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="df-city" className={LABEL}>City</label>
          <input id="df-city" name="city" autoComplete="address-level2" maxLength={80} className={FIELD} />
        </div>
        <div>
          <label htmlFor="df-phone" className={LABEL}>Phone</label>
          <input id="df-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} className={FIELD} />
        </div>
        <div>
          <label htmlFor="df-email" className={LABEL}>Email</label>
          <input id="df-email" name="email" type="email" autoComplete="email" maxLength={160} className={FIELD} />
        </div>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        {(
          [
            ["timeline", "When are you planning to start?", TIMELINE],
            ["businessSize", "How big is your business?", SIZE],
            ["currentSoftware", "What do you use today?", SOFTWARE],
          ] as const
        ).map(([name, label, opts]) => (
          <div key={name}>
            <label htmlFor={`df-${name}`} className={LABEL}>{label}</label>
            <select id={`df-${name}`} name={name} defaultValue="" className={FIELD}>
              <option value="">Select (optional)</option>
              {opts.map(([v, text]) => (
                <option key={v} value={v}>{text}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <label htmlFor="df-message" className={LABEL}>Message</label>
        <textarea id="df-message" name="message" rows={4} maxLength={2000} autoComplete="off" className={FIELD} />
      </div>
      <label htmlFor="df-consent" className="mt-4 flex min-h-11 items-start gap-3 text-small text-ink">
        <input id="df-consent" name="marketingConsent" type="checkbox" className="mt-0.5 size-6 shrink-0 accent-accent" />
        <span>{CONSENT_LABEL}</span>
      </label>
      {/* Honeypot: off-screen, not display:none, so bots still fill it; people and screen readers never reach it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="df-website">Website</label>
        <input id="df-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <p className="mt-3 text-small text-muted">Phone or email is needed so we can reach you.</p>
      <noscript>
        <p className="mt-3 text-small font-bold">This form needs JavaScript. Please call or email us using the details on this page.</p>
      </noscript>

      {status === "error" && (
        <p role="alert" className="mt-4 rounded-md bg-tint p-3 text-small text-ink">
          {error} You can also call us on {site.phones.map((p) => p.label).join(", ")}.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-5 py-3 font-bold text-paper transition-colors duration-(--duration-fast) hover:bg-bronze disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? "Sending..." : "Request a demo"}
      </button>
    </form>
  );
}
