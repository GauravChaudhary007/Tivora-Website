"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { loadGsap } from "@/lib/scene";

/** Re-measures every ScrollTrigger once fonts have loaded, on pages that have scenes. GSAP loads lazily (shared loader), so other pages never download it. */
export function ScrollRefresh() {
  const pathname = usePathname();
  useEffect(() => {
    if (!document.querySelector("[data-pin]")) return;
    let live = true;
    document.fonts.ready.then(() => live && loadGsap().then((g) => live && g.ScrollTrigger.refresh()));
    return () => {
      live = false;
    };
  }, [pathname]);
  return null;
}
