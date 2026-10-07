"use client";

import { useEffect, useRef, useState } from "react";

export const CHAPTERS = [
  { id: "tour-strengths", label: "Strengths" },
  { id: "tour-process", label: "Modules tour" },
  { id: "tour-screen", label: "Home screen" },
  { id: "tour-workdesk", label: "Work Desk" },
  { id: "tour-dashboards", label: "Dashboards" },
  { id: "tour-nepal", label: "Made for Nepal" },
  { id: "tour-modules", label: "All modules" },
  { id: "tour-editions", label: "Industries" },
  { id: "demo", label: "Request a demo" },
] as const;

/** Home chapter rail (state indication) and scroll-progress hairline. The active chapter is the one crossing a band at mid-viewport. */
export function TourRail() {
  const nav = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const els = CHAPTERS.map((c) => document.getElementById(c.id));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setActive(els.indexOf(e.target as HTMLElement));
          nav.current?.setAttribute("data-on", (e.target as HTMLElement).dataset.tone === "night" ? "night" : "light");
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div className="tour-progress" aria-hidden="true" />
      <nav ref={nav} aria-label="Home page chapters" data-on="light" className="tour-rail hidden xl:block" style={{ ["--slot" as string]: Math.max(active, 0) }}>
        <ol>
          {active >= 0 && <li aria-hidden="true" className="tour-pill" />}
          {CHAPTERS.map((c, i) => (
            <li key={c.id}>
              <a href={`#${c.id}`} aria-current={i === active ? "location" : undefined}>
                <span className="tour-dot" />
                <span className="tour-label">{c.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
