import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { modules, tradeFinanceExtra, type Module } from "@/content/modules";
import type { ScreenSlug } from "@/content/screens";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { CtaBand } from "@/components/layout/CtaBand";
import { Screen } from "@/components/ui/Screen";
import { Pill } from "@/components/ui/Pill";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = pageMeta({
  title: "Modules",
  description:
    "Ten modules on one ledger: sales, customer services, purchase, inventory, production, finance, trade finance, tax, reports and administration.",
  path: "/modules/",
});

const core = modules.filter((m) => m.pack === "core");
const jewelry = modules.filter((m) => m.pack === "jewelry");

const screenFor: Partial<Record<string, ScreenSlug>> = {
  sales: "sales-dashboard",
  finance: "finance-dashboard",
  reports: "dashboards",
};
// Reports Centre and Administration lines are not worded on any app screen yet (owner to confirm),
// so those two show name + a plain description only, no bullet list.
const descriptionOnly = new Set(["reports", "administration"]);

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

function ModuleBlock({ m }: { m: Module }) {
  const shot = screenFor[m.slug];
  return (
    <article id={m.slug} className="scroll-mt-24 border-t border-rule pt-10 first:border-t-0 first:pt-0" data-reveal>
      <div className="flex items-center gap-4">
        <ModuleIcon name={m.icon} />
        <h3 className="text-h3">{m.name}</h3>
      </div>
      <p className="mt-4 max-w-prose text-lead text-muted">{m.appLine}</p>
      {!descriptionOnly.has(m.slug) && <Bullets items={m.bullets} />}
      {m.slug === "trade-finance" && <p className="mt-4 text-small text-muted">{tradeFinanceExtra}</p>}
      {shot && <Screen slug={shot} sizes="(min-width: 1024px) 640px, 100vw" className="mt-8 max-w-2xl" />}
    </article>
  );
}

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Modules"
        title="Ten modules. One ledger underneath."
        lead="Sales, buying, stock, the production floor and the books share one set of entries, so a figure changed in one module is the same figure in every other."
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
                <li className="lg:mt-3">
                  <a href="#jewelry-pack" className="inline-flex min-h-11 items-center font-bold text-accent hover:text-bronze">
                    Jewelry pack
                  </a>
                </li>
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

      <Section tone="paper" id="jewelry-pack">
        <div className="container-x">
          <div className="max-w-3xl" data-reveal>
            <Pill kind="available" />
            <h2 className="mt-4">The Jewelry pack.</h2>
            <p className="mt-4 text-lead text-muted">
              Tivora ERP – Jewelry adds four modules to the same core, for the workshop, the factory floor, tagged stock and
              loans against jewelry.
            </p>
          </div>
          <div className="mt-stack-lg grid gap-6 sm:grid-cols-2 lg:gap-8">
            {jewelry.map((m) => (
              <article key={m.slug} className="rounded-xl border border-rule bg-ground p-6" data-reveal>
                <div className="flex items-center gap-4">
                  <ModuleIcon name={m.icon} />
                  <h3>{m.name}</h3>
                </div>
                <p className="mt-4 text-muted">{m.appLine}</p>
                <Bullets items={m.bullets} />
              </article>
            ))}
          </div>
          <div className="mt-stack" data-reveal>
            <ButtonLink href="/industries/jewelry/" variant="secondary">See Tivora ERP – Jewelry</ButtonLink>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
