import { Pill } from "@/components/ui/Pill";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Screen } from "@/components/ui/Screen";
import { Section } from "@/components/layout/Section";
import { trades } from "@/content/trades";

const coming = trades.filter((t) => t.status === "coming");

/** Scene 7. Light, not pinned; the shared [data-reveal] handles the entrance. */
export function TradesScene() {
  return (
    <Section tone="ground" size="lg" id="tour-editions">
      <div className="container-x">
        <div data-reveal="" className="max-w-prose">
          <h2>Built one trade at a time.</h2>
          <p className="mt-5 text-lead text-muted">
            Every TiVora product shares the same accounting core and stock engine, and adds a pack for its own trade.
          </p>
        </div>
        <div data-stagger="" className="mt-stack-lg grid gap-stack lg:grid-cols-12">
          <div className="rounded-xl border border-rule bg-paper p-6 shadow-card lg:col-span-7 lg:p-8">
            <Pill kind="available" />
            <h3 className="mt-4">TiVora ERP – Jewelry</h3>
            <div className="relative mt-6 pl-6 sm:pl-12">
              <Screen slug="home-jewelry" imgClassName="aspect-5/2 object-cover object-bottom" sizes="(min-width: 1024px) 560px, 100vw" />
              <Screen
                slug="menu-jewelry"
                caption={false}
                sizes="144px"
                imgClassName="aspect-3/4 object-cover object-top"
                className="absolute top-4 left-0 w-20 sm:top-8 sm:w-32"
              />
            </div>
            <ul className="mt-6 grid gap-2 font-bold sm:grid-cols-2">
              {["Karigar / Workshop", "RFID", "Gold Loans", "Board rates"].map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="size-2 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
            <ButtonLink href="/industries/jewelry/" variant="ghost" className="mt-4 sm:w-auto">
              See Jewelry
            </ButtonLink>
          </div>
          <ul className="divide-y divide-rule self-start border-y border-rule lg:col-span-5">
            {coming.map((t) => (
              <li key={t.slug} className="flex items-center justify-between gap-4 py-4">
                <span className="font-bold">{t.name}</span>
                <Pill kind="coming" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
