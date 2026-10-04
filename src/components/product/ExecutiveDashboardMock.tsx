"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Bell,
  ChartColumn,
  ChevronDown,
  CircleHelp,
  Coins,
  Cpu,
  Factory,
  Gem,
  Home,
  Landmark,
  LayoutGrid,
  Moon,
  Package,
  Percent,
  ReceiptText,
  Settings2,
  ShoppingCart,
  Building,
  Truck,
  Hammer,
  Headset,
  Repeat,
} from "lucide-react";

/** Nepali rupee prefix as used throughout the application. */
const R = "रु";

type Period = {
  key: string;
  tab: string;
  label: string;
  big: string;
  exact: string;
  delta: string;
  deltaText: string;
  pct: number;
  target: string;
  bills: number;
  avg: string;
  chartTitle: string;
  chartSub: string;
  x: string[];
  /** Running total as [x position 0..1, value] steps */
  run: [number, number][];
  /** Value of the target line at x = 1 */
  pace: number;
  yMax: number;
  yUnit: string;
};

const periods: Period[] = [
  {
    key: "today",
    tab: "Today",
    label: "Sales · Today",
    big: "1.84L",
    exact: "1,84,300.00",
    delta: "22%",
    deltaText: "vs the same hours yesterday",
    pct: 74,
    target: "2.50L",
    bills: 2,
    avg: "92.2K",
    chartTitle: "Running total against target",
    chartSub: "Today · behind pace by रु 0.41L",
    x: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    run: [[0, 0], [0.18, 0], [0.24, 0.62], [0.52, 0.62], [0.58, 1.84], [0.78, 1.84]],
    pace: 2.5,
    yMax: 3,
    yUnit: "L",
  },
  {
    key: "month",
    tab: "This month · Aswin",
    label: "Sales · Aswin 2083",
    big: "26.87L",
    exact: "26,87,162.49",
    delta: "659%",
    deltaText: "vs the same days of Bhadra",
    pct: 107,
    target: "25.00L",
    bills: 4,
    avg: "6.72L",
    chartTitle: "Running total against target",
    chartSub: "Aswin 2083 · ahead of pace by रु 12.36L",
    x: ["Aswin 1", "Aswin 4", "Aswin 7", "Aswin 10", "Aswin 13", "Aswin 16", "Aswin 19", "Aswin 22", "Aswin 25", "Aswin 28"],
    run: [[0, 0], [0.18, 0], [0.24, 7], [0.28, 17.5], [0.43, 17.5], [0.49, 26.87], [0.6, 26.87]],
    pace: 25,
    yMax: 40,
    yUnit: "L",
  },
  {
    key: "last",
    tab: "Last month · Bhadra",
    label: "Sales · Bhadra 2083",
    big: "18.42L",
    exact: "18,42,050.00",
    delta: "12%",
    deltaText: "vs Shrawan",
    pct: 74,
    target: "25.00L",
    bills: 11,
    avg: "1.67L",
    chartTitle: "Running total against target",
    chartSub: "Bhadra 2083 · finished below target by रु 6.58L",
    x: ["Bhadra 1", "Bhadra 4", "Bhadra 7", "Bhadra 10", "Bhadra 13", "Bhadra 16", "Bhadra 19", "Bhadra 22", "Bhadra 25", "Bhadra 28"],
    run: [[0, 0], [0.08, 1.2], [0.2, 3.4], [0.33, 6.1], [0.45, 8.2], [0.56, 11.9], [0.7, 13.1], [0.82, 16.4], [1, 18.42]],
    pace: 25,
    yMax: 40,
    yUnit: "L",
  },
  {
    key: "ytd",
    tab: "Year to date",
    label: "Sales · FY 2083/84",
    big: "62.08L",
    exact: "62,08,410.20",
    delta: "18%",
    deltaText: "vs the same period last year",
    pct: 83,
    target: "75.00L",
    bills: 27,
    avg: "2.30L",
    chartTitle: "Running total against target",
    chartSub: "Shrawan to Aswin · behind pace by रु 2.10L",
    x: ["Shrawan", "", "", "Bhadra", "", "", "Aswin", "", "", ""],
    run: [[0, 0], [0.1, 6], [0.22, 12.4], [0.33, 16.8], [0.45, 24.1], [0.56, 35.2], [0.6, 62.08 * 0.62], [0.66, 52], [0.7, 62.08]],
    pace: 107,
    yMax: 120,
    yUnit: "L",
  },
];

