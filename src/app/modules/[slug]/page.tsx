import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { modulePages, modulePageBySlug } from "@/content/module-pages";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { CtaBand } from "@/components/layout/CtaBand";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { Screen } from "@/components/ui/Screen";
import type { ScreenSlug } from "@/content/screens";
import { Bullets, StepList } from "@/components/pages/blocks";

export const dynamicParams = false;

export function generateStaticParams() {
  return modulePages.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const m = modulePageBySlug((await params).slug);
  if (!m) return {};
  return pageMeta({ title: m.name, description: m.description, path: `/modules/${m.slug}/` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const m = modulePageBySlug((await params).slug);
  if (!m) notFound();
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
            <Screen slug={`module-${m.slug}` as ScreenSlug} sizes="(min-width: 1024px) 960px, 100vw" className="mx-auto max-w-4xl" />
            {related.length > 0 && (
              <div data-reveal>
                <h2 className="text-h3">Works with.</h2>
                <ul className="mt-5 flex flex-wrap gap-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/modules/${r.slug}/`}
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

      <CtaBand />
    </>
  );
}
