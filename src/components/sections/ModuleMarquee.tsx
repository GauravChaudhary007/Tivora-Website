const modules = [
  "Reports Centre",
  "Purchase & Accounts Payable",
  "Sales & Accounts Receivable",
  "Store & Inventory",
  "Production",
  "Planning & Forecasting",
  "Machine & Maintenance",
  "Transport & Delivery",
  "CRM",
  "Customer Service",
  "Finance & Accounts",
  "Fixed Assets",
  "Trade & Finance",
  "Tax & IRD",
  "Export",
  "Communication",
  "Administration",
];

const engines = [
  "Multi-level approval & authorisation",
  "Promotion engine",
  "Tax & VAT engine",
  "Import & landed cost",
  "Batch & expiry",
  "Serial management",
  "Workflow system",
  "Multi-factor authentication",
];

/** Two counter-moving rows: the modules, and the engines that run underneath them. */
export function ModuleMarquee() {
  return (
    <section aria-label="Modules and engines" className="relative overflow-hidden border-b border-line bg-paper py-10 sm:py-12">
      <div className="container-x mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Every module. One system.</p>
        <p className="text-sm text-muted">Each one integrated with every other.</p>
      </div>
      <div className="space-y-3 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <Row items={modules} duration={70} />
        <Row items={engines} duration={55} reverse engine />
      </div>
    </section>
  );
}

function Row({ items, duration, reverse = false, engine = false }: { items: string[]; duration: number; reverse?: boolean; engine?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className="group flex overflow-hidden">
      <ul
        className="flex shrink-0 gap-3 pr-3 group-hover:[animation-play-state:paused]"
        style={{ animation: `marquee ${duration}s linear infinite${reverse ? " reverse" : ""}` }}
      >
        {loop.map((m, i) => (
          <li
            key={i}
            aria-hidden={i >= items.length}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-[13.5px] font-semibold ${
              engine ? "border-dashed border-teal/40 bg-teal/[0.05] text-teal" : "border-line bg-white text-midnight"
            }`}
          >
            {engine && <span className="mr-1.5 font-mono text-[10px] uppercase tracking-widest text-teal/70">engine</span>}
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}
