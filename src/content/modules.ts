// The sixteen working areas of the platform (brochure p11, in its order), the four launching soon, the eight engines, and the
// four Jewellery-solution modules. `appLine` is the brochure's one-line description; `more` is the app's own richer wording,
// copied from the Home screen of the current build (assests/app-captures/home.png); `bullets` come from the Website Brief.
export type IconName =
  | "ReceiptText" | "HeartHandshake" | "ShoppingCart" | "Package" | "Factory" | "Scale" | "Landmark"
  | "FileText" | "ChartColumn" | "SlidersHorizontal" | "Truck" | "Building2" | "Hammer" | "FlaskConical" | "ScanLine" | "LockKeyhole"
  | "ClipboardCheck" | "LayoutDashboard" | "ClipboardList" | "Wrench" | "Users" | "Ship" | "BadgeCheck" | "CalendarClock";

export type Module = { slug: string; name: string; icon: IconName; appLine: string; more?: string; bullets: string[]; pack: "core" | "jewelry" };

export const modules: Module[] = [
  {
    slug: "work-desk", name: "Work Desk", icon: "ClipboardCheck", pack: "core",
    appLine: "Every person's tasks, critical items and approvals",
    bullets: [],
  },
  {
    slug: "dashboards", name: "Dashboards", icon: "LayoutDashboard", pack: "core",
    appLine: "Executive and department views, live",
    bullets: [],
  },
  {
    slug: "sales", name: "Sales & Receivable", icon: "ReceiptText", pack: "core",
    appLine: "Counter billing, orders, receipts, what customers owe",
    more: "Billing at the counter, orders and estimates, receipts, and what customers owe.",
    bullets: ["Quotations, orders, invoices and returns", "Credit limits", "Bill-wise outstanding and ageing"],
  },
  {
    slug: "purchase", name: "Purchase & Payable", icon: "ShoppingCart", pack: "core",
    appLine: "Orders, bills, returns, imports and paying for it",
    more: "Buying stock: bills, orders, returns, old gold and loose stones, and paying for it.",
    bullets: ["Requisitions and supplier quotations compared", "Purchase orders and goods receipt", "Purchase invoices and returns"],
  },
  {
    slug: "inventory", name: "Store & Inventory", icon: "Package", pack: "core",
    appLine: "Items, rates, where stock is, every movement",
    more: "Items, today's rate, where stock is, and everything that moves it.",
    bullets: ["Godowns, batches and lots", "Transfers and stock audit", "Reorder report", "FIFO, LIFO, moving average or board-rate valuation"],
  },
  {
    slug: "material-planning", name: "Material Planning", icon: "ClipboardList", pack: "core",
    appLine: "Reorder policy, sales forecast, purchase plan",
    bullets: [],
  },
  {
    slug: "production", name: "Production", icon: "Factory", pack: "core",
    appLine: "BOM, orders, floor, batch costing, variance",
    more: "BOMs, production plans and orders, material to the floor, receipts costed batch by batch, variance and the Production Journal.",
    bullets: ["BOMs, production plans and orders", "Material issued to the floor", "Receipts costed batch by batch", "Variance and the Production Journal"],
  },
  {
    slug: "maintenance", name: "Maintenance", icon: "Wrench", pack: "core",
    appLine: "Machines, vehicles, utilities, breakdowns, spares",
    bullets: [],
  },
  {
    slug: "transport", name: "Transport & Delivery", icon: "Truck", pack: "core",
    appLine: "Dispatch, own vehicles, hired transporters",
    more: "Dispatch, own vehicles and trips, hired transporters and their freight bills.",
    bullets: [],
  },
  {
    slug: "customer-services", name: "Customer Services", icon: "HeartHandshake", pack: "core",
    appLine: "Savings schemes, repairs, return dates",
    more: "Savings schemes, repairs and the dates that bring customers back.",
    bullets: ["Savings schemes", "Customer orders"],
  },
  {
    slug: "finance", name: "Finance & Accounts", icon: "Scale", pack: "core",
    appLine: "Vouchers, books, cheques, final accounts",
    more: "Vouchers, books, cheques and the final accounts.",
    bullets: [
      "True double-entry ledger",
      "Trial balance, profit and loss, balance sheet and cash flow",
      "Bank reconciliation and the cheque (PDC) register",
      "Budgets and cost centres",
    ],
  },
  {
    slug: "fixed-assets", name: "Fixed Assets", icon: "Building2", pack: "core",
    appLine: "Register, depreciation, disposals",
    more: "The asset register, depreciation, disposals and the asset schedule.",
    bullets: [],
  },
  {
    slug: "trade-finance", name: "Trade & Finance", icon: "Landmark", pack: "core",
    appLine: "LC, trust receipts, guarantees, FX",
    more: "Bank guarantees, foreign-currency settlements, letters of credit and import trade finance.",
    bullets: ["LCs and import loans", "Landed cost", "Foreign-currency payments and revaluation", "Bank guarantees"],
  },
  {
    slug: "tax", name: "Tax & IRD", icon: "FileText", pack: "core",
    appLine: "VAT, Annex 9 and 13, TDS, IRD",
    more: "VAT, Annex 9 and 13, TDS, income tax and the IRD connection.",
    bullets: ["13% VAT on each line, gathered into the VAT books", "Monthly VAT return, Annex 9 and Annex 13", "TDS where it applies", "E-invoicing in the CBMS format IRD publishes"],
  },
  {
    slug: "reports", name: "Reports Centre", icon: "ChartColumn", pack: "core",
    appLine: "136 reports, one searchable list",
    more: "Every report you may open, in one searchable list, with your saved views.",
    bullets: [],
  },
  {
    slug: "control-panel", name: "Control Panel", icon: "SlidersHorizontal", pack: "core",
    appLine: "Users, workflow, settings, licence",
    more: "Every setting in one place: company, users, documents, workflow, accounting and tax, each module, and your data and licence.",
    bullets: [],
  },
  {
    slug: "karigar", name: "Karigar / Workshop", icon: "Hammer", pack: "jewelry",
    appLine: "Work orders, metal out to the bench, pieces back, wastage and labour.",
    bullets: ["Work order, metal issue and production receipt", "Scrap and dust recovery", "Labour settlement net of TDS", "Fine-metal balance per karigar and wastage variance"],
  },
  {
    slug: "manufacturing", name: "Manufacturing", icon: "FlaskConical", pack: "jewelry",
    appLine: "Job bags weighed at every stage, casting flasks, diamond packets, QC and the loss audits.",
    bullets: ["Job bags and casting", "A full factory floor"],
  },
  {
    slug: "rfid", name: "RFID", icon: "ScanLine", pack: "jewelry",
    appLine: "RFID tags on every piece, readers, counts in minutes and the exit-gate alert.",
    bullets: ["RFID tagging", "Stock counts", "Exit-gate alerts"],
  },
  {
    slug: "gold-loans", name: "Gold Loans", icon: "LockKeyhole", pack: "jewelry",
    appLine: "Loans against pledged jewellery: valuation, interest, renewals, custody, notices and auctions.",
    bullets: ["Valuation and interest", "Renewals and custody", "Notices and auctions"],
  },
];

