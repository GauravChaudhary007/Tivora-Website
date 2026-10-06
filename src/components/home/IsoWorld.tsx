import type { ReactNode } from "react";
import { iso, prism } from "@/lib/iso";
import { CHAIN, H, MODS, ORIGIN, P, POS, S, VB, centre, collapse, outline, type Mod } from "./world";

// The "Follow one bill" world: the twelve modules as rounded slabs on a 4 x 3 grid, 45-degree links along one bill's path, one chip.
// Server component, decorative (aria-hidden). Scenes find parts by data attributes (several copies may exist).
const f = (n: number) => n.toFixed(1);
const pt = ([x, y]: [number, number], z: number) => iso(x, y, z).map(f).join(",");

function Slab({ d, gold }: { d: Mod; gold?: boolean }) {
  const [cx, cy] = [POS[d][0] * P, POS[d][1] * P];
  const o = outline(cx, cy);
  let right = "";
  let left = "";
  o.forEach((p, i) => {
    const q = o[(i + 1) % o.length];
    const nx = q[1] - p[1];
    const ny = -(q[0] - p[0]);
    if (nx + ny <= 0) return; // faces away from the viewer
    const quad = `M${pt(p, H)}L${pt(q, H)}L${pt(q, 0)}L${pt(p, 0)}Z`;
    if (nx > ny) right += quad;
    else left += quad;
  });
  return (
    <>
      <path d={left} className="fill-night-3 stroke-night-3" strokeWidth=".6" />
      <path d={right} className="fill-night-2 stroke-night-2" strokeWidth=".6" />
      <polygon points={o.map((p) => pt(p, H)).join(" ")} className={`fill-slab-top-lit ${gold ? "stroke-gold" : "stroke-rule-dark"}`} strokeWidth={gold ? 3 : 1} />
    </>
  );
}

/** Low-poly box, coordinates local to the slab centre, sitting on the slab. */
function Box({ d, x, y, z = 0, w, dp, h, gold }: { d: Mod; x: number; y: number; z?: number; w: number; dp: number; h: number; gold?: boolean }) {
  // props were drawn for a 180 slab: scaled to this one, and pushed to the back half so the label has the front
  const f = S / 180;
  const p = prism(POS[d][0] * P + x * f - 22, POS[d][1] * P + y * f - 22, H + z * f, w * f, dp * f, h * f);
  return (
    <>
      <polygon points={p.left} className="fill-night-3 stroke-rule-dark" strokeWidth=".6" />
      <polygon points={p.right} className="fill-night-2 stroke-rule-dark" strokeWidth=".6" />
      <polygon points={p.top} className={`${gold ? "fill-gold" : "fill-slate"} stroke-rule-dark`} strokeWidth=".6" />
    </>
  );
}

function Props({ d }: { d: Mod }) {
  if (d === "sales")
    return (
      <>
        <Box d={d} x={-55} y={-25} w={110} dp={44} h={26} />
        <Box d={d} x={-30} y={-22} z={26} w={38} dp={30} h={14} gold />
        <Box d={d} x={30} y={28} w={32} dp={24} h={3} />
        <Box d={d} x={32} y={30} z={3} w={32} dp={24} h={3} />
      </>
    );
  if (d === "inventory")
    return (
      <>
        {[-70, -34, 2, 38].map((x, i) => (
          <g key={x}>
            <Box d={d} x={x} y={-40} w={30} dp={30} h={22 + (i % 2) * 14} gold={i === 2} />
            <Box d={d} x={x} y={14} w={30} dp={30} h={36 - (i % 2) * 12} />
          </g>
        ))}
      </>
    );
  if (d === "production")
    return (
      <>
        <Box d={d} x={-60} y={-50} w={40} dp={40} h={62} />
        <Box d={d} x={-8} y={-50} w={40} dp={40} h={46} />
        <Box d={d} x={-60} y={8} w={46} dp={36} h={28} />
        <Box d={d} x={0} y={20} w={72} dp={24} h={10} gold />
      </>
    );
  if (d !== "finance" && d !== "tax") return null;
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} d={d} x={-40 + i * 2} y={-30 + i} z={i * 14} w={80 - i * 4} dp={60 - i * 2} h={14} />
      ))}
      <Box d={d} x={-46} y={-36} z={56} w={92} dp={68} h={8} gold />
    </>
  );
}

const link = (a: Mod, b: Mod) => {
  const [ax, ay] = [POS[a][0] * P, POS[a][1] * P];
  const [bx, by] = [POS[b][0] * P, POS[b][1] * P];
  const s = S / 2; // half slab
  const dx = Math.sign(bx - ax);
  const dy = Math.sign(by - ay);
  return `M${pt([ax + dx * s, ay + dy * s], H)}L${pt([bx - dx * s, by - dy * s], H)}`;
};

export function IsoWorld({ props = false, collapsed = false, className = "", underlay }: { props?: boolean; collapsed?: boolean; className?: string; underlay?: ReactNode }) {
  const park = centre("sales", H + 95);
  return (
    <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} aria-hidden="true" focusable="false" className={`block h-auto w-full overflow-visible ${className}`}>
      <g transform={`translate(${ORIGIN.x} ${ORIGIN.y})`}>
        <g data-cam="">
          {props && (
            <g>
              {CHAIN.slice(0, -1).map((d, i) => {
                const e = link(d, CHAIN[i + 1]);
                return (
                  <g key={d} fill="none" strokeLinecap="round" strokeWidth="6">
                    <path d={e} className="stroke-rule-dark" />
                    <path d={e} data-link="" pathLength={1} strokeDasharray={1} strokeDashoffset={0} className="stroke-gold" />
                  </g>
                );
              })}
            </g>
          )}
          {underlay}
          {MODS.map(({ id: d, label }) => {
            const c = collapse(d);
            return (
              <g key={d} data-d={d} style={collapsed ? { transform: `translate(${f(c.x)}px,${f(c.y)}px)` } : undefined}>
                <Slab d={d} gold={d === "sales"} />
                {props && (
                  <g data-props="">
                    <Props d={d} />
                    <text x={centre(d, H)[0]} y={centre(d, H)[1] + 12} textAnchor="middle" className="fill-ground font-sans text-[26px] font-bold">
                      {label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          {props && (
            <g data-chip="" style={{ transform: `translate(${f(park[0])}px,${f(park[1])}px)` }}>
              <rect x="-112" y="-21" width="224" height="42" rx="10" className="fill-gold" />
              <text y="7" textAnchor="middle" className="fill-ink font-mono text-xl font-medium">
                SI-2083/84-00001
              </text>
            </g>
          )}
        </g>
      </g>
    </svg>
  );
}
