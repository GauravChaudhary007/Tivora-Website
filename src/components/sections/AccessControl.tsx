"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import {
  ChartColumn,
  Check,
  ClipboardCheck,
  Contact,
  Boxes,
  Landmark,
  Lock,
  Receipt,
  Settings2,
  ShoppingCart,
  Truck,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const modules: { name: string; icon: LucideIcon }[] = [
  { name: "Sales", icon: ShoppingCart },
  { name: "Customers", icon: Contact },
  { name: "Inventory", icon: Boxes },
  { name: "Delivery", icon: Truck },
  { name: "Finance", icon: Landmark },
  { name: "Invoices", icon: Receipt },
  { name: "Reports", icon: ChartColumn },
  { name: "Approvals", icon: ClipboardCheck },
  { name: "Operations", icon: Workflow },
  { name: "Administration", icon: Settings2 },
];

const roles: { name: string; summary: string; access: string[] }[] = [
  { name: "Admin", summary: "Full access", access: modules.map((m) => m.name) },
  { name: "Manager", summary: "Reports, approvals & operations", access: ["Reports", "Approvals", "Operations"] },
  { name: "Sales", summary: "Sales & customers", access: ["Sales", "Customers"] },
  { name: "Warehouse", summary: "Inventory & delivery", access: ["Inventory", "Delivery"] },
  { name: "Finance", summary: "Finance, invoices & reports", access: ["Finance", "Invoices", "Reports"] },
];

export function AccessControl() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "-20% 0px" });
  const [roleIdx, setRoleIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const role = roles[roleIdx];

  useEffect(() => {
    if (!auto || !inView) return;
    const id = window.setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 2600);
    return () => window.clearInterval(id);
  }, [auto, inView]);

  return (
    <section id="access" className="relative overflow-hidden bg-paper py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          index="09"
          eyebrow="Role-based access control"
          title={
            <>
              Everyone gets the access they need.
              <span className="text-muted"> Nothing more.</span>
            </>
          }
          description="Give each role exactly the modules, data and actions it requires. People stay focused, sensitive information stays protected, and you stay in control."
        />

        <div ref={root} className="mt-12 grid gap-4 lg:grid-cols-[320px_1fr] lg:gap-6">
          {/* Roles */}
          <div role="tablist" aria-label="Roles" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {roles.map((r, i) => {
              const on = i === roleIdx;
              return (
                <button
                  key={r.name}
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    setAuto(false);
                    setRoleIdx(i);
                  }}
                  className={`relative flex shrink-0 items-center gap-3 rounded-2xl border p-3 text-left transition-colors lg:p-4 ${
                    on ? "border-midnight" : "border-line bg-white hover:border-midnight/25"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="role-bg"
                      className="absolute inset-0 rounded-[15px] bg-midnight"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span
                    className={`relative grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold ${on ? "bg-teal text-white" : "bg-mist text-midnight"}`}
                  >
                    {r.name[0]}
                  </span>
                  <span className="relative">
                    <span className={`block text-sm font-semibold ${on ? "text-white" : "text-midnight"}`}>{r.name}</span>
                    <span className={`block whitespace-nowrap text-[11.5px] ${on ? "text-teal-light" : "text-muted"}`}>{r.summary}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Permission matrix */}
          <div className="frame-light rounded-3xl p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted">
                Assigning permissions to <span className="font-semibold text-midnight">{role.name}</span>
              </p>
              <p className="font-mono text-[11px] text-teal">
                {role.access.length}/{modules.length} modules
              </p>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-mist">
              <motion.div
                className="h-full rounded-full bg-teal"
                animate={{ width: `${(role.access.length / modules.length) * 100}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5">
              {modules.map((m, i) => {
                const allowed = role.access.includes(m.name);
                return (
                  <motion.li
                    key={m.name}
                    animate={{
                      opacity: allowed ? 1 : 0.55,
                      scale: allowed ? 1 : 0.97,
                    }}
                    transition={{ duration: 0.35, delay: i * 0.025 }}
                    className={`relative flex flex-col gap-3 rounded-2xl border p-3.5 transition-colors duration-300 ${
                      allowed ? "border-teal/40 bg-teal/[0.06]" : "border-line bg-paper"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <m.icon className={`size-5 ${allowed ? "text-teal" : "text-muted/50"}`} aria-hidden />
                      <motion.span
                        key={`${role.name}-${allowed}`}
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 22, delay: i * 0.025 }}
                        className={`grid size-5 place-items-center rounded-full ${allowed ? "bg-teal text-white" : "bg-line text-muted"}`}
                      >
                        {allowed ? <Check className="size-3" strokeWidth={3} /> : <Lock className="size-2.5" />}
                      </motion.span>
                    </div>
                    <p className={`text-[13px] font-semibold ${allowed ? "text-midnight" : "text-muted"}`}>{m.name}</p>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
