import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { modules } from "@/content/modules";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { CtaBand } from "@/components/layout/CtaBand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { Screen } from "@/components/ui/Screen";

export const metadata: Metadata = pageMeta({
  title: "Jewellery",
  description:
    "Your gold is accounted for, every gram of it. The Jewellery solution follows your metal from the showroom counter to the karigar's bench: metal and stone tracking, purity, making charges, old gold and karigar management.",
  path: "/industries/jewelry/",
});

const stages = [
  {
    title: "In the showroom",
    body: "Tagged stock, the day's board rate, jewellery and general-goods billing, old-metal exchange, goods on approval, customer orders, savings schemes, and counters with a cash-up at the end of the day.",
  },
  {
    title: "In the workshop",
    body: "Work orders, metal and stone issue, production receipts, scrap and dust recovery, labour settlement net of TDS, and a running fine-metal balance for every karigar.",
  },
  {
    title: "When you grow",
    body: "A full factory floor with job bags and casting, RFID tagging with stock counts and exit-gate alerts, gold loans, hallmarking, and more branches.",
  },
];

const pack = modules.filter((m) => m.pack === "jewelry");

const plans = [
  { name: "Standard", who: "One showroom." },
  { name: "Business", who: "A growing shop with a workshop." },
  { name: "Enterprise", who: "Manufacturers and chains." },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Jewellery"
        title="Your gold is accounted for, every gram of it."
        lead="From the showroom counter to the karigar's bench, TiVora follows your metal. Metal and stone tracking, purity, making charges, old gold and karigar management are built in. Bill a necklace with its weight, making charge and stones; take old gold in exchange on the same bill; issue metal to a karigar and see exactly how much fine metal comes back, with the wastage (ghat) explained."
        actions={
          <>
            <ButtonLink href="/contact/?trade=jewelry">See it on your own numbers</ButtonLink>
            <ButtonLink href="/modules/#jewelry-pack" variant="secondary">See the Jewellery modules</ButtonLink>
          </>
        }
      />

      <Section tone="ground">
        <div className="container-x">
          <ol className=" grid gap-6 lg:grid-cols-3 lg:gap-8">
            {stages.map((s, i) => (
              <li key={s.title} className="rounded-xl border border-rule bg-paper p-6 shadow-card" data-reveal>
                <p className="font-mono text-eyebrow font-medium uppercase text-accent">0{i + 1}</p>
                <h2 className="mt-3 text-h3 font-sans font-bold">{s.title}</h2>
                <p className="mt-3 text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="paper">
        <div className="container-x">
          <h2 className="max-w-3xl" data-reveal>Four modules for the trade.</h2>
          <div className="mt-stack-lg grid gap-6 sm:grid-cols-2 lg:gap-8">
            {pack.map((m) => (
              <article key={m.slug} className="rounded-xl border border-rule bg-ground p-6" data-reveal>
                <div className="flex items-center gap-4">
                  <ModuleIcon name={m.icon} />
                  <h3>{m.name}</h3>
                </div>
                <p className="mt-4 text-muted">{m.appLine}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="ground">
        <div className="container-x" data-reveal>
          <Screen slug="home-jewelry" sizes="(min-width: 1280px) 1100px, 100vw" highlight={{ x: 0, y: 0, w: 15.6, h: 100, label: "One menu" }} />
        </div>
      </Section>

      <Section tone="paper">
        <div className="container-x">
          <h2 data-reveal>Three plans.</h2>
          <p className="mt-4 max-w-prose text-muted" data-reveal>
            Tell us about your business and we will suggest one.
          </p>
          <ul className="mt-stack-lg grid gap-6 md:grid-cols-3 lg:gap-8">
            {plans.map((p) => (
              <li key={p.name} className="flex flex-col rounded-xl border border-rule bg-ground p-6" data-reveal>
                <h3>{p.name}</h3>
                <p className="mt-3 flex-1 text-muted">{p.who}</p>
                <div className="mt-6">
                  <ButtonLink href="/contact/?trade=jewelry" variant="secondary" className="w-full">
                    Ask for a quote
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
