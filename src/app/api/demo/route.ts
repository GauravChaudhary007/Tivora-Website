import { NextResponse } from "next/server";

type DemoRequest = {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  industry?: string;
  city?: string;
  message?: string;
};

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
 */
export async function POST(request: Request) {
  let body: DemoRequest;
  try {
    body = await request.json();
    if (!body || typeof body !== "object") throw new Error("bad");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const lead = {
    name: clean(body.name, 120),
    company: clean(body.company, 160),
    phone: clean(body.phone, 40),
    email: clean(body.email, 160),
    industry: clean(body.industry, 60),
    city: clean(body.city, 80),
    message: clean(body.message, 2000, true),
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
