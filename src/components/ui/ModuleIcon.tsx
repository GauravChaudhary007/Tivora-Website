import { createElement } from "react";
import type { IconName } from "@/content/modules";
import { ICON_NODES } from "@/content/icon-nodes";

/** Icon in a rounded-square chip (radius 32%, the symbol's corner ratio). Plain server-rendered SVG (nodes from lucide, see scripts/gen-icons.mjs). */
export function ModuleIcon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <span
      className={`inline-flex size-12 shrink-0 items-center justify-center rounded-module bg-tint text-accent in-data-[tone=night]:bg-night-3 in-data-[tone=night]:text-gold ${className}`}
    >
      <svg
        aria-hidden="true"
        className="size-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICON_NODES[name].map(([tag, attrs], i) => createElement(tag, { ...attrs, key: i }))}
      </svg>
    </span>
  );
}
