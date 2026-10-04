"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  Boxes,
  CalendarRange,
  ChartColumn,
  Contact,
  Factory,
  Gauge,
  Globe,
  Landmark,
  Calculator,
  Percent,
  Settings2,
  ShoppingCart,
  Truck,
  Users,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { gsap, useGSAP, MOTION_QUERIES } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Mod = { name: string; icon: LucideIcon };

const inner: Mod[] = [
  { name: "Sales", icon: ShoppingCart },
  { name: "Inventory", icon: Boxes },
  { name: "Manufacturing", icon: Factory },
  { name: "Accounting", icon: Calculator },
  { name: "Finance", icon: Landmark },
  { name: "Tax", icon: Percent },
  { name: "Reporting", icon: ChartColumn },
  { name: "Purchase", icon: Truck },
];
const outer: Mod[] = [
  { name: "CRM / Customers", icon: Contact },
  { name: "Production Planning", icon: CalendarRange },
  { name: "Maintenance", icon: Wrench },
  { name: "Trade", icon: Globe },
  { name: "Dashboards", icon: Gauge },
  { name: "Automation", icon: Workflow },
  { name: "Administration", icon: Settings2 },
  { name: "Suppliers", icon: Users },
];

type Placed = Mod & { x: number; y: number; ring: 0 | 1 };

function place(): Placed[] {
  const out: Placed[] = [];
  inner.forEach((m, i) => {
    const a = (i / inner.length) * Math.PI * 2 - Math.PI / 2;
    out.push({ ...m, x: 50 + Math.cos(a) * 25, y: 50 + Math.sin(a) * 25, ring: 0 });
  });
  outer.forEach((m, i) => {
    const a = ((i + 0.5) / outer.length) * Math.PI * 2 - Math.PI / 2;
    out.push({ ...m, x: 50 + Math.cos(a) * 43, y: 50 + Math.sin(a) * 43, ring: 1 });
  });
  return out;
}

const nodes = place();
const byName = Object.fromEntries(nodes.map((n) => [n.name, n]));

const flows = [
  {
    name: "Order to cash",
    path: ["CRM / Customers", "Sales", "Inventory", "Accounting", "Tax"],
    text: "A customer order reserves stock, the invoice posts to accounts and tax is calculated — without anyone re-entering it.",
  },
  {
    name: "Procure to pay",
    path: ["Suppliers", "Purchase", "Inventory", "Finance"],
    text: "Purchases flow from supplier to store to payables, so stock and money always agree.",
  },
  {
    name: "Plan to produce",
    path: ["Production Planning", "Manufacturing", "Inventory", "Maintenance"],
    text: "Plans turn into production, output lands in stock, and machines stay ready for the next run.",
  },
  {
    name: "Data to decisions",
    path: ["Sales", "Finance", "Reporting", "Dashboards"],
    text: "Every transaction feeds live reports and dashboards — the numbers your managers talk about.",
  },
  {
    name: "Automate the routine",
    path: ["Automation", "Sales", "Trade", "Administration"],
    text: "Automations push documents forward and keep teams informed, with one click instead of five screens.",
  },
];

