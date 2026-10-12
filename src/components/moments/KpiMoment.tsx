"use client";

import { Appear, Frame, GrowBar, Tile, useCount, useStory } from "./kit";

// Work Desk Performance (brochure p5): department scores count up, then each team member's achievement grows against target and earns a grade.
const TEAM = [
  { name: "Ramesh Thapa", role: "Sales Manager", ach: 96, coll: 94, grade: "A" },
  { name: "Sita Gurung", role: "Area Executive", ach: 91, coll: 97, grade: "A" },
  { name: "Bikash Shrestha", role: "Area Executive", ach: 82, coll: 78, grade: "B" },
  { name: "Anil Yadav", role: "Sales Officer", ach: 64, coll: 61, grade: "C" },
];

export function KpiMoment() {
  const { ref, step, live } = useStory([0, 300, 900, 2700], 7000);
  const on = step >= 1;
  const sales = useCount(on ? 94 : 0, live);
  const purchase = useCount(on ? 87 : 0, live);
  const plan = useCount(on ? 82 : 0, live);
  const stock = useCount(on ? 99.1 : 0, live);
  return (
    <Frame frameRef={ref} title="Work Desk Performance" meta="Sales department · Ashwin 2083" label="Work Desk Performance example: department scores and each team member's achievement against target, with a grade">
      <p className="text-small text-muted">Calculated from bills, collections and every task on each person&rsquo;s desk</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Sales: achievement" value={`${Math.round(sales)}%`} />
        <Tile label="Purchase: on-time receipt" value={`${Math.round(purchase)}%`} />
        <Tile label="Production: plan adherence" value={`${Math.round(plan)}%`} />
        <Tile label="Store: stock accuracy" value={`${stock.toFixed(1)}%`} />
      </div>
      <ul className="space-y-2">
        {TEAM.map((t, i) => (
          <li key={t.name}>
            <Appear on={step >= 2} delay={i * 150}>
              <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 rounded-xl border border-rule bg-paper px-3 py-2.5 sm:grid-cols-[11rem_1fr_auto]">
                <span className="text-small leading-tight">
                  <span className="block font-bold">{t.name}</span>
                  <span className="text-muted">{t.role}</span>
                </span>
                <span
                  className={`row-span-2 flex size-9 items-center justify-center rounded-full font-display text-lg font-semibold sm:order-last sm:row-span-1 ${
                    t.grade === "A" ? "bg-ok-tint text-ok" : t.grade === "C" ? "bg-no-tint text-no" : "bg-tint text-accent"
                  }`}
                >
                  {step >= 3 ? t.grade : ""}
                </span>
                <span className="grid grid-cols-[1fr_2.75rem] items-center gap-2 text-small">
                  <GrowBar value={t.ach} on={step >= 2} tone={t.ach >= 90 ? "ok" : t.ach < 70 ? "no" : undefined} />
                  <span className="text-right tabular-nums">{t.ach}%</span>
                </span>
              </div>
            </Appear>
          </li>
        ))}
      </ul>
    </Frame>
  );
}
