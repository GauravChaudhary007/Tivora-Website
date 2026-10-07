// Geometry shared by IsoWorld (server) and the scenes that move it (client). World units, z is up.
import { iso } from "@/lib/iso";

export const S = 140; // slab side
export const GAP = 70; // gap between slabs when spread
export const H = 22; // slab height
export const P = S + GAP; // slab pitch

/**
 * The sixteen working areas (brochure p11) as a 4 x 4 grid (column, row). Reading order is the order a business runs: row 1 plan, sell, buy, store;
 * row 2 make, maintain, deliver, serve; row 3 account; row 4 report and control, then Work Desk and Dashboards, which every stage reports into.
 * `stage` is the 1-based stage of the tour (see beats.ts); 0 = the always-on layer.
 */
export type Mod =
  | "planning" | "sales" | "purchase" | "inventory"
  | "production" | "maintenance" | "transport" | "customer"
  | "finance" | "assets" | "trade" | "tax"
  | "reports" | "control" | "workdesk" | "dashboards";
export const MODS: { id: Mod; label: string[]; stage: number }[] = [
  { id: "planning", label: ["Material", "Planning"], stage: 1 },
  { id: "sales", label: ["Sales"], stage: 2 },
  { id: "purchase", label: ["Purchase"], stage: 3 },
  { id: "inventory", label: ["Store &", "Inventory"], stage: 3 },
  { id: "production", label: ["Production"], stage: 4 },
  { id: "maintenance", label: ["Maintenance"], stage: 4 },
  { id: "transport", label: ["Transport"], stage: 5 },
  { id: "customer", label: ["Customer", "Services"], stage: 5 },
  { id: "finance", label: ["Finance &", "Accounts"], stage: 6 },
  { id: "assets", label: ["Fixed", "Assets"], stage: 6 },
  { id: "trade", label: ["Trade &", "Finance"], stage: 6 },
  { id: "tax", label: ["Tax &", "IRD"], stage: 6 },
  { id: "reports", label: ["Reports"], stage: 7 },
  { id: "control", label: ["Control", "Panel"], stage: 7 },
  { id: "workdesk", label: ["Work", "Desk"], stage: 0 },
  { id: "dashboards", label: ["Dashboards"], stage: 0 },
];
export const IDS = MODS.map((m) => m.id);
/** Grid position in pitch units, centred on the world origin (slot i = column i % 4, row i / 4). */
export const POS = Object.fromEntries(MODS.map((m, i) => [m.id, [(i % 4) - 1.5, Math.floor(i / 4) - 1.5]])) as Record<Mod, [number, number]>;

/** The process line through the fourteen stage modules, in business order (it snakes down the grid). Link j joins CHAIN[j] to CHAIN[j + 1]. */
export const CHAIN: Mod[] = MODS.filter((m) => m.stage > 0).map((m) => m.id);

/** Screen point of a module centre at height z (viewBox units, relative to the world origin). */
export const centre = (d: Mod, z = H): [number, number] => iso(POS[d][0] * P, POS[d][1] * P, z);

/** Rounded-square outline (corner radius 32% of the side) as world points, in angle order. */
export function outline(cx: number, cy: number, n = 5): [number, number][] {
  const h = S / 2;
  const r = S * 0.32;
  const out: [number, number][] = [];
  [[-1, -1, 180], [1, -1, 270], [1, 1, 0], [-1, 1, 90]].forEach(([sx, sy, a0]) => {
    for (let i = 0; i <= n; i++) {
      const a = ((a0 + (90 * i) / n) * Math.PI) / 180;
      out.push([cx + sx * (h - r) + r * Math.cos(a), cy + sy * (h - r) + r * Math.sin(a)]);
    }
  });
  return out;
}

/** Half-extent of the world from its origin in viewBox units (left-right, up, down). */
const EXT = { x: 667, up: 407, down: 385 };
/** Visible window of the world SVG: the content (slabs and labels) with its empty margins cropped, so the world fills its box. */
export const VB = { x: 0, y: 47, w: 1400, h: 825 };
/** World origin in viewBox units (the camera pivot). */
export const ORIGIN = { x: 700, y: 450 + H };

/**
 * Camera for the world: a plain {x, y, scale} object that GSAP tweens, written to the `data-cam` group's transform
 * attribute (translate then scale, about the world origin, which is the group's local 0,0). GSAP's own svgOrigin
 * machinery resolves global coordinates against the element's current matrix and drifts under dev re-mounts.
 */
export function makeCamera(el: Element | undefined) {
  const view = { x: 0, y: 0, scale: 1 };
  const apply = () => el?.setAttribute("transform", `translate(${view.x.toFixed(2)} ${view.y.toFixed(2)}) scale(${view.scale.toFixed(4)})`);
  return { view, apply, reset: () => el?.removeAttribute("transform") };
}

/**
 * Camera pose that centres screen point c at zoom z, clamped so the zoomed world always covers the visible window
 * (no empty margins). World extent: see EXT.
 */
export function hold(c: [number, number] | number[], z: number) {
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  return {
    x: clamp(-c[0] * z, VB.x + VB.w - ORIGIN.x - EXT.x * z, VB.x - ORIGIN.x + EXT.x * z),
    y: clamp(-c[1] * z, VB.y + VB.h - ORIGIN.y - EXT.down * z, VB.y - ORIGIN.y + EXT.up * z),
    scale: z,
  };
}
