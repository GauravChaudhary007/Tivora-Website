"use client";

import { useRef } from "react";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import type { IconName } from "@/content/modules";
import { MOTION_QUERIES, useScene } from "@/lib/scene";

const HIDE = "inset(0% 100% 0% 0%)";
const SHOW = "inset(0% 0% 0% 0%)";

const Chip = ({ children }: { children: string }) => (
  <span className="rounded-full border border-rule-dark bg-night-3/60 px-3 py-1 text-small whitespace-nowrap text-ground">{children}</span>
);

function Tile({ icon, title, text, wide = false, children }: { icon: IconName; title: string; text?: string; wide?: boolean; children?: React.ReactNode }) {
  return (
    <li className={`flex flex-col gap-3 rounded-2xl border border-rule-dark bg-night-2 p-5 transition-colors duration-300 hover:border-gold/40 ${wide ? "sm:col-span-2" : ""}`}>
      <div className="flex items-center gap-3">
        <ModuleIcon name={icon} className="size-10" />
        <h3 className="text-h3">{title}</h3>
      </div>
      {text && <p className="text-muted-dark">{text}</p>}
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </li>
  );
}

/** Scene 5: Ready for Nepal. The giant 2083 fills gold once on enter, beside a bento of icon tiles (the brochure p10 facts). No pin: compact and readable. */
export function NepalScene() {
  const root = useRef<HTMLElement>(null);
  useScene(root, ({ gsap, ScrollTrigger }) => {
    const mm = gsap.matchMedia();
    const fill = gsap.utils.selector(root)("[data-fill]");
    mm.add(`${MOTION_QUERIES.desktop}, ${MOTION_QUERIES.mobile}`, () => {
      gsap.set(fill, { clipPath: HIDE });
      ScrollTrigger.create({ trigger: fill[0], start: "top 85%", once: true, onEnter: () => gsap.to(fill, { clipPath: SHOW, duration: 1.4, ease: "expo.out" }) });
    });
    return () => mm.revert();
  });

  return (
    <section id="tour-nepal" ref={root} data-tone="night" className="overflow-hidden bg-night py-section text-ground scheme-dark">
      <div className="container-x grid items-start gap-stack-lg lg:grid-cols-12">
        <div className="lg:sticky lg:top-28 lg:col-span-5">
          <div className="relative font-display text-8xl leading-none font-semibold lg:text-9xl">
            <span aria-hidden="true" className="block text-night-3">
              2083
            </span>
            <span data-fill="" aria-hidden="true" className="absolute inset-0 text-gold">
              2083
            </span>
          </div>
          <h2 className="mt-6">Ready for Nepal: tax, trade, finance and import costing.</h2>
          <p className="mt-4 max-w-prose text-lead text-muted-dark">Built in Kathmandu for the way Nepali businesses actually operate.</p>
        </div>
        <ul data-stagger="" className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          <Tile icon="ReceiptText" title="VAT on every line" text="On every line and every document." wide>
            <Chip>Annex 9</Chip>
            <Chip>Annex 13</Chip>
            <Chip>VAT reports</Chip>
          </Tile>
          <Tile icon="Scale" title="TDS and income tax" text="Deducted and reported where it applies." />
          <Tile icon="LockKeyhole" title="Connected to IRD" text="Issued bills are locked forever." />
          <Tile icon="CalendarClock" title="Bikram Sambat and AD" text="Both dates side by side, and the Nepali fiscal year." wide>
            <Chip>BS 2083</Chip>
            <Chip>AD 2026</Chip>
          </Tile>
          <Tile icon="Landmark" title="Trade and finance" wide>
            <Chip>Letters of credit</Chip>
            <Chip>Margin held</Chip>
            <Chip>Trust receipt</Chip>
            <Chip>Short-term loans</Chip>
            <Chip>Bank limits</Chip>
            <Chip>Bank guarantees</Chip>
            <Chip>Foreign-currency settlement</Chip>
          </Tile>
          <Tile icon="Ship" title="Landed cost" text="Charges land in the item cost, estimate against actual." wide>
            <Chip>Freight</Chip>
            <span aria-hidden="true" className="text-gold">
              →
            </span>
            <Chip>Duty</Chip>
            <span aria-hidden="true" className="text-gold">
              →
            </span>
            <Chip>Clearing</Chip>
            <span aria-hidden="true" className="text-gold">
              →
            </span>
            <Chip>Bank charges</Chip>
            <span aria-hidden="true" className="text-gold">
              →
            </span>
            <Chip>Item cost</Chip>
          </Tile>
        </ul>
      </div>
    </section>
  );
}
