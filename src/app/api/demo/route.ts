import { NextResponse } from "next/server";

type DemoRequest = {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  industry?: string;
  city?: string;
  message?: string;
  timeline?: string;
  businessSize?: string;
  currentSoftware?: string;
  marketingConsent?: unknown;
  consentText?: string;
  website?: string;
  startedAt?: unknown;
  utm?: { source?: string; medium?: string; campaign?: string };
  landing?: string;
  referrer?: string;
};

// Unknown or blank choices become "" so old payloads (without these keys) still validate.
const pick = (v: unknown, allowed: string[]) => (typeof v === "string" && allowed.includes(v) ? v : "");

// Trust boundary: cap length, drop control characters (newlines only survive in the message)
// and angle brackets, so nothing HTML-like or header-like reaches the webhook or a mail.
const clean = (v: unknown, max = 300, multiline = false) =>
  typeof v === "string"
    ? v
        .replace(multiline ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, " ")
        .replace(/[<>]/g, "")
        .trim()
        .slice(0, max)
    : "";

/**
 * Receives "Book a Demo" requests and forwards them to DEMO_WEBHOOK_URL
 * (e.g. a CRM, Zapier/Make hook, or an internal endpoint).
 *
 * Docker twin, deliberately a thin forwarder: scoring, the Excel sheet, Teams and email lists
 * live in the PHP handler (deploy/static/api/demo). Keep the payload contract in lockstep.
 */
export async function POST(request: Request) {
  let body: DemoRequest;
  try {
    body = await request.json();
    if (!body || typeof body !== "object") throw new Error("bad");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Pretend success, forward nothing.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const utm = body.utm && typeof body.utm === "object" ? body.utm : {};
  const startedAt = typeof body.startedAt === "number" && Number.isFinite(body.startedAt) ? Math.trunc(body.startedAt) : 0;
  const lead = {
    name: clean(body.name, 120),
    company: clean(body.company, 160),
    phone: clean(body.phone, 40),
    email: clean(body.email, 160),
    industry: clean(body.industry, 60),
    city: clean(body.city, 80),
    message: clean(body.message, 2000, true),
    timeline: pick(body.timeline, ["1m", "1-3m", "exploring"]),
    businessSize: pick(body.businessSize, ["small", "medium", "large"]),
    currentSoftware: pick(body.currentSoftware, ["excel", "other-erp", "hitech", "none"]),
    marketingConsent: body.marketingConsent === true,
    consentText: clean(body.consentText, 20),
    startedAt,
    utm: { source: clean(utm.source, 100), medium: clean(utm.medium, 100), campaign: clean(utm.campaign, 150) },
    landing: clean(body.landing, 200),
    referrer: clean(body.referrer, 300),
    source: "tivora-website",
    receivedAt: new Date().toISOString(),
  };

  if (!lead.name || (!lead.phone && !lead.email)) {
    return NextResponse.json({ error: "Please share your name and a phone number or email." }, { status: 422 });
  }

  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }

  const webhook = process.env.DEMO_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ error: "Online requests aren't switched on yet. Please call us or email info@hitechnepal.com.np." }, { status: 503 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch {
    return NextResponse.json({ error: "We couldn't send your request right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
