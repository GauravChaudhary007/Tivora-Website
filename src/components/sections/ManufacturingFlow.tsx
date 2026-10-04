"use client";

import { useRef } from "react";
import { Boxes, CalendarRange, Factory, PackageCheck, ShieldCheck, ShoppingCart } from "lucide-react";
import { gsap, useGSAP, MOTION_QUERIES } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";

const stages = [
  { icon: CalendarRange, name: "Planning", text: "Demand and capacity planned ahead" },
  { icon: Factory, name: "Production", text: "Batches tracked on the shop floor" },
  { icon: Boxes, name: "Inventory", text: "Materials and stock always current" },
  { icon: ShieldCheck, name: "Quality", text: "Checked before anything moves on" },
  { icon: PackageCheck, name: "Finished Goods", text: "Ready stock visible to everyone" },
  { icon: ShoppingCart, name: "Sales", text: "Available to sell the moment it's ready" },
];

export function ManufacturingFlow() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const build = (axis: "x" | "y") => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: "[data-mf='track']", start: "top 72%", end: "bottom 45%", scrub: 0.6 },
        });
        tl.fromTo("[data-mf='fill']", axis === "x" ? { scaleX: 0 } : { scaleY: 0 }, axis === "x" ? { scaleX: 1, duration: 1 } : { scaleY: 1, duration: 1 }, 0);
        tl.fromTo(
          "[data-mf='token']",
          axis === "x" ? { left: "0%" } : { top: "0%" },
          axis === "x" ? { left: "100%", duration: 1 } : { top: "100%", duration: 1 },
          0,
        );
        gsap.utils.toArray<HTMLElement>("[data-mf='node']").forEach((node, i) => {
          const at = i / (stages.length - 1);
          tl.to(node.querySelector("[data-mf='dot']"), { backgroundColor: "#12A594", borderColor: "#3FD6C4", color: "#fff", duration: 0.04 }, Math.max(0, at - 0.02));
          tl.to(node.querySelector("[data-mf='label']"), { opacity: 1, duration: 0.04 }, Math.max(0, at - 0.02));
        });
      };
      mm.add(MOTION_QUERIES.desktop, () => build("x"));
      mm.add(MOTION_QUERIES.mobile, () => build("y"));
    },
    { scope: root },
  );

  return (
    <section ref={root} id="manufacturing" className="relative overflow-hidden bg-midnight-950 py-24 text-white sm:py-32">
      <div aria-hidden className="bg-grid-dark mask-fade-y pointer-events-none absolute inset-0" />
      <div className="container-x relative">
        <SectionHeading
          index="11"
          eyebrow="Manufacturing & planning"
          tone="dark"
          title="From plan to product to sale."
          description="Tivora isn't only for accounts and sales. It runs the operational side too — from the production plan to finished goods on the shelf — in the same application."
        />

        <div data-mf="track" className="relative mt-16 lg:mt-24">
          {/* Track (horizontal on desktop, vertical on mobile) */}
          <div className="absolute bottom-7 left-[27px] top-7 w-px bg-white/10 lg:bottom-auto lg:left-[calc(100%/12)] lg:right-[calc(100%/12)] lg:top-[27px] lg:h-px lg:w-auto">
            <div
              data-mf="fill"
              className="absolute inset-0 origin-top bg-gradient-to-b from-teal to-teal-light lg:origin-left lg:bg-gradient-to-r"
            />
            <div
              data-mf="token"
              className="absolute left-1/2 top-0 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_6px_rgb(63_214_196/0.25),0_0_24px_4px_rgb(63_214_196/0.6)] lg:left-0 lg:top-1/2"
            />
          </div>

          <ol className="relative grid gap-8 lg:grid-cols-6 lg:gap-4">
            {stages.map((s) => (
              <li key={s.name} data-mf="node" className="flex items-start gap-5 lg:flex-col lg:items-center lg:text-center">
                <span
                  data-mf="dot"
                  className="relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl border border-white/15 bg-midnight-800 text-white/60"
                >
                  <s.icon className="size-5" aria-hidden />
                </span>
                <div data-mf="label" className="pt-2 opacity-60 lg:pt-0">
                  <p className="font-semibold">{s.name}</p>
                  <p className="mt-1 text-sm leading-snug text-white/50">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-16 text-center text-base text-white/60 lg:mt-20">
          Complete planning to execution —{" "}
          <span className="font-semibold text-white">from a single application.</span>
        </p>
      </div>
    </section>
  );
}
