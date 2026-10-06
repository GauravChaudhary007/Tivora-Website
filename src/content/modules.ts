// The ten core modules plus the four Jewelry-pack modules. `appLine` is the app's own wording
// (read off the demo screens); `bullets` come only from the Website Brief's feature lists.
// Reports Centre, Administration and the Customer Services bullets are not worded on any
// screen we have, so their lines are plain descriptions built from the brief: WP2 to confirm with the app team.
export type IconName =
  | "ReceiptText" | "HeartHandshake" | "ShoppingCart" | "Package" | "Factory" | "Scale" | "Landmark"
  | "FileText" | "ChartColumn" | "SlidersHorizontal" | "Hammer" | "FlaskConical" | "ScanLine" | "LockKeyhole";

export type Module = { slug: string; name: string; icon: IconName; appLine: string; bullets: string[]; pack: "core" | "jewelry" };

export const modules: Module[] = [
  {
    slug: "sales", name: "Sales & Accounts Receivable", icon: "ReceiptText", pack: "core",
    appLine: "Billing at the counter, orders and estimates, receipts, and what customers owe.",
    bullets: ["Quotations, orders, invoices and returns", "Credit limits", "Bill-wise outstanding and ageing"],
  },
  {
    slug: "customer-services", name: "Customer Services", icon: "HeartHandshake", pack: "core",
    appLine: "Savings schemes, repairs and the dates that bring customers back.",
    bullets: ["Savings schemes", "Customer orders"],
  },
  {
    slug: "purchase", name: "Purchase & Accounts Payable", icon: "ShoppingCart", pack: "core",
    appLine: "Buying stock — bills, orders, returns, old gold and loose stones — and paying for it.",
    bullets: ["Requisitions and supplier quotations compared", "Purchase orders and goods receipt", "Purchase invoices and returns"],
  },
  {
    slug: "inventory", name: "Store & Inventory", icon: "Package", pack: "core",
    appLine: "Items, today's rate, where stock is, and everything that moves it.",
    bullets: ["Godowns, batches and lots", "Transfers and stock audit", "Reorder report", "FIFO, LIFO, moving average or board-rate valuation"],
  },
  {
    slug: "production", name: "Production Plan & Manufacturing", icon: "Factory", pack: "core",
    appLine: "BOMs, production plans and orders, material to the floor, receipts costed batch by batch, variance and the Production Journal.",
    bullets: ["BOMs, production plans and orders", "Material issued to the floor", "Receipts costed batch by batch", "Variance and the Production Journal"],
  },
  {
    slug: "finance", name: "Finance & Accounts", icon: "Scale", pack: "core",
    appLine: "Vouchers, books, cheques, assets and the final accounts.",
    bullets: [
      "True double-entry ledger",
      "Trial balance, profit and loss, balance sheet and cash flow",
      "Bank reconciliation and the cheque (PDC) register",
      "Fixed assets, budgets and cost centres",
    ],
  },
  {
    slug: "trade-finance", name: "Trade & Finance", icon: "Landmark", pack: "core",
    appLine: "Bank guarantees, foreign-currency settlements, letters of credit and import trade finance.",
    bullets: ["LCs and import loans", "Landed cost", "Foreign-currency payments and revaluation", "Bank guarantees"],
  },
  {
    slug: "tax", name: "Tax & IRD", icon: "FileText", pack: "core",
    appLine: "VAT, Annex 9 and 13, TDS, income tax and the IRD connection.",
    bullets: ["13% VAT on each line, gathered into the VAT books", "Monthly VAT return, Annex 9 and Annex 13", "TDS where it applies", "E-invoicing in the CBMS format IRD publishes"],
  },
  {
    slug: "reports", name: "Reports Centre", icon: "ChartColumn", pack: "core",
    appLine: "Fixed statutory layouts and a pivot report builder.",
    bullets: ["Fixed statutory layouts", "Pivot report builder"],
  },
  {
    slug: "administration", name: "Administration", icon: "SlidersHorizontal", pack: "core",
    appLine: "Roles, rights and the settings behind the system.",
    bullets: ["Roles and rights inside the app", "An audit log of every change"],
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

/** Extra line the home page shows on the Trade & Finance card. */
export const tradeFinanceExtra = "LCs, bank guarantees, foreign-currency revaluation.";
