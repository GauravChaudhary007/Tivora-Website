"use client";

import Link from "next/link";
import { useRef } from "react";
import { Screen } from "@/components/ui/Screen";
import { MOTION_QUERIES, useScene } from "@/lib/scene";
import { WORK_DESK_CARDS, WorkDeskStills } from "./WorkDeskStills";

// Markers sit just outside the top-right corner of each CRITICAL card (percent of the cropped screenshot), clear of the card text.
const MARKS = [
  { left: "44.6%", label: WORK_DESK_CARDS[0].label },
  { left: "72.4%", label: WORK_DESK_CARDS[1].label },
  { left: "97.2%", label: WORK_DESK_CARDS[2].label },
];

/** Scene 3. Light, not pinned. Desktop: the frame drifts down as you scroll. The image does not move inside it, so the markers stay on the cards. */
export function WorkDeskScene() {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ gsap }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_QUERIES.desktop, () => {
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q("[data-frame]"),
        { yPercent: -4 },
        { yPercent: 6, ease: "none", scrollTrigger: { trigger: q("[data-frame]")[0], start: "top bottom", end: "bottom top", scrub: 1 } },
      );
    });
    return () => mm.revert();
  });

  return (
    <section id="tour-workdesk" ref={root} data-tone="ground" className="overflow-hidden bg-ground py-section text-ink">
      <div className="container-x grid items-center gap-stack-lg lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2>Mornings start with what needs you.</h2>
          <p className="mt-4 text-lead text-muted">
            The Work Desk lists what is late, critical or due, across every module: a customer over the credit limit, a manufacturing order past its date, a
            supplier payment coming up. The action is one click away.
          </p>
          <ol className="mt-stack hidden space-y-2 lg:block">
            {MARKS.map((m, i) => (
              <li key={m.label} className="flex items-center gap-3 font-bold">
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-night font-mono text-small text-gold">
                  {i + 1}
                </span>
                {m.label}
              </li>
            ))}
          </ol>
          <Link
            href="/work-desk/"
            className="mt-stack inline-flex min-h-11 items-center font-bold text-accent underline underline-offset-4 hover:text-bronze"
          >
            See the Work Desk
          </Link>
        </div>
        <div className="min-w-0 lg:col-span-8 lg:bleed-right">
          <WorkDeskStills />
          <div className="screen-rise hidden lg:block">
          <div data-frame="" className="relative">
            <Screen slug="work-desk" caption={false} imgClassName="aspect-7/2 object-cover object-top" sizes="(min-width: 1024px) 900px, 100vw" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 aspect-7/2" aria-hidden="true">
              {MARKS.map((m, i) => (
                <span
                  key={m.label}
                  style={{ left: m.left, top: "55.9%" }}
                  className="absolute inline-flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold bg-night font-mono text-small text-gold"
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
