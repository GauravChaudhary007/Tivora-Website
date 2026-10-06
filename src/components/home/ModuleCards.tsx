import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { modules, tradeFinanceExtra } from "@/content/modules";

const core = modules.filter((m) => m.pack === "core");

/** The twelve module cards for Scene 6 (server component; passed to ModuleTrack as children). */
export function ModuleCards() {
  return (
    <ul className="flex gap-6">
      {core.map((m) => (
        <li key={m.slug} className="flex h-90 w-72 shrink-0 snap-start flex-col rounded-xl border border-rule bg-paper p-6 shadow-card sm:w-80">
          <ModuleIcon name={m.icon} className="relative" />
          <h3 className="mt-6">{m.name}</h3>
          <p className="mt-2 text-small text-muted">{m.appLine}</p>
          {m.slug === "trade-finance" && <p className="mt-2 text-small font-bold text-accent">{tradeFinanceExtra}</p>}
        </li>
      ))}
    </ul>
  );
}
