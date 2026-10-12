import Link from "next/link";
import { FeatureSection } from "./FeatureSection";
import { WorkDeskMoment } from "@/components/moments/WorkDeskMoment";
import { ExecutiveMoment } from "@/components/moments/DashboardMoments";
import { KpiMoment } from "@/components/moments/KpiMoment";
import { PlanningMoment, ProductionMoment } from "@/components/moments/MakeMoments";

// Copy for the home page's key features. Source: the CEO brochure (docs/CEO-BROCHURE.txt) pp.3-9, wording unchanged.
const link = "mt-stack inline-flex min-h-11 items-center font-bold text-accent underline underline-offset-4 hover:text-bronze";

export function WorkDeskFeature() {
  return (
    <FeatureSection
      id="tour-workdesk"
      tone="ground"
      eyebrow="Work Desk"
      title="My Work Desk: every employee knows what to do, and does it from one window."
      lead="Each user opens TiVora to a personal desk built from live transactions: today's tasks, what is critical, what is waiting on them, and what is happening around them. Approvals, follow-ups, entries and calls are completed right there, with no hunting through menus."
      visual={<WorkDeskMoment />}
      groups={[
        {
          title: "The system reminds you what to do",
          items: [
            "Tasks generated from live transactions, not typed manually",
            "Due follow-ups, collections, dispatches and approvals in one queue",
            "Escalation to the manager when a task overruns",
          ],
        },
        {
          title: "And stops what you should not do",
          items: [
            "Sale beyond credit limit goes for approval",
            "Price below minimum or margin below floor is flagged",
            "Near-expiry batch is suggested first; spend beyond budget is blocked",
          ],
        },
      ]}
    >
      <Link href="/work-desk/" className={link}>
        See the Work Desk
      </Link>
    </FeatureSection>
  );
}

export function DashboardFeature() {
  return (
    <FeatureSection
      id="tour-dashboards"
      tone="paper"
      eyebrow="Executive Dashboard"
      title="Run meetings on data, not on assumption."
      lead="The Executive Dashboard gives owners and department heads a 360° live view of the whole company. Every number drills down to the voucher behind it, so a review meeting moves straight from “what happened” to “what we do next”."
      visual={<ExecutiveMoment />}
      reverse
      groups={[
        {
          title: "How a TiVora review meeting runs",
          items: [
            "Open the dashboard, not a spreadsheet someone prepared last night",
            "Start with exceptions: what is red, who owns it, by when",
            "Review each person's KPIs against target, live",
            "Assign actions that land directly on each person's Work Desk",
          ],
        },
      ]}
    >
      <p className="mt-stack font-bold">
        The result: managers talk only about business, performance, efficiency and scalability. Every claim in the room has a number and a source entry
        behind it.
      </p>
    </FeatureSection>
  );
}

const KPI_LIBRARY: [string, string][] = [
  ["Sales", "Target vs achievement, new customers, quotation conversion, order value, visit compliance, collection efficiency"],
  ["Purchase", "On-time delivery by vendor, price variance, PO cycle time, vendor rating"],
  ["Production", "Plan adherence, output vs standard, wastage %, cost per unit, machine downtime"],
  ["Store & Inventory", "Inventory days, stock accuracy, near-expiry value, dead stock, dispatch turnaround"],
  ["Finance", "Receivable and payable days, cash position, budget vs actual, margin by product and customer"],
  ["Customer Service", "Complaints opened and closed, resolution time, repeat complaints"],
];

export function KpiFeature() {
  return (
    <FeatureSection
      id="tour-kpi"
      tone="ground"
      eyebrow="Work Desk Performance"
      title="The right KPI for every team member and every department."
      lead="Set the target once. TiVora tracks it live from real transactions and from every task on each person's Work Desk, so every score is earned in the system, not reported in a meeting."
      visual={<KpiMoment />}
      below={
        <div data-reveal="" className="mt-stack-lg">
          <h3>KPI library by department, measured automatically</h3>
          <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {KPI_LIBRARY.map(([dept, kpis]) => (
              <div key={dept} className="border-t border-rule pt-4">
                <dt className="font-bold">{dept}</dt>
                <dd className="mt-1 text-small text-muted">{kpis}</dd>
              </div>
            ))}
          </dl>
        </div>
      }
    />
  );
}

const PLAN_STEPS = ["Forecast + confirmed orders", "BOM explosion", "Net of stock and open POs", "Lead-time scheduling", "Purchase and work orders"];

export function PlanningFeature() {
  return (
    <FeatureSection
      id="tour-planning"
      tone="paper"
      eyebrow="Material Planning"
      title="Material Planning and MRP workbench: buy and make exactly what you need."
      lead="The MRP workbench combines your sales forecast and confirmed orders, explodes them through the bill of materials, nets off stock and open orders, and tells you what to buy, what to make and by when."
      visual={<PlanningMoment />}
      groups={[
        {
          items: [
            "Sales forecast from history, season and targets",
            "Production plan by plant, line and shift",
            "Reorder policy per product group",
            "Purchase requests and work orders created from the workbench",
            "Imported items scheduled with LC and shipping lead time",
            "Plan vs actual tracked daily on the dashboard",
          ],
        },
      ]}
      below={
        <ol data-stagger="" className="mt-stack-lg flex flex-col gap-3 lg:flex-row lg:items-stretch">
          {PLAN_STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-3 rounded-xl border border-rule bg-ground px-4 py-3 font-bold">
              <span className="font-mono text-eyebrow text-accent">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      }
    />
  );
}

export function ProductionFeature() {
  return (
    <FeatureSection
      id="tour-production"
      tone="ground"
      eyebrow="Production costing"
      title="Planned cost vs actual cost, visible every day, not at year end."
      lead="Every batch is costed against its standard as it is received. Variance, yield, loss and machine efficiency are visible the same day, so cost leaks are fixed while they are still small."
      visual={<ProductionMoment />}
      reverse
      groups={[
        {
          items: [
            "Plan: standard cost from the BOM and the production plan, before a single batch starts.",
            "Compare: actual against standard for every batch, product and stage, the day it is received.",
            "Correct: imports too, landed cost estimate against actual for every charge on every shipment.",
          ],
        },
      ]}
    />
  );
}
