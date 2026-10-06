"use client";

import { useRef, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";
import { SymbolStage } from "./SymbolStage";

/** Scene 0. Frame at load needs no motion (LCP is the H1). Desktop: the symbol tilts into the iso world as you scroll. */
export function HeroCore({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop, () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: "+=160%", pin: true, scrub: true },
        });
        tl.fromTo(q("[data-sym]"), { "--rx": "0deg", "--rz": "0deg", "--sc": 1 }, { "--rx": "55deg", "--rz": "-45deg", "--sc": 1.6, duration: 0.8 }, 0)
          .to(q("[data-sym]"), { opacity: 0, duration: 0.2 }, 0.6)
          .to(q("[data-world]"), { opacity: 1, duration: 0.2 }, 0.6)
          .to(q("[data-copy]"), { y: "-12vh", opacity: 0, duration: 0.7 }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-tone="night" className="relative bg-night text-ground scheme-dark">
      <div data-pin="" className="relative flex min-h-svh items-center overflow-hidden pt-header pb-section-sm">
        <div className="bg-ember pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-x relative grid items-center gap-stack-lg lg:grid-cols-12">
          <div data-copy="" className="lg:col-span-7">
            <p className="font-mono text-eyebrow font-medium text-gold uppercase">Tivora ERP · from HiTech, Kathmandu</p>
            <h1 className="mt-5 text-display">One platform. Every business.</h1>
            <p className="mt-6 max-w-prose text-lead text-muted-dark">
              Sales, buying, stock, the production floor and the books, in one system. Bikram Sambat dates, VAT and IRD formats are built in, because it is
              made in Nepal for Nepal.
            </p>
            <div className="mt-stack flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact/">See it on your own numbers</ButtonLink>
              <ButtonLink href="/platform/" variant="secondary">
                Explore the platform
              </ButtonLink>
            </div>
            <p className="mt-8 flex max-w-prose items-start gap-3 text-small text-muted-dark">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-gold" aria-hidden="true" />
              Tivora ERP – Jewelry is running in showrooms today. General trading and Paint are next.
            </p>
          </div>
          <div className="flex justify-center py-stack lg:col-span-5">
            <SymbolStage priority>{children}</SymbolStage>
          </div>
        </div>
      </div>
    </section>
  );
}
