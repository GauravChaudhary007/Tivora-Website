import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Tivora ERP" title="One platform. Every business." lead="Sales, buying, stock, the production floor and the books, in one system. Made in Nepal for Nepal." />
      <Section tone="ground">
        <p className="container-x text-muted">Coming in WP1.</p>
      </Section>
    </>
  );
}