export function ModuleEcosystem() {
  const root = useRef<HTMLDivElement>(null);
  const [flowIdx, setFlowIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const flow = flows[flowIdx];

  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setFlowIdx((i) => (i + 1) % flows.length), 4200);
    return () => window.clearInterval(id);
  }, [auto]);

  const chord = flow.path
    .map((n, i) => `${i ? "L" : "M"} ${byName[n].x.toFixed(2)} ${byName[n].y.toFixed(2)}`)
    .join(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop + ", " + MOTION_QUERIES.mobile, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
        tl.from("[data-eco='core']", { scale: 0.6, opacity: 0, duration: 1, ease: "back.out(1.6)" })
          .from("[data-eco='spoke']", { strokeDashoffset: 60, opacity: 0, duration: 0.8, stagger: 0.03 }, "-=0.5")
          .from(
            "[data-eco='mod']",
            {
              opacity: 0,
              scale: 0.5,
              x: (_i, el) => (50 - Number((el as HTMLElement).dataset.x)) * 4,
              y: (_i, el) => (50 - Number((el as HTMLElement).dataset.y)) * 4,
              duration: 0.9,
              stagger: 0.04,
              ease: "expo.out",
            },
            "<",
          );
      });
    },
    { scope: root },
  );

  return (
    <section id="modules" className="relative overflow-hidden bg-midnight-950 py-24 text-white sm:py-32">
      <div aria-hidden className="bg-grid-dark mask-fade-y pointer-events-none absolute inset-0" />
      <div className="container-x relative">
        <SectionHeading
          index="05"
          eyebrow="Multi-module ERP"
          tone="dark"
          align="center"
          title="Everything your business needs. Connected."
          description="Sixteen modules on one core. Data entered in one place is instantly available everywhere it matters."
        />

        <div ref={root} className="mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-[0.75fr_1.25fr]">
          {/* Flow selector */}
          <div className="order-2 lg:order-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">How modules talk</p>
            <ul className="mt-4 space-y-1.5">
              {flows.map((f, i) => {
                const on = i === flowIdx;
                return (
                  <li key={f.name}>
                    <button
                      type="button"
                      onClick={() => {
                        setAuto(false);
                        setFlowIdx(i);
                      }}
                      className={`relative w-full rounded-xl px-4 py-3 text-left transition-colors ${on ? "" : "hover:bg-white/[0.03]"}`}
                    >
                      {on && (
                        <motion.span
                          layoutId="eco-flow"
                          className="absolute inset-0 rounded-xl border border-teal-light/25 bg-white/[0.05]"
                          transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        />
                      )}
                      <span className="relative flex items-center gap-3">
                        <span className={`font-mono text-[11px] ${on ? "text-teal-light" : "text-white/30"}`}>
                          0{i + 1}
                        </span>
                        <span className={`font-semibold ${on ? "text-white" : "text-white/60"}`}>{f.name}</span>
                      </span>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.span
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="relative block overflow-hidden"
                          >
                            <span className="block pl-8 pt-1.5 text-sm leading-relaxed text-white/55">{f.text}</span>
                            <span className="mt-2.5 flex flex-wrap items-center gap-1 pl-8 font-mono text-[10.5px] text-teal-light/90">
                              {f.path.map((p, k) => (
                                <span key={p}>
                                  {p}
                                  {k < f.path.length - 1 && <span className="px-1 text-white/25">→</span>}
                                </span>
                              ))}
                            </span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Orbit (tablet & desktop) */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto hidden aspect-square w-full max-w-[640px] md:block">
              <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden>
                <g className="origin-center [animation:orbit_120s_linear_infinite] [transform-box:fill-box]">
                  <circle cx="50" cy="50" r="25" fill="none" stroke="rgb(255 255 255 / 0.09)" strokeWidth="0.2" strokeDasharray="0.6 1.2" />
                  <circle cx="50" cy="50" r="43" fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth="0.2" strokeDasharray="0.6 1.2" />
                </g>
                {nodes.map((n) => {
                  const on = flow.path.includes(n.name);
                  return (
                    <line
                      key={n.name}
                      data-eco="spoke"
                      x1="50"
                      y1="50"
                      x2={n.x}
                      y2={n.y}
                      stroke={on ? "rgb(63 214 196 / 0.35)" : "rgb(255 255 255 / 0.06)"}
                      strokeWidth="0.2"
                      strokeDasharray="60"
                      className="transition-[stroke] duration-500"
                    />
                  );
                })}
                <motion.path
                  key={flow.name}
                  d={chord}
                  fill="none"
                  stroke="#3FD6C4"
                  strokeWidth="0.45"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
                  style={{ filter: "drop-shadow(0 0 1.2px rgb(63 214 196 / 0.9))" }}
                />
                <circle key={`p-${flow.name}`} r="0.9" fill="#fff">
                  <animateMotion dur="2.4s" repeatCount="indefinite" path={chord} begin="1.2s" />
                </circle>
              </svg>

              {/* Core */}
              <div
                data-eco="core"
                className="absolute left-1/2 top-1/2 grid size-[22%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[28%] border border-white/10 bg-midnight-800 shadow-[0_0_80px_-10px_rgb(58_75_224/0.7)]"
              >
                <div className="flex flex-col items-center">
                  <Image src="/brand/tivora-symbol-white.svg" alt="" width={48} height={48} unoptimized className="size-[38%] min-w-8" />
                  <span className="mt-1.5 font-mono text-[9px] tracking-[0.22em] text-white/60 lg:text-[10px]">ERP CORE</span>
                </div>
              </div>

              {nodes.map((n) => {
                const on = flow.path.includes(n.name);
                const step = flow.path.indexOf(n.name);
                return (
                  <div
                    key={n.name}
                    data-eco="mod"
                    data-x={n.x}
                    data-y={n.y}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  >
                    <div
                      className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-full border py-1.5 pl-2 pr-3 text-[11.5px] font-semibold backdrop-blur transition-all duration-500 ${
                        on
                          ? "border-teal-light/50 bg-midnight-800 text-white shadow-[0_0_24px_-4px_rgb(63_214_196/0.55)]"
                          : n.ring === 0
                            ? "border-white/12 bg-midnight-900/90 text-white/70"
                            : "border-white/8 bg-midnight-900/90 text-white/50"
                      }`}
                    >
                      <span className={`grid size-5 place-items-center rounded-full ${on ? "bg-teal text-white" : "bg-white/[0.06]"}`}>
                        {on ? <span className="font-mono text-[9px]">{step + 1}</span> : <n.icon className="size-3" aria-hidden />}
                      </span>
                      {n.name}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile: compact connected grid */}
            <div className="md:hidden">
              <div className="mx-auto flex w-fit items-center gap-2.5 rounded-2xl border border-white/10 bg-midnight-800 px-4 py-3">
                <Image src="/brand/tivora-symbol-white.svg" alt="" width={28} height={28} unoptimized />
                <span className="font-mono text-[11px] tracking-[0.22em] text-white/70">ERP CORE</span>
              </div>
              <div className="mx-auto h-6 w-px bg-gradient-to-b from-white/30 to-transparent" />
              <ul className="grid grid-cols-2 gap-2">
                {nodes.map((n) => {
                  const on = flow.path.includes(n.name);
                  return (
                    <li
                      key={n.name}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[12.5px] font-semibold transition-colors duration-500 ${
                        on ? "border-teal-light/50 bg-teal/15 text-white" : "border-white/10 text-white/60"
                      }`}
                    >
                      <n.icon className={`size-4 shrink-0 ${on ? "text-teal-light" : "text-white/40"}`} aria-hidden />
                      <span className="truncate">{n.name}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
