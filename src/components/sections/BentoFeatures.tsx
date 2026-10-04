"use client";

import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Bell, CalendarDays, MousePointerClick, RefreshCw, Search, SunMoon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const R = "रु";

/**
 * "Active" bento grid: each tile demonstrates a real detail of the product.
 * Tiles animate on hover (desktop) or when scrolled into view (touch devices).
 */
export function BentoFeatures() {
  return (
    <section id="details" className="relative overflow-hidden bg-paper pb-24 sm:pb-32">
      <div className="container-x">
        <SectionHeading
          index="02"
          eyebrow="Designed for daily use"
          title="Powerful underneath. Effortless on top."
          description="The details your team touches a hundred times a day — built to be fast, familiar and obvious."
        />

        <div className="mt-12 grid auto-rows-[minmax(220px,auto)] gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Tile className="sm:col-span-2 lg:row-span-2" title="The whole business on one page" text="An executive dashboard that tells you, at a glance, whether today is on target." >
            {(on) => <DashboardDemo on={on} />}
          </Tile>
          <Tile icon={Search} title="Find anything with Ctrl K" text="Every screen, report and register — one shortcut away.">
            {(on) => <SearchDemo on={on} />}
          </Tile>
          <Tile icon={CalendarDays} title="Bikram Sambat, natively" text="Dates, months and fiscal years the way Nepal works.">
            {(on) => <DateDemo on={on} />}
          </Tile>
          <Tile icon={Bell} title="Alerts that matter" text="Over-limit customers, late orders, pending approvals — surfaced for you.">
            {(on) => <AlertsDemo on={on} />}
          </Tile>
          <Tile icon={RefreshCw} title="Always current" text="Figures refresh on their own, every few minutes.">
            {(on) => <RefreshDemo on={on} />}
          </Tile>
          <Tile className="sm:col-span-2" icon={MousePointerClick} title="Click any figure for the detail behind it" text="Every number opens the register it came from.">
            {(on) => <DrillDemo on={on} />}
          </Tile>
          <Tile className="sm:col-span-2" icon={SunMoon} title="Light by default, dark by choice" text="Comfortable for a full day at the counter or the desk.">
            {(on) => <ThemeDemo on={on} />}
          </Tile>
        </div>
      </div>
    </section>
  );
}

