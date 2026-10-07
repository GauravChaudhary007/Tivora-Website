import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/layout/Section";
import { DemoForm } from "@/components/forms/DemoForm";
import { addressLine, site } from "@/content/site";

const link = "inline-flex min-h-11 items-center text-accent underline underline-offset-4 hover:text-bronze";

/** The end of the home page: who is behind TiVora, then the demo form with HiTech's contact details. */
export function ClosingScene() {
  return (
    <>
      <Section tone="paper" size="md">
        <div data-reveal="" className="container-x flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-prose text-lead">
            TiVora ERP is the new platform from HiTech Solutions and Services, who have built business software in Nepal for 26+ years.
          </p>
          <ButtonLink href="/about/" variant="ghost">
            About HiTech
          </ButtonLink>
        </div>
      </Section>
      <Section tone="ground" size="lg" id="demo">
        <div className="container-x grid gap-stack lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <h2>See TiVora run your business, before you decide.</h2>
            <p className="mt-4 mb-stack max-w-prose text-lead text-muted">
              A live demo customised to your industry, with your products, your process and your reports. We&rsquo;ll show your Work Desk, your dashboard and your approvals working on the call.
            </p>
            <DemoForm />
          </div>
          <aside data-stagger="" className="lg:col-span-5" aria-label="Contact details">
            <h3>HiTech Solutions and Services</h3>
            <address className="mt-4 text-muted not-italic">{addressLine}</address>
            <ul className="mt-4">
              {site.phones.map((p) => (
                <li key={p.tel}>
                  <a className={link} href={`tel:${p.tel}`}>
                    {p.label}
                  </a>
                </li>
              ))}
              <li>
                <a className={link} href={site.whatsapp.href} rel="noopener">
                  WhatsApp {site.whatsapp.label}
                </a>
              </li>
              <li>
                <a className={link} href={`mailto:${site.emails.info}`}>
                  {site.emails.info}
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </Section>
    </>
  );
}
