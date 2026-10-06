"use client";

import { useRef, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { live, MOTION_QUERIES, useScene } from "@/lib/scene";
import { BEATS } from "./beats";
import { centre, H, hold, IDS, makeCamera, STOPS, type Mod } from "./world";

const lift = H + 95;
const DIM = 0.5; // modules off the bill's path stay visible and labelled
const ZOOM = { desktop: 1.12, single: 1.6, pair: 1.35 };
const mid = (ids: Mod[]) => {
  const c = ids.map((d) => centre(d, H + 30));
  return [c.reduce((n, p) => n + p[0], 0) / c.length, c.reduce((n, p) => n + p[1], 0) / c.length];
};

const STOP_S = 3.4; // seconds each stop of the bill's path is on screen

/**
 * Scene 0 is the hero (headline + the master film, the first thing a visitor sees). Scene 1 explains the idea in a loop that plays by
 * itself, not scrubbed by scroll: the bill's chip travels Sales > Inventory > Production > Finance & Tax across the twelve modules while the
 * caption and card follow it, then the whole world shows and it starts over. It pauses while off screen. Scrolling on simply moves into
 * Scene 2 ("This is the real screen"). Reduced motion / no JS: the world in its final lit state beside a numbered list, nothing hidden.
 * children = <IsoWorld props underlay={<Flows />} />.
 */
export function HeroCore({ children, film }: { children: ReactNode; film: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ gsap, ScrollTrigger }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_QUERIES, (ctx) => {
      const { desktop } = ctx.conditions as { desktop: boolean; mobile: boolean };
      const q = gsap.utils.selector(root);
      const off = live(root.current);
      const camera = makeCamera(q("[data-cam]")[0]);
      const dOf = (k: Mod) => q(`[data-d=${k}]`)[0];
      const ds = IDS.map(dOf);
      const links = q("[data-link]");
      const chip = q("[data-chip]");
      const caps = q("[data-cap]");
      const cards = q("[data-card]");
      const at = (k: Mod) => ({ x: centre(k, lift)[0], y: centre(k, lift)[1] });

      IDS.forEach((k) => gsap.set(dOf(k), { opacity: k === "sales" ? 1 : DIM }));
      gsap.set(links, { strokeDashoffset: 1 });
      gsap.set(chip, { ...at("sales"), opacity: 1 });
      gsap.set([...caps, ...cards], { opacity: 0, y: 24 });
      gsap.set(cards, { xPercent: -50, yPercent: -50 });

      const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.inOut" }, onUpdate: camera.apply });
      const swap = (i: number, t: number) => {
        [caps, cards].forEach((set) => {
          if (i > 0) tl.to(set[i - 1], { opacity: 0, y: -24, duration: 0.3 }, t);
          if (set[i]) tl.to(set[i], { opacity: 1, y: 0, duration: 0.4 }, t + 0.3);
        });
      };
      STOPS.forEach((ids, i) => {
        const t = i * STOP_S;
        tl.to(camera.view, { ...hold(mid(ids), desktop ? ZOOM.desktop : i === 3 ? ZOOM.pair : ZOOM.single), duration: 1 }, t);
        IDS.forEach((k) => tl.to(dOf(k), { opacity: ids.includes(k) ? 1 : DIM, duration: 0.4 }, t + 0.1));
        if (i > 0) tl.to(links[i - 1], { strokeDashoffset: 0, duration: 0.9 }, t).to(chip, { ...at(ids[0]), duration: 0.9 }, t);
        if (i === 3) tl.to(links[3], { strokeDashoffset: 0, duration: 0.8 }, t + 1.2);
        swap(i, t + 0.05);
      });
      const end = STOPS.length * STOP_S;
      tl.to(camera.view, { x: 0, y: 0, scale: 1, duration: 1.2 }, end)
        .to(ds, { opacity: 1, duration: 0.6 }, end)
        .to(caps[3], { opacity: 0, y: -24, duration: 0.3 }, end)
        .to(cards[3], { opacity: 0, y: -24, duration: 0.3 }, end)
        .to(caps[4], { opacity: 1, y: 0, duration: 0.4 }, end + 0.4)
        .to(caps[4], { opacity: 0, y: -24, duration: 0.3 }, end + 3.4)
        .to({}, { duration: 0.4 }, end + 3.4); // short gap, then the loop restarts from the first stop

      // Play only while the scene is on screen.
      const st = ScrollTrigger.create({ trigger: root.current, start: "top 85%", end: "bottom 15%", onToggle: (s) => tl.paused(!s.isActive) });
      tl.paused(!st.isActive);
      return () => {
        st.kill();
        tl.kill();
        off();
        camera.reset();
      };
    });
    return () => mm.revert();
  });

  return (
    <>
      <section data-tone="night" className="bg-night text-ground scheme-dark">
        {/* Scene 0: the hero. Needs no motion for LCP (the H1 is the LCP element). */}
        <div
          className="relative flex min-h-svh items-center overflow-hidden pt-header pb-section-sm"
        >
          <div className="bg-ember pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="container-x relative grid items-center gap-stack-lg lg:grid-cols-12">
            <div className="lg:col-span-5">
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
            <div className="lg:col-span-7">{film}</div>
          </div>
        </div>

      </section>

      {/* Scene 1: one bill through the twelve modules. Static default: the world in its final lit state beside a numbered list. */}
      <section ref={root} data-tone="night" className="bg-night text-ground scheme-dark">
        <div className="flex items-center py-section in-data-live:min-h-svh">
          <div className="container-x grid items-center gap-stack lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="mb-6 in-data-live:mb-0">
                <p className="font-mono text-eyebrow font-medium text-gold uppercase">One entry, twelve modules</p>
                <p className="mt-3 text-lead text-ground">Raise one bill at the counter. Stock, the production floor and the books update from that same entry. Nobody types it twice. Here is that one bill passing through four of the twelve modules.</p>
              </div>
              <ol className="mt-4 list-none space-y-stack in-data-live:grid in-data-live:space-y-0">
                {BEATS.map((b, i) => (
                  <li key={b.tag} data-cap="" className="in-data-live:col-start-1 in-data-live:row-start-1">
                    <p className="font-mono text-eyebrow font-medium text-gold uppercase">
                      Stop {i + 1} of 4 on the bill&rsquo;s path · {b.tag}
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
            <div data-worldbox="" className="relative order-first max-lg:in-data-live:overflow-hidden lg:order-last lg:col-span-7">
              {children}
              {BEATS.map((b) => (
                <div
                  key={b.tag}
                  data-card=""
                  className="absolute top-[calc(100%+4rem)] left-1/2 hidden w-72 rounded-lg border border-rule-dark bg-night-2 p-4 in-data-live:block"
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
    </>
  );
}
