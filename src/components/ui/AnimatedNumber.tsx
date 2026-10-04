"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type AnimatedNumberProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

const fmt = (n: number, decimals: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);

/**
 * Counts up the first time it scrolls into view, then tweens between values
 * whenever `value` changes (e.g. when a dashboard tab switches).
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.4,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef({ n: 0 });
  const seen = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const render = () => {
      el.textContent = prefix + fmt(current.current.n, decimals) + suffix;
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      current.current.n = value;
      render();
      return;
    }
    const run = () =>
      gsap.to(current.current, {
        n: value,
        duration: seen.current ? 0.7 : duration,
        ease: "power2.out",
        onUpdate: render,
        onComplete: () => {
          seen.current = true;
        },
      });

    if (seen.current) {
      const t = run();
      return () => {
        t.kill();
      };
    }
    render();
    let tween: gsap.core.Tween | undefined;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      once: true,
      onEnter: () => {
        tween = run();
      },
    });
    return () => {
      st.kill();
      tween?.kill();
    };
  }, [value, decimals, prefix, suffix, duration]);

  // SSR renders the final value so the page reads correctly without JS.
  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {prefix + fmt(value, decimals) + suffix}
    </span>
  );
}
