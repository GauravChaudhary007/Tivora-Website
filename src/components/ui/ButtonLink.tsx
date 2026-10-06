import Link from "next/link";
import type { ReactNode } from "react";

// Colours follow the nearest [data-tone] ancestor (set by Section / header / footer).
const BASE =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-center font-bold transition-[color,background-color,border-color,transform] duration-(--duration-fast) ease-(--ease-out-expo) motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0 sm:w-auto sm:whitespace-nowrap";
const VARIANT = {
  primary:
    "bg-accent text-paper hover:bg-bronze in-data-[tone=night]:bg-gold in-data-[tone=night]:text-ink in-data-[tone=night]:hover:bg-gold-light",
  secondary:
    "border border-ink/30 text-ink hover:bg-tint in-data-[tone=night]:border-ground/30 in-data-[tone=night]:text-ground in-data-[tone=night]:hover:bg-night-3",
  ghost: "text-accent underline underline-offset-4 hover:text-bronze in-data-[tone=night]:text-gold-soft in-data-[tone=night]:hover:text-gold-light",
} as const;

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  onClick,
}: {
  href: string;
  variant?: keyof typeof VARIANT;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const cls = `${BASE} ${VARIANT[variant]} ${className}`;
  return /^(https?:|mailto:|tel:)/.test(href) ? (
    <a href={href} className={cls} rel="noopener" onClick={onClick}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls} onClick={onClick}>
      {children}
    </Link>
  );
}
