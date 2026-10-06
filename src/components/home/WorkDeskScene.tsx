"use client";

import Link from "next/link";
import { useRef } from "react";
import { Screen } from "@/components/ui/Screen";
import { DEMO_CAPTION } from "@/content/site";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";

// Markers sit on the top-right corner of the three CRITICAL cards (percent of the cropped screenshot).
const MARKS = [
  { left: "43.5%", label: "Over the credit limit" },
  { left: "71.5%", label: "Order late on the floor" },
  { left: "96%", label: "Journal not posted" },
];

/** Scene 3. Light, not pinned. Desktop: the screenshot and its frame move against each other. */
export function WorkDeskScene() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop, () => {
        const q = gsap.utils.selector(root);
        const st = { trigger: q("[data-frame]")[0], start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo(q("[data-frame]"), { yPercent: 0 }, { yPercent: 6, ease: "none", scrollTrigger: st });
        gsap.fromTo(q("img"), { yPercent: 3, scale: 1.08 }, { yPercent: -3, scale: 1.08, ease: "none", scrollTrigger: st });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-tone="ground" className="overflow-hidden bg-ground py-section-lg text-ink">
      <div className="container-x grid items-center gap-stack-lg lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2>Mornings start with what needs you.</h2>
          <p className="mt-5 text-lead text-muted">
            The Work Desk lists what is late, critical or due, across every module: a customer over the credit limit, a manufacturing order past its date, a
            supplier payment coming up. The action is one click away.
          </p>
          <ol className="mt-stack space-y-3">
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
        <div className="lg:col-span-7 lg:-mr-[max(var(--spacing-gutter),calc((100vw-76rem)/2+var(--spacing-gutter)))]">
          <div data-frame="" className="relative">
            <Screen slug="work-desk" caption={false} imgClassName="aspect-7/2 object-cover object-top" sizes="(min-width: 1024px) 800px, 100vw" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 aspect-7/2" aria-hidden="true">
              {MARKS.map((m, i) => (
                <span
                  key={m.label}
                  style={{ left: m.left, top: "56%" }}
                  className="absolute inline-flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold bg-night font-mono text-small text-gold"
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-3 text-small text-muted">{DEMO_CAPTION.paint}</p>
        </div>
      </div>
    </section>
  );
}
