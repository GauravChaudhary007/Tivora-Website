"use client";

import { useEffect, useRef } from "react";

const rgb = (hex: string, fallback: number[]) => {
  const n = parseInt(hex.trim().replace("#", ""), 16);
  return Number.isNaN(n) ? fallback : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const bezier = (t: number, a: number[], b: number[], c: number[], d: number[]) => {
  const u = 1 - t;
  return [u ** 3 * a[0] + 3 * u ** 2 * t * b[0] + 3 * u * t ** 2 * c[0] + t ** 3 * d[0], u ** 3 * a[1] + 3 * u ** 2 * t * b[1] + 3 * u * t ** 2 * c[1] + t ** 3 * d[1]];
};

type Path = { left: boolean; y: number; t: number; v: number };

/**
 * Dotted curves sweep in from both edges and converge on a focus point (the film), with a spark travelling along each.
 * A click or tap sends a ripple that pushes the sparks aside. Full-bleed background (pointer-events none): the host
 * puts it behind its content and fades it where text sits. Pauses off screen; one still frame for reduced motion.
 * Colours come from the --color-gold / --color-gold-light tokens.
 */
export function GatewayFlow({ className = "", focusX = 0.64 }: { className?: string; focusX?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const css = getComputedStyle(document.documentElement);
    const line = rgb(css.getPropertyValue("--color-gold"), [192, 138, 46]);
    const spark = rgb(css.getPropertyValue("--color-gold-light"), [224, 184, 114]);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let fx = 0;
    let paths: Path[] = [];
    let ripples: { x: number; y: number; r: number; life: number }[] = [];
    let raf = 0;
    let visible = true;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      fx = w * (w < 1024 ? 0.5 : focusX);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(64, Math.max(24, h / 12)));
      paths = Array.from({ length: n }, (_, i) => ({ left: i % 2 === 0, y: (i / n) * h * 1.4 - h * 0.2, t: Math.random(), v: 0.0015 + Math.random() * 0.002 }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cy = h / 2;
      ripples.forEach((r) => {
        r.r += 15;
        r.life -= 0.015;
      });
      ripples = ripples.filter((r) => r.life > 0);
      ctx.lineWidth = 1.2;
      for (const p of paths) {
        const reach = p.left ? fx : w - fx;
        const s = p.left ? 1 : -1;
        const x0 = p.left ? 0 : w;
        const a = [x0, p.y];
        const b = [x0 + s * reach * 0.5, p.y];
        const c = [x0 + s * reach * 0.8, cy];
        const d = [fx, cy];
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.bezierCurveTo(b[0], b[1], c[0], c[1], d[0], d[1]);
        ctx.strokeStyle = `rgba(${line},0.42)`;
        ctx.setLineDash([1, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        if (!still) {
          p.t += p.v;
          if (p.t > 1) {
            p.t = 0;
            p.y += (Math.random() - 0.5) * 10;
          }
        }
        const pos = bezier(p.t, a, b, c, d);
        for (const r of ripples) {
          const dx = pos[0] - r.x;
          const dy = pos[1] - r.y;
          const dist = Math.hypot(dx, dy);
          if (dist < r.r + 120 && dist > r.r - 120 && dist > 0) {
            const f = (1 - Math.abs(dist - r.r) / 120) * r.life;
            pos[0] += (dx / dist) * f * 80;
            pos[1] += (dy / dist) * f * 80;
          }
        }
        ctx.fillStyle = `rgba(${spark},0.8)`;
        ctx.fillRect(pos[0] - 1.5, pos[1] - 1.5, 3, 3);
      }
    };

    const loop = () => {
      if (visible) draw();
      raf = requestAnimationFrame(loop);
    };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0, life: 1 });
    };
    const ro = new ResizeObserver(() => {
      build();
      if (still) draw();
    });
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    ro.observe(canvas);
    io.observe(canvas);
    build();
    if (still) draw();
    else {
      window.addEventListener("pointerdown", onDown, { passive: true });
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", onDown);
      ro.disconnect();
      io.disconnect();
    };
  }, [focusX]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 size-full ${className}`} />;
}
