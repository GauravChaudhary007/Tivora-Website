// One entry per trade. Only Jewelry is live; "coming" trades carry no feature lists (claims policy).
export type Trade = { slug: string; name: string; status: "available" | "coming"; href?: string };

export const trades: Trade[] = [
  { slug: "jewelry", name: "Tivora ERP – Jewelry", status: "available", href: "/industries/jewelry/" },
  { slug: "general", name: "Tivora ERP (general trading and accounting)", status: "coming" },
  { slug: "paint", name: "Paint", status: "coming" },
  { slug: "fmcg", name: "FMCG", status: "coming" },
  { slug: "automobile", name: "Automobile", status: "coming" },
  { slug: "home-appliances", name: "Home Appliances", status: "coming" },
  { slug: "pharma", name: "Pharma", status: "coming" },
];
