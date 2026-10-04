"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  CircleCheck,
  ClipboardList,
  Factory,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { gsap, useGSAP, MOTION_QUERIES } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

type Tag = "Critical" | "Due today" | "Waiting" | "Info";
type Row = { id: string; title: string; meta: string; tag: Tag; action: string };
type Tab = { key: string; label: string; icon: LucideIcon; rows: Row[] };

const tabs: Tab[] = [
  {
    key: "tasks",
    label: "Today's tasks",
    icon: ClipboardList,
    rows: [
      { id: "t1", title: "Follow up on overdue receivable", meta: "Customer · Everest Traders · 32 days", tag: "Critical", action: "Call" },
      { id: "t2", title: "Confirm dispatch for SO-2041", meta: "Delivery due 2:00 PM", tag: "Due today", action: "Confirm" },
      { id: "t3", title: "Review weekly sales target", meta: "Kathmandu branch · 78% achieved", tag: "Due today", action: "Open" },
      { id: "t4", title: "Send quotation to new lead", meta: "Prepared by Rohan", tag: "Waiting", action: "Send" },
    ],
  },
  {
    key: "approvals",
    label: "Pending approvals",
    icon: ShieldCheck,
    rows: [
      { id: "a1", title: "Discount above limit on SO-2044", meta: "Requested by Rohan · 12% discount", tag: "Critical", action: "Approve" },
      { id: "a2", title: "Credit limit extension", meta: "Himal Suppliers · रु 5,00,000", tag: "Due today", action: "Approve" },
      { id: "a3", title: "Purchase order PO-1193", meta: "Store · Raw material", tag: "Waiting", action: "Approve" },
    ],
  },
  {
    key: "sales",
    label: "Sales orders",
    icon: ShoppingCart,
    rows: [
      { id: "s1", title: "SO-2041 · रु 1,24,300", meta: "Ready to convert to delivery note", tag: "Due today", action: "Convert" },
      { id: "s2", title: "SO-2042 · रु 86,750", meta: "Pokhara · awaiting stock", tag: "Waiting", action: "View" },
      { id: "s3", title: "SO-2043 · रु 2,10,000", meta: "Created 10 min ago", tag: "Info", action: "View" },
    ],
  },
  {
    key: "production",
    label: "Production",
    icon: Factory,
    rows: [
      { id: "p1", title: "Batch B-311 behind plan", meta: "Line 1 · 62% of target", tag: "Critical", action: "Open" },
      { id: "p2", title: "Batch B-312 scheduled", meta: "Starts 3:00 PM", tag: "Info", action: "View" },
    ],
  },
  {
    key: "deliveries",
    label: "Deliveries",
    icon: Truck,
    rows: [
      { id: "d1", title: "DN-1187 out for delivery", meta: "Vehicle BA 2 KHA 4410", tag: "Info", action: "Track" },
      { id: "d2", title: "DN-1188 ready to dispatch", meta: "Main store", tag: "Due today", action: "Dispatch" },
    ],
  },
  {
    key: "payments",
    label: "Payments",
    icon: Wallet,
    rows: [
      { id: "m1", title: "Payment received · रु 1,24,300", meta: "Against INV-8831", tag: "Info", action: "Match" },
      { id: "m2", title: "Supplier payment due", meta: "Himal Suppliers · today", tag: "Due today", action: "Pay" },
    ],
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: Bell,
    rows: [
      { id: "n1", title: "INV-8831 delivered on WhatsApp", meta: "Seen by customer", tag: "Info", action: "View" },
      { id: "n2", title: "Stock below reorder level", meta: "3 items · Main store", tag: "Critical", action: "Reorder" },
    ],
  },
];

// Status colours follow the application's own palette.
const tagStyle: Record<Tag, string> = {
  Critical: "bg-[#FDECEC] text-app-negative ring-app-negative/25",
  "Due today": "bg-app-tint text-app-warning ring-app-warning/25",
  Waiting: "bg-app-bg text-app-accent ring-app-accent/25",
  Info: "bg-app-bg text-app-label ring-app-border",
};

const points = [
  "See the work assigned to you",
  "Track what's pending and what's critical",
  "Monitor business activity around you",
  "Jump straight into the right module",
  "Act without clicking through screens",
  "Stay focused on what needs attention",
];

