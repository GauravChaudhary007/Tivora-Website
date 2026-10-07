"use client";

import { useRef } from "react";
import { live, MOTION_QUERIES, useScene } from "@/lib/scene";

const FACTS = [
  "VAT on every line and every document, with Annex 9 and Annex 13 reports.",
  "TDS and income tax. Connected to IRD, with issued bills locked forever.",
  "Bikram Sambat and AD dates, and the Nepali fiscal year.",
  "Letters of credit with the register and margin held, trust receipt and short-term loans, bank limits with headroom, bank guarantees and foreign-currency settlement.",
  "Landed cost: freight, duty, clearing and bank charges allocated to item cost, estimate against actual.",
];
const HIDE = "inset(0% 100% 0% 0%)";
const SHOW = "inset(0% 0% 0% 0%)";

/** Scene 5. Giant "2083" fills gold with scroll (clip-path sweep), then the facts stack in. Desktop pinned 140%; mobile fills once on enter. */
export function NepalScene() {
  const root = useRef<HTMLElement>(null);
  useScene(root, (g) => {
    const { gsap, ScrollTrigger } = g;
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      const fill = q("[data-fill]");
      mm.add(MOTION_QUERIES.desktop, () => {
        const off = live(root.current);
        const facts = q("[data-fact]");
        gsap.set(fill, { clipPath: HIDE });
        gsap.set(q("[data-facts]"), { opacity: 0 });
        gsap.set(facts, { opacity: 0, y: 24 });
        const tl = gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: "+=140%", pin: true, anticipatePin: 1, scrub: 1 },
          })
          .to(fill, { clipPath: SHOW, duration: 0.5 }, 0)
          .to(q("[data-mega]"), { yPercent: -40, opacity: 0, duration: 0.15 }, 0.5)
          .to(q("[data-facts]"), { opacity: 1, duration: 0.1 }, 0.5);
        facts.forEach((f, i) => tl.to(f, { opacity: 1, y: 0, duration: 0.1 }, 0.55 + i * 0.12));
        tl.to({}, { duration: 0.1 }, 0.9);
        return off;
      });
      mm.add(MOTION_QUERIES.mobile, () => {
        gsap.set(fill, { clipPath: HIDE });
        ScrollTrigger.create({
          trigger: fill[0],
          start: "top 85%",
          once: true,
          onEnter: () => gsap.to(fill, { clipPath: SHOW, duration: 1.2, ease: "expo.out" }),
        });
      });
    return () => mm.revert();
  });

  return (
    <section id="tour-nepal" ref={root} data-tone="night" className="overflow-hidden bg-night text-ground scheme-dark">
      <div data-pin="" className="flex flex-col justify-center py-section lg:in-data-live:h-svh lg:in-data-live:py-0">
        <div className="container-x lg:in-data-live:grid">
          <div data-mega="" className="lg:in-data-live:col-start-1 lg:in-data-live:row-start-1 lg:in-data-live:self-center">
            <div className="relative font-display text-mega font-semibold">
              <span aria-hidden="true" className="block text-night-3">
                2083
              </span>
              <span data-fill="" className="absolute inset-0 text-gold">
                2083
              </span>
            </div>
            <p className="mt-4 font-mono text-small font-medium text-muted-dark">2083-06-14 BS · 2026-09-30 AD</p>
          </div>
          <div data-facts="" className="mt-stack-lg lg:in-data-live:col-start-1 lg:in-data-live:row-start-1 lg:in-data-live:mt-0 lg:in-data-live:self-center">
            <h2 className="max-w-3xl">Ready for Nepal: tax, trade, finance and import costing.</h2>
            <ul className="mt-stack max-w-3xl divide-y divide-rule-dark border-y border-rule-dark">
              {FACTS.map((t) => (
                <li key={t} data-fact="" className="py-4 text-lead">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
