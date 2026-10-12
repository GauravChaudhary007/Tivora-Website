"use client";

import { Appear, Btn, Eyebrow, Frame, GrowBar, Pill, Tile, useCount, useStory } from "./kit";

// Executive dashboard (brochure p4): tiles count up, branches grow against target, today's exceptions arrive and one is assigned to a Work Desk.
const BRANCHES = [
  { name: "Kathmandu", pct: 104 },
  { name: "Biratnagar", pct: 91 },
  { name: "Pokhara", pct: 78 },
  { name: "Birgunj", pct: 62 },
];
const EXCEPTIONS = [
  { area: "Stock", text: "5 items below reorder" },
  { area: "Credit", text: "3 orders on hold" },
  { area: "Purchase", text: "2 POs past due date" },
  { area: "Budget", text: "Project P-07 at 96%" },
];

export function ExecutiveMoment() {
  const { ref, step, live } = useStory([0, 300, 900, 1900, 3300, 3900], 8000, 3);
  const on = step >= 1;
  const revenue = useCount(on ? 4.82 : 0, live, 1100);
  const margin = useCount(on ? 27.4 : 0, live, 1100);
  const cash = useCount(on ? 1.36 : 0, live, 1100);
  const assigned = step >= 5;

  return (
    <Frame frameRef={ref} title="Executive dashboard" meta="All branches · FY 2083/84" label="Executive dashboard example: revenue, margin and cash, sales by branch against target, and today's exceptions">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <p className="font-display text-xl font-semibold">The whole business on one page</p>
        <p className="text-small text-muted">Live as of today 10:42 AM</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Tile label="Revenue MTD" value={`Rs ${revenue.toFixed(2)} Cr`} note="94% of target" bar={on ? 94 : 0} />
        <Tile label="Gross margin" value={`${margin.toFixed(1)}%`} note="▲ 1.2 pts" tone="ok" />
        <Tile label="Cash and bank" value={`Rs ${cash.toFixed(2)} Cr`} note="After 7-day dues" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-rule bg-paper p-3">
          <Eyebrow>Sales by branch vs target</Eyebrow>
          <ul className="mt-3 space-y-2.5">
            {BRANCHES.map((b) => (
              <li key={b.name} className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-2 text-small">
                <span>{b.name}</span>
                <GrowBar value={b.pct} max={110} on={step >= 2} tone={b.pct >= 100 ? "ok" : b.pct < 70 ? "no" : undefined} />
                <span className="text-right tabular-nums">{b.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-rule bg-paper p-3">
          <Eyebrow>Exceptions today</Eyebrow>
          <ul className="mt-2 space-y-1.5">
            {EXCEPTIONS.map((e, i) => (
              <li key={e.area}>
                <Appear on={step >= 3} delay={i * 120}>
                  <div className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-small transition-colors duration-500 ${i === 0 && assigned ? "bg-ok-tint" : ""}`}>
                    <Pill tone={i === 0 && assigned ? "ok" : "no"}>{e.area}</Pill>
                    <span className="min-w-0 flex-1 truncate">{i === 0 && assigned ? "Assigned to Store, on its Work Desk" : e.text}</span>
                    {i === 0 && !assigned && <Btn pressing={step === 4}>Assign</Btn>}
                  </div>
                </Appear>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}

// Dashboards index (brochure p1 "Department health"): one dashboard per department, each reporting its health; a delay is opened and cleared.
const DEPTS = [
  { name: "Sales", status: "On track" },
  { name: "Production", status: "On track" },
  { name: "Purchase", status: "2 delays" },
  { name: "Store", status: "5 below reorder" },
  { name: "Finance", status: "On track" },
  { name: "Trade & Finance", status: "On track" },
];

export function DeptHealthMoment() {
  const { ref, step } = useStory([0, 300, 1300, 2300, 2900], 7000);
  const cleared = step >= 4;
  return (
    <Frame frameRef={ref} title="Dashboards" label="Dashboards example: one dashboard per department, each showing whether it is on track">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <p className="font-display text-xl font-semibold">Department health</p>
        <p className="text-small text-muted">Every dashboard opens on its trend</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {DEPTS.map((d, i) => {
          const late = d.status !== "On track";
          const fixed = cleared && d.name === "Purchase";
          return (
            <li key={d.name}>
              <Appear on={step >= 1} delay={i * 110}>
                <div className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-3 transition-colors duration-500 ${fixed ? "border-ok/40 bg-ok-tint" : "border-rule bg-paper"}`}>
                  <span className="font-bold">{d.name} dashboard</span>
                  {d.name === "Purchase" && step === 3 ? <Btn pressing>Open</Btn> : <Pill tone={fixed ? "ok" : late ? "no" : "ok"}>{fixed ? "On track" : d.status}</Pill>}
                </div>
              </Appear>
            </li>
          );
        })}
      </ul>
      <Appear on={step >= 2}>
        <p className="rounded-xl bg-tint px-3 py-2 text-small">
          {cleared ? "Purchase: both delayed POs chased from the dashboard; the vendors are reminded." : "Purchase has 2 delays. Open the dashboard to see which orders and who owns them."}
        </p>
      </Appear>
    </Frame>
  );
}
