import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = pageMeta({
  title: "Tivora ERP – Jewelry",
  description: "Tivora ERP – Jewelry follows your metal from the showroom counter to the karigar's bench: billing, rate register, workshop, RFID and gold loans.",
  path: "/industries/jewelry/",
});

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Tivora ERP – Jewelry" title="Your gold is accounted for, every gram of it." />
      <Section tone="ground">
        <p className="container-x text-muted">Coming in WP2.</p>
      </Section>
    </>
  );
}
