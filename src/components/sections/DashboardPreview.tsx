"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { CalendarRange, ChevronDown, GripVertical, Plus, SlidersHorizontal } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { smoothPath } from "@/lib/chart";

type Kpi = { label: string; value: number; decimals?: number; prefix?: string; suffix?: string; delta: string; up: boolean };
type View = {
  key: string;
  label: string;
  kpis: Kpi[];
  chartTitle: string;
  series: number[];
  barsTitle: string;
  bars: { label: string; value: number }[];
  tableTitle: string;
  table: { a: string; b: string; c: string }[];
  tableHead: [string, string, string];
};

// Nepali fiscal-year months
const months = ["Shr", "Bha", "Asw", "Kar", "Man", "Pou", "Mag", "Fal", "Cha", "Bai", "Jes", "Asa"];

const views: View[] = [
  {
    key: "sales",
    label: "Sales",
    kpis: [
      { label: "Revenue (MTD)", value: 2.48, decimals: 2, prefix: "रु ", suffix: " Cr", delta: "+14.2%", up: true },
      { label: "Orders", value: 1284, delta: "+9.1%", up: true },
      { label: "Avg. order value", value: 19320, prefix: "रु ", delta: "+4.6%", up: true },
      { label: "Quote conversion", value: 31, suffix: "%", delta: "+2.3 pts", up: true },
    ],
    chartTitle: "Revenue by month",
    series: [1.42, 1.51, 1.48, 1.66, 1.79, 1.72, 1.94, 2.08, 2.01, 2.22, 2.31, 2.48],
    barsTitle: "Sales by branch",
    bars: [
      { label: "Kathmandu", value: 42 },
      { label: "Pokhara", value: 24 },
      { label: "Biratnagar", value: 19 },
      { label: "Butwal", value: 15 },
    ],
    tableTitle: "Top customers",
    tableHead: ["Customer", "Orders", "Revenue"],
    table: [
      { a: "Everest Traders", b: "86", c: "18,42,600" },
      { a: "Himal Suppliers", b: "64", c: "14,10,250" },
      { a: "Annapurna Retail", b: "51", c: "11,96,400" },
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    kpis: [
      { label: "Stock value", value: 3.62, decimals: 2, prefix: "रु ", suffix: " Cr", delta: "−2.1%", up: true },
      { label: "Active items", value: 2418, delta: "+36", up: true },
      { label: "Below reorder level", value: 37, delta: "+5", up: false },
      { label: "Stock turnover", value: 6.4, decimals: 1, suffix: "×", delta: "+0.4", up: true },
    ],
    chartTitle: "Stock value by month",
    series: [3.9, 3.84, 3.95, 3.78, 3.7, 3.82, 3.74, 3.66, 3.71, 3.58, 3.64, 3.62],
    barsTitle: "Stock by warehouse",
    bars: [
      { label: "Main store", value: 48 },
      { label: "Plant", value: 27 },
      { label: "Pokhara", value: 14 },
      { label: "Biratnagar", value: 11 },
    ],
    tableTitle: "Low stock",
    tableHead: ["Item", "On hand", "Reorder at"],
    table: [
      { a: "Item SKU-1042", b: "18", c: "40" },
      { a: "Item SKU-0388", b: "6", c: "25" },
      { a: "Item SKU-2210", b: "22", c: "30" },
    ],
  },
  {
    key: "finance",
    label: "Finance",
    kpis: [
      { label: "Receivables", value: 62.4, decimals: 1, prefix: "रु ", suffix: " L", delta: "−3.1%", up: true },
      { label: "Payables", value: 41.8, decimals: 1, prefix: "रु ", suffix: " L", delta: "+1.2%", up: false },
      { label: "Cash & bank", value: 1.12, decimals: 2, prefix: "रु ", suffix: " Cr", delta: "+6.8%", up: true },
      { label: "Net margin", value: 18.6, decimals: 1, suffix: "%", delta: "+1.1 pts", up: true },
    ],
    chartTitle: "Net cash flow by month",
    series: [12, 18, 9, 22, 26, 19, 31, 28, 24, 35, 33, 41],
    barsTitle: "Receivables ageing",
    bars: [
      { label: "0–30 days", value: 58 },
      { label: "31–60", value: 24 },
      { label: "61–90", value: 11 },
      { label: "90+", value: 7 },
    ],
    tableTitle: "Overdue",
    tableHead: ["Customer", "Days", "Amount"],
    table: [
      { a: "Annapurna Retail", b: "92", c: "3,40,000" },
      { a: "Sagarmatha Stores", b: "67", c: "2,15,800" },
      { a: "Lumbini Mart", b: "48", c: "1,22,450" },
    ],
  },
  {
    key: "operations",
    label: "Operations",
    kpis: [
      { label: "Orders fulfilled", value: 96.2, decimals: 1, suffix: "%", delta: "+1.4 pts", up: true },
      { label: "On-time delivery", value: 92, suffix: "%", delta: "+3 pts", up: true },
      { label: "Production on plan", value: 87, suffix: "%", delta: "+4 pts", up: true },
      { label: "Pending approvals", value: 14, delta: "−6", up: true },
    ],
    chartTitle: "Orders fulfilled by month (%)",
    series: [88, 89, 91, 90, 92, 93, 92, 94, 95, 94, 96, 96.2],
    barsTitle: "Department efficiency",
    bars: [
      { label: "Sales", value: 92 },
      { label: "Store", value: 88 },
      { label: "Production", value: 87 },
      { label: "Finance", value: 95 },
    ],
    tableTitle: "Pending approvals",
    tableHead: ["Request", "Dept", "Age"],
    table: [
      { a: "PO-1193", b: "Store", c: "4h" },
      { a: "Credit limit", b: "Sales", c: "1d" },
      { a: "Discount SO-2044", b: "Sales", c: "2h" },
    ],
  },
];

const insights = [
  "Custom dashboards",
  "Custom reports",
  "Business analytics",
  "KPIs",
  "Sales insights",
  "Inventory insights",
  "Financial insights",
  "Operational reporting",
];

export function DashboardPreview() {
  const frame = useRef<HTMLDivElement>(null);
  const inView = useInView(frame, { once: true, margin: "0px 0px -25% 0px" });
  const [loaded, setLoaded] = useState(false);
  const [viewKey, setViewKey] = useState(views[0].key);
  const view = views.find((v) => v.key === viewKey)!;
  const chart = useMemo(() => smoothPath(view.series, 640, 270, 14), [view]);

  // Simulate the dashboard "loading live data" the first time it's seen.
  useEffect(() => {
    if (!inView) return;
    const id = window.setTimeout(() => setLoaded(true), 900);
    return () => window.clearTimeout(id);
  }, [inView]);

  return (
    <section id="dashboards" className="relative overflow-hidden border-t border-line bg-white py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            index="07"
            eyebrow="Reports & dashboards"
            title="Your data. Your dashboard."
            description="Build the dashboards and reports your business actually runs on. Every number is live, and every view can be shaped around your role."
          />
          <Reveal as="ul" className="flex max-w-md flex-wrap gap-2 lg:justify-end" stagger={0.03}>
            {insights.map((i) => (
              <li key={i} className="rounded-full border border-line bg-paper px-3 py-1 text-[12px] font-medium text-graphite">
                {i}
              </li>
            ))}
          </Reveal>
        </div>

        <div ref={frame} className="frame-light mt-12 overflow-hidden rounded-3xl border-app-border bg-app-surface font-app">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-app-border px-4 py-3 sm:px-5">
            <div role="tablist" aria-label="Dashboard views" className="flex rounded-xl bg-app-tint p-1">
              {views.map((v) => (
                <button
                  key={v.key}
                  role="tab"
                  aria-selected={v.key === viewKey}
                  onClick={() => setViewKey(v.key)}
                  className={`relative rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${v.key === viewKey ? "text-app-ink" : "text-app-label hover:text-app-ink"}`}
                >
                  {v.key === viewKey && (
                    <motion.span
                      layoutId="dash-tab"
                      className="absolute inset-0 rounded-lg bg-white shadow-sm"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative">{v.label}</span>
                </button>
              ))}
            </div>
            <div className="ml-auto hidden items-center gap-2 text-[12px] text-app-label md:flex">
              <Pill>All companies <ChevronDown className="size-3" /></Pill>
              <Pill>All branches <ChevronDown className="size-3" /></Pill>
              <Pill>
                <CalendarRange className="size-3.5" /> FY 2083/84
              </Pill>
              <span className="mx-1 h-5 w-px bg-line" />
              <Pill>
                <SlidersHorizontal className="size-3.5" /> Customize
              </Pill>
            </div>
          </div>

          <div className="bg-app-bg p-3 sm:p-5">
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {view.kpis.map((k, i) => (
                <Widget key={i} loaded={loaded}>
                  <p className="truncate text-[12px] text-app-label">{k.label}</p>
                  <p className="mt-2 truncate text-lg font-bold tracking-tight text-app-ink sm:text-2xl">
                    <AnimatedNumber value={k.value} decimals={k.decimals} prefix={k.prefix} suffix={k.suffix} />
                  </p>
                  <p className={`mt-1 font-mono text-[11px] ${k.up ? "text-app-positive" : "text-app-negative"}`}>{k.delta}</p>
                </Widget>
              ))}
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[1.7fr_1fr]">
              {/* Main chart */}
              <Widget loaded={loaded} title={view.chartTitle} tall>
                <div className="relative mt-3">
                  <svg viewBox="0 0 640 284" className="h-auto w-full" aria-hidden>
                    <defs>
                      <linearGradient id="dp-area" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#12A594" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#12A594" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[0, 1, 2, 3].map((i) => (
                      <line key={i} x1="0" x2="640" y1={14 + i * 80} y2={14 + i * 80} stroke="#ECECE6" strokeDasharray="3 5" />
                    ))}
                    <AnimatePresence mode="wait">
                      <motion.g key={view.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        <path d={chart.area} fill="url(#dp-area)" />
                        <motion.path
                          d={chart.line}
                          fill="none"
                          stroke="#12A594"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: loaded ? 1 : 0 }}
                          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
                        />
                        {chart.points.map(([x, y], i) =>
                          i === chart.points.length - 1 ? (
                            <g key={i}>
                              <circle cx={x} cy={y} r="9" fill="#12A594" opacity="0.15" />
                              <circle cx={x} cy={y} r="4" fill="#fff" stroke="#12A594" strokeWidth="2.5" />
                            </g>
                          ) : null,
                        )}
                      </motion.g>
                    </AnimatePresence>
                  </svg>
                  <div className="mt-1 grid grid-cols-12 text-center font-mono text-[9.5px] text-app-label sm:text-[10.5px]">
                    {months.map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                </div>
              </Widget>

              <div className="grid gap-3">
                <Widget loaded={loaded} title={view.barsTitle}>
                  <ul className="mt-3 space-y-2.5">
                    {view.bars.map((b, i) => (
                      <li key={b.label + view.key}>
                        <div className="flex justify-between text-[12px]">
                          <span className="text-app-ink">{b.label}</span>
                          <span className="font-mono text-app-label">{b.value}%</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-app-tint">
                          <motion.div
                            className="h-full rounded-full bg-app-accent"
                            initial={{ width: 0 }}
                            animate={{ width: loaded ? `${b.value}%` : 0 }}
                            transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </Widget>
                <Widget loaded={loaded} title={view.tableTitle}>
                  <table className="mt-2 w-full text-[12px]">
                    <thead>
                      <tr className="text-left text-app-label">
                        <th className="py-1 font-medium">{view.tableHead[0]}</th>
                        <th className="py-1 text-right font-medium">{view.tableHead[1]}</th>
                        <th className="py-1 text-right font-medium">{view.tableHead[2]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {view.table.map((r) => (
                        <tr key={r.a} className="border-t border-app-border text-app-ink">
                          <td className="py-1.5 font-medium">{r.a}</td>
                          <td className="py-1.5 text-right tabular-nums">{r.b}</td>
                          <td className="py-1.5 text-right tabular-nums">{r.c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Widget>
              </div>
            </div>

            <div
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-app-accent/30 py-3.5 text-[13px] font-semibold text-app-label transition-colors "
            >
              <Plus className="size-4" /> Add widget
            </div>
          </div>
        </div>
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-app-label/60">Illustrative data</p>
      </div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 rounded-lg border border-app-border bg-white px-2.5 py-1.5 font-medium text-app-ink">
      {children}
    </span>
  );
}

function Widget({
  children,
  loaded,
  title,
  tall,
}: {
  children: React.ReactNode;
  loaded: boolean;
  title?: string;
  tall?: boolean;
}) {
  return (
    <div className="group relative rounded-2xl border border-app-border bg-white p-4 transition-shadow hover:shadow-[0_6px_20px_-10px_rgb(20_28_61/0.25)]">
      {title && (
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-app-ink">{title}</p>
          <GripVertical className="size-4 text-app-label/0 transition-colors group-hover:text-app-label/60" aria-hidden />
        </div>
      )}
      <AnimatePresence mode="wait" initial={false}>
        {loaded ? (
          <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
            {children}
          </motion.div>
        ) : (
          <motion.div key="s" exit={{ opacity: 0 }} className={`space-y-2.5 pt-1 ${tall ? "h-[240px]" : ""}`}>
            <div className="skeleton h-3 w-1/3 rounded" />
            <div className="skeleton h-6 w-2/3 rounded" />
            <div className={`skeleton w-full rounded ${tall ? "h-44" : "h-3"}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
