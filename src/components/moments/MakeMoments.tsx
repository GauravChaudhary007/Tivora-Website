"use client";

import { Appear, Btn, Eyebrow, Frame, GrowBar, Pill, Tile, useCount, useStory } from "./kit";

// MRP workbench (brochure p8): demand is netted against stock and open orders, shortfalls show their action, and purchase requests are created.
const ITEMS = [
  { item: "Titanium dioxide", short: "4,500 kg", action: "Import", by: "Kartik 8" },
  { item: "Acrylic resin", short: "1,300 kg", action: "Purchase", by: "Kartik 15" },
  { item: "Tin container 20 L", short: "400 pcs", action: "Purchase", by: "Kartik 18" },
  { item: "Pigment paste, blue", short: "730 kg", action: "Produce", by: "Kartik 20" },
  { item: "Thickener", short: "None", action: "Covered", by: "—" },
];

export function PlanningMoment() {
  const { ref, step, live } = useStory([0, 300, 900, 2300, 2900], 8000, 2);
  const made = step >= 4;
  const cost = useCount(step >= 1 ? 1.94 : 0, live);
  const cap = useCount(step >= 1 ? 88 : 0, live);
  return (
    <Frame frameRef={ref} title="MRP workbench" meta="Plan: Kartik 2083" label="MRP workbench example: each material's shortfall with what to buy or make and by when, then purchase requests and work orders created">
      <div className="grid grid-cols-3 gap-3">
        <Tile label="Plan cost of materials" value={`Rs ${cost.toFixed(2)} Cr`} />
        <Tile label="Machine capacity used" value={`${Math.round(cap)}%`} bar={cap} />
        <Tile label="Items at stock-out risk" value={step >= 1 ? "1" : "0"} tone="no" />
      </div>
      <div className="overflow-hidden rounded-xl border border-rule bg-paper">
        <div className="grid grid-cols-[1fr_5rem_6rem] gap-2 border-b border-rule px-3 py-2 font-mono text-[0.6875rem] text-muted uppercase sm:grid-cols-[1fr_5.5rem_6rem_5.5rem]">
          <span>Item</span>
          <span className="text-right">Shortfall</span>
          <span>Action</span>
          <span className="hidden sm:block">Order by</span>
        </div>
        {ITEMS.map((r, i) => (
          <Appear key={r.item} on={step >= 2} delay={i * 120}>
            <div className="grid grid-cols-[1fr_5rem_6rem] items-center gap-2 border-b border-rule px-3 py-2 text-small last:border-b-0 sm:grid-cols-[1fr_5.5rem_6rem_5.5rem]">
              <span className="truncate font-bold">{r.item}</span>
              <span className="text-right tabular-nums">{r.short}</span>
              <span>
                <Pill tone={r.action === "Covered" ? "ok" : made && r.action !== "Covered" ? "ok" : r.action === "Import" ? "no" : undefined}>
                  {made && r.action !== "Covered" ? (r.action === "Produce" ? "WO made" : "PR made") : r.action}
                </Pill>
              </span>
              <span className="hidden text-muted sm:block">{r.by}</span>
            </div>
          </Appear>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {made ? (
          <p className="text-small font-bold text-ok">4 purchase requests and 1 work order created, each with its lead time.</p>
        ) : (
          <>
            <Btn pressing={step === 3}>Create purchase requests</Btn>
            <Btn ghost>Create work orders</Btn>
          </>
        )}
      </div>
    </Frame>
  );
}

// Production costing (brochure p9): standard against actual cost as batches are received, variance by product, machine efficiency, and a reminder.
const VARIANCE = [
  { product: "RBD Soyabean Oil", v: "40,400" },
  { product: "Soyabean Oil 1 L pouch", v: "9,200" },
  { product: "Soyabean Oil 2 L jar", v: "6,500" },
];
const MACHINES = [
  { name: "PK-1 Pouch FFS", pct: 80 },
  { name: "PK-2 Jar Filler", pct: 100 },
  { name: "R-1 Refining Line", pct: 90 },
];

export function ProductionMoment() {
  const { ref, step, live } = useStory([0, 300, 900, 2100, 2900], 8000, 2);
  const on = step >= 1;
  const std = useCount(on ? 38.83 : 0, live);
  const act = useCount(on ? 39.4 : 0, live);
  const yld = useCount(on ? 92.6 : 0, live);
  return (
    <Frame frameRef={ref} title="Production dashboard" meta="Aswin 2083" label="Production dashboard example: standard against actual cost, variance by product, machine efficiency and a reminder">
      <div className="grid grid-cols-3 gap-3">
        <Tile label="Standard cost of output" value={`Rs ${std.toFixed(2)} L`} />
        <Tile label="Actual cost" value={`Rs ${act.toFixed(2)} L`} note="Variance 1.49% adverse" tone="no" />
        <Tile label="Yield vs standard" value={`${yld.toFixed(1)}%`} note="Standard 93.5%" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-rule bg-paper p-3">
          <Eyebrow>Variance by product, Rs</Eyebrow>
          <ul className="mt-2 space-y-1.5 text-small">
            {VARIANCE.map((r, i) => (
              <Appear key={r.product} on={step >= 2} delay={i * 120}>
                <li className="flex justify-between gap-2">
                  <span className="truncate">{r.product}</span>
                  <span className="text-no tabular-nums">{r.v}</span>
                </li>
              </Appear>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-rule bg-paper p-3">
          <Eyebrow>Machine efficiency, target 85%</Eyebrow>
          <ul className="mt-3 space-y-2.5 text-small">
            {MACHINES.map((m) => (
              <li key={m.name} className="grid grid-cols-[7.5rem_1fr_2.5rem] items-center gap-2">
                <span className="truncate">{m.name}</span>
                <GrowBar value={m.pct} on={step >= 2} tone={m.pct >= 85 ? "ok" : "no"} />
                <span className="text-right tabular-nums">{m.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Appear on={step >= 3}>
        <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-small transition-colors duration-500 ${step >= 4 ? "bg-ok-tint" : "bg-tint"}`}>
          <Pill tone={step >= 4 ? "ok" : "no"}>{step >= 4 ? "Done" : "Reminder"}</Pill>
          <span className="flex-1">{step >= 4 ? "Abnormal loss journal posted; variance explained." : "Abnormal loss journal not posted"}</span>
          {step < 4 && <Btn pressing={step === 3}>Post</Btn>}
        </div>
      </Appear>
    </Frame>
  );
}
