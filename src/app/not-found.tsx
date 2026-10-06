import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="404"
      title="That page is not here."
      lead="The address may have changed. Start from the home page, or tell us what you were looking for."
      actions={
        <>
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/contact/" variant="secondary">
            Request a demo
          </ButtonLink>
        </>
      }
    />
  );
}
