"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Building2, Check, GitBranch, Lock, ShieldCheck, Smartphone } from "lucide-react";
import { gsap, useGSAP, MOTION_QUERIES } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

type User = { name: string; role: string; allow: string[]; deny: string[] };
type Dept = { name: string; users: User[] };
type Branch = { name: string; depts: Dept[] };
type Company = { name: string; tag: string; branches: Branch[] };

const salesDept: Dept = {
  name: "Sales",
  users: [
    { name: "Anjali", role: "Sales Manager", allow: ["Sales orders", "Approvals", "Customers", "Sales reports"], deny: ["Finance"] },
    { name: "Rohan", role: "Sales Executive", allow: ["Sales orders", "Customers"], deny: ["Approvals", "Finance"] },
  ],
};
const storeDept: Dept = {
  name: "Store",
  users: [{ name: "Bikash", role: "Store Keeper", allow: ["Inventory", "Delivery notes"], deny: ["Sales reports", "Finance"] }],
};
const financeDept: Dept = {
  name: "Finance",
  users: [{ name: "Sita", role: "Accountant", allow: ["Invoices", "Payments", "Finance reports"], deny: ["Administration"] }],
};
const productionDept: Dept = {
  name: "Production",
  users: [{ name: "Ramesh", role: "Plant Supervisor", allow: ["Production", "Planning", "Maintenance"], deny: ["Finance"] }],
};

const tree: Company[] = [
  {
    name: "Company A",
    tag: "Trading",
    branches: [
      { name: "Kathmandu", depts: [salesDept, storeDept, financeDept] },
      { name: "Pokhara", depts: [salesDept, storeDept] },
      { name: "Biratnagar", depts: [salesDept, financeDept] },
    ],
  },
  {
    name: "Company B",
    tag: "Manufacturing",
    branches: [
      { name: "Head office", depts: [financeDept, salesDept] },
      { name: "Plant", depts: [productionDept, storeDept] },
    ],
  },
];

type Path = [number, number, number, number];
const tour: Path[] = [
  [0, 0, 0, 0],
  [0, 1, 1, 0],
  [1, 1, 0, 0],
  [0, 0, 2, 0],
  [0, 2, 0, 1],
];

const features = [
  { icon: Building2, title: "Multi-company", text: "Run every company in your group from one unified ERP." },
  { icon: GitBranch, title: "Multi-branch", text: "Operate each branch locally, monitor them all centrally." },
  { icon: ShieldCheck, title: "Role-based access", text: "People see only the modules, data and actions they're allowed." },
  { icon: Smartphone, title: "Mobile responsive", text: "Work from desktop, tablet or phone — same ERP, same data." },
];

const NODE_H = 46;
const GAP = 8;
const centerY = (i: number) => i * (NODE_H + GAP) + NODE_H / 2;