function Tile({
  title,
  text,
  icon: Icon,
  className = "",
  children,
}: {
  title: string;
  text: string;
  icon?: typeof Search;
  className?: string;
  children: (active: boolean) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const inView = useInView(ref, { amount: 0.6 });
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const sync = () => setTouch(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // While visible, each demo plays on its own; hovering takes over.
  const [auto, setAuto] = useState(false);
  useEffect(() => {
    if (!inView || hover) return;
    const id = window.setInterval(() => setAuto((a) => !a), touch ? 2600 : 3400);
    return () => window.clearInterval(id);
  }, [inView, hover, touch]);

  const active = hover || auto;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onPointerMove={onMove}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white p-5 transition-[border-color,box-shadow] duration-300 hover:border-app-accent/40 hover:shadow-[0_20px_50px_-24px_rgb(18_165_148/0.35)] sm:p-6 ${className}`}
    >
      {/* Cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(380px circle at var(--mx) var(--my), rgb(18 165 148 / 0.08), transparent 60%)" }}
      />
      <div className="relative flex-1">{children(active)}</div>
      <div className="relative mt-5">
        <p className="flex items-center gap-2 text-[15px] font-semibold text-midnight">
          {Icon && <Icon className="size-4 text-app-accent" aria-hidden />}
          {title}
        </p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{text}</p>
      </div>
    </motion.div>
  );
}

/* ---------- Tile demos (all drawn in the application's own palette) ---------- */

function DashboardDemo({ on }: { on: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} className="h-full rounded-2xl border border-app-border bg-app-bg p-4 font-app text-app-ink sm:p-5">
      <p className="text-[10px] font-semibold tracking-[0.14em] text-app-accent">EXECUTIVE DASHBOARD</p>
      <p className="font-app-serif text-xl font-semibold">Demo Showroom</p>
      <p className="text-[11px] text-app-label">Figures as of 16:17 · refreshes every 5 minutes</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-app-border bg-app-tint/70 p-3.5">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-app-label">SALES · ASWIN 2083</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">
            <span className="mr-1 text-2xl">{R}</span>26.87L
          </p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-app-border/70">
            <motion.div className="h-full rounded-full bg-app-accent" initial={{ width: 0 }} animate={{ width: seen ? "100%" : 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
          </div>
          <p className="mt-1.5 text-[11px] text-app-label">107% of the {R} 25.00L target</p>
        </div>
        <div className="rounded-xl border border-app-border bg-app-card p-3.5">
          <p className="text-[12px] font-semibold">Running total against target</p>
          <svg viewBox="0 0 220 100" className="mt-2 w-full" aria-hidden>
            {[20, 50, 80].map((y) => (
              <line key={y} x1="0" x2="220" y1={y} y2={y} stroke="#ECECE6" />
            ))}
            <path d="M0 98 L220 36" stroke="#A9B0C2" strokeWidth="1.2" fill="none" />
            <motion.path
              key={on ? "on" : "off"}
              d="M0 98 L36 98 L50 80 L62 54 L95 54 L108 32 L132 32"
              stroke="#12A594"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: seen ? 1 : 0 }}
              transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
            />
            <circle cx="132" cy="32" r="3" fill="#12A594" />
          </svg>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ["Money received", `${R} 68.0K`],
          ["Customers owe", `${R} 35.08L`],
          ["Cash & bank", `${R} 45.20L`],
          ["Orders on hand", `${R} 23.43L`],
          ["Gross profit", `${R} 4.73L`],
          ["We owe", `${R} 3.73Cr`],
          ["Stock at cost", `${R} 1.83Cr`],
          ["Gold position", "842.482 g"],
        ].map(([t, v], i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 8 }}
            animate={seen ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="rounded-lg border border-app-border bg-app-card p-2.5"
          >
            <p className="truncate text-[10px] text-app-label">{t}</p>
            <p className="text-sm font-semibold">{v}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function useTyped(text: string, on: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setN((c) => (on ? Math.min(c + 1, text.length) : Math.max(c - 2, 0))), on ? 90 : 25);
    return () => window.clearInterval(id);
  }, [on, text]);
  return text.slice(0, n);
}

function SearchDemo({ on }: { on: boolean }) {
  const q = useTyped("gold lo", on);
  const results = ["Gold Loans", "Gold position", "Metal out"];
  return (
    <div className="font-app">
      <div className="flex items-center gap-2 rounded-lg border border-app-border bg-app-card px-3 py-2 text-[13px] text-app-ink shadow-sm">
        <Search className="size-3.5 text-app-label" aria-hidden />
        <span className="min-w-0 flex-1 truncate">
          {q || <span className="text-app-label/70">Search the menu…</span>}
          <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-app-ink" />
        </span>
        <span className="rounded border border-app-border px-1 font-mono text-[9.5px] text-app-accent">Ctrl K</span>
      </div>
      <AnimatePresence>
        {q.length > 3 && (
          <motion.ul initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 overflow-hidden rounded-lg border border-app-border bg-app-card text-[12.5px] shadow-md">
            {results.map((r, i) => (
              <li key={r} className={`px-3 py-1.5 ${i === 0 ? "bg-app-tint font-semibold text-app-accent" : "text-app-ink"}`}>
                {r}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function DateDemo({ on }: { on: boolean }) {
  return (
    <div className="grid h-full place-items-center font-app">
      <div className="w-full rounded-xl border border-app-border bg-app-bg p-4 text-center">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-app-accent">TODAY</p>
        <div className="relative mt-1 h-8 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={on ? "ad" : "bs"}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-app-serif text-2xl font-semibold text-app-ink"
            >
              {on ? "4 Oct 2026" : "Aswin 18, 2083"}
            </motion.p>
          </AnimatePresence>
        </div>
        <p className="mt-1 font-mono text-[11px] text-app-label">2083-06-18 BS</p>
      </div>
    </div>
  );
}

function AlertsDemo({ on }: { on: boolean }) {
  const items = [
    { t: "1 customer over the credit limit", c: "text-app-negative border-app-negative/30 bg-[#FDECEC]" },
    { t: "7 late on the Purchase desk", c: "text-app-warning border-app-warning/30 bg-app-tint" },
    { t: "2 past the promised date", c: "text-app-warning border-app-warning/30 bg-app-tint" },
  ];
  return (
    <div className="font-app">
      <div className="flex items-center gap-2">
        <motion.span animate={on ? { rotate: [0, -14, 12, -8, 0] } : { rotate: 0 }} transition={{ duration: 0.7 }} className="relative grid size-9 place-items-center rounded-lg border border-app-border bg-app-card">
          <Bell className="size-4 text-app-ink" aria-hidden />
          <span className="absolute -right-2 -top-2 rounded-full bg-app-negative px-1.5 text-[10px] font-semibold text-white">50</span>
        </motion.span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {items.map((it, i) => (
          <motion.li
            key={it.t}
            animate={{ opacity: on ? 1 : 0.45, x: on ? 0 : -4 }}
            transition={{ delay: on ? i * 0.1 : 0 }}
            className={`w-fit rounded-full border px-2.5 py-1 text-[11.5px] ${it.c}`}
          >
            {it.t}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function RefreshDemo({ on }: { on: boolean }) {
  return (
    <div className="flex items-center gap-4 font-app">
      <div className="relative size-16">
        <svg viewBox="0 0 40 40" className="size-full -rotate-90" aria-hidden>
          <circle cx="20" cy="20" r="16" fill="none" stroke="#ECECE6" strokeWidth="3" />
          <motion.circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="#12A594"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0.15 }}
            animate={{ pathLength: on ? 1 : 0.15 }}
            transition={{ duration: on ? 2.2 : 0.4, ease: "linear" }}
          />
        </svg>
        <RefreshCw className={`absolute inset-0 m-auto size-4 text-app-accent ${on ? "animate-spin [animation-duration:2.2s]" : ""}`} aria-hidden />
      </div>
      <div className="text-[12px] text-app-label">
        <p>Figures as of {on ? "16:22" : "16:17"}</p>
        <p>refreshes every 5 minutes</p>
      </div>
    </div>
  );
}

function DrillDemo({ on }: { on: boolean }) {
  return (
    <div className="grid gap-3 font-app sm:grid-cols-[0.9fr_1.1fr]">
      <div className={`rounded-xl border bg-app-card p-4 transition-colors ${on ? "border-app-accent/50" : "border-app-border"}`}>
        <p className="text-[12px] text-app-label">Cash & bank</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-app-ink">{R} 45.20L</p>
        <p className="mt-1 text-[11.5px] font-semibold text-app-ink">Cash position ›</p>
      </div>
      <AnimatePresence>
        {on && (
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl border border-app-border bg-app-bg p-4 text-[12px] text-app-ink"
          >
            {[
              ["Cash", "25.52L", 56],
              ["Bank", "19.68L", 44],
            ].map(([k, v, w]) => (
              <div key={k as string} className="mb-2.5 last:mb-0">
                <div className="flex justify-between">
                  <span>{k}</span>
                  <span className="font-semibold">
                    {R} {v}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-app-border/60">
                  <motion.div className="h-full rounded-full bg-app-accent" initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 0.7, delay: 0.15 }} />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThemeDemo({ on }: { on: boolean }) {
  const dark = on;
  return (
    <motion.div
      animate={{ backgroundColor: dark ? "#0F1530" : "#F2F2EE", borderColor: dark ? "#26316A" : "#E3E3DC" }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-4 rounded-xl border p-4 font-app"
    >
      <motion.div animate={{ backgroundColor: dark ? "#141C3D" : "#ffffff", borderColor: dark ? "#26316A" : "#E3E3DC" }} className="flex-1 rounded-lg border p-3">
        <motion.p animate={{ color: dark ? "#9AA3C0" : "#5F6573" }} className="text-[11px]">
          Gold position
        </motion.p>
        <motion.p animate={{ color: dark ? "#F2F2EE" : "#141C3D" }} className="text-lg font-semibold">
          842.482 g
        </motion.p>
      </motion.div>
      <motion.span animate={{ color: dark ? "#3FD6C4" : "#12A594", borderColor: dark ? "#26316A" : "#E3E3DC" }} className="rounded-lg border px-3 py-2 text-[12px] font-semibold">
        Metal out ›
      </motion.span>
    </motion.div>
  );
}
