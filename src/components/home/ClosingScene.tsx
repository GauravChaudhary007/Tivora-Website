"use client";

import { useRef, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/layout/Section";
import { DemoForm } from "@/components/forms/DemoForm";
import { addressLine, site } from "@/content/site";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";
import { collapse, ORDER } from "./world";
import { SymbolStage } from "./SymbolStage";

const link = "inline-flex min-h-11 items-center text-accent underline underline-offset-4 hover:text-bronze";

/** Scenes 8 and 9. children = <IsoWorld />. The world collapses back into the official symbol (desktop: pinned scrub; mobile: plays once), then the demo form. */
export function ClosingScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const q = gsap.utils.selector(root);
        gsap.set(q("[data-world]"), { opacity: 1 });
        gsap.set(q("[data-sym]"), { opacity: 0, "--rx": "55deg", "--rz": "-45deg", "--sc": 1.6 });
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: desktop
            ? { trigger: q("[data-pin]")[0], start: "top top", end: "+=100%", pin: true, scrub: 0.6 }
            : { trigger: q("[data-pin]")[0], start: "top 70%", once: true },
        });
        ORDER.forEach((k) => tl.to(q(`[data-d=${k}]`), { ...collapse(k), duration: 0.5 }, 0));
        tl.to(q("[data-world]"), { opacity: 0, duration: 0.2, ease: "none" }, 0.5)
          .to(q("[data-sym]"), { opacity: 1, duration: 0.2, ease: "none" }, 0.5)
          .to(q("[data-sym]"), { "--rx": "0deg", "--rz": "0deg", "--sc": 1, duration: 0.4 }, 0.6);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <Section tone="paper" size="md">
        <div data-reveal="" className="container-x flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-prose text-lead">
            Tivora ERP is the new platform from HiTech Solutions and Services, who have built business software in Nepal for more than 25 years.
          </p>
          <ButtonLink href="/about/" variant="ghost">
            About HiTech
          </ButtonLink>
        </div>
      </Section>
      <section data-tone="night" className="bg-night text-ground scheme-dark">
        <div data-pin="" className="flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden py-section">
          <SymbolStage>{children}</SymbolStage>
          <p className="font-mono text-eyebrow font-medium text-gold uppercase mt-12">Four modules. One core.</p>
        </div>
      </section>
      <Section tone="ground" size="lg" id="demo">
        <div className="container-x grid gap-stack lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h2>See it on your own numbers.</h2>
            <p className="mt-4 mb-stack max-w-prose text-lead text-muted">
              Tell us about your business and we will show you Tivora ERP on a trade like yours.
            </p>
            <DemoForm />
          </div>
          <aside className="lg:col-span-5" aria-label="Contact details">
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
                <a className={link} href={`mailto:${site.emails.info}`}>
                  {site.emails.info}
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </Section>
    </div>
  );
}
