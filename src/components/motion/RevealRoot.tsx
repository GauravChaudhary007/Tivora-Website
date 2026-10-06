"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Shared reveal for ordinary sections: any [data-reveal] element fades in and rises 24px once it enters.
 * Elements are visible by default; .js-reveal (globals.css) hides them only after this runs, and only when
 * motion is allowed, so no-JS, crawlers and reduced motion see content. Plain IntersectionObserver + CSS
 * transition (tokens in globals.css), so GSAP is not loaded on pages without scenes.
 */
export function RevealRoot() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => {
      el.classList.add("js-reveal");
      io.observe(el);
    });
    return () => {
      io.disconnect();
      els.forEach((el) => el.classList.remove("js-reveal", "is-in"));
    };
  }, [pathname]);
  return null;
}
