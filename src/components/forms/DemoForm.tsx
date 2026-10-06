"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { site } from "@/content/site";

const TRADES = ["Jewelry", "General trading", "Paint", "FMCG", "Automobile", "Home Appliances", "Pharma", "Other"];
const SLUG_TO_TRADE: Record<string, string> = {
  jewelry: "Jewelry",
  general: "General trading",
  paint: "Paint",
  fmcg: "FMCG",
  automobile: "Automobile",
  "home-appliances": "Home Appliances",
  pharma: "Pharma",
};

// The form is always a light card, so it reads the same on night and light sections.
const FIELD =
  "mt-1.5 block min-h-11 w-full rounded-md border border-rule bg-paper px-3 py-2.5 text-base text-ink placeholder:text-muted scheme-light";
const LABEL = "block text-small font-bold text-ink";

type Status = "idle" | "sending" | "sent" | "error";

function Form() {
  const trade = SLUG_TO_TRADE[useSearchParams().get("trade") ?? ""] ?? "";
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
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-lg bg-paper p-6 text-ink shadow-card sm:p-8">
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
          <label htmlFor="df-industry" className={LABEL}>Trade</label>
          <select id="df-industry" name="industry" defaultValue={trade} className={FIELD}>
            <option value="">Select a trade</option>
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
      <div className="mt-5">
        <label htmlFor="df-message" className={LABEL}>Message</label>
        <textarea id="df-message" name="message" rows={4} maxLength={2000} autoComplete="off" className={FIELD} />
      </div>
      <p className="mt-3 text-small text-muted">Phone or email is needed so we can reach you.</p>

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

export function DemoForm() {
  return (
    <Suspense fallback={null}>
      <Form />
    </Suspense>
  );
}
