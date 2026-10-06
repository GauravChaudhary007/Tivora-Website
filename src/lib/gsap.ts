"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
}

/** Breakpoint conditions shared by every gsap.matchMedia() call. */
export const MOTION_QUERIES = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

/** Marks a scene as "driven by GSAP" (data-live) while its matchMedia branch is active. Pin/stack layout classes hang off it (in-data-live:), so no-JS and reduced motion keep the plain, fully visible default. */
export const live = (el: Element | null) => {
  el?.setAttribute("data-live", "");
  return () => el?.removeAttribute("data-live");
};

export { gsap, ScrollTrigger, useGSAP };
