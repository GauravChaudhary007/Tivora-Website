import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
};

/** Mono eyebrow ("03 — WORKDESK") echoes the brand book's page labels. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <Reveal
      className={`${align === "center" ? "mx-auto text-center items-center" : ""} flex max-w-3xl flex-col ${className}`}
    >
      <p
        className={`font-mono text-[11px] uppercase tracking-[0.2em] ${dark ? "text-teal-light" : "text-teal"}`}
      >
        {index && <span className={dark ? "text-white/40" : "text-muted/70"}>{index} — </span>}
        {eyebrow}
      </p>
      <h2
        className={`mt-4 text-balance text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[2.6rem] lg:text-[3.1rem] ${dark ? "text-white" : "text-midnight"}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 max-w-2xl text-pretty text-base leading-relaxed sm:text-lg ${dark ? "text-white/65" : "text-muted"}`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
