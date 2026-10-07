import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";

/** The hero: headline and the master film, the first thing a visitor sees. Needs no motion for LCP (the H1 is the LCP element). */
export function HomeHero({ film }: { film: ReactNode }) {
  return (
    <section data-tone="night" className="bg-night text-ground scheme-dark">
      <div className="relative flex min-h-[78svh] items-center overflow-hidden pt-header pb-section-sm">
        <div className="bg-ember pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-x relative grid items-center gap-stack-lg py-4 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-eyebrow font-medium text-gold uppercase">The ERP that tells you what&rsquo;s next</p>
            <h1 className="mt-4 text-h1">The ERP that works like your best manager.</h1>
            <p className="mt-4 max-w-prose text-lead text-muted-dark">
              TiVora knows everything happening in your business, tells every person what to do next and why, and is customised for your industry and your way
              of working.
            </p>
            <div className="mt-stack flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start 2xl:flex-row">
              <ButtonLink href="/contact/">See it on your own numbers</ButtonLink>
              <ButtonLink href="/platform/" variant="secondary">
                Explore the platform
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-7">{film}</div>
        </div>
      </div>
    </section>
  );
}
