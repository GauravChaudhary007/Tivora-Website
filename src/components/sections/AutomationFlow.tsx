"use client";

import { useRef } from "react";
import { CheckCheck, FileText, MousePointer2, Receipt, ShoppingCart, Truck } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, MOTION_QUERIES } from "@/lib/gsap";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";

const steps = [
  { icon: ShoppingCart, title: "Sales Order", text: "Captured once — customer, items, prices, tax." },
  { icon: Truck, title: "Delivery Note", text: "One click. Everything carries forward to dispatch." },
  { icon: Receipt, title: "Invoice", text: "One click. Invoice posts with tax, ready for accounts." },
  { icon: WhatsAppGlyph, title: "WhatsApp", text: "One click. Your customer receives it instantly." },
];

const docs = [
  { label: "Sales Order", no: "SO-2041", status: "Confirmed", btn: "Convert to Delivery Note" },
  { label: "Delivery Note", no: "DN-1187", status: "Dispatched", btn: "Generate Invoice" },
  { label: "Tax Invoice", no: "INV-8831", status: "Posted", btn: "Send on WhatsApp" },
];

const items = [
  { name: "Item SKU-1042", qty: 24, rate: 2500 },
  { name: "Item SKU-2210", qty: 16, rate: 1875 },
  { name: "Item SKU-0388", qty: 8, rate: 2500 },
];

/** Children stacked in one grid cell so swapping them never shifts layout. */
const stack = "[grid-area:1/1]";

