import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { CtaBand } from "@/components/layout/CtaBand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Screen } from "@/components/ui/Screen";

export const metadata: Metadata = pageMeta({
  title: "Platform",
  description:
    "One accounting core and one stock engine, with Bikram Sambat dates, VAT and IRD formats built in. See how Tivora ERP fits together.",
  path: "/platform/",
});

const reasons = [
  {
    title: "Books your auditor accepts",
    body: "Every entry is true double-entry. A voucher that does not balance cannot be saved, and a posted invoice cannot be quietly deleted. The trial balance, profit and loss and balance sheet all read the same entries.",
  },
  {
    title: "Stock that adds up",
    body: "Every piece, lot and godown is tracked, with its value. Choose FIFO, LIFO, moving average or board-rate valuation, and count your stock against the system whenever you want.",
  },
  {
    title: "Nepal built in",
    body: "Bikram Sambat dates and fiscal years, 13% VAT, Annex 9 and Annex 13, TDS, and e-invoicing in IRD's CBMS format are part of the product, not an add-on.",
  },
];

const nepalFacts = [
  "Bikram Sambat dates and fiscal years throughout, with documents numbered by fiscal year.",
  "13% VAT worked out on each line and gathered into the VAT books and the monthly VAT return.",
  "Annex 9 and Annex 13.",
  "TDS where it applies, on labour and services.",
  "E-invoicing in the CBMS format IRD publishes: CBMS-ready, built to IRD's current formats.",
];

const moves = [
  "Press Ctrl K and type: the menu search finds any entry.",
  "Switch company from the top bar without signing out.",
  "Read every date in Bikram Sambat and AD side by side.",
  "Pick the modern menu, or the classic grouped menu; use the light or dark theme.",
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="The platform"
        title="One accounting core. One stock engine."
        lead="Every Tivora product shares the same ledger and the same stock engine, and adds a pack for its own trade. A sale made at the counter updates the stock and the ledger at the same moment, so nothing is typed twice and the numbers always agree."
        actions={
          <>
            <ButtonLink href="/modules/">See the modules</ButtonLink>
            <ButtonLink href="/work-desk/" variant="secondary">See the Work Desk</ButtonLink>
          </>
        }
      />

      <Section tone="ground">
        <div className="container-x">
          <h2 className="max-w-3xl" data-reveal>Three things an owner and an accountant both check.</h2>
          <ol className="mt-stack-lg grid gap-6 lg:grid-cols-3 lg:gap-8">
            {reasons.map((r, i) => (
              <li key={r.title} className="rounded-xl border border-rule bg-paper p-6 shadow-card" data-reveal>
                <p className="font-mono text-eyebrow font-medium uppercase text-accent">0{i + 1}</p>
                <h3 className="mt-3">{r.title}</h3>
                <p className="mt-3 text-muted">{r.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="paper" id="nepal">
        <div className="container-x grid gap-stack-lg lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6" data-reveal>
            <p className="font-mono text-eyebrow font-medium uppercase text-accent">Built for Nepal</p>
            <h2 className="mt-3">Made for the way Nepal does business.</h2>
            <p className="mt-5 text-lead text-muted">
              Every date in Tivora ERP can be read in Bikram Sambat, and every document is numbered by fiscal year. VAT is
              worked out on each line and gathered into the VAT books, the monthly VAT return, and Annex 9 and Annex 13.
              TDS is deducted where it applies, and invoices can be sent in the CBMS format IRD publishes for billing
              software.
            </p>
          </div>
          <div className="lg:col-span-6" data-reveal>
            <div className="rounded-xl bg-tint p-6">
              <p className="font-mono text-eyebrow font-medium uppercase text-muted">A fiscal-year document number</p>
              <p className="mt-3 font-mono text-h2 font-medium text-ink">SI-2083/84-00001</p>
              <p className="mt-2 text-small text-muted">Sales invoice, fiscal year 2083/84, first of the year.</p>
            </div>
            <ul className="mt-6 space-y-3">
              {nepalFacts.map((f) => (
                <li key={f} className="flex gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="ground" id="security">
        <div className="container-x grid gap-stack-lg lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5" data-reveal>
            <p className="font-mono text-eyebrow font-medium uppercase text-accent">Security and hosting</p>
            <h2 className="mt-3">Your records stay yours.</h2>
          </div>
          <div className="space-y-5 text-lead text-muted lg:col-span-7" data-reveal>
            <p>
              In the Tivora cloud, every company has its own database, kept apart from every other customer&apos;s. Your
              data is backed up automatically, and every change is written to an audit log that cannot be edited. HiTech&apos;s
              own staff sign in to their console with a second step, a code from an authenticator app.
            </p>
            <p>
              If a subscription runs out, Tivora ERP turns read-only rather than locking you out. You can always open and
              print your own records.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="container-x">
          <div className="max-w-3xl" data-reveal>
            <p className="font-mono text-eyebrow font-medium uppercase text-accent">How you move around</p>
            <h2 className="mt-3">Ten modules on one menu.</h2>
            <ul className="mt-6 space-y-3">
              {moves.map((m) => (
                <li key={m} className="flex gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-stack-lg grid gap-8 sm:grid-cols-2 lg:max-w-3xl" data-reveal>
            <Screen slug="menu-paint" sizes="320px" className="max-w-xs" />
            <Screen slug="menu-classic" sizes="320px" className="max-w-xs" />
          </div>
          <p className="mt-6 max-w-prose text-small text-muted">The modern menu on the left, the classic menu on the right.</p>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