/** Brochure p11: modules launching soon on the same platform. */
export const launchingSoon: { name: string; icon: IconName; line: string }[] = [
  { name: "CRM", icon: "Users", line: "Leads, follow-ups, pipeline, customer history" },
  { name: "Exports", icon: "Ship", line: "Export orders, proforma, packing list, shipping documents" },
  { name: "Quality Control", icon: "BadgeCheck", line: "Inspection, test results, hold and release of batches" },
  { name: "HRM", icon: "CalendarClock", line: "Employees, attendance, leave and payroll" },
];

/** Brochure p11: engines that run underneath every module. */
export const engines: { name: string; line: string }[] = [
  { name: "Approval & authorisation", line: "Multi-level, value- and role-based approvals with escalation" },
  { name: "Workflow", line: "Configurable document flows, reminders and task generation" },
  { name: "Promotion", line: "Schemes, slabs, free goods and discounts applied at billing" },
  { name: "Tax & VAT", line: "Correct tax on every line, document and return" },
  { name: "Import & landed cost", line: "Freight, duty, clearing and bank charges allocated to item cost" },
  { name: "Batch, expiry & serial", line: "Batch-wise and serial-wise tracking, first-expiry-first-out dispatch" },
  { name: "Security & MFA", line: "Multi-factor login, approval PIN, role rights and full audit trail" },
  { name: "Communication", line: "Quotations, invoices and statements by email, WhatsApp and SMS from the document" },
];

/** Extra line the home page shows on the Trade & Finance card. */
export const tradeFinanceExtra = "LCs, bank guarantees, foreign-currency revaluation.";
