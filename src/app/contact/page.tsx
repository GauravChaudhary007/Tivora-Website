import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = pageMeta({
  title: "Request a demo",
  description: "Tell us about your business and we will show you Tivora ERP on a trade like yours.",
  path: "/contact/",
});

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Request a demo" title="See it on your own numbers." />
      <Section tone="ground">
        <p className="container-x text-muted">Coming in WP3.</p>
      </Section>
    </>
  );
}
