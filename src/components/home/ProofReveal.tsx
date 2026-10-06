"use client";

import { useRef, type ReactNode } from "react";
import { Screen } from "@/components/ui/Screen";
import { DEMO_CAPTION } from "@/content/site";
import { gsap, live, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { centre, H } from "./world";

const Z = 12;
const FROM = "inset(34% 34% 34% 34% round 32%)"; // a rounded square, the module shape
const TO = "inset(-12% -12% -12% -12% round 0%)"; // beyond the box so the frame shadow survives

/** Scene 2. children = <IsoWorld />. Desktop: the ledger slab floods the screen, then a rounded-square mask opens onto the real Home screen. */
export function ProofReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      const frame = q("[data-frame]");
      mm.add(MOTION_QUERIES.desktop, () => {
        const off = live(root.current);
        const c = centre("ledger", H);
        gsap.set(q("[data-cam]"), { svgOrigin: "0 0" });
        gsap.set(frame, { clipPath: FROM, autoAlpha: 0 });
        // Hand-off from Scene 1: the world (props, lit links, parked chip = Scene 1's end state) fades in on the night ground, then the props clear so the slab fills the screen.
        gsap.set(q("[data-world-inner]"), { opacity: 0 });
        gsap.set(q("[data-tone-night]"), { display: "block" });
        gsap.set(q("[data-copy]"), { opacity: 0, y: 24 });
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: "+=140%", pin: true, scrub: 0.6 },
          })
          .to(q("[data-world-inner]"), { opacity: 1, duration: 0.12 }, 0)
          .to([...q("[data-props]"), ...q("[data-chip]"), ...q("[data-link]")], { opacity: 0, duration: 0.2 }, 0.1)
          .to(q("[data-cam]"), { x: -c[0] * Z, y: -c[1] * Z, scale: Z, ease: "power2.in", duration: 0.45 }, 0)
          .set(frame, { autoAlpha: 1 }, 0.4)
          .to(frame, { clipPath: TO, duration: 0.4 }, 0.4)
          .to(q("[data-world]"), { opacity: 0, duration: 0.4 }, 0.4)
          .set(q("[data-tone-night]"), { display: "none" }, 0.7)
          .to(q("[data-copy]"), { opacity: 1, y: 0, duration: 0.3 }, 0.7);
        return off;
      });
      mm.add(MOTION_QUERIES.mobile, () => {
        gsap.set(frame, { clipPath: FROM });
        ScrollTrigger.create({ trigger: frame[0], start: "top 80%", once: true, onEnter: () => gsap.to(frame, { clipPath: TO, duration: 0.9, ease: "expo.out" }) });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-tone="ground" className="bg-ground text-ink">
      <div data-pin="" className="relative py-section lg:in-data-live:h-svh lg:in-data-live:overflow-hidden lg:in-data-live:py-0">
        <div data-world="" className="absolute inset-0 hidden bg-night lg:in-data-live:block" aria-hidden="true">
          <div data-world-inner="" className="size-full [&>svg]:size-full">
            {children}
          </div>
        </div>
        {/* Header tone: the section is "ground", but its first half is a dark world. GSAP shows this sentinel (display) only while the world is dark, and SiteHeader's observer reads data-tone. */}
        <div data-tone="night" data-tone-night="" className="pointer-events-none absolute inset-0 hidden" aria-hidden="true" />
        <div className="container-x relative grid items-center gap-stack-lg lg:grid-cols-12 lg:in-data-live:h-full">
          <div data-copy="" className="lg:col-span-5">
            <h2>This is the real screen.</h2>
            <p className="mt-5 max-w-prose text-lead text-muted">
              Ten modules on one menu. Ctrl K finds any entry. Switch companies from the top bar, and read every date in Bikram Sambat and AD.
            </p>
            <p className="mt-5 text-small text-muted">{DEMO_CAPTION.paint}</p>
          </div>
          <div data-frame="" className="lg:col-span-7">
            <Screen slug="home-paint" caption={false} sizes="(min-width: 1024px) 700px, 100vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
