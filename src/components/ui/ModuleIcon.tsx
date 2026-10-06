import {
  ChartColumn, Factory, FileText, FlaskConical, Hammer, HeartHandshake, Landmark, LockKeyhole,
  Package, ReceiptText, Scale, ScanLine, ShoppingCart, SlidersHorizontal, type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/content/modules";

const ICONS: Record<IconName, LucideIcon> = {
  ReceiptText, HeartHandshake, ShoppingCart, Package, Factory, Scale, Landmark,
  FileText, ChartColumn, SlidersHorizontal, Hammer, FlaskConical, ScanLine, LockKeyhole,
};

/** Lucide icon in a rounded-square chip (radius 32%, the symbol's corner ratio). */
export function ModuleIcon({ name, className = "" }: { name: IconName; className?: string }) {
  const Icon = ICONS[name];
  return (
    <span
      className={`inline-flex size-12 shrink-0 items-center justify-center rounded-module bg-tint text-accent in-data-[tone=night]:bg-night-3 in-data-[tone=night]:text-gold ${className}`}
    >
      <Icon aria-hidden="true" className="size-6" />
    </span>
  );
}
