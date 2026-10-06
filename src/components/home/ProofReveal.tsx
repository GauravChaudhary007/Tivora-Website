import { Section } from "@/components/layout/Section";
import { Screen } from "@/components/ui/Screen";

/** Scene 2: the real Home screen. A plain section; the copy and the screen fade up as they enter (data-reveal, see RevealRoot). */
export function ProofReveal() {
  return (
    <Section tone="ground" size="lg" id="tour-screen">
      <div className="container-x grid items-center gap-stack-lg lg:grid-cols-12">
        <div data-reveal="" className="lg:col-span-5">
          <h2>This is the real screen.</h2>
          <p className="mt-5 max-w-prose text-lead text-muted">
            Every module on one menu. Ctrl K finds any entry. Switch companies from the top bar, and read every date in Bikram Sambat and AD.
          </p>
        </div>
        <div data-reveal="" className="min-w-0 lg:col-span-7">
          <div className="screen-rise hidden lg:block">
            <Screen slug="home-paint" caption={false} sizes="(min-width: 1024px) 700px, 100vw" />
          </div>
          {/* Below 1024px the full screen is unreadable: two real crops in a swipe row. */}
          <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden" tabIndex={0} aria-label="Home screen details">
            {(["home-paint-m1", "home-paint-m2"] as const).map((s) => (
              <li key={s} className="w-5/6 shrink-0 snap-start sm:w-2/3">
                <Screen slug={s} caption={false} sizes="85vw" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
