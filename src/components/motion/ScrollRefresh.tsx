"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";

/** Re-measures every ScrollTrigger once fonts have loaded and after each route change. */
export function ScrollRefresh() {
  const pathname = usePathname();
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    let live = true;
    document.fonts.ready.then(() => live && ScrollTrigger.refresh());
    return () => {
      live = false;
    };
  }, [pathname]);
  return null;
}