export function Workdesk() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(tabs[0].key);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const tab = tabs.find((t) => t.key === active)!;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_QUERIES.desktop}, ${MOTION_QUERIES.mobile}`, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
        tl.from(root.current, { y: 50, opacity: 0, duration: 1, ease: "expo.out" })
          .from("[data-wd='stat']", { y: 12, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.5")
          .from("[data-wd='tab']", { x: -12, opacity: 0, stagger: 0.04, duration: 0.4 }, "-=0.4")
          .from("[data-wd='row']", { y: 14, opacity: 0, stagger: 0.07, duration: 0.5 }, "-=0.3");
      });
    },
    { scope: root },
  );

  return (
    <section id="workdesk" className="relative overflow-hidden bg-mist py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.4fr] lg:items-center lg:gap-14">
        <div>
          <SectionHeading
            index="04"
            eyebrow="Workdesk"
            title="Everyone knows exactly what to do today."
            description="Workdesk is each person's command center. Their assigned work, pending approvals and live activity in one place — ready to act on without hunting through menus."
          />
          <Reveal as="ul" className="mt-8 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px] text-graphite">
                <CircleCheck className="mt-0.5 size-[18px] shrink-0 text-teal" aria-hidden />
                {p}
              </li>
            ))}
          </Reveal>
        </div>

        <div ref={root} className="frame-light min-w-0 overflow-hidden rounded-3xl border-app-border bg-app-surface font-app">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-app-border px-5 py-4 sm:px-6">
            <div>
              <p className="font-app-serif text-[19px] font-semibold text-app-ink">Good morning, Anjali</p>
              <p className="text-xs text-app-label">Sales Manager · Kathmandu branch</p>
            </div>
            <div className="flex gap-2">
              {[
                { n: 4, l: "Critical", c: "text-app-negative" },
                { n: 6, l: "Due today", c: "text-app-warning" },
                { n: 3, l: "Approvals", c: "text-app-accent" },
              ].map((s) => (
                <div key={s.l} data-wd="stat" className="rounded-xl border border-app-border px-3 py-1.5 text-center">
                  <p className={`text-base font-bold leading-tight ${s.c}`}>{s.n}</p>
                  <p className="text-[10px] text-app-label">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Tabs */}
            <div
              role="tablist"
              aria-label="Workdesk views"
              className="no-scrollbar flex gap-1 overflow-x-auto border-b border-app-border p-2 md:w-52 md:shrink-0 md:flex-col md:border-b-0 md:border-r md:p-3"
            >
              {tabs.map((t) => {
                const on = t.key === active;
                const open = t.rows.filter((r) => !done[r.id]).length;
                return (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={on}
                    data-wd="tab"
                    onClick={() => setActive(t.key)}
                    className={`relative flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors ${on ? "text-app-ink" : "text-app-label hover:text-app-ink"}`}
                  >
                    {on && (
                      <motion.span
                        layoutId="wd-tab"
                        className="absolute inset-0 rounded-lg bg-app-tint"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    <t.icon className="relative size-4" aria-hidden />
                    <span className="relative whitespace-nowrap">{t.label}</span>
                    <span className="relative ml-auto rounded-full bg-white px-1.5 font-mono text-[10px] text-app-label ring-1 ring-app-border">
                      {open}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Panel */}
            <div className="min-h-[330px] flex-1 p-3 sm:p-4" role="tabpanel">
              <AnimatePresence mode="wait">
                <motion.ul
                  key={active}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-2"
                >
                  {tab.rows.map((r) => {
                    const isDone = done[r.id];
                    return (
                      <li
                        key={r.id}
                        data-wd="row"
                        className={`flex items-center gap-3 rounded-xl border p-3 transition-colors duration-300 sm:p-3.5 ${isDone ? "border-app-positive/30 bg-[#E7F6F3]" : "border-app-border bg-white hover:border-app-accent/40"}`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className={`truncate text-[13.5px] font-semibold ${isDone ? "text-app-label line-through decoration-app-positive/50" : "text-app-ink"}`}>
                              {r.title}
                            </p>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${tagStyle[r.tag]}`}>
                              {r.tag}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-[11.5px] text-app-label">{r.meta}</p>
                        </div>
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.94 }}
                          onClick={() => setDone((d) => ({ ...d, [r.id]: !d[r.id] }))}
                          className={`flex h-8 shrink-0 items-center gap-1 rounded-lg px-3 text-xs font-semibold transition-colors ${
                            isDone ? "bg-app-positive text-white" : "bg-indigo text-white hover:bg-[#4757ea]"
                          }`}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                              key={isDone ? "d" : "a"}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.15 }}
                              className="flex items-center gap-1"
                            >
                              {isDone ? (
                                <>
                                  <CircleCheck className="size-3.5" aria-hidden /> Done
                                </>
                              ) : (
                                r.action
                              )}
                            </motion.span>
                          </AnimatePresence>
                        </motion.button>
                      </li>
                    );
                  })}
                </motion.ul>
              </AnimatePresence>

              <div className="mt-4 rounded-xl border border-dashed border-app-border p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-app-label">Around you</p>
                <p className="mt-1.5 text-[12px] text-app-ink">
                  Rohan created <b className="font-semibold text-app-ink">SO-2043</b> · Store dispatched{" "}
                  <b className="font-semibold text-app-ink">DN-1187</b> · Finance posted{" "}
                  <b className="font-semibold text-app-ink">INV-8831</b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
