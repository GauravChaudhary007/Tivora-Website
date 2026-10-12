import { Section } from "@/components/layout/Section";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import type { IconName } from "@/content/modules";

// Copy: CEO brochure (docs/CEO-BROCHURE.txt) p6 "One entry. Everything else follows." and p7 "Control. Every rule, every time.", wording unchanged.

const CHAIN: { name: string; icon: IconName; team: string; auto: string }[] = [
  { name: "Quotation", icon: "FileText", team: "Customer, items and price list", auto: "Applies price list, schemes and VAT; sends it by email or WhatsApp" },
  { name: "Sales order", icon: "ClipboardList", team: "One click from the quotation", auto: "Checks credit limit, floor rate and stock; holds for approval if a rule is crossed" },
  { name: "Challan", icon: "Truck", team: "Delivery note from the order", auto: "Reduces stock, picks batch by expiry, assigns own vehicle or transporter" },
  { name: "Invoice", icon: "ReceiptText", team: "Tax invoice from the challan", auto: "Posts sales, VAT and receivable ledgers, connects to IRD, locks the issued bill" },
  { name: "Send to customer", icon: "Globe", team: "From the same screen", auto: "Invoice PDF reaches the customer's email and WhatsApp in minutes" },
  { name: "Receipt", icon: "Banknote", team: "Payment set against bills", auto: "Updates customer ageing, salesperson target and cash position" },
];

