// Mirrors the motion tokens in src/app/globals.css (@theme). Keep the two in sync:
// this is the only place token values are duplicated, because GSAP cannot read CSS vars as eases.
export const EASE = {
  outExpo: "expo.out", // ~ --ease-out-expo cubic-bezier(0.16, 1, 0.3, 1)
  inOut: "power2.inOut", // ~ --ease-in-out cubic-bezier(0.65, 0, 0.35, 1)
} as const;

/** Seconds. */
export const DURATION = {
  fast: 0.16, // --duration-fast
  base: 0.32, // --duration-base
  slow: 0.7, // --duration-slow
  reveal: 1.0, // --duration-reveal
} as const;
