import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { CtaBand } from "@/components/layout/CtaBand";
import { Screen } from "@/components/ui/Screen";
import { VideoSection } from "@/components/video/VideoSection";
import { DashboardZoom } from "@/components/home/DashboardZoom";
import { WorkDeskStills } from "@/components/home/WorkDeskStills";
import { Bullets, DataTable, Eyebrow, StepList } from "@/components/pages/blocks";
import { deskParts, deskReminders, deskStops, kpiLibrary, meetingSteps } from "@/content/platform";

export const metadata: Metadata = pageMeta({
  title: "Work Desk and dashboards",
  description:
    "The Work Desk lists what is late, critical or due across every module. Each module has a dashboard, and the Executive dashboard shows the whole business on one page.",
  path: "/work-desk/",
});

// Three CRITICAL cards on the Work Desk screen, read left to right.
const critical = [
  { label: "Over the credit limit", body: "A customer's open bills pass the limit set for them, with Review one click away." },
  { label: "Gold loan past its term", body: "A gold loan has run past its term, so the pledge can be followed up before interest piles up." },
  { label: "RFID exit-gate read", body: "A tagged piece was read at the exit gate, so missing stock is flagged the moment it leaves." },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Work Desk"
        title="My Work Desk: every employee knows what to do, and does it from one window."
        lead="Each user opens TiVora to a personal desk built from live transactions: today's tasks, what is critical, what is waiting on them, and what is happening around them. Approvals, follow-ups, entries and calls are completed right there, with no hunting through menus."
      />

      <VideoSection
        id="owner"
        tone="paper"
        title="The owner's morning."
        body="The Work Desk, performance and dashboards, in a minute."
      />

      <Section tone="ground">
        <div className="container-x grid items-start gap-stack-lg lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5" data-reveal>
            <h2>What needs you now.</h2>
            <p className="mt-5 text-lead text-muted">
              A customer over the credit limit, a manufacturing order past its date, a supplier payment coming up. Each
              item sits under the module it belongs to, with the button that deals with it.
            </p>
            <ol className="mt-8 space-y-5">
              {critical.map((c, i) => (
                <li key={c.label} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-paper font-mono text-small font-medium">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-bold">{c.label}</span>
                    <span className="text-muted">{c.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="min-w-0 lg:col-span-7" data-reveal>
            <div className="hidden lg:block">
              <Screen slug="work-desk" sizes="(min-width: 1024px) 720px, 100vw" />
            </div>
            <WorkDeskStills />
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="container-x grid gap-stack-lg lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5" data-reveal>
            <h2>The system reminds you what to do and stops what you should not do.</h2>
            <Bullets items={deskReminders} className="mt-6" />
            <Bullets items={deskStops} className="mt-6" />
          </div>
          <ol className="space-y-4 lg:col-span-7" data-stagger>
            {deskParts.map((d) => (
              <li key={d.label} className="rounded-xl border border-rule bg-paper p-5 shadow-card">
                <h3>{d.label}</h3>
                <p className="mt-2 text-muted">{d.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="ground">
        <div className="container-x grid items-start gap-stack-lg lg:grid-cols-12 lg:gap-8">
          <div className="lg:order-2 lg:col-span-5" data-reveal>
            <h2>A dashboard for every module.</h2>
            <p className="mt-5 text-lead text-muted">
              Each dashboard opens on its trend, with your work, what is critical and what is outstanding a tab away. The
              Dashboards page lists the Executive dashboard first, then Sales, Customer Services, Purchase, Store,
              Production, Finance, Trade and Tax.
            </p>
          </div>
          <div className="lg:order-1 lg:col-span-7" data-reveal>
            <Screen slug="dashboards" sizes="(min-width: 1024px) 720px, 100vw" />
          </div>
        </div>
      </Section>

      <Section tone="paper" id="meetings">
        <div className="container-x grid items-start gap-stack-lg lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5" data-reveal>
            <Eyebrow>Executive dashboard</Eyebrow>
            <h2 className="mt-3">Run meetings on data, not on assumption.</h2>
            <p className="mt-5 text-lead text-muted">
              The Executive Dashboard gives owners and department heads a 360° live view of the whole company. Every number
              drills down to the voucher behind it, so a review meeting moves straight from &ldquo;what happened&rdquo; to
              &ldquo;what we do next&rdquo;.
            </p>
            <p className="mt-5">
              The result: managers talk only about business, performance, efficiency and scalability. No perception, no
              general talk. Every claim in the room has a number and a source entry behind it.
            </p>
          </div>
          <div className="lg:col-span-7">
            <h3 className="mb-4">How a TiVora review meeting runs</h3>
            <StepList steps={meetingSteps} />
          </div>
        </div>
      </Section>

      <Section tone="ground" id="kpi">
        <div className="container-x">
          <div className="max-w-3xl" data-reveal>
            <h2>The right KPI for every team member and every department.</h2>
            <p className="mt-5 text-lead text-muted">
              Set the target once. TiVora tracks it live from real transactions and from every task on each person&apos;s Work
              Desk, so every score is earned in the system, not reported in a meeting.
            </p>
          </div>
          <div className="mt-stack-lg" data-reveal>
            <h3 className="mb-4">KPI library by department</h3>
            <DataTable caption="KPIs measured automatically, by department" head={["Department", "Measured automatically"]} rows={kpiLibrary} />
          </div>
        </div>
      </Section>

      <DashboardZoom pinned={false} />

      <CtaBand />
    </>
  );
}