const modules = [
  { icon: ChartColumn, name: "Reports Centre", n: "" },
  { icon: ShoppingCart, name: "Purchase & Accounts Payable", n: "29" },
  { icon: Package, name: "Store & Inventory", n: "48" },
  { icon: Cpu, name: "RFID", n: "6" },
  { icon: Factory, name: "Production", n: "1" },
  { icon: Hammer, name: "Karigar / Workshop", n: "18" },
  { icon: Gem, name: "Jewelry Factory", n: "14" },
  { icon: ReceiptText, name: "Sales & Accounts Receivable", n: "42" },
  { icon: Truck, name: "Transport & Delivery", n: "11" },
  { icon: Headset, name: "Customer Services", n: "6" },
  { icon: Coins, name: "Gold Loans", n: "12" },
  { icon: Landmark, name: "Finance & Accounts", n: "41" },
  { icon: Building, name: "Fixed Assets", n: "3" },
  { icon: Repeat, name: "Trade & Finance", n: "20" },
  { icon: Percent, name: "Tax & IRD", n: "19" },
  { icon: Settings2, name: "Administration", n: "22" },
];

const glance = [
  { t: "Gross profit, tagged pieces", v: `${R} 4.73L`, s: `15.7% margin on ${R} 30.23L`, link: "Product-wise register" },
  { t: "Money received", v: `${R} 68.0K`, s: "Cash and card on bills, and receipts from customers", link: "Details" },
  { t: "Customers owe", v: `${R} 35.08L`, s: `6 customers · ${R} 24.38L received but not set against bills`, chip: { tone: "neg", text: "1 customer over the credit limit" }, link: "Outstanding & ageing" },
  { t: "We owe", v: `${R} 3.73Cr`, s: "10 suppliers · most to one gem & stone supplier", chip: { tone: "warn", text: "7 late on the Purchase desk" }, link: "Payable ageing" },
  { t: "Cash & bank", v: `${R} 45.20L`, s: `Cash ${R} 25.52L · Bank ${R} 19.68L`, spark: true, link: "Cash position" },
  { t: "Stock on hand, at cost", v: `${R} 1.83Cr`, s: `36 pieces · metal at market ${R} 1.55Cr`, link: "Stock position" },
  { t: "Gold position", v: "842.482 g", s: "487.369 g in stock · 354.276 g with karigars", link: "Metal out" },
  { t: "Orders on hand", v: `${R} 23.43L`, s: "2 customer orders · 5 sales orders to bill", chip: { tone: "warn", text: "2 past the promised date" }, link: "Details" },
];

export const DASH_W = 1280;
export const DASH_H = 830;

