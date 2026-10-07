import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { site, addressLine } from "@/content/site";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { DemoForm } from "@/components/forms/DemoForm";

export const metadata: Metadata = pageMeta({
  title: "Request a demo",
  description: "Book your demo: a live TiVora ERP demo customised to your industry, with your products, your process and your reports.",
  path: "/contact/",
});

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Book your demo"
        title="See TiVora run your business, before you decide."
        lead="A live demo customised to your industry, with your products, your process and your reports. We'll show your Work Desk, your dashboard and your approvals working on the call."
      />
      <Section tone="ground">
        <div className="container-x grid gap-stack lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <DemoForm />
          </div>
          <aside className="lg:col-span-5" aria-label="Contact details">
            <p className="font-bold">Nobody guesses. Nobody forgets. Everything on time.</p>
            <h2 className="mt-4 text-h3 font-sans font-bold">Developed by HiTech Solutions and Services Pvt. Ltd.</h2>
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
              <li>
                <a className="inline-flex min-h-11 items-center text-accent underline underline-offset-4" href={site.whatsapp.href} rel="noopener">
                  WhatsApp {site.whatsapp.label}
                </a>
              </li>
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
              <li>
                <a className="inline-flex min-h-11 items-center text-accent underline underline-offset-4" href={site.productUrl} rel="noopener">
                  {site.productSite}
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </Section>
    </>
  );
}
