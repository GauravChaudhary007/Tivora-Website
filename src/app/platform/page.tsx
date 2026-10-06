import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { CtaBand } from "@/components/layout/CtaBand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Screen } from "@/components/ui/Screen";
import { VideoSection } from "@/components/video/VideoSection";
import { Bullets, Chain, DataTable, Eyebrow, Pillars, StepList } from "@/components/pages/blocks";
import {
  approvalFlow, controlFacts, costSteps, executionFacts, guardrails, landedCost, mrpFlow, pillars, planningFacts,
  productionChain, purchaseChain, salesChain, taxFacts, tradeFacts, truthRows,
} from "@/content/platform";

export const metadata: Metadata = pageMeta({
  title: "Platform",
  description:
    "One accounting core and one stock engine, with Bikram Sambat dates, VAT and IRD formats built in. See how TiVora ERP fits together.",
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
    body: "Bikram Sambat dates and fiscal years, 13% VAT, Annex 9 and Annex 13, TDS, and a connection to IRD with issued bills locked are part of the product, not an add-on.",
  },
];

const nepalFacts = [
  "Bikram Sambat dates and fiscal years throughout, with documents numbered by fiscal year.",
  "13% VAT worked out on each line and gathered into the VAT books and the monthly VAT return.",
  "Annex 9 and Annex 13.",
  "TDS where it applies, on labour and services.",
  "Connected to IRD; issued bills locked forever.",
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
        lead="Every TiVora product shares the same ledger and the same stock engine, and adds a pack for its own trade. A sale made at the counter updates the stock and the ledger at the same moment, so nothing is typed twice and the numbers always agree."
        actions={
          <>
            <ButtonLink href="/modules/">See the modules</ButtonLink>
            <ButtonLink href="/work-desk/" variant="secondary">See the Work Desk</ButtonLink>
          </>
        }
      />

      <Section tone="ground" id="one-truth">
        <div className="container-x">
          <div className="max-w-3xl" data-reveal>
            <Eyebrow>One version of the truth</Eyebrow>
            <h2 className="mt-3">Most companies don&apos;t lack software. They lack one version of the truth.</h2>
            <p className="mt-5 text-lead text-muted">
              Data sits in separate systems, people wait to be told what to do, and meetings run on opinion. TiVora replaces
              all three with one system that knows your business, guides your people, automates the routine and measures the
              result.
            </p>
          </div>
          <div className="mt-stack-lg" data-reveal>
            <DataTable caption="Without an integrated system compared with TiVora ERP" head={["Without an integrated system", "With TiVora ERP"]} rows={truthRows} />
          </div>
          <div className="mt-stack-lg"><Pillars items={pillars} /></div>
        </div>
      </Section>

      <Section tone="paper" id="single-entry">
        <div className="container-x">
          <div className="max-w-3xl" data-reveal>
            <Eyebrow>Single entry</Eyebrow>
            <h2 className="mt-3">One entry. Everything else follows.</h2>
            <p className="mt-5 text-lead text-muted">
              Each document is created from the one before it, so data is never retyped. Stock, ledgers, tax, receivables and
              dashboards update the moment a step is saved.
            </p>
          </div>
          <div className="mt-stack-lg"><StepList steps={salesChain} doesLabel="TiVora does automatically" /></div>
          <p className="mt-6 max-w-prose font-bold" data-reveal>
            Result: dashboard, P&amp;L, stock and KPI reports are correct the moment the last step is saved.
          </p>
          <div className="mt-stack-lg grid gap-6 lg:grid-cols-2 lg:gap-8" data-reveal>
            <Chain label="The same chain runs in purchase" steps={purchaseChain} note="Stock at true cost, LC margin and payables post on their own." />
            <Chain label="And in production" steps={productionChain} note="WIP and finished goods move with each step." />
          </div>
          <p className="mt-6 font-mono text-h3 font-medium text-ink" data-reveal>Re-typed fields: 0</p>
        </div>
      </Section>

      <Section tone="ground" id="control">
        <div className="container-x grid gap-stack-lg lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5" data-reveal>
            <Eyebrow>Control</Eyebrow>
            <h2 className="mt-3">Control. Every rule, every time.</h2>
            <p className="mt-5 text-lead text-muted">
              Set your company&apos;s rules once. TiVora decides which documents need approval, sends them to the right person,
              reminds and escalates, and posts the transaction the moment it is approved.
            </p>
            <h3 className="mt-8">Mistakes stopped before they happen</h3>
            <Bullets items={guardrails} className="mt-4" />
            <Bullets items={controlFacts} className="mt-6" />
          </div>
          <div className="lg:col-span-7"><StepList steps={approvalFlow} /></div>
        </div>
      </Section>

      <Section tone="paper" id="planning">
        <div className="container-x">
          <div className="max-w-3xl" data-reveal>
            <Eyebrow>Material Planning</Eyebrow>
            <h2 className="mt-3">Material Planning and MRP workbench: buy and make exactly what you need.</h2>
            <p className="mt-5 text-lead text-muted">
              The MRP workbench combines your sales forecast and confirmed orders, explodes them through the bill of materials,
              nets off stock and open orders, and tells you what to buy, what to make and by when.
            </p>
          </div>
          <div className="mt-stack-lg"><StepList steps={mrpFlow} /></div>
          <div className="mt-stack-lg grid gap-8 md:grid-cols-2" data-reveal>
            <div><h3>Planning and forecasting</h3><Bullets items={planningFacts} className="mt-4" /></div>
            <div><h3>From plan to execution</h3><Bullets items={executionFacts} className="mt-4" /></div>
          </div>
        </div>
      </Section>

      <Section tone="ground" id="cost">
        <div className="container-x">
          <div className="max-w-3xl" data-reveal>
            <Eyebrow>Costing</Eyebrow>
            <h2 className="mt-3">Planned cost vs actual cost, visible every day, not at year end.</h2>
            <p className="mt-5 text-lead text-muted">
              Every batch is costed against its standard as it is received. Variance, yield, loss and machine efficiency are
              visible the same day, so cost leaks are fixed while they are still small.
            </p>
          </div>
          <div className="mt-stack-lg"><StepList steps={costSteps} /></div>
        </div>
      </Section>

      <Section tone="paper">
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

      <VideoSection
        id="money"
        tone="night"
        title="Books, banks and tax."
        body="Vouchers to the trial balance, letters of credit, VAT and TDS, in 72 seconds."
      />

      <Section tone="paper" id="nepal">
        <div className="container-x grid gap-stack-lg lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6" data-reveal>
            <p className="font-mono text-eyebrow font-medium uppercase text-accent">Built for Nepal</p>
            <h2 className="mt-3">Made for the way Nepal does business.</h2>
            <p className="mt-5 text-lead text-muted">
              Every date in TiVora ERP can be read in Bikram Sambat, and every document is numbered by fiscal year. VAT is
              worked out on each line and gathered into the VAT books, the monthly VAT return, and Annex 9 and Annex 13.
              TDS is deducted where it applies, and TiVora connects to IRD and locks every issued bill.
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

      <Section tone="ground" id="ready-for-nepal">
        <div className="container-x">
          <div className="max-w-3xl" data-reveal>
            <Eyebrow>Ready for Nepal</Eyebrow>
            <h2 className="mt-3">Ready for Nepal: tax, trade, finance and import costing.</h2>
            <p className="mt-5 text-lead text-muted">
              TiVora is built in Kathmandu for the way Nepali businesses actually operate, from IRD and Bikram Sambat dates to
              LC, trust receipt loans, bank limits and landed cost.
            </p>
          </div>
          <div className="mt-stack-lg grid gap-8 md:grid-cols-2" data-reveal>
            <div><h3>Tax and compliance</h3><Bullets items={taxFacts} className="mt-4" /></div>
            <div><h3>Trade and finance</h3><Bullets items={tradeFacts} className="mt-4" /></div>
          </div>
          <div className="mt-stack-lg" data-reveal>
            <h3>Landed cost, calculated automatically</h3>
            <p className="mt-3 max-w-prose text-muted">
              Every charge is linked to the shipment and capitalised to each line by value, weight or manual driver, with
              estimate against actual. Import VAT is taken as input credit, not added to cost.
            </p>
            <div className="mt-6"><DataTable caption="Landed cost heads and how each is allocated" head={["Cost head", "Allocated by"]} rows={landedCost} /></div>
          </div>
        </div>
      </Section>

      <Section tone="paper" id="security">
        <div className="container-x grid gap-stack-lg lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5" data-reveal>
            <p className="font-mono text-eyebrow font-medium uppercase text-accent">Security and hosting</p>
            <h2 className="mt-3">Your records stay yours.</h2>
          </div>
          <div className="space-y-5 text-lead text-muted lg:col-span-7" data-reveal>
            <p>
              In the TiVora cloud, every company has its own database, kept apart from every other customer&apos;s. Your
              data is backed up automatically, and every change is written to an audit log that cannot be edited. HiTech&apos;s
              own staff sign in to their console with a second step, a code from an authenticator app. Every approver in your own company signs in with multi-factor login and an approval PIN.
            </p>
            <p>
              If a subscription runs out, TiVora ERP turns read-only rather than locking you out. You can always open and
              print your own records.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="ground">
        <div className="container-x">
          <div className="max-w-3xl" data-reveal>
            <p className="font-mono text-eyebrow font-medium uppercase text-accent">How you move around</p>
            <h2 className="mt-3">One menu for every module.</h2>
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
