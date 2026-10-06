import { iso } from "@/lib/iso";
import { H, P, POS, type Mod } from "./world";

// Decorative links between modules that cross each other, with a light pulse travelling along each one (CSS only, see .flow-pulse).
// Not data: the gold chain in IsoWorld is the bill's real path; these show that the other modules are wired to the same books.
const FLOWS: [Mod, Mod, number][] = [
  ["purchase", "inventory", 0], ["transport", "sales", 1.1], ["customer", "sales", 0.5], ["sales", "finance", 1.7],
  ["inventory", "trade", 0.9], ["production", "assets", 2.2], ["finance", "reports", 1.3], ["tax", "reports", 0.2],
  ["control", "reports", 1.9], ["assets", "tax", 0.7], ["transport", "production", 2.5], ["purchase", "production", 1.5],
];
const pt = (m: Mod) => iso(POS[m][0] * P, POS[m][1] * P, H).map((n) => n.toFixed(1)).join(",");

export function Flows() {
  return (
    <g data-flows="" fill="none" strokeLinecap="round" strokeWidth="3">
      {FLOWS.map(([a, b, delay]) => {
        const d = `M${pt(a)}L${pt(b)}`;
        return (
          <g key={a + b}>
            <path d={d} className="stroke-rule-dark" />
            <path d={d} pathLength={1} className="flow-pulse stroke-gold" style={{ animationDelay: `${delay}s` }} />
          </g>
        );
      })}
    </g>
  );
}
