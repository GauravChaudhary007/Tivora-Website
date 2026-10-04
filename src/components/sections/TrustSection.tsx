"use client";

import { useRef } from "react";
import { BadgeCheck, Landmark, MapPin, Percent } from "lucide-react";
import { gsap, useGSAP, MOTION_QUERIES } from "@/lib/gsap";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Reveal } from "@/components/ui/Reveal";

const stats = [
  { value: 25, suffix: "+", label: "Years of experience" },
  { value: 10000, suffix: "+", label: "Clients across Nepal" },
  { value: 15, suffix: "+", label: "Branches" },
  { value: 100, suffix: "+", label: "Professionals" },
];

const points = [
  { icon: BadgeCheck, title: "IRD Certified", text: "Certified by Nepal's Inland Revenue Department." },
  { icon: Percent, title: "Tax compliant", text: "Tax and VAT handled inside every transaction." },
  { icon: MapPin, title: "Made in Kathmandu", text: "Built and supported by a team that knows Nepali business." },
];

export function TrustSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_QUERIES.desktop}, ${MOTION_QUERIES.mobile}`, () => {
        gsap.from("[data-seal]", {
          scale: 0.7,
          rotate: -20,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-seal]", start: "top 80%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="trust" className="relative overflow-hidden bg-paper py-24 sm:py-32">
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Seal */}
          <div className="relative mx-auto aspect-square w-full max-w-[380px]" data-seal>
            <div className="absolute inset-0 rounded-full border border-line bg-white shadow-[0_30px_80px_-30px_rgb(20_28_61/0.35)]" />
            <svg viewBox="0 0 200 200" className="absolute inset-0 size-full [animation:orbit_40s_linear_infinite]" aria-hidden>
              <defs>
                <path id="seal-ring" d="M 100 100 m -78 0 a 78 78 0 1 1 156 0 a 78 78 0 1 1 -156 0" />
              </defs>
              <text className="fill-midnight font-mono text-[10.5px] uppercase tracking-[0.32em]">
                <textPath href="#seal-ring">IRD Certified · Tivora ERP · Built for Nepal ·</textPath>
              </text>
            </svg>
            <div className="absolute inset-[22%] grid place-items-center rounded-full bg-midnight text-center text-white shadow-[inset_0_0_0_6px_rgb(63_214_196/0.18)]">
              <div>
                <BadgeCheck className="mx-auto size-9 text-teal-light sm:size-11" aria-hidden />
                <p className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">IRD</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-teal-light">Certified</p>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
              <span className="text-muted/70">12 — </span>Trust
            </p>
            <h2 className="mt-4 text-balance text-[2rem] font-semibold leading-[1.06] tracking-[-0.03em] text-midnight sm:text-[2.6rem] lg:text-[3.1rem]">
              Built for Nepal. Ready for business.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Tivora ERP is IRD certified, so Nepalese businesses can bill, account and report with confidence from day one.
            </p>

            <Reveal as="ul" className="mt-8 grid gap-3 sm:grid-cols-3">
              {points.map((p) => (
                <li key={p.title} className="rounded-2xl border border-line bg-white p-4">
                  <p.icon className="size-5 text-teal" aria-hidden />
                  <p className="mt-3 text-sm font-semibold text-midnight">{p.title}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{p.text}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </div>

        {/* HiTech credentials */}
        <div className="mt-20 rounded-3xl border border-line bg-white p-6 sm:p-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-midnight">
                <Landmark className="size-4 text-teal" aria-hidden />
                Developed by HiTech Solutions and Services Pvt. Ltd.
              </p>
              <p className="mt-1 text-sm text-muted">
                The team behind Swastik, Bizant, Pharmasoft, HiTech Payroll and more — trusted by businesses across Nepal.
              </p>
            </div>
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border-l border-line pl-4">
                <dd className="text-3xl font-semibold tracking-tight text-midnight sm:text-4xl">
                  <AnimatedNumber value={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-1 text-sm text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
