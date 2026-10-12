import type { ReactNode } from "react";

// One flat 64 x 64 illustration per stage of the process flow. Plain SVG; the motion is CSS (.pf-* in globals.css) and stops for reduced motion.
const S = { fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const GLYPHS: ReactNode[] = [
  // Plan: bars rising with a forecast line
  <g key="plan" {...S}>
    <path d="M10 54h44" />
    <rect className="pf-bar" style={{ ["--d" as string]: "0s" }} x="14" y="38" width="8" height="16" rx="2" />
    <rect className="pf-bar" style={{ ["--d" as string]: "0.3s" }} x="28" y="28" width="8" height="26" rx="2" />
    <rect className="pf-bar" style={{ ["--d" as string]: "0.6s" }} x="42" y="16" width="8" height="38" rx="2" />
    <path d="M12 30l14-9 12 4 16-14" strokeDasharray="3 5" />
    <circle cx="54" cy="11" r="2.5" fill="currentColor" />
  </g>,
  // Sell: a bill with lines and a tick
  <g key="sell" {...S}>
    <path d="M18 8h28a2 2 0 0 1 2 2v44l-5-3-5 3-5-3-5 3-5-3-5 3V10a2 2 0 0 1 2-2z" />
    <path d="M24 20h16M24 28h16M24 36h8" />
    <path className="pf-tick" d="M36 44l4 4 8-9" />
  </g>,
  // Buy and store: boxes on a shelf, a crate dropping in
  <g key="buy" {...S}>
    <path d="M8 56h48M12 56V30h40v26" />
    <rect x="16" y="38" width="12" height="18" rx="1.5" />
    <rect x="36" y="42" width="12" height="14" rx="1.5" />
    <g className="pf-drop">
      <rect x="22" y="12" width="14" height="12" rx="1.5" />
      <path d="M29 4v5M26 7l3 3 3-3" />
    </g>
  </g>,
  // Make: a gear turning
  <g key="make" {...S}>
    <g className="pf-spin">
      <circle cx="32" cy="32" r="9" />
      <circle cx="32" cy="32" r="3" fill="currentColor" />
      <path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M49 15l-6 6M21 43l-6 6" />
    </g>
  </g>,
  // Deliver: a truck on the road
  <g key="deliver" {...S}>
    <path d="M6 18h30v26H6zM36 26h12l8 10v8H36z" />
    <circle cx="18" cy="46" r="5" fill="var(--color-night-3)" />
    <circle cx="46" cy="46" r="5" fill="var(--color-night-3)" />
    <path className="pf-road" d="M4 56h56" strokeDasharray="6 6" />
  </g>,
  // Account: a balance
  <g key="account" {...S}>
    <path d="M32 10v40M20 54h24" />
    <g className="pf-tilt">
      <path d="M12 18h40" />
      <path d="M12 18l-7 16h14zM52 18l-7 16h14z" />
    </g>
    <circle cx="32" cy="10" r="2.5" fill="currentColor" />
  </g>,
  // Know and control: a gauge with a needle
  <g key="know" {...S}>
    <path d="M10 44a22 22 0 0 1 44 0" />
    <path d="M14 36l3 2M32 20v4M50 36l-3 2" />
    <g className="pf-needle">
      <path d="M32 44L44 28" />
    </g>
    <circle cx="32" cy="44" r="3.5" fill="currentColor" />
    <path d="M18 54h28" />
  </g>,
];

export function StageGlyph({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 64 64" className="size-14 text-gold" aria-hidden="true">
      {GLYPHS[index]}
    </svg>
  );
}
