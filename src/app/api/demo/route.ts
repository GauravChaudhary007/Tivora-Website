import { NextResponse } from "next/server";

type DemoRequest = {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  industry?: string;
  message?: string;
};

const clean = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Receives "Book a Demo" requests and forwards them to DEMO_WEBHOOK_URL
 * (e.g. a CRM, Zapier/Make hook, or an internal endpoint).
 */
export async function POST(request: Request) {
  let body: DemoRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const lead = {
    name: clean(body.name, 120),
    company: clean(body.company, 160),
    phone: clean(body.phone, 40),
    email: clean(body.email, 160),
    industry: clean(body.industry, 60),
    message: clean(body.message, 2000),
    source: "tivora-website",
    receivedAt: new Date().toISOString(),
  };

  if (!lead.name || (!lead.phone && !lead.email)) {
    return NextResponse.json({ error: "Please share your name and a phone number or email." }, { status: 422 });
  }

  const webhook = process.env.DEMO_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ error: "Online booking isn't configured yet." }, { status: 503 });
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
