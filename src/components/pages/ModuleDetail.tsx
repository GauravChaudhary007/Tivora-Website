import Link from "next/link";
import { modulePageBySlug, moduleHref, type ModulePage } from "@/content/module-pages";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { CtaBand } from "@/components/layout/CtaBand";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { ModuleMoment } from "@/components/moments/ModuleMoment";
import { MODULE_MOMENTS } from "@/content/module-moments";
import { Bullets, StepList } from "@/components/pages/blocks";

/** Shared body of /modules/<slug>/ and /alanza/modules/<slug>/. */
export function ModuleDetail({ m }: { m: ModulePage }) {
  const related = m.connectsTo.map(modulePageBySlug).filter((x) => x !== undefined);
  const who = m.forWho.map((w) => w.toLowerCase()).join(", ").replace(/, ([^,]*)$/, " and $1");

  return (
    <>
      <PageHero eyebrow={m.group} title={m.name} lead={m.tagline} />

      <Section tone="ground">
        <div className="container-x">
          <div className="max-w-3xl" data-reveal>
            <h2>What matters in {m.name}.</h2>
            <p className="mt-4 text-muted">Built for {who}.</p>
          </div>
          <ul className="mt-stack-lg grid gap-6 md:grid-cols-2 lg:gap-8" data-stagger>
            {m.highlights.map((h, i) => (
              <li
                key={h.title}
                className={`rounded-xl border border-rule bg-paper p-6 shadow-card ${i === 0 ? "md:col-span-2 lg:p-8" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <ModuleIcon name={h.icon} />
                  <div>
                    <h3>{h.title}</h3>
                    <p className="mt-3 max-w-prose text-muted">{h.what}</p>
                    <p className="mt-3 max-w-prose font-bold">{h.why}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="paper">
        <div className="container-x grid gap-stack-lg lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4" data-reveal>
            <h2>How it runs.</h2>
            <p className="mt-4 text-muted">The usual path through {m.name}, from first entry to the books.</p>
          </div>
          <div className="lg:col-span-8">
            <StepList steps={m.workflow} />
          </div>
        </div>
      </Section>

      <Section tone="ground">
        <div className="container-x grid gap-stack-lg lg:grid-cols-2 lg:gap-8">
          <div data-reveal>
            <h2>Reports and registers.</h2>
            <ul className="mt-stack flex flex-wrap gap-3">
              {m.reports.map((r) => (
                <li key={r} className="rounded-full border border-rule bg-paper px-4 py-2 font-bold">
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-tint p-6 lg:p-8" data-reveal>
            <h2 className="text-h3">What the Work Desk tells you.</h2>
            <Bullets items={m.alerts} className="mt-5" />
            <p className="mt-3">
              <Link href="/work-desk/" className="inline-flex min-h-11 items-center font-bold text-accent underline underline-offset-4 hover:text-bronze">
                See the Work Desk
              </Link>
            </p>
          </div>
        </div>
      </Section>

        <Section tone="paper">
          <div className="container-x space-y-stack-lg">
            {related.length > 0 && (
              <div data-reveal>
                <h2 className="text-h3">Works with.</h2>
                <ul className="mt-5 flex flex-wrap gap-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={moduleHref(r)}
                        className="inline-flex min-h-11 items-center gap-3 rounded-full border border-rule bg-ground py-1.5 pr-5 pl-2 font-bold hover:bg-tint"
                      >
                        <ModuleIcon name={r.icon} className="size-8!" />
                        {r.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>

      {MODULE_MOMENTS[m.slug] && (
        <Section tone="ground" id="at-work">
          <div className="container-x grid items-center gap-stack-lg lg:grid-cols-12 lg:gap-10">
            <div data-reveal="" className="lg:col-span-4">
              <h2>{m.name}, at work.</h2>
              <p className="mt-4 text-lead text-muted">The register, its key figures, and one entry acted on: the rest follows on its own.</p>
            </div>
            <div className="min-w-0 lg:col-span-8">
              <ModuleMoment name={m.name} data={MODULE_MOMENTS[m.slug]} />
            </div>
          </div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
