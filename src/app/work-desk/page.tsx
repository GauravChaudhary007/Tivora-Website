import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { CtaBand } from "@/components/layout/CtaBand";
import { Screen } from "@/components/ui/Screen";
import { VideoSection } from "@/components/video/VideoSection";
import { DashboardZoom } from "@/components/home/DashboardZoom";
import { WorkDeskStills } from "@/components/home/WorkDeskStills";

export const metadata: Metadata = pageMeta({
  title: "Work Desk and dashboards",
  description:
    "The Work Desk lists what is late, critical or due across every module. Each module has a dashboard, and the Executive dashboard shows the whole business on one page.",
  path: "/work-desk/",
});

// Three CRITICAL cards on the redacted Work Desk screen, read left to right.
const critical = [
  { label: "Over the credit limit", body: "A customer's open bills pass the limit set for them, with Review one click away." },
  { label: "Order late on the floor", body: "A manufacturing order is past its due date with material still to receive." },
  { label: "Journal not posted", body: "An abnormal-loss journal from production has not been posted, with the button that posts it." },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Work Desk"
        title="Mornings start with what needs you."
        lead="The Work Desk lists what is late, critical or due, across every module. The action is one click away."
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
            <WorkDeskStills caption />
            <p className="mt-3 text-small text-muted">Customer, supplier and staff names are blurred.</p>
          </div>
        </div>
      </Section>

      <Section tone="paper">
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

      <DashboardZoom pinned={false} />

      <CtaBand />
    </>
  );
}
