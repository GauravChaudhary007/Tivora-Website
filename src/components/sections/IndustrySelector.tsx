"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import {
  Check,
  Coins,
  Cpu,
  Hammer,
  Boxes,
  Car,
  ChartColumn,
  Contact,
  Factory,
  Gem,
  Landmark,
  PaintBucket,
  Percent,
  Pill as PillIcon,
  ShoppingCart,
  Store,
  Truck,
  Wrench,
  CalendarRange,
  Globe,
  Package,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const allModules: { name: string; icon: LucideIcon }[] = [
  { name: "Sales", icon: ShoppingCart },
  { name: "Purchase", icon: Truck },
  { name: "Inventory", icon: Boxes },
  { name: "Manufacturing", icon: Factory },
  { name: "Production Planning", icon: CalendarRange },
  { name: "Maintenance", icon: Wrench },
  { name: "Trade", icon: Globe },
  { name: "CRM / Customers", icon: Contact },
  { name: "Finance", icon: Landmark },
  { name: "Tax", icon: Percent },
  { name: "Reporting", icon: ChartColumn },
];

type Industry = {
  slug: string;
  name: string;
  icon: LucideIcon;
  accent: string;
  tagline: string;
  text: string;
  focus: string[];
  flow: string[];
  /** Industry editions with their own module set (shown in the workspace sidebar). */
  modules?: { name: string; icon: LucideIcon }[];
};

// The jewellery edition's actual module list, as it appears in the application.
const jewelleryModules: { name: string; icon: LucideIcon }[] = [
  { name: "Reports Centre", icon: ChartColumn },
  { name: "Purchase & Accounts Payable", icon: Truck },
  { name: "Store & Inventory", icon: Boxes },
  { name: "RFID", icon: Cpu },
  { name: "Karigar / Workshop", icon: Hammer },
  { name: "Jewelry Factory", icon: Gem },
  { name: "Sales & Accounts Receivable", icon: ShoppingCart },
  { name: "Gold Loans", icon: Coins },
  { name: "Finance & Accounts", icon: Landmark },
  { name: "Tax & IRD", icon: Percent },
  { name: "Transport & Delivery", icon: Package },
  { name: "Customer Services", icon: Contact },
];

const core = [
  "Multi-company & multi-branch",
  "Workdesk for every role",
  "One-click automation",
  "Email & WhatsApp integration",
  "Custom reports & dashboards",
  "IRD certified, tax compliant",
];

const industries: Industry[] = [
  {
    slug: "jewellery",
    name: "Jewellery",
    icon: Gem,
    accent: "#12A594",
    tagline: "Precision for every piece.",
    text: "Daily board rate, gold position in grams, karigar workshops, RFID-tagged stock and gold loans — the jewellery edition runs on the same connected core.",
    focus: ["RFID", "Karigar / Workshop", "Jewelry Factory", "Store & Inventory", "Sales & Accounts Receivable", "Gold Loans"],
    flow: ["Purchase", "Karigar / Workshop", "Store & Inventory", "Sales", "Finance"],
    modules: jewelleryModules,
  },
  {
    slug: "paint",
    name: "Paint",
    icon: PaintBucket,
    accent: "#3A4BE0",
    tagline: "From batch to branch.",
    text: "For paint businesses that plan production, manufacture in batches and sell across branches — with every step connected.",
    focus: ["Production Planning", "Manufacturing", "Inventory", "Sales", "Finance"],
    flow: ["Planning", "Manufacturing", "Inventory", "Sales", "Invoice"],
  },
  {
    slug: "fmcg",
    name: "FMCG",
    icon: Package,
    accent: "#2B303B",
    tagline: "Move fast. Stay in stock.",
    text: "For fast-moving businesses where orders, stock and deliveries never stop — and every rupee needs to be accounted for.",
    focus: ["Sales", "Inventory", "Purchase", "CRM / Customers", "Finance", "Reporting"],
    flow: ["Sales Order", "Inventory", "Delivery", "Invoice", "Finance"],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    icon: Factory,
    accent: "#141C3D",
    tagline: "Plan it. Make it. Ship it.",
    text: "Connect planning, production, maintenance and stock so the shop floor and the office work from the same numbers.",
    focus: ["Production Planning", "Manufacturing", "Maintenance", "Inventory", "Purchase"],
    flow: ["Planning", "Production", "Inventory", "Quality", "Sales"],
  },
  {
    slug: "trading",
    name: "Trading",
    icon: Store,
    accent: "#0E8A7B",
    tagline: "Buy right. Sell fast.",
    text: "For trading businesses that live on margins — purchase, stock, sales and finance in one continuous flow.",
    focus: ["Purchase", "Trade", "Inventory", "Sales", "Finance", "Tax"],
    flow: ["Purchase", "Inventory", "Sales", "Invoice", "Finance"],
  },
  {
    slug: "pharmaceutical",
    name: "Pharmaceutical",
    icon: PillIcon,
    accent: "#26316A",
    tagline: "Accuracy you can rely on.",
    text: "For pharmaceutical businesses where accurate stock, clean records and compliant billing matter every single day.",
    focus: ["Purchase", "Inventory", "Sales", "Tax", "Reporting"],
    flow: ["Purchase", "Inventory", "Sales", "Invoice", "Reports"],
  },
  {
    slug: "automobile",
    name: "Automobile",
    icon: Car,
    accent: "#6B78F0",
    tagline: "Keep every deal moving.",
    text: "For automobile businesses managing customers, sales, stock and finance across showrooms and branches.",
    focus: ["CRM / Customers", "Sales", "Inventory", "Maintenance", "Finance"],
    flow: ["Customer", "Sales", "Inventory", "Invoice", "Finance"],
  },
];

