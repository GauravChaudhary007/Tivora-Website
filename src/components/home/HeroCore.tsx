"use client";

import { useRef, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { live, MOTION_QUERIES, useScene } from "@/lib/scene";
import { BEATS } from "./beats";
import { SymbolStage } from "./SymbolStage";
import { centre, collapse, H, makeCamera, ORDER, ORIGIN, ORIGIN_FRAC, S, SYMBOL_K, VB } from "./world";

const ZOOM = 1.35;
const lift = H + 95;
/** Where the active district sits while the camera is on it: left of the world's centre, so its info card has room on the right (viewBox units from the origin). */
const ANCHOR = { x: -170, y: 0 };
/** Info card, placed from the same anchor the camera uses: just right of the active district's slab edge (half the slab's screen width, times the zoom). */
const CARD_AT = {
  left: `${(((ORIGIN.x + ANCHOR.x + S * Math.cos(Math.PI / 6) * ZOOM + 28 - VB.x) / VB.w) * 100).toFixed(1)}%`,
  top: `${(((ORIGIN.y + ANCHOR.y - VB.y) / VB.h) * 100).toFixed(1)}%`,
};

/**
 * Scenes 0 and 1 as ONE pinned scene on desktop (one world, one timeline), so the hand-over is a single continuous move:
 * the real symbol tilts, travels to the world's centre and scales onto its four slab tops, cross-fades into the world,
 * and the bill beats start from exactly that size and position. Mobile: the hero is plain and "Follow one bill" pins
 * alone (250%). Reduced motion / no JS: hero, then the world with its numbered list, nothing pinned or hidden.
 * children = <IsoWorld props />.
 */
export function HeroCore({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ gsap }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_QUERIES, (ctx) => {
      const { desktop } = ctx.conditions as { desktop: boolean; mobile: boolean };
      const q = gsap.utils.selector(root);
      const off = live(root.current);
      const camera = makeCamera(q("[data-cam]")[0]);
      const ds = ORDER.map((k) => q(`[data-d=${k}]`)[0]);
      const links = q("[data-link]");
      const chip = q("[data-chip]");
      const caps = q("[data-cap]");
      const cards = q("[data-card]");
      const worldBox = q("[data-worldbox] > svg");
      const svg = worldBox[0];
      const at = (k: (typeof ORDER)[number]) => ({ x: centre(k, lift)[0], y: centre(k, lift)[1] });

      ORDER.forEach((k, i) => gsap.set(ds[i], { ...collapse(k), opacity: i === 0 ? 1 : 0.35 }));
      gsap.set(q("[data-props]"), { opacity: 0 });
      gsap.set(links, { strokeDashoffset: 1 });
      gsap.set(chip, { ...at("counter"), opacity: 0 });
      gsap.set([...(desktop ? caps : caps.slice(1)), ...cards], { opacity: 0, y: 24 });
      gsap.set(cards, { yPercent: -50 });
      if (desktop) gsap.set([worldBox, q("[data-bhead]")], { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: q(desktop ? "[data-pin-d]" : "[data-b]")[0],
          start: "top top",
          end: desktop ? "+=560%" : "+=250%",
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
        onUpdate: camera.apply,
      });

      // Beat 0 starts after the hero hand-over (desktop only).
      const T0 = desktop ? 0.9 : 0;
      if (desktop) {
        // Where the symbol must go and how big it must be so its squares land on the collapsed world's slab tops.
        const home = q("[data-symhome]")[0];
        const slot = q("[data-symslot]")[0] as HTMLElement;
        const geo = () => {
          const w = svg.getBoundingClientRect();
          const h = home.getBoundingClientRect();
          return {
            x: w.left + w.width * ORIGIN_FRAC.x - (h.left + h.width / 2),
            y: w.top + w.height * ORIGIN_FRAC.y - (h.top + h.height / 2),
            sc: (SYMBOL_K * w.width) / slot.offsetWidth,
          };
        };
        tl.fromTo(
          q("[data-sym]"),
          { "--rx": "0deg", "--rz": "0deg", "--sc": 1 },
          { "--rx": "55deg", "--rz": "-45deg", "--sc": () => geo().sc, duration: 0.8, ease: "none" },
          0,
        )
          .to(slot, { x: () => geo().x, y: () => geo().y, duration: 0.8 }, 0)
          .to(q("[data-copy]"), { autoAlpha: 0, y: "-12vh", duration: 0.6, ease: "none" }, 0)
          .to(q("[data-sym]"), { opacity: 0, duration: 0.15, ease: "none" }, 0.75)
          .to(worldBox, { opacity: 1, duration: 0.15, ease: "none" }, 0.75);
      }

      const swap = (i: number, t: number) => {
        [caps, cards].forEach((set) => {
          if (i > 0) tl.to(set[i - 1], { opacity: 0, y: -24, duration: 0.25 }, t);
          tl.to(set[i], { opacity: 1, y: 0, duration: 0.35 }, t + 0.25);
        });
      };
      tl.to(ds, { x: 0, y: 0, duration: 0.5 }, T0)
        .to(q("[data-props]"), { opacity: 1, duration: 0.5 }, T0 + 0.15)
        .to(chip, { opacity: 1, duration: 0.3 }, T0 + 0.1)
        .to(q("[data-bhead]"), { opacity: 1, duration: 0.3 }, T0);
      ORDER.forEach((k, i) => {
        const c = centre(k, H + 30);
        tl.to(camera.view, { x: ANCHOR.x - c[0] * ZOOM, y: ANCHOR.y - c[1] * ZOOM, scale: ZOOM, duration: 0.5 }, T0 + i);
        ds.forEach((d, j) => tl.to(d, { opacity: j === i ? 1 : 0.35, duration: 0.3 }, T0 + i + 0.1));
        if (i > 0) tl.to(links[i - 1], { strokeDashoffset: 0, duration: 0.5 }, T0 + i).to(chip, { ...at(k), duration: 0.5 }, T0 + i);
        swap(i, T0 + i + 0.05);
      });
      tl.to(camera.view, { x: 0, y: 0, scale: 1, duration: 1 }, T0 + 4)
        .to(ds, { opacity: 1, duration: 0.5 }, T0 + 4)
        .to(links[3], { strokeDashoffset: 0, duration: 0.5 }, T0 + 4.2)
        .to(caps[3], { opacity: 0, y: -24, duration: 0.25 }, T0 + 4)
        .to(cards[3], { opacity: 0, y: -24, duration: 0.25 }, T0 + 4)
        .to(caps[4], { opacity: 1, y: 0, duration: 0.35 }, T0 + 4.3)
        .to({}, { duration: 0.6 }, T0 + 5);
      return () => {
        off();
        camera.reset();
      };
    });
    return () => mm.revert();
  });

  return (
    <section ref={root} data-tone="night" className="bg-night text-ground scheme-dark">
      <div data-pin-d="" className="relative lg:in-data-live:grid lg:in-data-live:h-svh lg:in-data-live:overflow-hidden">
        {/* Scene 0: the hero. Needs no motion for LCP (the H1 is the LCP element). */}
        <div
          data-a=""
          className="relative flex min-h-svh items-center overflow-hidden pt-header pb-section-sm lg:in-data-live:col-start-1 lg:in-data-live:row-start-1 lg:in-data-live:h-full"
        >
          <div className="bg-ember pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="container-x relative grid items-center gap-stack-lg lg:grid-cols-12">
            <div data-copy="" className="lg:col-span-7">
              <p className="font-mono text-eyebrow font-medium text-gold uppercase">Tivora ERP · from HiTech, Kathmandu</p>
              <h1 className="mt-5 text-display">One platform. Every business.</h1>
              <p className="mt-6 max-w-prose text-lead text-muted-dark">
                Sales, buying, stock, the production floor and the books, in one system. Bikram Sambat dates, VAT and IRD formats are built in, because it is
                made in Nepal for Nepal.
              </p>
              <div className="mt-stack flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact/">See it on your own numbers</ButtonLink>
                <ButtonLink href="/platform/" variant="secondary">
                  Explore the platform
                </ButtonLink>
              </div>
              <p className="mt-8 flex max-w-prose items-start gap-3 text-small text-muted-dark">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                Tivora ERP – Jewelry is running in showrooms today. General trading and Paint are next.
              </p>
            </div>
            <div data-symhome="" className="flex justify-center py-stack lg:col-span-5">
              <SymbolStage priority />
            </div>
          </div>
        </div>

        {/* Scene 1: follow one bill. Static default: the world in its final lit state beside a numbered list. */}
        <div
          data-b=""
          className="flex items-center py-section-sm in-data-live:h-svh in-data-live:overflow-hidden in-data-live:pt-header in-data-live:pb-20 lg:py-section lg:in-data-live:pointer-events-none lg:in-data-live:col-start-1 lg:in-data-live:row-start-1 lg:in-data-live:h-full lg:in-data-live:pb-0"
        >
          <div className="container-x grid items-center gap-stack lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p data-bhead="" className="mb-6 font-mono text-eyebrow font-medium text-gold uppercase in-data-live:mb-0">
                Follow one bill
              </p>
              <ol className="mt-4 list-none space-y-stack in-data-live:grid in-data-live:space-y-0">
                {BEATS.map((b, i) => (
                  <li key={b.tag} data-cap="" className="in-data-live:col-start-1 in-data-live:row-start-1">
                    <p className="font-mono text-eyebrow font-medium text-gold uppercase">
                      {i + 1} · {b.tag}
                    </p>
                    <h2 className="mt-3 text-h3 in-data-live:text-h2">{b.title}</h2>
                    <p className="mt-3 text-lead text-muted-dark">{b.body}</p>
                  </li>
                ))}
                <li data-cap="" className="in-data-live:col-start-1 in-data-live:row-start-1">
                  <h2 className="text-h3 in-data-live:text-h2">Typed once. Every number agrees.</h2>
                </li>
              </ol>
            </div>
            <div data-worldbox="" className="relative order-first lg:order-last lg:col-span-7">
              {children}
              {BEATS.map((b) => (
                <div
                  key={b.tag}
                  data-card=""
                  style={CARD_AT}
                  className="absolute hidden w-56 rounded-lg border border-rule-dark bg-night-2 p-4 lg:in-data-live:block"
                >
                  <p className="font-mono text-eyebrow font-medium text-gold uppercase">{b.tag}</p>
                  <p className="mt-1 font-bold">{b.card[0]}</p>
                  <p className="mt-1 text-small text-muted-dark">{b.card[1]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
