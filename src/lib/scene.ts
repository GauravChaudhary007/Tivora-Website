import { useEffect, type RefObject } from "react";

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

export type Gsap = typeof import("./gsap");

// GSAP + ScrollTrigger are ~53 KB gz. They load once, after first paint (idle), so the server-rendered scenes are
// readable and painted without them; scenes then upgrade in place. One shared promise keeps scene setup in DOM order.
let loading: Promise<Gsap> | undefined;
export const loadGsap = () =>
  (loading ??= new Promise<Gsap>((resolve) => {
    const go = () => import("./gsap").then(resolve);
    if ("requestIdleCallback" in window) window.requestIdleCallback(go, { timeout: 1500 });
    else setTimeout(go, 200);
  }));

let refreshTimer: ReturnType<typeof setTimeout> | undefined;
const refreshSoon = (g: Gsap) => {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => g.ScrollTrigger.refresh(), 60);
};

/**
 * Runs `setup` (inside a gsap.context scoped to `root`) once GSAP has loaded, and reverts on unmount.
 * `setup` returns a cleanup (usually `() => mm.revert()`); ScrollTrigger.refresh() runs once after all scenes set up.
 */
export function useScene(root: RefObject<Element | null>, setup: (g: Gsap) => void | (() => void), deps: unknown[] = []) {
  useEffect(() => {
    let dead = false;
    let ctx: { revert: () => void } | undefined;
    let cleanup: void | (() => void);
    loadGsap().then((g) => {
      if (dead || !root.current) return;
      ctx = g.gsap.context(() => {
        cleanup = setup(g);
      }, root.current);
      refreshSoon(g);
    });
    return () => {
      dead = true;
      cleanup?.();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setup is a fresh closure every render; callers list real deps
  }, deps);
}
