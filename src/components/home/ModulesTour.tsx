"use client";

import { useRef, type ReactNode } from "react";
import { live, MOTION_QUERIES, useScene } from "@/lib/scene";
import { ALWAYS_ON, ONE_DB, STAGES } from "./beats";
import { centre, H, hold, IDS, makeCamera, MODS, type Mod } from "./world";

const DIM = 0.6; // modules off the current stage stay visible and labelled
const STAGE_S = 3; // seconds each stage is on screen
const lit = (i: number): Mod[] => MODS.filter((m) => m.stage === i + 1).map((m) => m.id);
const mid = (ids: Mod[]) => {
  const c = ids.map((d) => centre(d, H + 30));
  return [c.reduce((n, p) => n + p[0], 0) / c.length, c.reduce((n, p) => n + p[1], 0) / c.length];
};
const zoom = (n: number, desktop: boolean) => (n > 2 ? (desktop ? 1.2 : 1.25) : desktop ? 1.5 : 1.9);

/**
 * Autoplay modules tour (not scrubbed by scroll): the camera runs through the seven stages in business order, lighting each stage's slabs and
 * drawing the process line into it, with a caption per stage; then it pulls back to the whole system ("One database...") and loops. Work Desk
 * and Dashboards stay lit throughout (the layer every stage reports into). Pauses while off screen. Reduced motion / no JS: the whole world lit
 * beside the numbered list of stages, nothing hidden. children = <IsoWorld props underlay={<Flows />} />.
 */
export function ModulesTour({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ gsap, ScrollTrigger }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_QUERIES, (ctx) => {
      const { desktop } = ctx.conditions as { desktop: boolean; mobile: boolean };
      const q = gsap.utils.selector(root);
      const off = live(root.current);
      const camera = makeCamera(q("[data-cam]")[0]);
      const dOf = (k: Mod) => q(`[data-d=${k}]`)[0];
      const ringOf = (k: Mod) => dOf(k).querySelector("[data-ring]");
      const stageMods = IDS.filter((k) => !dOf(k).hasAttribute("data-always"));
      const links = q("[data-link]");
      const caps = q("[data-cap]");

      stageMods.forEach((k) => gsap.set(dOf(k), { opacity: DIM }));
      gsap.set(links, { strokeDashoffset: 1 });
      gsap.set(caps, { opacity: 0, y: 24 });

      const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.inOut" }, onUpdate: camera.apply });
      STAGES.forEach((_, i) => {
        const t = i * STAGE_S;
        const ids = lit(i);
        tl.to(camera.view, { ...hold(mid(ids), zoom(ids.length, desktop)), duration: 1 }, t);
        stageMods.forEach((k) => {
          const on = ids.includes(k);
          tl.to(dOf(k), { opacity: on ? 1 : DIM, duration: 0.4 }, t + 0.1).to(ringOf(k), { opacity: on ? 1 : 0, duration: 0.4 }, t + 0.1);
        });
        const own = q(`[data-link][data-stage="${i}"]`);
        own.forEach((l, j) => tl.to(l, { strokeDashoffset: 0, duration: 0.8 / own.length + 0.1 }, t + 0.1 + (j * 0.8) / own.length));
        if (i > 0) tl.to(caps[i - 1], { opacity: 0, y: -24, duration: 0.3 }, t + 0.05);
        tl.to(caps[i], { opacity: 1, y: 0, duration: 0.4 }, t + 0.35);
      });
      const end = STAGES.length * STAGE_S;
      tl.to(camera.view, { x: 0, y: 0, scale: 1, duration: 1.2 }, end)
        .to(stageMods.map(dOf), { opacity: 1, duration: 0.6 }, end)
        .to(stageMods.map(ringOf), { opacity: 1, duration: 0.6 }, end)
        .to(caps[STAGES.length - 1], { opacity: 0, y: -24, duration: 0.3 }, end)
        .to(caps[STAGES.length], { opacity: 1, y: 0, duration: 0.4 }, end + 0.4)
        .to(caps[STAGES.length], { opacity: 0, y: -24, duration: 0.3 }, end + 3.6)
        .to({}, { duration: 0.4 }, end + 3.6); // short gap, then the loop restarts from the first stage

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
    <section id="tour-process" ref={root} data-tone="night" className="bg-night text-ground scheme-dark">
      <div className="flex items-center py-section-sm in-data-live:min-h-[80svh]">
        <div className="container-x grid items-center gap-stack lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-eyebrow font-medium text-gold uppercase">One process. Every module.</p>
            <h2 className="mt-3 text-h2">From the plan to the report.</h2>
            <p className="mt-3 text-lead text-muted-dark">
              TiVora follows the way a business actually runs: plan first, then sell, buy, store, make, deliver, account and report, with every
              person&rsquo;s Work Desk and the dashboards watching the whole chain.
            </p>
            <ol className="mt-stack list-none space-y-4 in-data-live:grid in-data-live:space-y-0">
              {STAGES.map((s, i) => (
                <li key={s.tag} data-cap="" className="in-data-live:col-start-1 in-data-live:row-start-1">
                  <p className="font-mono text-eyebrow font-medium text-gold uppercase">
                    Stage {i + 1} of {STAGES.length} · {s.tag}
                  </p>
                  <h3 className="mt-1 text-lead font-bold in-data-live:text-h3">{s.title}</h3>
                  <p className="mt-1 text-muted-dark">{s.line}</p>
                  <p className="mt-1 text-small font-bold text-ground">{s.names}</p>
                </li>
              ))}
              <li data-cap="" className="in-data-live:col-start-1 in-data-live:row-start-1">
                <p className="text-h3 font-bold">{ONE_DB}</p>
              </li>
            </ol>
            <p className="mt-stack border-t border-gold pt-3 text-small text-muted-dark">{ALWAYS_ON}</p>
          </div>
          <div data-worldbox="" className="relative order-first max-lg:overflow-x-auto max-lg:in-data-live:overflow-hidden lg:order-last lg:col-span-7">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
