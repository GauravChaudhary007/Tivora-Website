import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ParticleDrift } from "@/components/ui/ParticleDrift";

const BRACKET = "pointer-events-none absolute size-3 border-ground/20";

/** The hero: headline and the master film, the first thing a visitor sees. Needs no motion for LCP (the H1 is the LCP element). */
export function HomeHero({ film }: { film: ReactNode }) {
  return (
    <section data-tone="night" className="bg-night text-ground scheme-dark">
      <div className="relative flex min-h-svh items-center overflow-hidden pt-header pb-section-sm">
        <div className="bg-ember pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-x relative py-stack">
          {/* Gradient-border shell around a night surface with drifting glyphs, matte noise and corner brackets */}
          <div className="rounded-3xl bg-gradient-to-br from-ground/20 via-ground/5 to-transparent p-px shadow-frame-dark">
            <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-night px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
              <ParticleDrift />
              <div className="bg-noise pointer-events-none absolute inset-0" aria-hidden="true" />
              <span className={`${BRACKET} top-4 left-4 border-t border-l`} aria-hidden="true" />
              <span className={`${BRACKET} top-4 right-4 border-t border-r`} aria-hidden="true" />
              <span className={`${BRACKET} bottom-4 left-4 border-b border-l`} aria-hidden="true" />
              <span className={`${BRACKET} right-4 bottom-4 border-r border-b`} aria-hidden="true" />
              <div className="relative grid items-center gap-stack-lg lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <p className="font-mono text-eyebrow font-medium text-gold uppercase">The ERP that tells you what&rsquo;s next</p>
                  <h1 className="mt-5 text-h1">The ERP that works like your best manager.</h1>
                  <p className="mt-6 max-w-prose text-lead text-muted-dark">
                    TiVora knows everything happening in your business, tells every person what to do next and why, and is customised for your industry and your
                    way of working.
                  </p>
                  <div className="mt-stack flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start 2xl:flex-row">
                    <ButtonLink href="/contact/">See it on your own numbers</ButtonLink>
                    <ButtonLink href="/platform/" variant="secondary">
                      Explore the platform
                    </ButtonLink>
                  </div>
                </div>
                <div className="relative lg:col-span-7">
                  {film}
                  {/* Floating glass card (brochure p6: single entry, re-typed fields 0) */}
                  <div className="float-y pointer-events-none absolute -top-4 right-3 hidden w-52 rounded-2xl border border-gold/30 bg-night/80 p-4 text-gold shadow-frame-dark backdrop-blur-xl sm:block">
                    <p className="font-mono text-eyebrow font-medium uppercase">Single entry</p>
                    <p className="mt-2 text-4xl leading-none">0</p>
                    <p className="mt-1 text-small text-muted-dark">re-typed fields. One document flows into every linked step.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
