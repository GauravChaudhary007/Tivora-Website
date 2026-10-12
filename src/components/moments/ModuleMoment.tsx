"use client";

import type { ModuleMomentData } from "@/content/module-moments";
import { Appear, Btn, Frame, Pill, Tile, useStory } from "./kit";

const DONE = /^(ok|posted|approved|accepted|delivered|resolved|received|invoiced|settled|ready|synced, locked|sent to vendor|pr raised)$/i;
const WAIT = /waiting|below|due|draft|open$|documents/i;

/** One module at work: its key tiles, then a register whose rows arrive, and one row acted on (button pressed, status flips, result line). */
export function ModuleMoment({ name, data }: { name: string; data: ModuleMomentData }) {
  const { ref, step } = useStory([0, 250, 800, 2200, 2800], 7500, 2);
  const acted = step >= 4;
  const grid = "grid grid-cols-[1fr_auto] gap-x-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_6.5rem_8.5rem]";
  return (
    <Frame frameRef={ref} title={`${name} · ${data.screen}`} label={`${name} example: ${data.screen.toLowerCase()} with key figures, and one entry acted on`}>
      <div className="grid grid-cols-3 gap-3">
        {data.tiles.map((t, i) => (
          <Appear key={t.label} on={step >= 1} delay={i * 100}>
            <Tile {...t} />
          </Appear>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-rule bg-paper">
        <div className={`${grid} border-b border-rule px-3 py-2 font-mono text-[0.6875rem] text-muted uppercase`}>
          <span>{data.cols[0]}</span>
          <span className="hidden sm:block">{data.cols[1]}</span>
          <span className="hidden sm:block">{data.cols[2]}</span>
          <span>{data.cols[3]}</span>
        </div>
        {data.rows.map((r, i) => {
          const isAct = i === data.act.row;
          const status = isAct && acted ? data.act.after : r[3];
          const tone = DONE.test(status) ? "ok" : WAIT.test(status) ? "no" : undefined;
          return (
            <Appear key={r[0]} on={step >= 2} delay={i * 120}>
              <div
                className={`${grid} items-center border-b border-rule px-3 py-2 text-small transition-colors duration-500 last:border-b-0 ${
                  isAct && acted ? "bg-ok-tint" : ""
                }`}
              >
                <span className="min-w-0 truncate font-bold">
                  {r[0]}
                  <span className="block truncate font-normal text-muted sm:hidden">
                    {r[1]} · {r[2]}
                  </span>
                </span>
                <span className="hidden min-w-0 truncate sm:block">{r[1]}</span>
                <span className="hidden tabular-nums sm:block">{r[2]}</span>
                <span className="justify-self-end sm:justify-self-start">
                  {isAct && step === 3 ? <Btn pressing>{data.act.button}</Btn> : <Pill tone={tone}>{status}</Pill>}
                </span>
              </div>
            </Appear>
          );
        })}
      </div>
      <Appear on={acted}>
        <p className="rounded-xl bg-tint px-3 py-2 text-small">{data.result}</p>
      </Appear>
    </Frame>
  );
}
