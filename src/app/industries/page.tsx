import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { trades, implementationSteps, flexible, easyToAdopt } from "@/content/trades";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { CtaBand } from "@/components/layout/CtaBand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Screen } from "@/components/ui/Screen";

export const metadata: Metadata = pageMeta({
  title: "Industries",
  description:
    "Customised for your industry, configured for your company: Jewellery, Paint & Coatings, FMCG, Pharmacy, Automobile, Trading and Manufacturing solutions on one complete platform.",
  path: "/industries/",
});

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((b) => (
        <li key={b} className="flex gap-3">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Customised for your industry. Configured for your company."
        lead="We don't ask you to fit a generic ERP. We start from a complete platform, add the solution made for your industry, then customise it to your products, your approvals and your reports."
      />

      <Section tone="ground">
        <div className="container-x max-w-5xl">
          <h2 data-reveal>Industry solutions.</h2>
          <div className="mt-stack overflow-x-auto" data-reveal>
            <table className="w-full min-w-xl border-collapse text-left">
              <caption className="sr-only">Industry solutions and what each is customised for</caption>
              <thead>
                <tr className="border-b border-rule text-small text-muted">
                  <th scope="col" className="py-3 pr-6 font-bold">Industry solution</th>
                  <th scope="col" className="py-3 font-bold">Customised for the way your industry works</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => (
                  <tr key={t.slug} className="border-b border-rule align-top">
                    <th scope="row" className="py-4 pr-6 font-bold">
                      {t.href ? (
                        <a href={t.href} className="text-accent hover:text-bronze">{t.name}</a>
                      ) : (
                        t.name
                      )}
                    </th>
                    <td className="py-4 text-muted">{t.line}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="container-x grid items-center gap-stack-lg lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5" data-reveal>
            <h2>Jewellery</h2>
            <p className="mt-4 text-lead text-muted">
              For jewellery showrooms and workshops. From the showroom counter to the karigar&apos;s bench, it follows your metal.
            </p>
            <Bullets items={["Karigar / Workshop", "RFID", "Gold Loans", "Board rates"]} />
            <div className="mt-5">
              <ButtonLink href="/industries/jewelry/">See Jewellery</ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-7" data-reveal>
            <Screen slug="home-jewelry" sizes="(min-width: 1024px) 720px, 100vw" />
          </div>
        </div>
      </Section>

      <Section tone="ground">
        <div className="container-x">
          <h2 data-reveal>Implementation, step by step.</h2>
          <ol className="mt-stack-lg grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" data-stagger>
            {implementationSteps.map((s, i) => (
              <li key={s.name} className="rounded-xl border border-rule bg-paper p-4 sm:p-5 shadow-card">
                <p className="font-mono text-eyebrow font-medium uppercase text-accent">0{i + 1}</p>
                <h3 className="mt-3">{s.name}</h3>
                <p className="mt-2 text-muted">{s.line}</p>
              </li>
            ))}
          </ol>
          <div className="mt-stack-lg grid gap-stack-lg md:grid-cols-2 md:gap-8">
            <div data-reveal>
              <h3>Completely flexible</h3>
              <Bullets items={flexible} />
            </div>
            <div data-reveal>
              <h3>Fast and easy to adopt</h3>
              <Bullets items={easyToAdopt} />
            </div>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
