import type { Mod } from "./world";

// The seven stages of the modules tour, in the order a business runs. `line` is grounded in the CEO brochure (p6, p7, p8, p11); `names` are the
// modules' full names as the brochure gives them. Work Desk and Dashboards are the layer under every stage, not a stop.
export const STAGES: { tag: string; title: string; ids: Mod[]; names: string; line: string }[] = [
  {
    tag: "Plan",
    title: "Plan first.",
    ids: ["planning"],
    names: "Material Planning",
    line: "Sales forecast and confirmed orders run through the bill of materials, net of stock and open orders, to show what to buy, what to make and by when.",
  },
  {
    tag: "Sell",
    title: "Then sell.",
    ids: ["sales"],
    names: "Sales & Receivable",
    line: "Quotation, order, challan, invoice and receipt in one chain. The invoice posts sales, VAT and the receivable ledger, and the receipt updates customer ageing.",
  },
  {
    tag: "Buy and store",
    title: "Buy and store.",
    ids: ["purchase", "inventory"],
    names: "Purchase & Payable, Store & Inventory",
    line: "Reorder, purchase order, goods received, bill, landed cost and payment. Stock is held at true cost, with every movement recorded.",
  },
  {
    tag: "Make and maintain",
    title: "Make, and keep it running.",
    ids: ["production", "maintenance"],
    names: "Production, Maintenance",
    line: "Production order, material to the floor, receipt costed batch by batch, variance. Maintenance covers machines, vehicles, utilities, breakdowns and spares.",
  },
  {
    tag: "Deliver and serve",
    title: "Deliver and serve.",
    ids: ["transport", "customer"],
    names: "Transport & Delivery, Customer Services",
    line: "Dispatch on your own vehicles or hired transporters, then savings schemes, repairs and the return dates that bring customers back.",
  },
  {
    tag: "Account",
    title: "Account for all of it.",
    ids: ["finance", "assets", "trade", "tax"],
    names: "Finance & Accounts, Fixed Assets, Trade & Finance, Tax & IRD",
    line: "Vouchers, books, cheques and final accounts; the asset register and depreciation; LCs, guarantees and foreign exchange; VAT, Annex 9 and 13, TDS and the IRD connection.",
  },
  {
    tag: "Know and control",
    title: "Know it, and control it.",
    ids: ["reports", "control"],
    names: "Reports Centre, Control Panel",
    line: "Every report you may open in one searchable list, and every setting in one place: users, workflow, settings and licence.",
  },
];

export const ALWAYS_ON = "Work Desk and Dashboards run across every stage: each person's tasks, critical items and approvals, and live executive and department views.";
export const ONE_DB = "One database. Every module updates the moment an entry is saved.";
