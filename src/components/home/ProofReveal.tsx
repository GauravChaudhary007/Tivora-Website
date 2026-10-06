"use client";

import { useRef, type ReactNode } from "react";
import { Screen } from "@/components/ui/Screen";
import { DEMO_CAPTION } from "@/content/site";
import { live, MOTION_QUERIES, useScene } from "@/lib/scene";
import { centre, H, makeCamera } from "./world";

const Z = 12;
const FROM = "inset(34% 34% 34% 34% round 32%)"; // a rounded square, the module shape
const TO = "inset(-12% -12% -12% -12% round 0%)"; // beyond the box so the frame shadow survives

/**
 * Scene 2. children = <IsoWorld />. Desktop: the ledger slab floods the screen, a rounded-square mask opens onto the
 * real Home screen as a full-bleed layer, and after ~65% of the scrub that layer settles into its place in the layout.
 * Mobile: the mask opens once on enter, onto pre-cropped stills.
 */
export function ProofReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ gsap, ScrollTrigger }) => {
    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(root);
    const frame = q("[data-frame]");
    mm.add(MOTION_QUERIES.desktop, () => {
      const off = live(root.current);
      const c = centre("ledger", H);
      const pin = q("[data-pin]")[0];
      const slot = q("[data-slot]")[0];
      // The frame's full-bleed pose: centred on the pinned frame and scaled to cover it. Measured against the (untransformed) slot.
      const bleed = () => {
        const p = pin.getBoundingClientRect();
        const r = slot.getBoundingClientRect();
        return {
          x: p.left + p.width / 2 - (r.left + r.width / 2),
          y: p.top + p.height / 2 - (r.top + r.height / 2),
          scale: Math.max(p.width / r.width, p.height / r.height),
        };
      };
      const camera = makeCamera(q("[data-cam]")[0]);
      gsap.set(frame, { clipPath: FROM, autoAlpha: 0, transformOrigin: "50% 50%" });
      // Hand-off from the bill scene: the world (props, lit links, parked chip = its end state) fades in on the night ground, then the props clear so the slab fills the screen.
      gsap.set(q("[data-world-inner]"), { opacity: 0 });
      gsap.set(q("[data-tone-night]"), { display: "block" });
      gsap.set(q("[data-copy]"), { opacity: 0, y: 24 });
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: pin, start: "top top", end: "+=180%", pin: true, scrub: 0.6, invalidateOnRefresh: true },
          onUpdate: camera.apply,
        })
        .to(q("[data-world-inner]"), { opacity: 1, duration: 0.12 }, 0)
        .to([...q("[data-props]"), ...q("[data-chip]"), ...q("[data-link]")], { opacity: 0, duration: 0.2 }, 0.1)
        .to(camera.view, { x: -c[0] * Z, y: -c[1] * Z, scale: Z, ease: "power2.in", duration: 0.45 }, 0)
        // the mask opens onto the screen at full bleed (cover scale), not onto a thumbnail
        .fromTo(frame, { x: () => bleed().x, y: () => bleed().y, scale: () => bleed().scale }, { x: () => bleed().x, y: () => bleed().y, scale: () => bleed().scale, duration: 0.01 }, 0)
        .set(frame, { autoAlpha: 1 }, 0.4)
        .to(frame, { clipPath: TO, duration: 0.25 }, 0.4)
        .to(q("[data-world]"), { opacity: 0, duration: 0.25 }, 0.4)
        // ...then, after ~65% of the scrub, it settles into the layout
        .to(frame, { x: 0, y: 0, scale: 1, ease: "power2.inOut", duration: 0.35 }, 0.65)
        .set(q("[data-tone-night]"), { display: "none" }, 0.66)
        .to(q("[data-copy]"), { opacity: 1, y: 0, duration: 0.25 }, 0.85)
        .to({}, { duration: 0.1 }, 1.1);
      return () => {
        off();
        camera.reset();
      };
    });
    mm.add(MOTION_QUERIES.mobile, () => {
      gsap.set(frame, { clipPath: FROM });
      ScrollTrigger.create({ trigger: frame[0], start: "top 80%", once: true, onEnter: () => gsap.to(frame, { clipPath: TO, duration: 0.9, ease: "expo.out" }) });
    });
    return () => mm.revert();
  });

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
          <div data-slot="" className="min-w-0 lg:col-span-7">
            <div data-frame="">
              <div className="hidden lg:block">
                <Screen slug="home-paint" caption={false} sizes="(min-width: 1024px) 700px, 100vw" />
              </div>
              {/* Below 1024px the full screen is unreadable: two real crops in a swipe row. */}
              <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden" tabIndex={0} aria-label="Home screen details">
                {(["home-paint-m1", "home-paint-m2"] as const).map((s) => (
                  <li key={s} className="w-5/6 shrink-0 snap-start sm:w-2/3">
                    <Screen slug={s} caption={false} sizes="85vw" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
