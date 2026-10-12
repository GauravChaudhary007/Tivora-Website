import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { ALWAYS_ON, ONE_DB, STAGES } from "./beats";
import { StageGlyph } from "./StageGlyphs";

/**
 * The modules tour as one picture that fits one screen: the seven stages side by side in business order, Work Desk and Dashboards as the layer above,
 * one database as the floor below. A dotted line runs through the stages and each lights in turn with its caption (pure CSS, ~3 s each, loops;
 * no scroll, no pin, no JS). Reduced motion: everything shown, every caption listed. See .pf-* in globals.css.
 */
export function ProcessFlow() {
  return (
    <section id="tour-process" data-tone="night" className="bg-night py-section text-ground scheme-dark">
      <div className="container-x">
        <div data-reveal="" className="max-w-3xl">
          <p className="font-mono text-eyebrow font-medium text-gold uppercase">One process. Every module.</p>
          <h2 className="mt-3">From the plan to the report.</h2>
          <p className="mt-4 text-lead text-muted-dark">
            TiVora follows the way a business actually runs: plan first, then sell, buy, store, make, deliver, account and report, with every person&rsquo;s
            Work Desk and the dashboards watching the whole chain.
          </p>
        </div>

        <div className="pf mt-stack-lg">
          <div className="flex flex-col gap-3 rounded-2xl border border-rule-dark bg-night-2 p-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex shrink-0 flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-rule-dark bg-night-3 py-1 pr-4 pl-1 font-bold">
                <ModuleIcon name="ClipboardCheck" className="size-9" /> Work Desk
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-rule-dark bg-night-3 py-1 pr-4 pl-1 font-bold">
                <ModuleIcon name="LayoutDashboard" className="size-9" /> Dashboards
              </span>
            </div>
            <p className="text-small text-muted-dark">{ALWAYS_ON}</p>
          </div>

          <ol className="pf-stages mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 xl:gap-3">
            {STAGES.map((s, i) => (
              <li key={s.tag} className="pf-node relative rounded-2xl border border-rule-dark bg-night-2 p-4" style={{ ["--i" as string]: i }}>
                <span className="inline-flex size-16 items-center justify-center rounded-module bg-night-3">
                  <StageGlyph index={i} />
                </span>
                <p className="mt-4 font-mono text-eyebrow font-medium text-gold uppercase">
                  {i + 1} · {s.tag}
                </p>
                <h3 className="mt-1 text-lead leading-snug font-bold">{s.title}</h3>
                <p className="mt-2 text-small text-muted-dark">{s.names}</p>
              </li>
            ))}
          </ol>

          <div className="pf-node mt-6 rounded-2xl border border-rule-dark bg-night-2 px-5 py-4 text-center font-bold" style={{ ["--i" as string]: STAGES.length }}>
            One database
          </div>

          <ul className="pf-caps mt-stack list-none rounded-2xl bg-night-3/60 p-5 sm:p-6" aria-label="What happens at each stage">
            {STAGES.map((s, i) => (
              <li key={s.tag} className="pf-cap" style={{ ["--i" as string]: i }}>
                <p className="font-mono text-eyebrow font-medium text-gold uppercase">
                  Stage {i + 1} of {STAGES.length} · {s.tag}
                </p>
                <p className="mt-1 max-w-4xl text-lead">{s.line}</p>
              </li>
            ))}
            <li className="pf-cap" style={{ ["--i" as string]: STAGES.length }}>
              <p className="font-mono text-eyebrow font-medium text-gold uppercase">Underneath all of it</p>
              <p className="mt-1 max-w-4xl text-lead">{ONE_DB}</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