export function MultiCompany() {
  const root = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<Path>(tour[0]);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % tour.length;
      setPath(tour[i]);
    }, 3200);
    return () => window.clearInterval(id);
  }, [auto]);

  const [c, b, d, u] = path;
  const company = tree[c];
  const branch = company.branches[b];
  const dept = branch.depts[d];
  const user = dept.users[u];

  const choose = (level: number, idx: number) => {
    setAuto(false);
    setPath((p) => {
      const next = [...p] as Path;
      next[level] = idx;
      for (let l = level + 1; l < 4; l++) next[l] = 0;
      return next;
    });
  };

  const columns: { title: string; items: { label: string; sub?: string }[]; active: number }[] = [
    { title: "Company", items: tree.map((t) => ({ label: t.name, sub: t.tag })), active: c },
    { title: "Branches", items: company.branches.map((x) => ({ label: x.name })), active: b },
    { title: "Departments", items: branch.depts.map((x) => ({ label: x.name })), active: d },
    { title: "Users", items: dept.users.map((x) => ({ label: x.name, sub: x.role })), active: u },
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_QUERIES.desktop}, ${MOTION_QUERIES.mobile}`, () => {
        gsap.from("[data-col]", {
          opacity: 0,
          x: -24,
          stagger: 0.14,
          duration: 0.8,
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="multi-company" className="relative overflow-hidden border-t border-line bg-white py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          index="03"
          eyebrow="Scale"
          title={
            <>
              One ERP. Multiple companies.
              <br className="hidden sm:block" /> Multiple branches.
            </>
          }
          description="Whether you run one shop or a group of companies across Nepal, Tivora gives you one place to see and control it all — with the right access for every person."
        />

        <Reveal className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white p-6">
              <Icon className="size-5 text-teal" aria-hidden />
              <p className="mt-4 font-semibold text-midnight">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </Reveal>

        {/* Hierarchy explorer */}
        <div ref={root} className="mt-8 rounded-3xl border border-line bg-paper p-4 sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Company → Branch → Department → User → Permissions
            </p>
            <p className="text-xs text-muted">{auto ? "Touring your organisation… click any node" : "Click any node to explore"}</p>
          </div>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-0">
            {columns.map((col, ci) => (
              <div key={col.title} className="contents">
                <div data-col className="lg:min-w-0 lg:flex-1">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">{col.title}</p>
                  <ul className="flex flex-wrap gap-2 lg:flex-col" style={{ rowGap: GAP }}>
                    {col.items.map((it, i) => {
                      const on = i === col.active;
                      return (
                        <li key={it.label + i}>
                          <button
                            type="button"
                            onClick={() => choose(ci, i)}
                            className={`relative flex w-full items-center gap-2 rounded-xl border px-3 text-left transition-colors duration-300 ${
                              on ? "border-midnight text-white" : "border-line bg-white text-midnight hover:border-midnight/30"
                            }`}
                            style={{ height: NODE_H }}
                          >
                            {on && (
                              <motion.span
                                layoutId={`node-${ci}`}
                                className="absolute inset-0 rounded-[11px] bg-midnight"
                                transition={{ type: "spring", stiffness: 380, damping: 34 }}
                              />
                            )}
                            <span className="relative min-w-0">
                              <span className="block truncate text-[13px] font-semibold">{it.label}</span>
                              {it.sub && (
                                <span className={`block truncate text-[10.5px] ${on ? "text-teal-light" : "text-muted"}`}>
                                  {it.sub}
                                </span>
                              )}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <Connector from={col.active} to={columns[ci + 1]?.active ?? 0} />
              </div>
            ))}

            {/* Permissions */}
            <div data-col className="lg:min-w-0 lg:flex-[1.5]">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Permissions</p>
              <motion.div
                key={`${c}${b}${d}${u}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-line bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-teal/10 text-sm font-bold text-teal">
                    {user.name[0]}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-midnight">{user.name}</p>
                    <p className="text-[11px] text-muted">
                      {user.role} · {branch.name}
                    </p>
                  </div>
                </div>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {user.allow.map((p, i) => (
                    <motion.li
                      key={p}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="flex items-center gap-1 rounded-full bg-teal/10 px-2.5 py-1 text-[11.5px] font-medium text-teal"
                    >
                      <Check className="size-3" aria-hidden /> {p}
                    </motion.li>
                  ))}
                  {user.deny.map((p) => (
                    <li key={p} className="flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-[11.5px] text-muted/70">
                      <Lock className="size-3" aria-hidden /> {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Connector({ from, to }: { from: number; to: number }) {
  const y1 = centerY(from);
  const y2 = centerY(to);
  const d = `M 0 ${y1} C 16 ${y1}, 16 ${y2}, 32 ${y2}`;
  const h = Math.max(y1, y2) + NODE_H;
  return (
    <svg
      aria-hidden
      className="mt-[30px] hidden shrink-0 overflow-visible lg:block"
      width="32"
      height={h}
      viewBox={`0 0 32 ${h}`}
    >
      <motion.path
        initial={false}
        animate={{ d }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        fill="none"
        stroke="#12A594"
        strokeWidth="1.5"
      />
      <motion.circle initial={false} animate={{ cy: y2 }} cx="32" r="3" fill="#12A594" />
    </svg>
  );
}
