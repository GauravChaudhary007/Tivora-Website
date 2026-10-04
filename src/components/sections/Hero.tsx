"use client";

import { useState, useRef } from "react";
import { BadgeCheck, Building2, GitBranch, Play, ShieldCheck } from "lucide-react";
import { gsap, useGSAP, MOTION_QUERIES } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { Spark } from "@/components/ui/Spark";
import { site } from "@/lib/site";
import { VideoModal } from "@/components/ui/VideoModal";
import { HeroShowcase } from "./HeroShowcase";

const headline = [
  { text: "Your entire business.", accent: false },
  { text: "One intelligent ERP.", accent: true },
];

const proof = [
  { icon: BadgeCheck, label: "IRD Certified" },
  { icon: Building2, label: "Multi-company" },
  { icon: GitBranch, label: "Multi-branch" },
  { icon: ShieldCheck, label: "Role-based access" },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [tour, setTour] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: `${MOTION_QUERIES.desktop}, ${MOTION_QUERIES.mobile}`, desktop: MOTION_QUERIES.desktop },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
          tl.from("[data-hero='eyebrow']", { y: 16, opacity: 0, duration: 0.7 })
            .from("[data-hero='word']", { yPercent: 110, duration: 1.1, stagger: 0.05 }, "-=0.45")
            .from("[data-hero='fade']", { y: 20, opacity: 0, duration: 0.9, stagger: 0.08 }, "-=0.8")
            .from("[data-hero='console']", { y: 80, opacity: 0, duration: 1.4, ease: "expo.out" }, "-=0.7")
            .add("console");

          // The console starts tilted back and settles flat as you scroll into it.
          if (desktop) {
            gsap.fromTo(
              "[data-hero='tilt']",
              { rotateX: 16, scale: 0.94 },
              {
                rotateX: 0,
                scale: 1,
                ease: "none",
                scrollTrigger: { trigger: "[data-hero='tilt']", start: "top 85%", end: "top 20%", scrub: 0.6 },
              },
            );
          }
          return () => tl.kill();
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate overflow-hidden bg-midnight-950 pb-20 pt-32 text-white sm:pt-40 lg:pb-28"
    >
      {/* Ambient light + grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid-dark mask-fade-b absolute inset-0" />
        <div className="absolute left-1/2 top-[-12%] h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(58_75_224/0.35),transparent)] blur-2xl" />
        <div className="absolute left-1/2 top-[38%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(18_165_148/0.22),transparent)] blur-2xl" />
      </div>

      <div className="container-x flex flex-col items-center text-center">
        <p
          data-hero="eyebrow"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-white/80"
        >
          <Spark className="size-3 text-teal-light" />
          One platform. Every business.
        </p>

        <h1 className="mt-7 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.9rem]">
          {headline.map((line) => (
            <span key={line.text} className="block">
              {line.text.split(" ").map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span
                    data-hero="word"
                    className={`inline-block ${line.accent ? "text-teal-light" : "text-white"}`}
                  >
                    {w}
                    {" "}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p
          data-hero="fade"
          className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-white/65 sm:text-lg"
        >
          Tivora connects sales, purchase, manufacturing, inventory, finance, planning, maintenance,
          trade and tax in one system — so every entry flows forward, every person knows what to do
          today, and every decision runs on live data.
        </p>

        <div data-hero="fade" className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button href="#contact" size="lg" arrow>
            Book a Demo
          </Button>
          <Button
            href="#tour"
            size="lg"
            variant="ghost-dark"
            onClick={(e) => {
              e?.preventDefault();
              setTour(true);
            }}
          >
            <Play className="size-4 fill-current" aria-hidden /> Watch the tour
          </Button>        </div>

        <ul
          data-hero="fade"
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] text-white/55"
        >
          {proof.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5">
              <Icon className="size-4 text-teal-light" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="container-x mt-14 sm:mt-16" style={{ perspective: "1600px" }}>
        <div data-hero="tilt" style={{ transformOrigin: "50% 0%" }}>
          <div data-hero="console">
            <HeroShowcase onPlay={() => setTour(true)} />
          </div>
        </div>
      </div>
      <VideoModal
        open={tour}
        onClose={() => setTour(false)}
        src={site.demoVideo}
        mobileSrc={site.demoVideoMobile}
        poster={site.demoPoster}
        title="Tivora ERP — product tour"
      />
    </section>
  );
}