/** A faithful recreation of the Tivora ERP executive dashboard (jewellery edition). */
export function ExecutiveDashboardMock({ compact = false }: { compact?: boolean }) {
  const [pk, setPk] = useState("month");
  const [mode, setMode] = useState<"chart" | "table">("chart");
  const p = periods.find((x) => x.key === pk)!;

  return (
    <div className="flex h-full w-full flex-col bg-app-bg font-app text-[13px] text-app-ink antialiased">
      {/* Top bar */}
      <header className="flex h-[52px] shrink-0 items-center gap-2 border-b border-app-border bg-app-surface px-4">
        <div className={`flex items-center gap-2 pr-3 ${compact ? "" : "w-[206px]"}`}>
          <div className="leading-none">
            <Image src="/brand/tivora-logo.svg" alt="TIVORA ERP" width={598} height={84} unoptimized className="h-[19px] w-auto" />
            <p className="mt-1 whitespace-nowrap pl-[27px] text-[6.5px] font-semibold tracking-[0.06em] text-app-accent">HITECH INTELLIGENT ERP SOLUTION</p>
          </div>
        </div>
        {!compact && (
          <>
            <TopBtn icon={ArrowLeft}>Back</TopBtn>
            <TopBtn icon={Home}>Home</TopBtn>
            <TopBtn icon={LayoutGrid}>Modules</TopBtn>
            <div className="ml-1 flex h-[30px] w-[230px] items-center justify-between rounded-md border border-app-border bg-app-card px-2.5 text-app-label/80">
              Search the menu…
              <span className="rounded border border-app-border px-1 font-mono text-[10px] text-app-accent">Ctrl K</span>
            </div>
            <TopBtn icon={CircleHelp}>Help</TopBtn>
          </>
        )}
        <div className="ml-auto flex items-center gap-2.5">
          {!compact && <span className="whitespace-nowrap rounded-md border border-app-border bg-app-card px-2.5 py-1 font-medium">Demo Showroom</span>}
          <span className="whitespace-nowrap text-app-label">2083-06-18 BS</span>
          {!compact && (
            <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-app-warning/40 bg-app-tint px-2.5 py-0.5 text-[11.5px] text-app-warning">
              <span className="size-1.5 rounded-full bg-app-warning" /> Board rate not set today
            </span>
          )}
          <span className="relative grid size-[30px] place-items-center rounded-md border border-app-border bg-app-card">
            <Bell className="size-3.5" />
            <span className="absolute -right-1.5 -top-1.5 rounded-full bg-app-negative px-1 text-[9px] font-semibold text-white">50</span>
          </span>
          {!compact && <Moon className="size-4 text-app-label" />}
          <span className="grid size-7 place-items-center rounded-full bg-app-tint text-[10px] font-semibold text-app-accent ring-1 ring-app-border">DS</span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        {!compact && (
          <aside className="w-[220px] shrink-0 overflow-hidden border-r border-app-border bg-app-surface px-3 py-3">
            <p className="rounded-md bg-app-tint px-2.5 py-1.5 font-semibold text-app-accent">Dashboards</p>
            <p className="px-2.5 py-1.5 text-app-ink/80">Work Desk</p>
            <p className="px-2.5 py-1.5 text-app-ink/80">Home</p>
            <p className="mt-2 px-2.5 text-[9.5px] font-semibold tracking-[0.12em] text-app-label">MODULES</p>
            <ul className="mt-1">
              {modules.map(({ icon: Icon, name, n }) => (
                <li key={name} className="flex items-center gap-2 rounded-md px-2 py-[4px] text-[12px] leading-tight text-app-ink/85">
                  <span className="grid size-5 shrink-0 place-items-center rounded bg-app-tint text-app-accent">
                    <Icon className="size-3" />
                  </span>
                  <span>{name}</span>
                  <span className="ml-auto text-[10px] text-app-label/60">{n}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Main */}
        <main className={`min-w-0 flex-1 overflow-hidden ${compact ? "px-5 py-5" : "px-8 py-5"}`}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10.5px] font-semibold tracking-[0.14em] text-app-accent">EXECUTIVE DASHBOARD</p>
              <h3 className="mt-1 font-app-serif text-[26px] font-semibold leading-tight">Demo Showroom</h3>
              <p className="text-app-label">The whole business on one page</p>
            </div>
            {!compact && (
              <div className="flex items-center gap-3">
                <div className="text-right text-[11.5px] text-app-label">
                  <p>Sunday, Aswin 18, 2083 · 4 Oct 2026</p>
                  <p>Figures as of 16:17 · refreshes every 5 minutes</p>
                </div>
                <span className="flex items-center gap-1 rounded-md border border-app-border bg-app-card px-3 py-1.5 font-medium">
                  Other dashboards <ChevronDown className="size-3.5" />
                </span>
              </div>
            )}
          </div>

          {/* Period tabs */}
          <div className="mt-4 inline-flex rounded-lg border border-app-border bg-app-card p-1">
            {periods.map((x) => (
              <button
                key={x.key}
                type="button"
                onClick={() => setPk(x.key)}
                className={`relative rounded-md px-3 py-1.5 ${x.key === pk ? "font-semibold text-app-ink" : "text-app-label hover:text-app-ink"}`}
              >
                {x.key === pk && <motion.span layoutId={`period-${compact}`} className="absolute inset-0 rounded-md bg-app-tint" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                <span className="relative">{compact ? x.tab.split(" · ")[0] : x.tab}</span>
              </button>
            ))}
          </div>

          {/* Sales + chart */}
          <div className={`mt-4 grid gap-4 ${compact ? "" : "grid-cols-[0.82fr_1fr]"}`}>
            <div className="rounded-xl border border-app-border bg-app-tint/70 p-5">
              <p className="text-[11px] font-semibold tracking-[0.12em] text-app-label">{p.label.toUpperCase()}</p>
              <AnimatePresence mode="wait">
                <motion.div key={p.key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}>
                  <p className="mt-2 text-[52px] font-semibold leading-none tracking-tight">
                    <span className="mr-2 text-[44px]">{R}</span>
                    {p.big}
                  </p>
                  <p className="mt-3 text-app-label">
                    {R} {p.exact}{" "}
                    <span className="ml-2 font-semibold text-app-positive">▲ {p.delta}</span>{" "}
                    <span className="text-[11.5px]">{p.deltaText}</span>
                  </p>
                  <div className="mt-4 h-[7px] overflow-hidden rounded-full bg-app-border/70">
                    <motion.div
                      className="h-full rounded-full bg-app-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(p.pct, 100)}%` }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[11.5px] text-app-label">
                    <span>
                      {p.pct}% of the {R} {p.target} target
                    </span>
                    <span>{p.pct >= 100 ? "target reached" : `${100 - p.pct}% to go`}</span>
                  </div>
                  <p className="mt-3 text-[14px] text-app-label">
                    <b className="font-semibold text-app-ink">{p.bills}</b> bills{"   "}
                    <b className="ml-3 font-semibold text-app-ink">
                      {R} {p.avg}
                    </b>{" "}
                    average <b className="ml-3 font-semibold text-app-ink">{R} 0</b> returned
                  </p>
                </motion.div>
              </AnimatePresence>
              <span className="mt-4 inline-block rounded-md border border-app-border bg-app-card px-3 py-1.5 font-medium">
                Sales & Accounts Receivable dashboard ›
              </span>
            </div>

            {!compact && (
              <div className="rounded-xl border border-app-border bg-app-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[14px] font-semibold">{p.chartTitle}</p>
                    <p className="text-[11.5px] text-app-label">{p.chartSub}</p>
                  </div>
                  <div className="flex rounded-md border border-app-border p-0.5 text-[11.5px]">
                    {(["chart", "table"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`rounded px-2.5 py-1 capitalize ${mode === m ? "bg-app-tint font-semibold" : "text-app-label"}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                {mode === "chart" ? <RunningChart p={p} /> : <RunningTable p={p} />}
              </div>
            )}
          </div>

          {/* At a glance */}
          <p className="mt-5 text-[14px] font-semibold">
            At a glance <span className="ml-2 text-[11.5px] font-normal text-app-label">Click any figure for the detail behind it</span>
          </p>
          <div className={`mt-2.5 grid gap-3 ${compact ? "grid-cols-2" : "grid-cols-4"}`}>
            {glance.slice(0, compact ? 6 : 8).map((g) => (
              <div
                key={g.t}
                className="group flex min-h-[132px] flex-col rounded-xl border border-app-border bg-app-card p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-app-accent/50 hover:shadow-[0_10px_24px_-14px_rgb(18_165_148/0.45)]"
              >
                <div className="flex items-start justify-between">
                  <p className="text-[12px] text-app-label">{g.t}</p>
                  {g.spark && (
                    <svg viewBox="0 0 80 22" className="h-5 w-20" aria-hidden>
                      <path d="M2 20 C 10 18, 12 8, 22 7 S 34 4, 44 5 S 60 4, 78 4" fill="none" stroke="#A9B0C2" strokeWidth="1.4" />
                      <circle cx="78" cy="4" r="2.4" fill="#12A594" />
                    </svg>
                  )}
                </div>
                <p className="mt-1.5 text-[22px] font-semibold tracking-tight">{g.v}</p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-app-label">{g.s}</p>
                {g.chip && (
                  <span
                    className={`mt-1.5 w-fit rounded-full border px-2 py-0.5 text-[10.5px] ${
                      g.chip.tone === "neg" ? "border-app-negative/30 bg-[#FDECEC] text-app-negative" : "border-app-warning/30 bg-app-tint text-app-warning"
                    }`}
                  >
                    {g.chip.tone === "neg" ? "●" : "!"} {g.chip.text}
                  </span>
                )}
                <p className="mt-auto pt-2 text-[11.5px] font-semibold text-app-ink group-hover:text-app-accent">{g.link} ›</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function TopBtn({ icon: Icon, children }: { icon: typeof Home; children: string }) {
  return (
    <span className="flex h-[30px] items-center gap-1.5 whitespace-nowrap rounded-md border border-app-border bg-app-card px-2.5 text-app-ink/90">
      <Icon className="size-3.5" />
      {children}
    </span>
  );
}

const CW = 560;
const CH = 190;

function RunningChart({ p }: { p: Period }) {
  const { run, area, pace, ticks } = useMemo(() => {
    const y = (v: number) => CH - (v / p.yMax) * CH;
    const pts = p.run.map(([x, v]) => `${(x * CW).toFixed(1)} ${y(v).toFixed(1)}`);
    const last = p.run[p.run.length - 1];
    return {
      run: `M ${pts.join(" L ")}`,
      area: `M ${pts.join(" L ")} L ${(last[0] * CW).toFixed(1)} ${CH} L 0 ${CH} Z`,
      pace: `M 0 ${CH} L ${CW} ${y(p.pace)}`,
      ticks: [0, 0.25, 0.5, 0.75, 1].map((t) => ({ y: CH - t * CH, label: `${Math.round(p.yMax * t)}${t ? p.yUnit : ""}` })),
    };
  }, [p]);
  const last = p.run[p.run.length - 1];

  return (
    <div className="mt-3">
      <div className="flex gap-5 text-[11.5px] text-app-label">
        <span className="flex items-center gap-1.5">
          <span className="h-px w-4 bg-app-pace" /> Target pace ({R} {p.target})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-app-accent" /> Sales so far
        </span>
      </div>
      <svg viewBox={`-34 -8 ${CW + 44} ${CH + 30}`} className="mt-2 w-full" aria-hidden>
        {ticks.map((t) => (
          <g key={t.y}>
            <line x1="0" x2={CW} y1={t.y} y2={t.y} stroke="#ECECE6" />
            <text x="-8" y={t.y + 3.5} textAnchor="end" className="fill-app-label text-[10px]">
              {t.label}
            </text>
          </g>
        ))}
        <motion.path key={`a-${p.key}`} d={area} fill="#12A594" initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} transition={{ duration: 0.8, delay: 0.5 }} />
        <path d={pace} stroke="#A9B0C2" strokeWidth="1.4" fill="none" />
        <motion.path
          key={`r-${p.key}`}
          d={run}
          stroke="#12A594"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
        />
        <motion.circle
          key={`c-${p.key}`}
          cx={last[0] * CW}
          cy={CH - (last[1] / p.yMax) * CH}
          r="3.5"
          fill="#12A594"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2 }}
        />
        {p.x.map((l, i) => (
          <text key={i} x={(i / (p.x.length - 1)) * CW * 0.94} y={CH + 18} className="fill-app-label text-[10px]">
            {l}
          </text>
        ))}
      </svg>
    </div>
  );
}

function RunningTable({ p }: { p: Period }) {
  return (
    <table className="mt-4 w-full text-[12px]">
      <thead>
        <tr className="border-b border-app-border text-left text-app-label">
          <th className="py-1.5 font-medium">Point</th>
          <th className="py-1.5 text-right font-medium">Sales so far</th>
          <th className="py-1.5 text-right font-medium">Target pace</th>
        </tr>
      </thead>
      <tbody>
        {p.run
          .filter((_, i) => i > 0)
          .slice(-5)
          .map(([x, v], i) => (
            <tr key={i} className="border-b border-app-grid">
              <td className="py-1.5">{p.x[Math.min(p.x.length - 1, Math.round(x * (p.x.length - 1)))] || "—"}</td>
              <td className="py-1.5 text-right font-medium">
                {R} {v.toFixed(2)}
                {p.yUnit}
              </td>
              <td className="py-1.5 text-right text-app-label">
                {R} {(x * p.pace).toFixed(2)}
                {p.yUnit}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
