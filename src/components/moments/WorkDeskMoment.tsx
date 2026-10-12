"use client";

import { Appear, Btn, Eyebrow, Frame, Pill, Tile, useCount, useStory } from "./kit";

// Work Desk (brochure p3): the numbers count up, the critical items arrive, an approval is decided and posted, and TiVora's reminder becomes tasks.
const CRITICAL = [
  { who: "Butwal Electrical House", what: "Credit approval, Rs 3.97 L", action: "Decide" },
  { who: "Biratnagar Electric Mart", what: "Rs 1.57 L over credit limit", action: "Review" },
  { who: "MO-00001", what: "9 days past its due date", action: "Receive" },
];

export function WorkDeskMoment() {
  const { ref, step, live } = useStory([0, 300, 900, 2300, 2900, 3900, 5300, 5900], 9500, 2);
  const decided = step >= 4;
  const tasksMade = step >= 7;
  const tasks = useCount(step < 1 ? 0 : tasksMade ? 21 : 12, live);
  const critical = useCount(step < 1 ? 0 : decided ? 2 : 3, live, 500);
  const waiting = useCount(step < 1 ? 0 : decided ? 4 : 5, live, 500);
  const target = useCount(step < 1 ? 0 : 68, live, 1200);

  return (
    <Frame frameRef={ref} title="Work Desk" label="Work Desk example: today's tasks, three critical items, an approval decided and a reminder turned into tasks">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-xl font-semibold">Good morning, Ramesh</p>
          <p className="text-small text-muted">Sales Manager, Kathmandu branch</p>
        </div>
        <div className="flex flex-wrap gap-2 text-small">
          {["+ Quotation", "Record collection", "Log visit"].map((a) => (
            <span key={a} className="rounded-full border border-rule bg-paper px-3 py-1">
              {a}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Tasks today" value={String(Math.round(tasks))} flash={tasksMade} />
        <Tile label="Critical" value={String(Math.round(critical))} tone="no" />
        <Tile label="Waiting for my approval" value={String(Math.round(waiting))} />
        <Tile label="Month target achieved" value={`${Math.round(target)}%`} bar={target} />
      </div>

      <div>
        <Eyebrow>Needs you now</Eyebrow>
        <ul className="mt-2 space-y-2">
          {CRITICAL.map((c, i) => {
            const done = i === 0 && decided;
            return (
              <li key={c.who}>
                <Appear on={step >= 2} delay={done ? 0 : i * 140}>
                  <div className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors duration-500 ${done ? "border-ok/40 bg-ok-tint" : "border-rule bg-paper"}`}>
                    <Pill tone={done ? "ok" : "no"}>{done ? "Posted" : "Critical"}</Pill>
                    <span className="min-w-0 flex-1 text-small leading-snug">
                      <span className="font-bold">{c.who}</span>
                      <span className="text-muted"> · {done ? "approved, ledgers updated, maker notified" : c.what}</span>
                    </span>
                    {done ? <span className="font-bold text-ok">✓</span> : <Btn pressing={i === 0 && step === 3}>{c.action}</Btn>}
                  </div>
                </Appear>
              </li>
            );
          })}
        </ul>
      </div>

      <Appear on={step >= 5}>
        <div className="rounded-xl border border-gold/50 bg-tint p-4">
          <Eyebrow>TiVora reminds you</Eyebrow>
          <p className="mt-1 text-small">
            {tasksMade
              ? "9 follow-up tasks created and placed on your team's Work Desks."
              : "9 dealers usually reorder within 7 days and have not ordered yet. Create follow-up tasks for your team?"}
          </p>
          {!tasksMade && (
            <div className="mt-3 flex gap-2">
              <Btn pressing={step === 6}>Create 9 tasks</Btn>
              <Btn ghost>Not now</Btn>
            </div>
          )}
        </div>
      </Appear>
    </Frame>
  );
}
