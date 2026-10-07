import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/layout/Section";

// Brochure p12: the seven industry solutions and what each is customised for.
const INDUSTRIES = [
  ["Jewellery", "Metal and stone tracking, purity, making charges, old gold, karigar management"],
  ["Paint & Coatings", "Shades and tinting, dealer schemes, volume pricing, batch control"],
  ["FMCG", "Distributor and retailer chain, schemes and promotions, route and beat"],
  ["Pharmacy", "Batch and expiry, first expiry first out, near-expiry returns"],
  ["Automobile", "Chassis and engine tracking, workshop job cards, spares, warranty and service"],
  ["Trading", "Imports, landed cost, LC and trust receipts, credit control"],
  ["Manufacturing", "BOM, production orders, WIP, yield, variance, machine efficiency"],
] as const;

/** Scene 7. Light, not pinned; the shared [data-reveal] handles the entrance. */
export function TradesScene() {
  return (
    <Section tone="ground" size="lg" id="tour-editions">
      <div className="container-x">
        <div data-reveal="" className="max-w-prose">
          <h2>Customised for your industry. Configured for your company.</h2>
          <p className="mt-4 text-lead text-muted">
            We don&rsquo;t ask you to fit a generic ERP. We start from a complete platform, add the solution made for your industry, then customise it to your
            products, your approvals and your reports.
          </p>
        </div>
        <ul data-stagger="" className="mt-stack-lg divide-y divide-rule border-y border-rule">
          {INDUSTRIES.map(([name, focus]) => (
            <li key={name} className="grid gap-1 py-4 sm:grid-cols-12 sm:gap-6">
              <span className="font-bold sm:col-span-3">{name}</span>
              <span className="text-muted sm:col-span-9">{focus}</span>
            </li>
          ))}
        </ul>
        <ButtonLink href="/industries/" variant="ghost" className="mt-4 sm:w-auto">
          See the industries
        </ButtonLink>
      </div>
    </Section>
  );
}
