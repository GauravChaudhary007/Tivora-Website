"use client";

import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { DURATION, EASE } from "@/lib/motion";

/**
 * Shared reveal for ordinary sections: any [data-reveal] element fades in and rises 24px once
 * it enters. Elements are visible by default; .js-reveal (globals.css) hides them only after
 * this runs, and only when motion is allowed, so no-JS, crawlers and reduced motion see content.
 */
export function RevealRoot() {
  const pathname = usePathname();
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
        els.forEach((el) => el.classList.add("js-reveal"));
        ScrollTrigger.batch(els, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: DURATION.slow, ease: EASE.outExpo, stagger: 0.08, overwrite: true }),
        });
        return () => els.forEach((el) => el.classList.remove("js-reveal"));
      });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );
  return null;
}
