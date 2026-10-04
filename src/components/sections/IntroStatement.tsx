"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_QUERIES } from "@/lib/gsap";

const statement =
  "Tivora is one connected ERP for the whole business. Enter something once and it flows to every team that needs it — no duplicate entries, no chasing, no guesswork. Just live data, clear work and decisions you can stand behind.";

const journey = ["Vision", "Plan", "Automation", "Execution", "Goal"];

export function IntroStatement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_QUERIES.desktop}, ${MOTION_QUERIES.mobile}`, () => {
        // Words brighten as the reader scrolls through the statement.
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.04,
            ease: "none",
            scrollTrigger: { trigger: "[data-statement]", start: "top 78%", end: "bottom 45%", scrub: true },
          },
        );
        const tl = gsap.timeline({
          scrollTrigger: { trigger: "[data-journey]", start: "top 80%", once: true },
        });
        tl.from("[data-journey-line]", { scaleX: 0, transformOrigin: "left", duration: 1.6, ease: "power2.inOut" }).from(
          "[data-step]",
          { y: 18, opacity: 0, stagger: 0.22, duration: 0.6 },
          0.1,
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="platform" className="relative bg-paper py-24 sm:py-32">
      <div className="container-x">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
          <span className="text-muted/70">01 — </span>The platform
        </p>
        <p
          data-statement
          className="mt-6 max-w-5xl text-balance text-[1.7rem] font-semibold leading-[1.22] tracking-[-0.025em] text-midnight sm:text-4xl lg:text-[3.1rem]"
        >
          {statement.split(" ").map((w, i) => (
            <span key={i} data-word className="inline">
              {w}{" "}
            </span>
          ))}
        </p>

        <div data-journey className="relative mt-16 sm:mt-20">
          <div className="absolute left-0 right-0 top-[19px] hidden h-px bg-line sm:block" />
          <div
            data-journey-line
            className="absolute left-0 right-0 top-[19px] hidden h-px bg-gradient-to-r from-teal via-indigo to-teal-light sm:block"
          />
          <ol className="relative grid grid-cols-1 gap-5 sm:grid-cols-5 sm:gap-4">
            {journey.map((step, i) => (
              <li key={step} data-step className="flex items-center gap-3 sm:flex-col sm:items-start">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full border font-mono text-xs ${
                    i === journey.length - 1
                      ? "border-midnight bg-midnight text-teal-light"
                      : "border-line bg-white text-midnight"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-lg font-semibold tracking-tight text-midnight">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-base text-muted sm:text-lg">
            No more chasing. No more errors. <span className="font-semibold text-midnight">Everything automated.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
