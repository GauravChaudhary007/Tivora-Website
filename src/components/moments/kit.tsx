"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Shared parts of the "product moments": app screens rebuilt in code from the CEO brochure's simplified screens (sample data), so they stay sharp and
// readable at any size. Each moment plays a short story once it is on screen and then loops. Reduced motion and server render: the finished state, still.

/** Story speed: 1 = the timings as written. Kept brisk so a visitor scrolling past still sees something happen. */
const SPEED = 0.6;

/**
 * Runs a story: `at` is when each step starts (ms), `loop` the length of one run. Returns the current step; the last step is the finished state.
 * The first run builds the screen from `at[0]`; later runs restart at `repeatFrom`, so the screen never goes blank and only the action replays.
 * Starts as soon as a fifth of the moment is on screen.
 */
export function useStory(at: number[], loop: number, repeatFrom = 1) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(at.length - 1);
  const [live, setLive] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    let first = true;
    const stop = () => timers.forEach(clearTimeout);
    const play = () => {
      stop();
      const from = first ? 0 : repeatFrom;
      const t0 = at[from];
      first = false;
      timers = at.slice(from).map((t, i) => setTimeout(() => setStep(from + i), (t - t0) * SPEED));
      timers.push(setTimeout(play, (loop - t0) * SPEED));
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLive(true);
          play();
        } else stop();
      },
      { threshold: 0.2 },
    );
    if (ref.current) io.observe(ref.current);
    return () => {
      io.disconnect();
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the story is fixed per moment
  }, []);
  return { ref, step, live };
}

/** Counts towards `target` (ease-out). An interrupted count resumes from what is on screen. */
export function useCount(target: number, run: boolean, ms = 600) {
  const [n, setN] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (!run) return;
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const v = a + (target - a) * (1 - (1 - p) ** 3);
      from.current = v;
      setN(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return n;
}

/** Light app window with pared-down chrome, and the standard caption under it. */
export function Frame({
  frameRef,
  title,
  meta = "Himalayan Traders · FY 2083/84",
  label,
  children,
}: {
  frameRef: React.Ref<HTMLDivElement>;
  title: string;
  meta?: string;
  /** What the moment shows, for screen readers. */
  label: string;
  children: ReactNode;
}) {
  return (
    <figure>
      <div
        ref={frameRef}
        role="img"
        aria-label={label}
        className="relative overflow-hidden rounded-frame border border-rule bg-ground text-ink shadow-frame in-data-[tone=night]:border-transparent in-data-[tone=night]:shadow-frame-dark"
      >
        <div className="flex items-center gap-2 border-b border-rule bg-paper px-4 py-2.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-rule" />
          <span className="size-2.5 rounded-full bg-rule" />
          <span className="size-2.5 rounded-full bg-rule" />
          <span className="ml-3 truncate rounded-full bg-ground px-3 py-0.5 text-eyebrow text-muted">{title}</span>
          <span className="ml-auto hidden shrink-0 text-eyebrow text-muted sm:inline">{meta}</span>
        </div>
        <div className="space-y-4 p-4 sm:p-6" aria-hidden="true">
          {children}
        </div>
      </div>
      <figcaption className="mt-3 text-small text-muted in-data-[tone=night]:text-muted-dark">Simplified screen with sample data.</figcaption>
    </figure>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-mono text-eyebrow font-medium text-accent uppercase">{children}</p>;
}

/** A KPI tile. `bar` (0-100) draws a progress bar; `tone` colours the value. */
export function Tile({ label, value, note, tone, bar, flash }: { label: string; value: string; note?: string; tone?: "no" | "ok"; bar?: number; flash?: boolean }) {
  return (
    <div className={`rounded-xl border bg-paper p-3 transition-colors duration-500 ${flash ? "border-gold bg-tint" : "border-rule"}`}>
      <p className="text-[0.75rem] leading-tight text-muted">{label}</p>
      <p className={`mt-1 font-display text-xl font-semibold tabular-nums sm:text-2xl ${tone === "no" ? "text-no" : tone === "ok" ? "text-ok" : ""}`}>{value}</p>
      {note && <p className="mt-0.5 text-[0.75rem] leading-tight text-muted">{note}</p>}
      {bar !== undefined && (
        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-rule">
          <span className="block h-full rounded-full bg-gold" style={{ width: `${Math.max(0, Math.min(100, bar))}%` }} />
        </span>
      )}
    </div>
  );
}

/** Status pill: "no" (critical, waiting), "ok" (done), or neutral. */
export function Pill({ tone, children }: { tone?: "no" | "ok"; children: ReactNode }) {
  const c = tone === "no" ? "bg-no-tint text-no" : tone === "ok" ? "bg-ok-tint text-ok" : "bg-tint text-muted";
  return <span className={`inline-block rounded-md px-2 py-0.5 font-mono text-[0.6875rem] font-medium whitespace-nowrap uppercase ${c}`}>{children}</span>;
}

/** An action button; `pressing` shows the press. */
export function Btn({ pressing, ghost, children }: { pressing?: boolean; ghost?: boolean; children: ReactNode }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-md px-3 py-1 text-small font-bold whitespace-nowrap transition-transform duration-200 ${
        ghost ? "border border-rule bg-paper" : "bg-accent text-paper"
      } ${pressing ? "scale-95 ring-4 ring-gold/40" : ""}`}
    >
      {children}
    </span>
  );
}

/** Fades and lifts children in when `on`; `delay` staggers siblings. */
export function Appear({ on, delay = 0, className = "", children }: { on: boolean; delay?: number; className?: string; children: ReactNode }) {
  return (
    <div
      style={{ transitionDelay: on ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-500 ease-(--ease-out-expo) ${on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}

/** Horizontal bar that grows to `value` (percent of `max`) when `on`. */
export function GrowBar({ value, max = 100, on, tone }: { value: number; max?: number; on: boolean; tone?: "no" | "ok" }) {
  const c = tone === "no" ? "bg-no" : tone === "ok" ? "bg-ok" : "bg-gold";
  return (
    <span className="block h-2 overflow-hidden rounded-full bg-rule">
      <span className={`block h-full rounded-full transition-[width] duration-1000 ease-(--ease-out-expo) ${c}`} style={{ width: on ? `${Math.min(100, (value / max) * 100)}%` : "0%" }} />
    </span>
  );
}
