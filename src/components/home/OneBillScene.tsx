"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";
import { centre, collapse, H, ORDER } from "./world";

const BEATS = [
  {
    tag: "Counter",
    title: "A bill at the counter.",
    body: "Sales & Accounts Receivable: billing at the counter, orders and estimates, receipts, and what customers owe.",
    card: ["Sales & Accounts Receivable", "Bill raised."],
  },
  {
    tag: "Godown",
    title: "The stock moves with it.",
    body: "Store & Inventory: items, today's rate, where stock is, and everything that moves it. FIFO, LIFO, moving average or board-rate valuation.",
    card: ["Store & Inventory", "Stock moves with it."],
  },
  {
    tag: "Floor",
    title: "The floor knows what to make.",
    body: "Production Plan & Manufacturing: BOMs, production plans and orders, material to the floor, receipts costed batch by batch, variance and the Production Journal.",
    card: ["Production Plan & Manufacturing", "Material to the floor."],
  },
  {
    tag: "Ledger",
    title: "And the ledger already has it.",
    body: "Finance & Accounts, Tax & IRD: true double-entry, VAT worked out on each line and gathered into the VAT books, Annex 9 and Annex 13.",
    card: ["Finance & Accounts, Tax & IRD", "Double-entry and the VAT books."],
  },
];
const ZOOM = 1.35;
const lift = H + 95;

/** Scene 1. children = <IsoWorld props />. Desktop 400% pinned scrub, mobile 250%; reduced motion: the final state plus a numbered list. */
export function OneBillScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean; mobile: boolean };
        const q = gsap.utils.selector(root);
        const cam = q("[data-cam]");
        const ds = ORDER.map((k) => q(`[data-d=${k}]`)[0]);
        const links = q("[data-link]");
        const chip = q("[data-chip]");
        const caps = q("[data-cap]");
        const cards = q("[data-card]");
        const at = (k: (typeof ORDER)[number]) => ({ x: centre(k, lift)[0], y: centre(k, lift)[1] });

        gsap.set(cam, { svgOrigin: "0 0" });
        ORDER.forEach((k, i) => gsap.set(ds[i], { ...collapse(k), opacity: i === 0 ? 1 : 0.35 }));
        gsap.set(q("[data-props]"), { opacity: 0 });
        gsap.set(links, { strokeDashoffset: 1 });
        gsap.set(chip, { ...at("counter"), opacity: 0 });
        gsap.set([...caps, ...cards], { opacity: 0, y: 24 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: desktop ? "+=400%" : "+=250%", pin: true, scrub: 0.6 },
        });
        const swap = (i: number, t: number) => {
          [caps, cards].forEach((set) => {
            if (i > 0) tl.to(set[i - 1], { opacity: 0, y: -24, duration: 0.25 }, t);
            tl.to(set[i], { opacity: 1, y: 0, duration: 0.35 }, t + 0.25);
          });
        };
        tl.to(ds, { x: 0, y: 0, duration: 0.5 }, 0).to(q("[data-props]"), { opacity: 1, duration: 0.5 }, 0.15).to(chip, { opacity: 1, duration: 0.3 }, 0.1);
        ORDER.forEach((k, i) => {
          const c = centre(k, H + 30);
          tl.to(cam, { x: -c[0] * ZOOM, y: -c[1] * ZOOM, scale: ZOOM, duration: 0.5 }, i);
          ds.forEach((d, j) => tl.to(d, { opacity: j === i ? 1 : 0.35, duration: 0.3 }, i + 0.1));
          if (i > 0) tl.to(links[i - 1], { strokeDashoffset: 0, duration: 0.5 }, i).to(chip, { ...at(k), duration: 0.5 }, i);
          swap(i, i + 0.05);
        });
        tl.to(cam, { x: 0, y: 0, scale: 1, duration: 1 }, 4)
          .to(ds, { opacity: 1, duration: 0.5 }, 4)
          .to(links[3], { strokeDashoffset: 0, duration: 0.5 }, 4.2)
          .to(caps[3], { opacity: 0, y: -24, duration: 0.25 }, 4)
          .to(cards[3], { opacity: 0, y: -24, duration: 0.25 }, 4)
          .to(caps[4], { opacity: 1, y: 0, duration: 0.35 }, 4.3)
          .to({}, { duration: 0.6 }, 5);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-tone="night" className="bg-night text-ground scheme-dark">
      <div data-pin="" className="flex items-center py-section-sm motion-safe:h-svh motion-safe:overflow-hidden motion-safe:pt-header motion-safe:pb-20 lg:py-section lg:motion-safe:pb-0">
        <div className="container-x grid items-center gap-stack lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-eyebrow font-medium text-gold uppercase motion-reduce:mb-6">Follow one bill</p>
            <ol className="mt-4 list-none motion-safe:grid motion-reduce:space-y-stack">
              {BEATS.map((b, i) => (
                <li
                  key={b.tag}
                  data-cap=""
                  className="motion-safe:col-start-1 motion-safe:row-start-1 motion-safe:opacity-0 motion-safe:first:opacity-100"
                >
                  <p className="font-mono text-eyebrow font-medium text-gold uppercase">
                    {i + 1} · {b.tag}
                  </p>
                  <h2 className="mt-3 motion-reduce:text-h3">{b.title}</h2>
                  <p className="mt-3 text-lead text-muted-dark">{b.body}</p>
                </li>
              ))}
              <li data-cap="" className="motion-safe:col-start-1 motion-safe:row-start-1 motion-safe:opacity-0">
                <h2 className="motion-reduce:text-h3">Typed once. Every number agrees.</h2>
              </li>
            </ol>
          </div>
          <div className="relative order-first lg:order-last lg:col-span-7">
            {children}
            {BEATS.map((b) => (
              <div
                key={b.tag}
                data-card=""
                className="absolute top-0 right-0 hidden w-60 rounded-lg border border-rule-dark bg-night-2 p-4 opacity-0 lg:motion-safe:block"
              >
                <p className="font-mono text-eyebrow font-medium text-gold uppercase">{b.tag}</p>
                <p className="mt-1 font-bold">{b.card[0]}</p>
                <p className="mt-1 text-small text-muted-dark">{b.card[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