export function IndustrySelector() {
  const section = useRef<HTMLElement>(null);
  const [slug, setSlug] = useState(industries[0].slug);
  const industry = industries.find((i) => i.slug === slug)!;

  // Deep links from the nav, e.g. #industry-pharmaceutical
  useEffect(() => {
    const sync = () => {
      const m = window.location.hash.match(/^#industry-(.+)$/);
      if (m && industries.some((i) => i.slug === m[1])) {
        setSlug(m[1]);
        section.current?.scrollIntoView({ behavior: "smooth" });
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const ordered = useMemo(
    () => [
      ...industry.focus.map((n) => (industry.modules ?? allModules).find((m) => m.name === n)!),
      ...(industry.modules ?? allModules).filter((m) => !industry.focus.includes(m.name)),
    ],
    [industry],
  );

  return (
    <section ref={section} id="industries" className="relative overflow-hidden border-t border-line bg-white py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          index="10"
          eyebrow="Industry solutions"
          title="Built for your industry."
          description="One core platform, specialised for the way your industry works. Choose an industry to see Tivora adapt."
        />

        {/* Selector */}
        <div
          role="tablist"
          aria-label="Industries"
          className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {industries.map((ind) => {
            const on = ind.slug === slug;
            return (
              <button
                key={ind.slug}
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setSlug(ind.slug);
                  history.replaceState(null, "", `#industry-${ind.slug}`);
                }}
                className={`relative flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  on ? "border-transparent text-white" : "border-line text-midnight hover:border-midnight/30"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="ind-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: ind.accent }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <ind.icon className="relative size-4" aria-hidden />
                <span className="relative">{ind.name}</span>
              </button>
            );
          })}
          <span className="flex shrink-0 items-center rounded-full border border-dashed border-line px-4 py-2.5 text-sm font-medium text-muted">
            More industries coming soon
          </span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          {/* Copy */}
          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={industry.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: industry.accent }}>
                  Tivora for {industry.name}
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-midnight sm:text-4xl">{industry.tagline}</h3>
                <p className="mt-4 text-base leading-relaxed text-muted">{industry.text}</p>

                <p className="mt-8 text-[11px] font-semibold uppercase tracking-wider text-muted">Included in every edition</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {core.map((c, i) => (
                    <motion.li
                      key={c}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                      className="flex items-center gap-2 text-[13.5px] text-graphite"
                    >
                      <Check className="size-4 shrink-0" style={{ color: industry.accent }} aria-hidden />
                      {c}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Adaptive workspace */}
          <div
            className="frame-dark overflow-hidden rounded-3xl text-white"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-3">
              <Image src="/brand/tivora-symbol-white.svg" alt="" width={20} height={20} unoptimized />
              <p className="text-[13px] font-semibold">Tivora</p>
              <AnimatePresence mode="wait">
                <motion.span
                  key={industry.slug}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  style={{ backgroundColor: `${industry.accent}33`, color: "#fff" }}
                >
                  {industry.name} edition
                </motion.span>
              </AnimatePresence>
              <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 sm:block">Same core platform</span>
            </div>

            <div className="grid sm:grid-cols-[210px_1fr]">
              <LayoutGroup>
                <ul className="border-b border-white/[0.07] p-3 sm:border-b-0 sm:border-r">
                  {ordered.map((m) => {
                    const focus = industry.focus.includes(m.name);
                    return (
                      <motion.li
                        layout
                        key={m.name}
                        transition={{ type: "spring", stiffness: 300, damping: 32 }}
                        className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12.5px] transition-colors duration-500 ${
                          focus ? "font-semibold text-white" : "text-white/35"
                        }`}
                        style={focus ? { backgroundColor: `${industry.accent}26` } : undefined}
                      >
                        <m.icon className="size-3.5 shrink-0" style={focus ? { color: industry.accent } : undefined} aria-hidden />
                        <span className="truncate">{m.name}</span>
                      </motion.li>
                    );
                  })}
                </ul>
              </LayoutGroup>

              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Configured for {industry.name.toLowerCase()}</p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={industry.slug}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0 }}
                    variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                    className="mt-4 space-y-2.5"
                  >
                    {industry.flow.map((f, i) => (
                      <motion.div
                        key={f}
                        variants={{ hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0 } }}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-3"
                      >
                        <span
                          className="grid size-7 place-items-center rounded-lg font-mono text-[11px] font-semibold"
                          style={{ backgroundColor: `${industry.accent}33`, color: "#fff" }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-[13px] font-semibold">{f}</span>
                        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                          {i < industry.flow.length - 1 ? "flows to next" : "complete"}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
                <p className="mt-5 text-[12px] leading-relaxed text-white/45">
                  Same modules, same data model, same Workdesk — arranged around your industry&apos;s process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
