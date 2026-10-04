"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, MOTION_QUERIES } from "@/lib/gsap";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { DemoForm } from "./DemoForm";

export function FinalCTA() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop, () => {
        // The dark panel opens up from an inset card to full bleed.
        gsap.fromTo(
          "[data-cta='panel']",
          { clipPath: "inset(6% 4% 0% 4% round 40px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 95%", end: "top 25%", scrub: 0.5 },
          },
        );
        gsap.fromTo(
          "[data-cta='symbol']",
          { rotate: -25, scale: 0.85 },
          { rotate: 0, scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true } },
        );
      });
      mm.add(`${MOTION_QUERIES.desktop}, ${MOTION_QUERIES.mobile}`, () => {
        gsap.from("[data-cta='copy'] > *", {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          scrollTrigger: { trigger: "[data-cta='copy']", start: "top 80%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contact" className="relative bg-paper">
      <div data-cta="panel" className="relative overflow-hidden bg-midnight-950 text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="bg-grid-dark absolute inset-0 opacity-70" />
          <div className="absolute -right-40 top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(58_75_224/0.35),transparent)] blur-2xl" />
          <Image
            data-cta="symbol"
            src="/brand/tivora-symbol-white.svg"
            alt=""
            width={720}
            height={720}
            unoptimized
            className="absolute -left-64 -top-40 size-[560px] opacity-[0.025] sm:size-[720px]"
          />
        </div>

        <div className="container-x relative grid items-center gap-12 py-24 sm:py-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div data-cta="copy">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-light">
              <span className="text-white/40">13 — </span>Get started
            </p>
            <h2 className="mt-5 text-balance text-[2.3rem] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-[4rem]">
              Ready to run your business from <span className="text-teal-light">one platform?</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
              Connect your people, processes and business data with one intelligent ERP.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="#demo-form" size="lg" arrow>
                Book a Demo
              </Button>
              <Button href={`tel:${site.phones[0].replace(/-/g, "")}`} size="lg" variant="ghost-dark">
                Talk to Our Team
              </Button>
            </div>
          </div>

          <div id="demo-form" className="scroll-mt-28">
            <DemoForm />
          </div>
        </div>
      </div>
    </section>
  );
}
