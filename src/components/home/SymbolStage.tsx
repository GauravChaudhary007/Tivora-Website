import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";

/** CSS isometric tilt of the real symbol file (never a redraw). Scenes tween --rx/--rz/--sc. */
export const TILT = { transform: "rotateX(var(--rx,0deg)) rotateZ(var(--rz,0deg)) scale(var(--sc,1))" };

/**
 * The official symbol with the (collapsed) iso world centred over it. The world is 3.3x the symbol's width so its
 * four slab tops sit on the tilted squares at the cross-fade (scale ~1.5). Used by the hero and the closing scene.
 */
export function SymbolStage({ children, priority = false }: { children: ReactNode; priority?: boolean }) {
  return (
    <div className="relative size-44 sm:size-52 lg:size-56">
      <div data-world="" className="pointer-events-none absolute top-1/2 left-1/2 w-[330%] -translate-x-1/2 -translate-y-1/2 opacity-0" aria-hidden="true">
        {children}
      </div>
      <div data-sym="" style={TILT} className="size-full">
        <Logo kind="symbol" tone="dark" alt="" priority={priority} className="size-full" />
      </div>
    </div>
  );
}
