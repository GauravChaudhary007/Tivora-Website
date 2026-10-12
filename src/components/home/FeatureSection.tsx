import type { ReactNode } from "react";
import { Section } from "@/components/layout/Section";

export type BulletGroup = { title?: string; items: string[] };

/**
 * One key feature: its copy beside a product moment (a simplified screen rebuilt in code). No pin, no scrub. Without a visual the copy takes the full
 * width. `reverse` puts the visual on the left at lg.
 */
export function FeatureSection({
  id,
  tone,
  eyebrow,
  title,
  lead,
  groups = [],
  visual,
  reverse = false,
  children,
  below,
}: {
  id: string;
  tone: "ground" | "paper" | "night";
  eyebrow?: string;
  title: string;
  lead: string;
  groups?: BulletGroup[];
  visual?: ReactNode;
  reverse?: boolean;
  /** Extra content under the bullets, inside the copy column. */
  children?: ReactNode;
  /** Full-width content under the whole row. */
  below?: ReactNode;
}) {
  const shot = Boolean(visual);
  return (
    <Section tone={tone} size="lg" id={id}>
      <div className="container-x">
        <div className={`grid items-center gap-stack-lg ${shot ? "lg:grid-cols-12 lg:gap-10" : ""}`}>
          <div data-reveal="" className={shot ? `lg:col-span-5 ${reverse ? "lg:order-last" : ""}` : "max-w-3xl"}>
            {eyebrow && <p className="font-mono text-eyebrow font-medium text-accent uppercase in-data-[tone=night]:text-gold">{eyebrow}</p>}
            <h2 className="mt-3">{title}</h2>
            <p className="mt-5 text-lead text-muted in-data-[tone=night]:text-muted-dark">{lead}</p>
            {groups.map((g) => (
              <div key={g.title ?? g.items[0]} className="mt-stack">
                {g.title && <h3 className="text-lead font-bold">{g.title}</h3>}
                <ul className="mt-3 space-y-2.5">
                  {g.items.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent in-data-[tone=night]:bg-gold" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {children}
          </div>
          {shot && (
            <div data-reveal="" className="min-w-0 lg:col-span-7">
              {visual}
            </div>
          )}
        </div>
        {below}
      </div>
    </Section>
  );
}
