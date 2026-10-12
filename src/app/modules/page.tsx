import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { modules, launchingSoon, engines, tradeFinanceExtra, type Module } from "@/content/modules";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { CtaBand } from "@/components/layout/CtaBand";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { VideoBlock } from "@/components/video/VideoBlock";
import { pageHrefForIndexSlug } from "@/content/module-pages";
import { ModuleMoment } from "@/components/moments/ModuleMoment";
import { PlanningMoment, ProductionMoment } from "@/components/moments/MakeMoments";
import { MODULE_MOMENTS } from "@/content/module-moments";
import { filmReady, type FilmId } from "@/content/videos";

export const metadata: Metadata = pageMeta({
  title: "Modules",
  description:
    "Complete modules, one database. Sixteen working areas today, with CRM, Exports, Quality Control and HRM launching soon on the same platform.",
  path: "/modules/",
});

const core = modules.filter((m) => m.pack === "core");

// Product moments under a module's block: the module's own moment where one exists, or the brochure's planning and production screens.
const visualFor = (m: Module) =>
  m.slug === "material-planning" ? <PlanningMoment /> : m.slug === "production" ? <ProductionMoment /> : MODULE_MOMENTS[m.slug] ? <ModuleMoment name={m.name} data={MODULE_MOMENTS[m.slug]} /> : null;

const filmFor: Partial<Record<string, { id: FilmId; heading: string }>> = {
  sales: { id: "sales", heading: "From quotation to receipt, in a minute." },
  production: { id: "stock", heading: "Buy, store, make and deliver, in 68 seconds." },
};

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-2.5">
      {items.map((b) => (
        <li key={b} className="flex gap-3">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function PageLink({ slug, name }: { slug: string; name: string }) {
  const href = pageHrefForIndexSlug(slug);
  if (!href) return null;
  return (
    <p className="mt-4">
      <Link href={href} className="inline-flex min-h-11 items-center font-bold text-accent underline underline-offset-4 hover:text-bronze">
        Explore {name}
      </Link>
    </p>
  );
}

function ModuleBlock({ m }: { m: Module }) {
  // Heading and film both vanish in production while the film's files are missing.
  const visual = ["sales", "finance", "reports", "material-planning", "production"].includes(m.slug) ? visualFor(m) : null;
  const f = filmFor[m.slug];
  const film = f && (process.env.NODE_ENV !== "production" || filmReady(f.id)) ? f : null;
  return (
    <article id={m.slug} className="scroll-mt-24 border-t border-rule pt-10 first:border-t-0 first:pt-0" data-reveal>
      <div className="flex items-center gap-4">
        <ModuleIcon name={m.icon} />
        <h3 className="text-h3">{m.name}</h3>
      </div>
      <p className="mt-4 max-w-prose text-lead text-muted">{m.appLine}</p>
      {m.more && <p className="mt-3 max-w-prose text-muted">{m.more}</p>}
      {m.bullets.length > 0 && <Bullets items={m.bullets} />}
      <PageLink slug={m.slug} name={m.name} />
      {film && (
        <div className="mt-8 max-w-2xl">
          <h3 className="text-h3">{film.heading}</h3>
          <VideoBlock id={film.id} className="mt-4" />
        </div>
      )}
      {m.slug === "trade-finance" && <p className="mt-4 text-small text-muted">{tradeFinanceExtra}</p>}
      {visual && <div className="mt-8 max-w-2xl">{visual}</div>}
    </article>
  );
}

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Modules"
        title="Complete modules. One database."
        lead="Every module talks to every other. Sixteen working areas today, with CRM, Exports, Quality Control and HRM launching soon on the same platform."
      />

      <Section tone="ground">
        <div className="container-x grid gap-stack-lg lg:grid-cols-12 lg:gap-8">
          <nav aria-label="Modules" className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <p className="font-mono text-eyebrow font-medium uppercase text-accent">On this page</p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 lg:block lg:space-y-1">
                {core.map((m) => (
                  <li key={m.slug}>
                    <a href={`#${m.slug}`} className="inline-flex min-h-11 items-center text-muted hover:text-ink">
                      {m.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="space-y-12 lg:col-span-9">
            {core.map((m) => (
              <ModuleBlock key={m.slug} m={m} />
            ))}
          </div>
        </div>
      </Section>

      <Section tone="ground">
        <div className="container-x">
          <h2 data-reveal>Launching soon.</h2>
          <ul className="mt-stack-lg grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8" data-stagger>
            {launchingSoon.map((m) => (
              <li key={m.name} className="rounded-xl border border-rule bg-ground p-6">
                <ModuleIcon name={m.icon} />
                <h3 className="mt-4">{m.name}</h3>
                <p className="mt-2 text-muted">{m.line}</p>
                <span className="mt-4 inline-block rounded-full bg-tint px-3 py-1 text-small font-bold text-muted">Launching soon</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="paper">
        <div className="container-x">
          <h2 data-reveal>Engines that run underneath every module.</h2>
          <dl className="mt-stack-lg grid gap-x-8 gap-y-6 sm:grid-cols-2" data-stagger>
            {engines.map((e) => (
              <div key={e.name} className="border-t border-rule pt-4">
                <dt className="font-bold">{e.name}</dt>
                <dd className="mt-1 text-muted">{e.line}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-stack-lg max-w-3xl text-lead" data-reveal>
            <strong>Intelligent by design.</strong> TiVora knows every open item across all modules and acts like your manager: it
            reminds you what to do, warns you what not to do, and shows the next step, so every job finishes on time.
          </p>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
