import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = pageMeta({
  title: "Modules",
  description: "Ten modules on one ledger: sales, customer services, purchase, stock, production, finance, trade finance, tax, reports and administration.",
  path: "/modules/",
});

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Modules" title="Ten modules. One ledger underneath." />
      <Section tone="ground">
        <p className="container-x text-muted">Coming in WP2.</p>
      </Section>
    </>
  );
}
