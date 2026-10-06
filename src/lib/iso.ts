// Isometric (2:1 dimetric) projection for the home-page world (IsoWorld, WP1).
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = 0.5;

/** Projects world (x, y, z) to screen [sx, sy]. z is up. */
export const iso = (x: number, y: number, z = 0): [number, number] => [(x - y) * COS30, (x + y) * SIN30 - z];

const pts = (...p: [number, number][]) => p.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

/** Box at (x, y, z) with width w (x), depth d (y), height h (z): the three visible faces as SVG polygon points. */
export function prism(x: number, y: number, z: number, w: number, d: number, h: number) {
  return {
    top: pts(iso(x, y, z + h), iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x, y + d, z + h)),
    left: pts(iso(x, y + d, z + h), iso(x + w, y + d, z + h), iso(x + w, y + d, z), iso(x, y + d, z)),
    right: pts(iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x + w, y + d, z), iso(x + w, y, z)),
  };
}
