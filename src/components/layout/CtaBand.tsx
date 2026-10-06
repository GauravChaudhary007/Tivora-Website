import { CTA } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "./Section";

/** Closing call to action used at the foot of every page except /contact/. */
export function CtaBand() {
  return (
    <Section tone="night" size="md">
      <div className="container-x flex flex-col gap-stack lg:flex-row lg:items-center lg:justify-between" data-reveal>
        <div className="max-w-prose">
          <h2>See it on your own numbers.</h2>
          <p className="mt-4 text-lead text-muted-dark">
            Tell us about your business and we will show you Tivora ERP on a trade like yours.
          </p>
        </div>
        <ButtonLink href={CTA.href}>{CTA.label}</ButtonLink>
      </div>
    </Section>
  );
}
