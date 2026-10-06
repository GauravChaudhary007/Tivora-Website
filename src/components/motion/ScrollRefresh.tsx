"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Re-measures every ScrollTrigger once fonts have loaded, on pages that have scenes. GSAP is imported lazily so other pages never download it. */
export function ScrollRefresh() {
  const pathname = usePathname();
  useEffect(() => {
    if (!document.querySelector("[data-pin]")) return;
    let live = true;
    document.fonts.ready.then(() => live && import("@/lib/gsap").then((m) => live && m.ScrollTrigger.refresh()));
    return () => {
      live = false;
    };
  }, [pathname]);
  return null;
}
