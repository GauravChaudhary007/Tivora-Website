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
