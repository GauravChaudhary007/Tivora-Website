import { Screen } from "@/components/ui/Screen";
import type { ScreenSlug } from "@/content/screens";

export const WORK_DESK_CARDS: { slug: ScreenSlug; label: string }[] = [
  { slug: "work-desk-m1", label: "Over the credit limit" },
  { slug: "work-desk-m2", label: "Order late on the floor" },
  { slug: "work-desk-m3", label: "Journal not posted" },
];

/** Below 1024px the full Work Desk screen is unreadable: the three critical cards as real pre-cropped stills in a swipe row. */
export function WorkDeskStills({ className = "" }: { className?: string }) {
  return (
    <>
    <ul className={`flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden ${className}`} tabIndex={0} aria-label="Work Desk critical items">
      {WORK_DESK_CARDS.map((c, i) => (
        <li key={c.slug} className="w-5/6 shrink-0 snap-start sm:w-2/3">
          <Screen slug={c.slug} caption={false} sizes="85vw" />
          <p className="mt-3 flex items-center gap-3 text-small font-bold">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-night font-mono text-gold">{i + 1}</span>
            {c.label}
          </p>
        </li>
      ))}
    </ul>
    </>
  );
}
