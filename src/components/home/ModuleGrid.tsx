import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { engines, launchingSoon, modules, tradeFinanceExtra } from "@/content/modules";
import { moduleHref } from "@/content/module-pages";

const core = modules.filter((m) => m.pack === "core");
const more = "inline-flex min-h-11 items-center font-bold text-accent underline underline-offset-4 hover:text-bronze";

/** Every module on one screen-sized grid (brochure p11), with what launches next and the engines underneath. Static: no pin, no horizontal scroll. */
export function ModuleGrid() {
  return (
    <Section tone="paper" size="lg" id="tour-modules">
      <div className="container-x">
        <div data-reveal="" className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <h2>One entry. Every module. One ledger underneath.</h2>
            <p className="mt-4 text-lead text-muted">Complete modules, one database. Every module talks to every other.</p>
          </div>
          <Link href="/modules/" className={more}>
            All modules
          </Link>
        </div>

        <ul data-stagger="" className="mt-stack-lg grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {core.map((m) => {
            const href = moduleHref(m);
            const body = (
              <>
                <ModuleIcon name={m.icon} />
                <h3 className="mt-4 text-lead leading-snug font-bold">{m.name}</h3>
                <p className="mt-1 text-small text-muted">{m.appLine}</p>
                {m.slug === "trade-finance" && <p className="mt-1 text-small font-bold text-accent">{tradeFinanceExtra}</p>}
              </>
            );
            return (
              <li key={m.slug}>
                {href ? (
                  <Link href={href} prefetch={false} className="block h-full rounded-xl border border-rule bg-ground p-5 transition-colors hover:border-accent hover:bg-tint">
                    {body}
                  </Link>
                ) : (
                  <div className="h-full rounded-xl border border-rule bg-ground p-5">{body}</div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-stack-lg grid gap-stack-lg lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5" data-reveal="">
            <h3>Launching soon</h3>
            <ul className="mt-4 space-y-3">
              {launchingSoon.map((m) => (
                <li key={m.name} className="flex items-center gap-3">
                  <ModuleIcon name={m.icon} className="size-10" />
                  <span>
                    <span className="font-bold">{m.name}</span>
                    <span className="block text-small text-muted">{m.line}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7" data-reveal="">
            <h3>Engines that run underneath every module</h3>
            <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {engines.map((e) => (
                <div key={e.name} className="border-t border-rule pt-3">
                  <dt className="font-bold">{e.name}</dt>
                  <dd className="mt-1 text-small text-muted">{e.line}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}
