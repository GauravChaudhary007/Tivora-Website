"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { MOTION_QUERIES, useScene } from "@/lib/scene";

/** Scene 6. children = <ModuleCards /> (rendered on the server, so lucide never ships in the client bundle). Desktop: pinned horizontal track. Mobile and reduced motion: a native scroll-snap row. A thin gold line (the core) runs through every card at icon height. */
export function ModuleTrack({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useScene(root, (g) => {
    const { gsap } = g;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop, () => {
        const q = gsap.utils.selector(root);
        const view = q("[data-view]")[0] as HTMLElement;
        const track = q("[data-track]")[0] as HTMLElement;
        const dist = () => track.scrollWidth - view.clientWidth;
        gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: () => `+=${Math.round(dist() * 0.55)}`, pin: true, anticipatePin: 1, scrub: 1, invalidateOnRefresh: true },
        });
      });
    return () => mm.revert();
  });

  return (
    <section id="tour-modules" ref={root} data-tone="ground" className="overflow-hidden bg-ground text-ink">
      <div data-pin="" className="flex flex-col justify-center py-section lg:motion-safe:h-svh lg:motion-safe:py-0">
        <div data-stagger="" className="container-x flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-3xl">One entry. Every module. One ledger underneath.</h2>
          <Link href="/modules/" className="inline-flex min-h-11 items-center font-bold text-accent underline underline-offset-4 hover:text-bronze">
            All modules
          </Link>
        </div>
        <div
          data-view=""
          tabIndex={0}
          aria-label="The modules"
          className="mt-stack-lg snap-x snap-mandatory overflow-x-auto pb-4 lg:motion-safe:snap-none lg:motion-safe:overflow-visible"
        >
          <div data-track="" className="relative w-max px-gutter">
            <div className="pointer-events-none absolute inset-x-0 top-12 h-px bg-gold" aria-hidden="true" />
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
