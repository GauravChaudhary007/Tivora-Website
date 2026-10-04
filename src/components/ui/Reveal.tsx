"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_QUERIES } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** CSS selector (relative to the wrapper) for the elements to stagger in. */
  targets?: string;
  stagger?: number;
  y?: number;
  delay?: number;
  start?: string;
  id?: string;
};

/**
 * Scroll-triggered entrance. Runs before paint (useGSAP is layout-effect based),
 * so content never flashes, and renders fully visible when motion is reduced.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  targets = ":scope > *",
  stagger = 0.08,
  y = 28,
  delay = 0,
  start = "top 82%",
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop + ", " + MOTION_QUERIES.mobile, () => {
        const els = ref.current?.querySelectorAll(targets);
        if (!els?.length) return;
        gsap.from(els, {
          y,
          opacity: 0,
          duration: 0.9,
          stagger,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start, once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
