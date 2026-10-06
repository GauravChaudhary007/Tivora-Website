// Brochure p12: the seven industry solutions, all available, each customised for the way its industry works.
export type Trade = { slug: string; name: string; status: "available" | "coming"; line: string; href?: string };

export const trades: Trade[] = [
  { slug: "jewelry", name: "Jewellery", status: "available", line: "Metal and stone tracking, purity, making charges, old gold, karigar management", href: "/industries/jewelry/" },
  { slug: "paint", name: "Paint & Coatings", status: "available", line: "Shades and tinting, dealer schemes, volume pricing, batch control" },
  { slug: "fmcg", name: "FMCG", status: "available", line: "Distributor and retailer chain, schemes and promotions, route and beat" },
  { slug: "pharma", name: "Pharmacy", status: "available", line: "Batch and expiry, first expiry first out, near-expiry returns" },
  { slug: "automobile", name: "Automobile", status: "available", line: "Chassis and engine tracking, workshop job cards, spares, warranty and service" },
  { slug: "trading", name: "Trading", status: "available", line: "Imports, landed cost, LC and trust receipts, credit control" },
  { slug: "manufacturing", name: "Manufacturing", status: "available", line: "BOM, production orders, WIP, yield, variance, machine efficiency" },
];

export const implementationSteps = [
  { name: "Study", line: "Map your process, roles and reports" },
  { name: "Configure", line: "Masters, workflows, approval rules, print formats" },
  { name: "Migrate", line: "Opening balances, stock, customers and vendors" },
  { name: "Train", line: "Role-wise training on each person's Work Desk" },
  { name: "Go live", line: "Department by department, with on-site support" },
  { name: "Review", line: "KPI review after 30 days and fine-tuning" },
];

export const flexible = [
  "Custom fields, forms and print formats",
  "Your own workflows and approval rules",
  "Role-wise dashboards and KPIs",
  "Multi-company, multi-branch, multi-location",
  "Cloud based, on desktop, tablet and mobile",
];

export const easyToAdopt = [
  "Each user sees only their own work",
  "Plain-language screens: “Customers owe”, “Needs you now”",
  "Training built around the Work Desk, not menus",
];
