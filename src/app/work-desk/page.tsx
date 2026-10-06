import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = pageMeta({
  title: "Work Desk and dashboards",
  description: "The Work Desk lists what is late, critical or due across every module, and each module has a dashboard that opens on its trend.",
  path: "/work-desk/",
});

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Work Desk" title="Mornings start with what needs you." />
      <Section tone="ground">
        <p className="container-x text-muted">Coming in WP2.</p>
      </Section>
    </>
  );
}
