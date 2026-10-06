import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { site, addressLine } from "@/content/site";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { DemoForm } from "@/components/forms/DemoForm";

export const metadata: Metadata = pageMeta({
  title: "Request a demo",
  description: "Tell us about your business and we will show you TiVora ERP on a trade like yours.",
  path: "/contact/",
});

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Request a demo"
        title="See it on your own numbers."
        lead="Tell us about your business and we will show you TiVora ERP on a trade like yours."
      />
      <Section tone="ground">
        <div className="container-x grid gap-stack lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <DemoForm />
          </div>
          <aside className="lg:col-span-5" aria-label="Contact details">
            <h2 className="text-h3 font-sans font-bold">HiTech Solutions and Services</h2>
            <address className="mt-4 not-italic text-muted">{addressLine}</address>
            <ul className="mt-4 space-y-1">
              {site.phones.map((p) => (
                <li key={p.tel}>
                  <a className="inline-flex min-h-11 items-center text-accent underline underline-offset-4" href={`tel:${p.tel}`}>
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-2 space-y-1">
              {Object.values(site.emails).map((e) => (
                <li key={e}>
                  <a className="inline-flex min-h-11 items-center text-accent underline underline-offset-4" href={`mailto:${e}`}>
                    {e}
                  </a>
                </li>
              ))}
              <li>
                <a className="inline-flex min-h-11 items-center text-accent underline underline-offset-4" href={site.website} rel="noopener">
                  {site.websiteLabel}
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </Section>
    </>
  );
}
