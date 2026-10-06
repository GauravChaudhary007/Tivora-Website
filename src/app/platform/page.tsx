import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = pageMeta({
  title: "Platform",
  description: "One accounting core and one stock engine, with Bikram Sambat dates, VAT and IRD formats built in. See how Tivora ERP fits together.",
  path: "/platform/",
});

export default function Page() {
  return (
    <>
      <PageHero eyebrow="The platform" title="One accounting core. One stock engine." />
      <Section tone="ground">
        <p className="container-x text-muted">Coming in WP2.</p>
      </Section>
    </>
  );
}
