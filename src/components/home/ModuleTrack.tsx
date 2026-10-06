"use client";

import Link from "next/link";
import { useRef } from "react";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { modules, tradeFinanceExtra } from "@/content/modules";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";

const core = modules.filter((m) => m.pack === "core");

/** Scene 6. Desktop: pinned horizontal track. Mobile and reduced motion: a native scroll-snap row. A thin gold line (the core) runs through every card at icon height. */
export function ModuleTrack() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop, () => {
        const q = gsap.utils.selector(root);
        const view = q("[data-view]")[0] as HTMLElement;
        const track = q("[data-track]")[0] as HTMLElement;
        const dist = () => track.scrollWidth - view.clientWidth;
        gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: () => `+=${dist()}`, pin: true, scrub: true, invalidateOnRefresh: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-tone="ground" className="overflow-hidden bg-ground text-ink">
      <div data-pin="" className="flex flex-col justify-center py-section lg:motion-safe:h-svh lg:motion-safe:py-0">
        <div className="container-x flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-3xl">Ten modules. One ledger underneath.</h2>
          <Link href="/modules/" className="inline-flex min-h-11 items-center font-bold text-accent underline underline-offset-4 hover:text-bronze">
            All modules
          </Link>
        </div>
        <div
          data-view=""
          tabIndex={0}
          aria-label="The ten modules"
          className="mt-stack-lg snap-x snap-mandatory overflow-x-auto pb-4 lg:motion-safe:snap-none lg:motion-safe:overflow-visible"
        >
          <div data-track="" className="relative w-max px-gutter">
            <div className="pointer-events-none absolute inset-x-0 top-12 h-px bg-gold" aria-hidden="true" />
            <ul className="flex gap-6">
              {core.map((m) => (
                <li key={m.slug} className="flex h-90 w-72 shrink-0 snap-start flex-col rounded-xl border border-rule bg-paper p-6 shadow-card sm:w-80">
                  <ModuleIcon name={m.icon} className="relative" />
                  <h3 className="mt-6">{m.name}</h3>
                  <p className="mt-2 text-small text-muted">{m.appLine}</p>
                  {m.slug === "trade-finance" && <p className="mt-2 text-small font-bold text-accent">{tradeFinanceExtra}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
