"use client";

import { Appear, Frame, useCount, useStory } from "./kit";

// Landed cost (brochure p10): every charge on one import shipment is added and capitalised to the item, ending at the cost per piece.
const HEADS = [
  { head: "Goods, USD 58,600 at Rs 139.80", by: "PO and bill", amt: 8192280 },
  { head: "Customs duty", by: "Manual, per line", amt: 414439 },
  { head: "Inland freight, ICD Sirsiya to Teku", by: "Weight", amt: 228900 },
  { head: "Marine insurance", by: "Value", amt: 96500 },
  { head: "Clearing and forwarding (CHA)", by: "Value", amt: 48000 },
  { head: "LC and bank charges", by: "Value", amt: 47105 },
  { head: "Port and ICD charges", by: "Value", amt: 18500 },
];
const npr = (n: number) => Math.round(n).toLocaleString("en-IN");

export function LandedCostMoment() {
  const { ref, step, live } = useStory([0, ...HEADS.map((_, i) => 300 + i * 300), 300 + HEADS.length * 300 + 200], 8500, 0);
  const shown = Math.max(0, Math.min(HEADS.length, step));
  const total = useCount(HEADS.slice(0, shown).reduce((s, h) => s + h.amt, 0), live, 380);
  const done = step > HEADS.length;
  return (
    <Frame frameRef={ref} title="Landed cost sheet" meta="Shipment: LED bulbs and MCBs" label="Landed cost example: each import charge added and allocated to the item, ending at Rs 330.62 per piece">
      <div className="overflow-hidden rounded-xl border border-rule bg-paper">
        <div className="grid grid-cols-[1fr_6.5rem] gap-2 border-b border-rule px-3 py-2 font-mono text-[0.6875rem] text-muted uppercase sm:grid-cols-[1fr_7rem_6.5rem]">
          <span>Cost head</span>
          <span className="hidden sm:block">Allocated by</span>
          <span className="text-right">Amount, Rs</span>
        </div>
        {HEADS.map((h, i) => (
          <Appear key={h.head} on={shown > i}>
            <div className="grid grid-cols-[1fr_6.5rem] gap-2 border-b border-rule px-3 py-1.5 text-small sm:grid-cols-[1fr_7rem_6.5rem]">
              <span className="truncate">{h.head}</span>
              <span className="hidden text-muted sm:block">{h.by}</span>
              <span className="text-right tabular-nums">{npr(h.amt)}</span>
            </div>
          </Appear>
        ))}
        <div className={`grid grid-cols-[1fr_6.5rem] gap-2 px-3 py-2.5 font-bold transition-colors duration-500 sm:grid-cols-[1fr_7rem_6.5rem] ${done ? "bg-tint" : ""}`}>
          <span>Total landed cost</span>
          <span className="hidden text-accent sm:block">{done ? "Rs 330.62 per pc" : ""}</span>
          <span className="text-right tabular-nums">{npr(total)}</span>
        </div>
      </div>
      <p className="text-small text-muted">Sample figures. Import VAT is taken as input credit, not added to cost.</p>
    </Frame>
  );
}
