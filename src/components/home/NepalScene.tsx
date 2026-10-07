"use client";

import { useRef } from "react";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import type { IconName } from "@/content/modules";
import { MOTION_QUERIES, useScene } from "@/lib/scene";

const HIDE = "inset(0% 100% 0% 0%)";
const SHOW = "inset(0% 0% 0% 0%)";

const Chip = ({ children }: { children: string }) => (
  <span className="rounded-full border border-rule-dark bg-night-3/60 px-2.5 py-0.5 text-small whitespace-nowrap text-ground">{children}</span>
);
const Arrow = () => (
  <span aria-hidden="true" className="text-gold">
    →
  </span>
);

function Tile({ icon, title, text, span = "", children }: { icon: IconName; title: string; text?: string; span?: string; children?: React.ReactNode }) {
  return (
    <li className={`flex flex-col gap-2.5 rounded-2xl border border-rule-dark bg-night-2 p-4 transition-colors duration-300 hover:border-gold/40 ${span}`}>
      <div className="flex items-center gap-3">
        <ModuleIcon name={icon} className="size-9" />
        <h3 className="text-base leading-snug font-bold">{title}</h3>
      </div>
      {text && <p className="text-small text-muted-dark">{text}</p>}
      {children && <div className="flex flex-wrap items-center gap-1.5">{children}</div>}
    </li>
  );
}

/** Scene 5: Ready for Nepal. The giant 2083 fills gold once on enter, beside a compact bento of icon tiles (brochure p10 facts) that fits one screen. No pin. */
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
    <section id="tour-nepal" ref={root} data-tone="night" className="overflow-hidden bg-night py-section-sm text-ground scheme-dark lg:py-section">
      <div className="container-x">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-12">
          <div className="relative shrink-0 font-display text-7xl leading-none font-semibold lg:text-8xl">
            <span aria-hidden="true" className="block text-night-3">
              2083
            </span>
            <span data-fill="" aria-hidden="true" className="absolute inset-0 text-gold">
              2083
            </span>
          </div>
          <div className="max-w-2xl">
            <h2>Ready for Nepal: tax, trade, finance and import costing.</h2>
            <p className="mt-2 text-muted-dark">Built in Kathmandu for the way Nepali businesses actually operate.</p>
          </div>
        </div>
        <ul data-stagger="" className="mt-stack grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Tile icon="ReceiptText" title="VAT on every line">
            <Chip>Annex 9</Chip>
            <Chip>Annex 13</Chip>
            <Chip>VAT reports</Chip>
          </Tile>
          <Tile icon="Scale" title="TDS and income tax" text="Deducted and reported where it applies." />
          <Tile icon="LockKeyhole" title="Connected to IRD" text="Issued bills are locked forever." />
          <Tile icon="CalendarClock" title="Bikram Sambat and AD" text="And the Nepali fiscal year.">
            <Chip>BS 2083</Chip>
            <Chip>AD 2026</Chip>
          </Tile>
          <Tile icon="Landmark" title="Trade and finance" span="sm:col-span-2">
            <Chip>Letters of credit</Chip>
            <Chip>Margin held</Chip>
            <Chip>Trust receipt</Chip>
            <Chip>Short-term loans</Chip>
            <Chip>Bank limits</Chip>
            <Chip>Bank guarantees</Chip>
            <Chip>Foreign-currency settlement</Chip>
          </Tile>
          <Tile icon="Ship" title="Landed cost, estimate against actual" span="sm:col-span-2 lg:col-span-3">
            <Chip>Freight</Chip>
            <Arrow />
            <Chip>Duty</Chip>
            <Arrow />
            <Chip>Clearing</Chip>
            <Arrow />
            <Chip>Bank charges</Chip>
            <Arrow />
            <Chip>Item cost</Chip>
          </Tile>
        </ul>
      </div>
    </section>
  );
}
