// Geometry shared by IsoWorld (server) and the scenes that move it (client). World units, z is up.
import { iso } from "@/lib/iso";

export const S = 140; // slab side
export const GAP = 70; // gap between slabs when spread
export const GAP_SYMBOL = 30; // gap when the grid is gathered tight (closing scene, hero start)
export const H = 22; // slab height
export const P = S + GAP; // slab pitch

/** The twelve modules of the platform, laid out as a 4 x 3 grid (column, row). Labels are short forms of the app's own module names. */
export type Mod = "reports" | "purchase" | "transport" | "customer" | "sales" | "inventory" | "production" | "finance" | "control" | "trade" | "assets" | "tax";
export const MODS: { id: Mod; label: string; at: [number, number] }[] = [
  { id: "reports", label: "Reports", at: [0, 0] },
  { id: "purchase", label: "Purchase", at: [1, 0] },
  { id: "transport", label: "Transport", at: [2, 0] },
  { id: "customer", label: "Customers", at: [3, 0] },
  { id: "sales", label: "Sales", at: [0, 1] },
  { id: "inventory", label: "Inventory", at: [1, 1] },
  { id: "production", label: "Production", at: [2, 1] },
  { id: "finance", label: "Finance", at: [3, 1] },
  { id: "control", label: "Control Panel", at: [0, 2] },
  { id: "trade", label: "Trade", at: [1, 2] },
  { id: "assets", label: "Fixed Assets", at: [2, 2] },
  { id: "tax", label: "Tax & IRD", at: [3, 2] },
];
export const IDS = MODS.map((m) => m.id);
/** Grid position in pitch units, centred on the world origin. */
export const POS = Object.fromEntries(MODS.map((m) => [m.id, [m.at[0] - 1.5, m.at[1] - 1]])) as Record<Mod, [number, number]>;

/** One bill's path: four stops along a row (the last stop also lights Tax & IRD). Stop captions live in beats.ts. */
export const JOURNEY: Mod[] = ["sales", "inventory", "production", "finance"];
export const STOPS: Mod[][] = [["sales"], ["inventory"], ["production"], ["finance", "tax"]];
/** Link i joins JOURNEY[i] to the next stop's lead module, the last one runs Finance to Tax. */
export const CHAIN: Mod[] = ["sales", "inventory", "production", "finance", "tax"];

/** Screen point of a module centre at height z (viewBox units, relative to the world origin). */
export const centre = (d: Mod, z = H): [number, number] => iso(POS[d][0] * P, POS[d][1] * P, z);

/** Screen offset that slides a spread slab into the gathered layout. */
export const collapse = (d: Mod) => {
  const k = GAP - GAP_SYMBOL;
  const [x, y] = iso(POS[d][0] * k, POS[d][1] * k);
  return { x: -x, y: -y };
};

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

/** Visible window of the world SVG: the content (spread slabs, props, chip) with its empty margins cropped, so the world fills its box. */
export const VB = { x: 10, y: 100, w: 1160, h: 720 };
/** World origin in viewBox units (the camera pivot), and as a fraction of the SVG box. */
export const ORIGIN = { x: 600, y: 450 + H };
export const ORIGIN_FRAC = { x: (ORIGIN.x - VB.x) / VB.w, y: (ORIGIN.y - VB.y) / VB.h };
/** Width of the gathered grid in viewBox units (4 x 3 slabs at the tight gap). The symbol cross-fade is sized against it. */
const GATHERED_W = 2 * Math.cos(Math.PI / 6) * (2.5 * (S + GAP_SYMBOL) + S);
/** symbolScale = SYMBOL_K * worldWidthPx / symbolWidthPx at the cross-fade (the tilted symbol is 1.414 x its side wide). */
export const SYMBOL_K = GATHERED_W / VB.w / Math.SQRT2;

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
 * (no empty margins). World extent: 576 / 354 / 332 viewBox units from the origin (left-right, up, down).
 */
export function hold(c: [number, number] | number[], z: number) {
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  return {
    x: clamp(-c[0] * z, VB.x + VB.w - ORIGIN.x - 576 * z, VB.x - ORIGIN.x + 576 * z),
    y: clamp(-c[1] * z, VB.y + VB.h - ORIGIN.y - 332 * z, VB.y - ORIGIN.y + 354 * z),
    scale: z,
  };
}
