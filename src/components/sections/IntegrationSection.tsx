"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Bell, FileText, Mail, MessageSquareText, RefreshCw, ShoppingCart } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";

type Channel = "whatsapp" | "email";
const events: { kind: string; icon: typeof Bell; doc: string; channel: Channel; message: string }[] = [
  { kind: "Orders", icon: ShoppingCart, doc: "SO-2041 confirmed", channel: "whatsapp", message: "Your order SO-2041 is confirmed. We'll notify you when it's dispatched." },
  { kind: "Invoices", icon: FileText, doc: "INV-8831 · रु 1,24,300", channel: "email", message: "Invoice INV-8831 — रु 1,24,300 (PDF attached)" },
  { kind: "Notifications", icon: Bell, doc: "DN-1187 dispatched", channel: "whatsapp", message: "Good news — DN-1187 has been dispatched from our Kathmandu store." },
  { kind: "Updates", icon: RefreshCw, doc: "Payment received", channel: "email", message: "Payment of रु 1,24,300 received against INV-8831. Thank you!" },
  { kind: "Customer communication", icon: MessageSquareText, doc: "Follow-up message", channel: "whatsapp", message: "Namaste! Just checking in — is there anything else we can help you with?" },
];

// Geometry for the desktop diagram (viewBox matches the container's aspect ratio).
const W = 1000;
const H = 440;
const core = { x: 500, y: 220 };
const channelY: Record<Channel, number> = { email: 112, whatsapp: 330 };
const eventY = (i: number) => ((i + 0.5) / events.length) * H;
const inPath = (i: number) => `M 300 ${eventY(i)} C 390 ${eventY(i)}, 380 ${core.y}, ${core.x - 64} ${core.y}`;
const outPath = (c: Channel) => `M ${core.x + 64} ${core.y} C 600 ${core.y}, 560 ${channelY[c]}, 640 ${channelY[c]}`;

