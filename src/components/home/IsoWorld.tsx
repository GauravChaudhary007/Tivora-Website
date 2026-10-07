import type { ReactNode } from "react";
import { iso } from "@/lib/iso";
import { CHAIN, H, MODS, ORIGIN, P, POS, S, VB, centre, outline, type Mod } from "./world";

// The modules world: the sixteen working areas as rounded slabs on a 4 x 4 grid in business order, and the process line that snakes through the
// fourteen stage modules. Server component, decorative (aria-hidden). The tour (ModulesTour) finds parts by data attributes.
const f = (n: number) => n.toFixed(1);
const pt = ([x, y]: [number, number], z: number) => iso(x, y, z).map(f).join(",");

function Slab({ d, always }: { d: Mod; always?: boolean }) {
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
  const top = o.map((p) => pt(p, H)).join(" ");
  return (
    <>
      <path d={left} className="fill-night-3 stroke-night-3" strokeWidth=".6" />
      <path d={right} className="fill-night-2 stroke-night-2" strokeWidth=".6" />
      <polygon points={top} className={`fill-slab-top-lit ${always ? "stroke-gold" : "stroke-rule-dark"}`} strokeWidth={always ? 3 : 1} />
      {!always && <polygon data-ring="" points={top} fill="none" strokeWidth="4" className="stroke-gold" opacity="0" />}
    </>
  );
}

const edge = (d: Mod, dx: number, dy: number): [number, number] => [POS[d][0] * P + (dx * S) / 2, POS[d][1] * P + (dy * S) / 2];
/** Link between consecutive stage modules: straight along a row, otherwise down the gutter between rows (so it never crosses a slab). */
const link = (a: Mod, b: Mod) => {
  if (POS[a][1] === POS[b][1]) return `M${pt(edge(a, 1, 0), H)}L${pt(edge(b, -1, 0), H)}`;
  const gy = ((POS[a][1] + POS[b][1]) / 2) * P;
  return `M${pt(edge(a, 0, 1), H)}L${pt([POS[a][0] * P, gy], H)}L${pt([POS[b][0] * P, gy], H)}L${pt(edge(b, 0, -1), H)}`;
};
const stageIndex = (d: Mod) => MODS.find((m) => m.id === d)!.stage - 1; // index into STAGES (beats.ts)

export function IsoWorld({ props = false, className = "", underlay }: { props?: boolean; className?: string; underlay?: ReactNode }) {
  return (
    <svg
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      aria-hidden="true"
      focusable="false"
      className={`block h-auto w-full overflow-visible max-lg:not-in-data-live:min-w-160 ${className}`}
    >
      <g transform={`translate(${ORIGIN.x} ${ORIGIN.y})`}>
        <g data-cam="">
          {props && (
            <g>
              {CHAIN.slice(0, -1).map((d, i) => {
                const e = link(d, CHAIN[i + 1]);
                return (
                  <g key={d} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6">
                    <path d={e} className="stroke-rule-dark" />
                    <path d={e} data-link="" data-stage={stageIndex(CHAIN[i + 1])} pathLength={1} strokeDasharray={1} strokeDashoffset={0} className="stroke-gold" />
                  </g>
                );
              })}
            </g>
          )}
          {underlay}
          {MODS.map(({ id: d, label, stage }) => {
            const [cx, cy] = centre(d, H);
            const y0 = cy + (label.length > 1 ? 4 : 18);
            return (
              <g key={d} data-d={d} data-always={stage === 0 ? "" : undefined}>
                <Slab d={d} always={stage === 0} />
                {props && (
                  <g data-props="">
                    {stage > 0 && (
                      <text x={cx} y={cy - 24} textAnchor="middle" className="fill-gold-light font-mono text-[24px] font-bold">
                        {stage}
                      </text>
                    )}
                    <text textAnchor="middle" className="fill-ground font-sans text-[30px] font-bold">
                      {label.map((l, i) => (
                        <tspan key={l} x={cx} y={y0 + i * 34}>
                          {l}
                        </tspan>
                      ))}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
}
