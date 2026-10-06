import type { ReactNode } from "react";

const TONE = {
  night: "bg-night text-ground scheme-dark",
  ground: "bg-ground text-ink",
  paper: "bg-paper text-ink",
} as const;
const SIZE = { sm: "py-section-sm", md: "py-section", lg: "py-section-lg" } as const;

/** The only place vertical section padding is set. data-tone drives header colour and tone-aware children. */
export function Section({
  tone = "ground",
  size = "md",
  id,
  className = "",
  children,
}: {
  tone?: keyof typeof TONE;
  size?: keyof typeof SIZE;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} data-tone={tone} className={`${TONE[tone]} ${SIZE[size]} ${className}`}>
      {children}
    </section>
  );
}
