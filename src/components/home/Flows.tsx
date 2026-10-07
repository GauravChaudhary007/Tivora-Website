import { iso } from "@/lib/iso";
import { H, P, POS, type Mod } from "./world";

// Decorative links between modules that cross each other, with a light pulse travelling along each one (CSS only, see .flow-pulse).
// Not data: the gold process line in IsoWorld is the business order; these show that every module is wired to the same database.
const FLOWS: [Mod, Mod, number][] = [
  ["planning", "production", 0], ["sales", "finance", 1.1], ["purchase", "trade", 0.5], ["inventory", "assets", 1.7],
  ["transport", "sales", 0.9], ["customer", "sales", 2.2], ["production", "finance", 1.3], ["finance", "tax", 0.2],
  ["tax", "reports", 1.9], ["control", "maintenance", 1.0], ["workdesk", "sales", 2.5], ["dashboards", "finance", 1.5],
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
