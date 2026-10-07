import { Section } from "@/components/layout/Section";

// HiTech company figures (CEO brochure pp.1, 13); attributed to HiTech, not to TiVora ERP.
const stats = [
  { n: "26+", l: "years" },
  { n: "100+", l: "team members" },
  { n: "20+", l: "support offices" },
  { n: "5+", l: "countries" },
  { n: "10K+", l: "clients" },
];

const pillars = [
  { t: "Intelligent", d: "It knows every open item in your business and acts like your manager: what to do, why it matters and what comes next." },
  { t: "Integrated", d: "Every module on one database. Every entry updates stock, ledgers, dashboards and KPIs the moment it is saved." },
  { t: "Focused", d: "Each person sees only what matters to their role, so attention goes to the work that moves your targets." },
];

/** Home: the company behind TiVora ERP, as one stat strip and three pillars. */
export function Strengths() {
  return (
    <Section tone="night" size="md" id="tour-strengths">
      <div className="container-x">
        <div data-reveal="">
          <p className="font-mono text-eyebrow font-medium uppercase text-gold">Developed by HiTech Solutions and Services Pvt. Ltd.</p>
          <h2 className="mt-3 max-w-3xl">A platform with 26+ years of business software behind it.</h2>
        </div>
        <dl data-stagger="" className="mt-stack grid grid-cols-2 gap-x-6 gap-y-6 border-y border-rule-dark py-6 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.l} className="flex flex-col-reverse">
              <dt className="text-muted-dark">{s.l}</dt>
              <dd className="font-display text-h2 font-semibold text-gold">{s.n}</dd>
            </div>
          ))}
        </dl>
        <ul data-stagger="" className="mt-stack grid gap-stack md:grid-cols-3">
          {pillars.map((p) => (
            <li key={p.t}>
              <h3 className="text-h3">{p.t}</h3>
              <p className="mt-2 max-w-prose text-muted-dark">{p.d}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-small text-muted-dark">Figures are HiTech Solutions and Services&rsquo; company figures.</p>
      </div>
    </Section>
  );
}
