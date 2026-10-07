"use client";

import { useEffect, useRef } from "react";

const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#%&".split("");
const rgb = (hex: string, fallback: number[]) => {
  const n = parseInt(hex.trim().replace("#", ""), 16);
  return Number.isNaN(n) ? fallback : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/**
 * Drifting glyphs, link lines that react to the pointer, and rising beams, drawn on one canvas in the brand gold.
 * Sits behind content (pointer-events none). Pauses off screen, draws one still frame for reduced motion.
 * Colours come from the --color-gold / --color-muted-dark tokens, so there is no colour value in this file beyond a fallback.
 */
export function ParticleDrift({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const css = getComputedStyle(document.documentElement);
    const gold = rgb(css.getPropertyValue("--color-gold"), [192, 138, 46]);
    const dim = rgb(css.getPropertyValue("--color-muted-dark"), [169, 158, 139]);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let nodes: { x: number; y: number; vy: number; c: string }[] = [];
    let beams: { x: number; y: number; len: number; v: number; a: number }[] = [];
    const mouse = { x: -1000, y: -1000 };
    let raf = 0;
    let visible = true;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const area = w * h;
      nodes = Array.from({ length: Math.round(Math.min(70, Math.max(24, area / 16000))) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vy: Math.random() * 0.4 + 0.1,
        c: CHARS[Math.floor(Math.random() * CHARS.length)],
      }));
      beams = Array.from({ length: Math.round(Math.min(18, Math.max(6, area / 50000))) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        len: Math.random() * 100 + 50,
        v: Math.random() * 3 + 1.5,
        a: Math.random() * 0.35 + 0.15,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const b of beams) {
        if (!still) b.y -= b.v;
        if (b.y + b.len < 0) {
          b.y = h + 100;
          b.x = Math.random() * w;
        }
        const g = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.len);
        g.addColorStop(0, `rgba(${gold},${b.a})`);
        g.addColorStop(1, `rgba(${gold},0)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x, b.y + b.len);
        ctx.stroke();
      }
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 120) {
            ctx.strokeStyle = `rgba(${dim},${0.15 * (1 - d / 120)})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        if (!still) n.y += n.vy;
        if (n.y > h + 20) {
          n.y = -20;
          n.x = Math.random() * w;
        }
        const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        if (!still && (d < 180 || Math.random() > 0.98)) n.c = CHARS[Math.floor(Math.random() * CHARS.length)];
        if (d < 180) {
          ctx.strokeStyle = `rgba(${gold},${0.5 * (1 - d / 180)})`;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        ctx.fillStyle = d < 180 ? `rgb(${gold})` : `rgba(${dim},0.4)`;
        ctx.fillText(n.c, n.x, n.y);
      }
    };

    const loop = () => {
      if (visible) draw();
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
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
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 size-full ${className}`} />;
}
