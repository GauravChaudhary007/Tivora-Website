// Geometry shared by IsoWorld (server) and the scenes that move it (client). World units, z is up.
import { iso } from "@/lib/iso";

export const S = 180; // slab side
export const GAP = 180; // gap between slabs when spread (one module width)
export const GAP_SYMBOL = 85; // gap when collapsed to the symbol (0.47 of a side, as in the mark)
export const H = 22; // slab height
export const C = (S + GAP) / 2; // slab centre offset from the world origin

export type District = "counter" | "godown" | "floor" | "ledger";
/** Order of travel, clockwise from the gold square. Grid position is the symbol's tilted layout (top, right, bottom, left). */
export const ORDER: District[] = ["counter", "godown", "floor", "ledger"];
export const POS: Record<District, [number, number]> = { counter: [-1, -1], godown: [1, -1], floor: [1, 1], ledger: [-1, 1] };

/** Screen point of a district centre at height z (viewBox units, relative to the world origin). */
export const centre = (d: District, z = H): [number, number] => iso(POS[d][0] * C, POS[d][1] * C, z);

/** Screen offset that slides a spread district into the collapsed (symbol) layout. */
export const collapse = (d: District) => {
  const k = (GAP - GAP_SYMBOL) / 2;
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
export const VB = { x: 80, y: 90, w: 1040, h: 700 };
/** World origin in viewBox units (the camera pivot), and as a fraction of the SVG box. */
export const ORIGIN = { x: 600, y: 450 + H };
export const ORIGIN_FRAC = { x: (ORIGIN.x - VB.x) / VB.w, y: (ORIGIN.y - VB.y) / VB.h };
/**
 * Scale at which the tilted symbol's four squares span the collapsed world's four slab tops (771 viewBox units wide
 * for the collapsed layout; the tilted symbol is 1.414 x its side wide): symbolScale = SYMBOL_K * worldWidthPx / symbolWidthPx.
 */
export const SYMBOL_K = 771 / VB.w / Math.SQRT2;

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
