import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { ORIGIN_FRAC, SYMBOL_K } from "./world";

/** CSS isometric tilt of the real symbol file (never a redraw). Scenes tween --rx/--rz/--sc. */
export const TILT = { transform: "rotateX(var(--rx,0deg)) rotateZ(var(--rz,0deg)) scale(var(--sc,1))" };

/**
 * The official symbol, with (optionally) the collapsed iso world centred over it. The world is sized so its gathered 4 x 3 slabs
 * span the tilted symbol at the cross-fade (symbol scale 1.6): world width = 1.6 * 1.414 * symbol / (771/viewBox width).
 * Used by the closing scene; the hero tilts the symbol onto Scene 1's own world instead (HeroCore).
 */
export function SymbolStage({ children, priority = false }: { children?: ReactNode; priority?: boolean }) {
  // Geometry-derived values (a ratio of the symbol's size has no spacing token): see world.ts.
  const worldWidth = `${(1.6 / SYMBOL_K) * 100}%`;
  return (
    <div data-symslot="" className="relative size-44 sm:size-52 lg:size-56">
      {children && (
        <div
          data-world=""
          style={{ width: worldWidth, transform: `translate(-50%, -${ORIGIN_FRAC.y * 100}%)` }}
          className="pointer-events-none absolute top-1/2 left-1/2 opacity-0"
          aria-hidden="true"
        >
          {children}
        </div>
      )}
      <div data-sym="" style={TILT} className="size-full">
        <Logo kind="symbol" tone="dark" alt="" priority={priority} className="size-full" />
      </div>
    </div>
  );
}