/** One entry: the sales chain as six linked steps. A document dot travels the dotted line; nothing depends on scroll. */
export function EntryChain() {
  return (
    <Section tone="night" size="lg" id="tour-entry">
      <div className="container-x">
        <div data-reveal="" className="max-w-3xl">
          <p className="font-mono text-eyebrow font-medium text-gold uppercase">Single entry</p>
          <h2 className="mt-3">One entry. Everything else follows.</h2>
          <p className="mt-5 text-lead text-muted-dark">
            Each document is created from the one before it, so data is never retyped. Stock, ledgers, tax, receivables and dashboards update the moment a
            step is saved.
          </p>
        </div>

        <ol className="ec mt-stack-lg grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-3">
          {CHAIN.map((c, i) => (
            <li key={c.name} className="relative z-10 flex flex-col rounded-2xl border border-rule-dark bg-night-2 p-4">
              <div className="flex items-center gap-3">
                <ModuleIcon name={c.icon} className="size-11" />
                <span className="font-mono text-eyebrow font-medium text-gold">{i + 1}</span>
              </div>
              <h3 className="mt-3 text-lead leading-snug font-bold">{c.name}</h3>
              <p className="mt-3 font-mono text-eyebrow font-medium text-muted-dark uppercase">Your team does</p>
              <p className="mt-1 text-small">{c.team}</p>
              <p className="mt-3 font-mono text-eyebrow font-medium text-gold uppercase">TiVora does automatically</p>
              <p className="mt-1 text-small text-muted-dark">{c.auto}</p>
            </li>
          ))}
        </ol>

        <div data-reveal="" className="mt-stack-lg grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="rounded-2xl border border-gold/50 bg-night-2 p-6 lg:col-span-5">
            <p className="font-mono text-eyebrow font-medium text-gold uppercase">Result</p>
            <p className="mt-2 text-lead font-bold">Dashboard, P&amp;L, stock and KPI reports are correct the moment the last step is saved.</p>
            <p className="mt-4 font-mono text-gold">
              Re-typed fields: <span className="font-display text-h2 text-ground">0</span>
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            <div>
              <h3 className="text-lead font-bold">The same single-entry chain runs in purchase</h3>
              <p className="mt-2 text-muted-dark">
                Reorder → purchase order → goods received → bill → landed cost → payment. Stock at true cost, LC margin and payables post on their own.
              </p>
            </div>
            <div>
              <h3 className="text-lead font-bold">And in production</h3>
              <p className="mt-2 text-muted-dark">
                Plan → production order → material to the floor → receipt costed batch by batch → variance. WIP and finished goods move with each step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

const Arrow = () => (
  <span aria-hidden="true" className="ap-arrow self-center text-gold max-lg:rotate-90">
    →
  </span>
);

const Box = ({ title, text, className = "" }: { title: string; text: string; className?: string }) => (
  <div className={`rounded-2xl border border-rule bg-paper p-4 shadow-card ${className}`}>
    <p className="font-bold">{title}</p>
    <p className="mt-1 text-small text-muted">{text}</p>
  </div>
);

/** Approvals: the rule engine, three approval levels, escalation and automatic posting, as one flow that fits a screen. */
export function ApprovalFlow() {
  return (
    <Section tone="ground" size="lg" id="tour-control">
      <div className="container-x">
        <div data-reveal="" className="max-w-3xl">
          <p className="font-mono text-eyebrow font-medium text-accent uppercase">Approvals</p>
          <h2 className="mt-3">Control. Every rule, every time.</h2>
          <p className="mt-5 text-lead text-muted">
            Set your company&rsquo;s rules once. TiVora decides which documents need approval, sends them to the right person, reminds and escalates, and
            posts the transaction the moment it is approved.
          </p>
        </div>

        <div data-reveal="" className="mt-stack-lg flex flex-col gap-3 lg:flex-row">
          <Box className="lg:flex-1" title="Document saved" text="PO, sales order, payment, discount, journal" />
          <Arrow />
          <Box className="lg:flex-1" title="Rule engine checks" text="amount, discount %, credit limit, margin, budget, user role" />
          <Arrow />
          <div className="flex flex-col gap-3 lg:flex-[2]">
            <div className="rounded-2xl border border-ok/40 bg-ok-tint p-4">
              <p className="font-bold text-ok">Within limits: no approval needed</p>
            </div>
            <div className="rounded-2xl border border-rule bg-tint p-4">
              <p className="font-bold">Rule crossed</p>
              <ol className="mt-3 grid gap-2 sm:grid-cols-3">
                {[
                  ["Level 1", "Branch manager, up to Rs 5 L"],
                  ["Level 2", "General manager, up to Rs 25 L"],
                  ["Level 3", "Director, above Rs 25 L"],
                ].map(([l, t]) => (
                  <li key={l} className="rounded-xl bg-paper p-3 text-small">
                    <span className="font-bold">{l}</span>
                    <span className="block text-muted">{t}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-small text-muted">
                <strong className="text-ink">Auto-escalation.</strong> No action in 4 hours: reminder, then next level. <strong className="text-ink">Rejected:</strong> back
                to the maker with a comment.
              </p>
            </div>
          </div>
          <Arrow />
          <Box className="lg:flex-1 lg:border-gold" title="Posted automatically" text="stock, ledgers and KPIs update, the maker is notified, the full audit trail is saved" />
        </div>
        <p className="mt-3 text-small text-muted">Approval levels and limits shown are an example; each company sets its own.</p>

        <div className="mt-stack-lg grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal="">
            <h3>Mistakes stopped before they happen</h3>
            <ul className="mt-4 space-y-2">
              {[
                ["Rate below floor?", "Needs approval."],
                ["Discount above limit?", "Needs approval."],
                ["Issued IRD bill?", "Locked forever."],
              ].map(([q, a]) => (
                <li key={q} className="flex flex-wrap gap-x-2 rounded-xl border border-rule bg-paper px-4 py-3">
                  <span className="font-bold">{q}</span>
                  <span className="text-accent">{a}</span>
                </li>
              ))}
            </ul>
          </div>
          <ul className="space-y-2.5 lg:col-span-7" data-reveal="">
            {[
              "Approval PIN and multi-factor login for every approver",
              "Full context on the approval: bill, limit, overdue",
              "Audit trail for the owner: who created, who approved, when",
              "Approve from the Work Desk wherever you are",
            ].map((b) => (
              <li key={b} className="flex gap-3">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
