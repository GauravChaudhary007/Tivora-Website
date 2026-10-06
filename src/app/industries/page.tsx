import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = pageMeta({
  title: "Industries",
  description: "Tivora ERP is built one trade at a time. Tivora ERP – Jewelry is running in showrooms today; other trades are coming.",
  path: "/industries/",
});

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Industries" title="Built one trade at a time." />
      <Section tone="ground">
        <p className="container-x text-muted">Coming in WP2.</p>
      </Section>
    </>
  );
}
