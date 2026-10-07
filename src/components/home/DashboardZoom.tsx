"use client";

import { useRef } from "react";
import { Screen } from "@/components/ui/Screen";
import { live, MOTION_QUERIES, useScene } from "@/lib/scene";

// Zoom stops: point of the screenshot (fraction of width/height) brought to the frame centre at scale s.
const STOPS = [
  { s: 2.2, x: 0.335, y: 0.495, text: "Sales for the period, against the same days last month." },
  { s: 2, x: 0.74, y: 0.495, text: "A running total against target." },
  { s: 1.62, x: 0.468, y: 0.685, text: "At a glance: money received, what customers owe and what you owe." },
];
const STILLS = ["executive-sales", "executive-target", "executive-glance"] as const;
const pos = (st: (typeof STOPS)[number]) => ({ xPercent: 100 * (0.5 - st.s * st.x), yPercent: 100 * (0.5 - st.s * st.y), scale: st.s });

/** Scene 4. Home: pinned, scroll zooms into three parts of the dashboard. `pinned={false}` (/work-desk/) scrubs without pinning. Below 1024px: three crops in a swipe row. */
export function DashboardZoom({ pinned = true }: { pinned?: boolean }) {
  const root = useRef<HTMLElement>(null);
  useScene(
    root,
    ({ gsap }) => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop, () => {
        const q = gsap.utils.selector(root);
        const off = live(root.current);
        const img = q("[data-zoom] img");
        const caps = q("[data-cap]");
        gsap.set(img, { transformOrigin: "0 0", xPercent: 0, yPercent: 0 });
        gsap.set(caps.slice(1), { opacity: 0, y: 24 });
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: pinned
            ? { trigger: q("[data-pin]")[0], start: "top top", end: "+=160%", pin: true, anticipatePin: 1, scrub: 1 }
            : { trigger: q("[data-pin]")[0], start: "top 60%", end: "bottom 40%", scrub: 1 },
        });
        STOPS.forEach((st, i) => {
          tl.to(img, { ...pos(st), duration: 0.8 }, i * 1.4);
          if (i > 0) tl.to(caps[i - 1], { opacity: 0, y: -24, duration: 0.3 }, i * 1.4);
          tl.to(caps[i], { opacity: 1, y: 0, duration: 0.4 }, i * 1.4 + 0.4);
        });
        tl.to({}, { duration: 0.6 });
        return off;
      });
      return () => mm.revert();
    },
    [pinned],
  );

  return (
    <section id="tour-dashboards" ref={root} data-tone="paper" className="overflow-hidden bg-paper text-ink">
      <div data-pin="" className={`flex flex-col justify-center py-section ${pinned ? "lg:in-data-live:h-svh lg:in-data-live:py-0" : ""}`}>
        <div className="container-x grid items-center gap-stack lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2>The whole business on one page.</h2>
            <p className="mt-4 text-lead text-muted">Today, this month, last month or year to date.</p>
            <ol className="mt-stack hidden list-none space-y-4 lg:block lg:in-data-live:grid lg:in-data-live:space-y-0">
              {STOPS.map((st, i) => (
                <li key={st.text} data-cap="" className="lg:in-data-live:col-start-1 lg:in-data-live:row-start-1">
                  <span className="font-mono text-eyebrow font-medium text-accent uppercase">{i + 1} of 3</span>
                  <p className="mt-2 text-h3 font-bold">{st.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="hidden lg:col-span-8 lg:block">
            <div data-zoom="">
              <Screen slug="executive-dashboard" caption={false} sizes="(min-width: 1024px) 800px, 100vw" />
            </div>
          </div>
        </div>
        <div className="mt-stack lg:hidden">
          <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-4" tabIndex={0} aria-label="Dashboard details">
            {STOPS.map((st, i) => (
              <li key={st.text} className="w-5/6 shrink-0 snap-start sm:w-2/3">
                <Screen slug={STILLS[i]} caption={false} sizes="85vw" />
                <p className="mt-3 text-small text-muted">{st.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