export function AutomationFlow() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const build = (tl: gsap.core.Timeline) => {
        const q = gsap.utils.selector(root);
        const click = (i: number) => {
          tl.to(q("[data-a='cursor']"), { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "power2.inOut" })
            .to(q("[data-a='btn']"), { scale: 0.95, duration: 0.1 })
            .to(q("[data-a='btn']"), { scale: 1, duration: 0.15 })
            .fromTo(q("[data-a='flash']"), { opacity: 0.9, scale: 1 }, { opacity: 0, scale: 1.04, duration: 0.6 }, "<")
            .to(q("[data-a='cursor']"), { x: 60, y: 50, opacity: 0, duration: 0.4 }, "<+0.1");
          // swap the document identity
          const out = `[data-stage='${i}']`;
          const inn = `[data-stage='${i + 1}']`;
          tl.to(q(out), { opacity: 0, y: -8, duration: 0.35 }, "<")
            .fromTo(q(inn), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, "<+0.15")
            .to(q("[data-a='progress']"), { scaleY: (i + 1) / 3, duration: 0.5, ease: "power2.inOut" }, "<")
            .to(q(`[data-step='${i + 1}']`), { opacity: 1, duration: 0.3 }, "<")
            .to(q(`[data-step-dot='${i + 1}']`), { backgroundColor: "#12A594", borderColor: "#12A594", color: "#fff", duration: 0.3 }, "<");
        };

        tl.set(q("[data-a='cursor']"), { x: 120, y: 90, opacity: 0 });
        click(0);
        tl.to(q("[data-a='carried']"), { opacity: 1, duration: 0.4 }, "<+0.2");
        tl.to({}, { duration: 0.4 });
        click(1);
        tl.to({}, { duration: 0.4 });
        // final click: send on WhatsApp
        tl.to(q("[data-a='cursor']"), { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "power2.inOut" })
          .to(q("[data-a='btn']"), { scale: 0.95, duration: 0.1 })
          .to(q("[data-a='btn']"), { scale: 1, duration: 0.15 })
          .to(q("[data-a='cursor']"), { x: 60, y: 50, opacity: 0, duration: 0.4 })
          .to(q("[data-a='progress']"), { scaleY: 1, duration: 0.5 }, "<")
          .to(q("[data-step='3']"), { opacity: 1, duration: 0.3 }, "<")
          .to(q("[data-step-dot='3']"), { backgroundColor: "#25D366", borderColor: "#25D366", color: "#fff", duration: 0.3 }, "<")
          .fromTo(q("[data-a='phone']"), { opacity: 0, x: 50, rotate: 4 }, { opacity: 1, x: 0, rotate: 0, duration: 0.8, ease: "expo.out" }, "<")
          .fromTo(q("[data-a='bubble']"), { opacity: 0, scale: 0.85, y: 12 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }, "-=0.3")
          .to(q("[data-a='ticks']"), { color: "#53bdeb", duration: 0.3 }, "+=0.3")
          .to({}, { duration: 0.6 });
        return tl;
      };

      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop, () => {
        build(
          gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: "[data-a='pin']",
              start: "top top",
              end: "+=2200",
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
            },
          }),
        );
      });
      mm.add(MOTION_QUERIES.mobile, () => {
        const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2, defaults: { ease: "power2.out" } });
        build(tl);
        ScrollTrigger.create({ trigger: "[data-a='stage']", start: "top 75%", once: true, onEnter: () => tl.play() });
      });
      mm.add(MOTION_QUERIES.reduce, () => {
        build(gsap.timeline()).progress(1);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="automation" className="relative bg-paper">
      <div data-a="pin" className="flex min-h-screen items-center overflow-hidden py-24 lg:py-0">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Narrative */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
              <span className="text-muted/70">06 — </span>Automation
            </p>
            <h2 className="mt-4 text-balance text-[2rem] font-semibold leading-[1.06] tracking-[-0.03em] text-midnight sm:text-[2.6rem] lg:text-[3.2rem]">
              From order to invoice — automatically.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              Enter a transaction once. Every next document is one click away — with nothing typed twice.
            </p>

            <ol className="relative mt-10 space-y-6">
              <span className="absolute bottom-4 left-[17px] top-4 w-px bg-line" aria-hidden />
              <span
                data-a="progress"
                className="absolute bottom-4 left-[17px] top-4 w-px origin-top scale-y-0 bg-gradient-to-b from-teal to-whatsapp"
                aria-hidden
              />
              {steps.map((s, i) => (
                <li key={s.title} data-step={i} className={`relative flex gap-4 ${i === 0 ? "" : "opacity-40"}`}>
                  <span
                    data-step-dot={i}
                    className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-full border ${
                      i === 0 ? "border-teal bg-teal text-white" : "border-line bg-white text-midnight"
                    }`}
                  >
                    <s.icon className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold text-midnight">{s.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Stage */}
          <div data-a="stage" className="relative mx-auto w-full max-w-[600px] pb-28 sm:pb-16 lg:pb-0 lg:pr-24">
            <div className="frame-light relative rounded-3xl p-5 sm:p-7">
              <span data-a="flash" className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 ring-2 ring-teal" aria-hidden />

              <div className="flex items-start justify-between gap-4">
                <div className="grid">
                  {docs.map((d, i) => (
                    <div key={d.no} data-stage={i} className={`${stack} ${i ? "opacity-0" : ""}`}>
                      <p className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-teal">
                        <FileText className="size-3.5" aria-hidden /> {d.label}
                      </p>
                      <p className="mt-1 text-2xl font-bold tracking-tight text-midnight sm:text-3xl">{d.no}</p>
                    </div>
                  ))}
                </div>
                <div className="grid justify-items-end">
                  {docs.map((d, i) => (
                    <span
                      key={d.status}
                      data-stage={i}
                      className={`${stack} rounded-full bg-teal/10 px-2.5 py-1 text-[11px] font-semibold text-teal ${i ? "opacity-0" : ""}`}
                    >
                      {d.status}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-y border-line py-4 text-[12.5px]">
                <div>
                  <p className="text-muted">Customer</p>
                  <p className="font-semibold text-midnight">Everest Traders</p>
                  <p className="text-muted">Kathmandu</p>
                </div>
                <div className="text-right">
                  <p className="text-muted">Branch</p>
                  <p className="font-semibold text-midnight">Kathmandu</p>
                  <p className="text-muted">Main store</p>
                </div>
              </div>

              <div className="relative">
                <span
                  data-a="carried"
                  className="absolute right-0 top-0 -translate-y-1/2 rounded-full bg-midnight px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-teal-light opacity-0"
                >
                  Carried forward · 0 re-entry
                </span>
                <table className="mt-6 w-full text-[12.5px]">
                  <thead>
                    <tr className="text-left text-[11px] text-muted">
                      <th className="pb-2 font-medium">Item</th>
                      <th className="pb-2 text-right font-medium">Qty</th>
                      <th className="pb-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-midnight">
                    {items.map((it) => (
                      <tr key={it.name} className="border-t border-line/70">
                        <td className="py-2 font-medium">{it.name}</td>
                        <td className="py-2 text-right tabular-nums">{it.qty}</td>
                        <td className="py-2 text-right tabular-nums">{new Intl.NumberFormat("en-IN").format(it.qty * it.rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[13px]">
                <span className="text-muted">Total incl. 13% VAT</span>
                <span className="text-lg font-bold tabular-nums text-midnight">रु 1,24,300</span>
              </div>

              <div className="relative mt-5">
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  data-a="btn"
                  className="grid h-11 w-full place-items-center rounded-xl bg-midnight text-sm font-semibold text-white"
                >
                  {docs.map((d, i) => (
                    <span key={d.btn} data-stage={i} className={`${stack} flex items-center gap-2 ${i ? "opacity-0" : ""}`}>
                      {i === 2 && <WhatsAppGlyph className="size-4 text-whatsapp" />}
                      {d.btn}
                      <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-widest text-teal-light">
                        1 click
                      </span>
                    </span>
                  ))}
                </button>
                <MousePointer2
                  data-a="cursor"
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 size-6 fill-white text-midnight opacity-0 drop-shadow-md"
                />
              </div>
            </div>

            {/* Customer's phone */}
            <div
              data-a="phone"
              className="absolute -bottom-2 right-0 w-[230px] opacity-0 sm:-right-4 lg:-right-2 lg:bottom-[-40px]"
            >
              <div className="overflow-hidden rounded-[26px] border-[6px] border-midnight bg-[#efeae2] shadow-2xl">
                <div className="flex items-center gap-2 bg-[#075e54] px-3 py-2.5 text-white">
                  <span className="grid size-7 place-items-center rounded-full bg-white/20 text-[11px] font-bold">YC</span>
                  <div className="leading-tight">
                    <p className="text-[12px] font-semibold">Your Company</p>
                    <p className="text-[9.5px] text-white/70">Business account</p>
                  </div>
                </div>
                <div className="space-y-2 p-2.5">
                  <div data-a="bubble" className="ml-auto max-w-[92%] rounded-lg rounded-tr-none bg-[#d9fdd3] p-2 text-[11px] leading-snug text-[#111b21] shadow-sm">
                    <div className="mb-1.5 flex items-center gap-2 rounded-md bg-white/70 p-1.5">
                      <span className="grid size-7 place-items-center rounded bg-rose-500 text-[8px] font-bold text-white">PDF</span>
                      <span className="font-semibold">INV-8831.pdf</span>
                    </div>
                    Namaste! Your invoice INV-8831 for रु 1,24,300 is ready. Thank you for your business.
                    <span className="mt-0.5 flex items-center justify-end gap-0.5 text-[9px] text-[#667781]">
                      10:42
                      <CheckCheck data-a="ticks" className="size-3.5 text-[#8696a0]" aria-hidden />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
