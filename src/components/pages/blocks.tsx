import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-mono text-eyebrow font-medium uppercase text-accent">{children}</p>;
}

export function Bullets({ items, className = "" }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((m) => (
        <li key={m} className="flex gap-3">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          <span>{m}</span>
        </li>
      ))}
    </ul>
  );
}

/** A plain table in a keyboard-scrollable wrapper. First column is the row header. */
export function DataTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: readonly string[];
  rows: readonly (readonly string[])[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-rule bg-paper shadow-card" tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full min-w-[32rem] border-collapse text-left text-small">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-rule bg-tint">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-mono text-eyebrow font-medium uppercase text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-rule align-top last:border-0">
              {r.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="px-4 py-3 font-bold">
                    {c}
                  </th>
                ) : (
                  <td key={i} className="px-4 py-3 text-muted">
                    {c}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Numbered steps; each has a title, a detail and optionally what TiVora does on its own. */
export function StepList({
  steps,
  doesLabel,
}: {
  steps: readonly { title: string; detail: string; auto?: string }[];
  doesLabel?: string;
}) {
  return (
    <ol className="space-y-4" data-stagger>
      {steps.map((s, i) => (
        <li key={s.title} className="grid gap-3 rounded-xl border border-rule bg-paper p-5 shadow-card sm:grid-cols-12 sm:gap-6">
          <div className="flex gap-4 sm:col-span-5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-paper font-mono text-small font-medium">
              {i + 1}
            </span>
            <span>
              <span className="block font-bold">{s.title}</span>
              <span className="text-muted">{s.detail}</span>
            </span>
          </div>
          {s.auto ? (
            <p className="sm:col-span-7">
              {doesLabel ? <span className="block font-mono text-eyebrow font-medium uppercase text-accent">{doesLabel}</span> : null}
              {s.auto}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/** A left-to-right chain written as type; wraps on small screens. */
export function Chain({ label, steps, note }: { label: string; steps: readonly string[]; note: string }) {
  return (
    <div className="rounded-xl bg-tint p-6">
      <p className="font-mono text-eyebrow font-medium uppercase text-muted">{label}</p>
      <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 font-bold">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            {s}
            {i < steps.length - 1 ? (
              <span aria-hidden="true" className="text-accent">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-muted">{note}</p>
    </div>
  );
}

export function Pillars({ items }: { items: readonly { title: string; body: string }[] }) {
  return (
    <ul className="grid gap-6 lg:grid-cols-3 lg:gap-8" data-stagger>
      {items.map((p) => (
        <li key={p.title} className="rounded-xl border border-rule bg-paper p-6 shadow-card">
          <h3>{p.title}</h3>
          <p className="mt-3 text-muted">{p.body}</p>
        </li>
      ))}
    </ul>
  );
}
