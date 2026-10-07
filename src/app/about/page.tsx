import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { site, addressLine } from "@/content/site";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { CtaBand } from "@/components/layout/CtaBand";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = pageMeta({
  title: "About HiTech",
  description:
    "TiVora ERP is the new platform from HiTech Solutions and Services, who have built business software in Nepal for 26+ years.",
  path: "/about/",
});

// HiTech company figures, not TiVora ERP's (claims policy H): exactly these numbers, attributed.
const figures = [
  { n: "26+", l: "years" },
  { n: "100+", l: "team members" },
  { n: "20+", l: "support offices" },
  { n: "5+", l: "countries" },
  { n: "10K+", l: "clients" },
];

const products = ["Swastik", "Swastik POS", "Swastik Restaurant", "Bizant", "Pharmasoft", "HiTech Payroll", "HiTech Smartsuite"];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Made by HiTech."
        lead="HiTech Solutions and Services Pvt. Ltd. has built business software in Nepal for 26+ years."
      />

      <Section tone="ground">
        <div className="container-x grid gap-stack-lg lg:grid-cols-12 lg:gap-8">
          <div className="space-y-5 text-lead text-muted lg:col-span-7" data-reveal>
            <p>
              TiVora ERP is HiTech&apos;s new platform, bringing HiTech&apos;s experience of Nepali shops, accountants and chartered
              accountants into one modern system.
            </p>
            <p>
              HiTech also makes {products.join(", ").replace(/, ([^,]*)$/, " and $1")}.
            </p>
          </div>
          <div className="lg:col-span-5" data-reveal>
            <p className="font-mono text-eyebrow font-medium uppercase text-accent">HiTech Solutions and Services</p>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              {figures.map((f) => (
                <div key={f.l} className="flex flex-col rounded-xl border border-rule bg-paper p-5">
                  <dt className="order-2 text-small text-muted">{f.l}</dt>
                  <dd className="font-display text-h2 font-semibold">{f.n}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="container-x grid gap-stack-lg lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5" data-reveal>
            <h2>Visit or call us.</h2>
            <div className="mt-6">
              <ButtonLink href={site.website} variant="ghost" className="sm:w-auto">{site.websiteLabel}</ButtonLink>
              <ButtonLink href={site.productUrl} variant="ghost" className="mt-3 sm:ml-3 sm:mt-0 sm:w-auto">{site.productSite}</ButtonLink>
            </div>
          </div>
          <address className="space-y-3 not-italic lg:col-span-7" data-reveal>
            <p>{site.company}</p>
            <p>{addressLine}</p>
            <ul className="space-y-1">
              {site.phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className="inline-flex min-h-11 items-center text-accent underline underline-offset-4 hover:text-bronze">
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
            <p>
              <a href={`mailto:${site.emails.info}`} className="inline-flex min-h-11 items-center text-accent underline underline-offset-4 hover:text-bronze">
                {site.emails.info}
              </a>
            </p>
          </address>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
