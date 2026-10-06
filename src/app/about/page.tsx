import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = pageMeta({
  title: "About HiTech",
  description: "Tivora ERP is the new platform from HiTech Solutions and Services, Kathmandu, who have built business software in Nepal for more than 25 years.",
  path: "/about/",
});

export default function Page() {
  return (
    <>
      <PageHero eyebrow="About" title="Made by HiTech" />
      <Section tone="ground">
        <p className="container-x text-muted">Coming in WP2.</p>
      </Section>
    </>
  );
}
