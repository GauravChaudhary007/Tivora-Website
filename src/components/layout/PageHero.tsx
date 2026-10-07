import type { ReactNode } from "react";
import { Section } from "./Section";

/** Night-toned page opener. Holds the page's only <h1>; clears the fixed header. */
export function PageHero({
  eyebrow,
  title,
  lead,
  actions,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  actions?: ReactNode;
}) {
  return (
    <Section tone="night" size="lg" className="relative overflow-hidden">
      <div className="bg-ember pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-x relative pt-header">
        {eyebrow && <p className="font-mono text-eyebrow font-medium uppercase text-gold">{eyebrow}</p>}
        <h1 className="mt-4 max-w-4xl">{title}</h1>
        {lead && <p className="mt-4 max-w-prose text-lead text-muted-dark">{lead}</p>}
        {actions && <div className="mt-stack flex flex-col gap-3 sm:flex-row">{actions}</div>}
      </div>
    </Section>
  );
}
