import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { trades } from "@/content/trades";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { CtaBand } from "@/components/layout/CtaBand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Pill } from "@/components/ui/Pill";
import { Screen } from "@/components/ui/Screen";

export const metadata: Metadata = pageMeta({
  title: "Industries",
  description: "Tivora ERP is built one trade at a time. Tivora ERP – Jewelry is running in showrooms today; other trades are coming.",
  path: "/industries/",
});

const jewelry = trades.find((t) => t.slug === "jewelry")!;
const coming = trades.filter((t) => t.status === "coming");

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Built one trade at a time."
        lead="Every Tivora product shares the same accounting core and stock engine, and adds a pack for its own trade."
      />

      <Section tone="ground">
        <div className="container-x grid items-center gap-stack-lg lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5" data-reveal>
            <Pill kind="available" />
            <h2 className="mt-4">{jewelry.name}</h2>
            <p className="mt-5 text-lead text-muted">
              For jewellery showrooms and workshops. From the showroom counter to the karigar&apos;s bench, it follows your
              metal.
            </p>
            <ul className="mt-6 space-y-2.5">
              {["Karigar / Workshop", "RFID", "Gold Loans", "Board rates"].map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ButtonLink href={jewelry.href!}>See Jewelry</ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-7" data-reveal>
            <Screen slug="home-jewelry" sizes="(min-width: 1024px) 720px, 100vw" />
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="container-x max-w-4xl">
          <h2 data-reveal>Coming next.</h2>
          <ul className="mt-stack divide-y divide-rule border-y border-rule">
            {coming.map((t) => (
              <li key={t.slug} className="flex items-center justify-between gap-4 py-5" data-reveal>
                <span className="text-h3 font-bold">{t.name}</span>
                <Pill kind="coming" />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