export function IntegrationSection() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "-15% 0px" });
  const [tick, setTick] = useState(events.length);

  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 2800);
    return () => window.clearInterval(id);
  }, [inView]);

  const idx = tick % events.length;
  const active = events[idx];
  const sent = (c: Channel) =>
    Array.from({ length: tick + 1 }, (_, k) => ({ ...events[k % events.length], id: k }))
      .filter((e) => e.channel === c)
      .slice(-2)
      .reverse();

  return (
    <section id="integrations" className="relative overflow-hidden bg-midnight-950 py-24 text-white sm:py-32">
      <div aria-hidden className="bg-grid-dark mask-fade-y pointer-events-none absolute inset-0" />
      <div className="container-x relative">
        <SectionHeading
          index="08"
          eyebrow="Communication"
          tone="dark"
          title="Reach customers right from the ERP."
          description="Send orders, invoices, notifications and updates over Email and WhatsApp — straight from the transaction, without copying anything into another app."
        />

        <div ref={root} className="mt-14 lg:mt-20">
          {/* Desktop diagram */}
          <div className="relative hidden aspect-[1000/440] w-full lg:block">
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden>
              {events.map((_, i) => (
                <path key={i} d={inPath(i)} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="1.2" />
              ))}
              {(["email", "whatsapp"] as Channel[]).map((c) => (
                <path key={c} d={outPath(c)} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="1.2" />
              ))}
              <motion.path
                key={`in-${tick}`}
                d={inPath(idx)}
                fill="none"
                stroke="#3FD6C4"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1, opacity: [1, 1, 0.35] }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              <motion.path
                key={`out-${tick}`}
                d={outPath(active.channel)}
                fill="none"
                stroke={active.channel === "whatsapp" ? "#25D366" : "#6B78F0"}
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.7, ease: "easeInOut" }}
              />
            </svg>

            {/* Events */}
            <ul className="absolute left-0 top-0 flex h-full w-[30%] flex-col justify-around">
              {events.map((e, i) => {
                const on = i === idx;
                return (
                  <li
                    key={e.kind}
                    className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-all duration-500 ${
                      on ? "border-teal-light/40 bg-white/[0.06]" : "border-white/[0.06] bg-transparent"
                    }`}
                  >
                    <e.icon className={`size-4 shrink-0 ${on ? "text-teal-light" : "text-white/35"}`} aria-hidden />
                    <div className="min-w-0">
                      <p className={`text-[13px] font-semibold ${on ? "text-white" : "text-white/55"}`}>{e.kind}</p>
                      <p className="truncate text-[11px] text-white/40">{e.doc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Core */}
            <div className="absolute left-1/2 top-1/2 grid size-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[28px] border border-white/10 bg-midnight-800 shadow-[0_0_80px_-12px_rgb(58_75_224/0.8)]">
              <Image src="/brand/tivora-symbol-white.svg" alt="" width={56} height={56} unoptimized />
              <span className="absolute -bottom-7 font-mono text-[10px] tracking-[0.22em] text-white/50">TIVORA ERP</span>
            </div>

            {/* Channels */}
            <div className="absolute right-0 top-[3%] h-[45%] w-[36%]">
              <EmailCard items={sent("email")} />
            </div>
            <div className="absolute bottom-[3%] right-0 h-[45%] w-[36%]">
              <WhatsAppCard items={sent("whatsapp")} />
            </div>
          </div>

          {/* Mobile / tablet stack */}
          <div className="flex flex-col items-center gap-4 lg:hidden">
            <div className="no-scrollbar -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4">
              {events.map((e, i) => (
                <span
                  key={e.kind}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors duration-500 ${
                    i === idx ? "border-teal-light/50 bg-teal/15 text-white" : "border-white/10 text-white/50"
                  }`}
                >
                  <e.icon className="size-3.5" aria-hidden /> {e.kind}
                </span>
              ))}
            </div>
            <div className="h-6 w-px bg-gradient-to-b from-transparent to-white/30" />
            <div className="grid size-20 place-items-center rounded-2xl border border-white/10 bg-midnight-800">
              <Image src="/brand/tivora-symbol-white.svg" alt="" width={40} height={40} unoptimized />
            </div>
            <div className="h-6 w-px bg-gradient-to-b from-white/30 to-transparent" />
            <div className="grid w-full gap-4 sm:grid-cols-2">
              <div className="h-56">
                <EmailCard items={sent("email")} />
              </div>
              <div className="h-56">
                <WhatsAppCard items={sent("whatsapp")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type Sent = (typeof events)[number] & { id: number };

function EmailCard({ items }: { items: Sent[] }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white text-midnight shadow-2xl">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <Mail className="size-4 text-indigo" aria-hidden />
        <p className="text-[13px] font-semibold">Email</p>
        <span className="ml-auto font-mono text-[10px] text-muted">customer inbox</span>
      </div>
      <ul className="relative flex-1 overflow-hidden p-2">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((m) => (
            <motion.li
              key={m.id}
              layout
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-1.5 rounded-lg px-2.5 py-2 odd:bg-indigo/[0.05]"
            >
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold">Your Company</p>
                <p className="font-mono text-[9.5px] text-muted">now</p>
              </div>
              <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-muted">{m.message}</p>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function WhatsAppCard({ items }: { items: Sent[] }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#efeae2] shadow-2xl">
      <div className="flex items-center gap-2 bg-[#075e54] px-4 py-2.5 text-white">
        <WhatsAppGlyph className="size-4" />
        <p className="text-[13px] font-semibold">WhatsApp</p>
        <span className="ml-auto font-mono text-[10px] text-white/60">customer chat</span>
      </div>
      <ul className="relative flex flex-1 flex-col-reverse overflow-hidden p-2.5">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((m) => (
            <motion.li
              key={m.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-1.5 ml-auto max-w-[88%] rounded-lg rounded-tr-none bg-[#d9fdd3] px-2.5 py-1.5 text-[11.5px] leading-snug text-[#111b21] shadow-sm"
            >
              {m.message}
              <span className="mt-0.5 block text-right text-[9px] text-[#667781]">now ✓✓</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
