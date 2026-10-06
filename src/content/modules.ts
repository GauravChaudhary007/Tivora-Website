// The twelve modules of the platform plus the four Jewelry-pack modules. `appLine` is the app's own wording, copied from the
// Home screen of the current build (assests/app-captures/home.png); `bullets` come only from the Website Brief's feature lists.
// Reports Centre, Transport & Delivery, Fixed Assets and Control Panel have no brief bullets: the app's line is all we say.
export type IconName =
  | "ReceiptText" | "HeartHandshake" | "ShoppingCart" | "Package" | "Factory" | "Scale" | "Landmark"
  | "FileText" | "ChartColumn" | "SlidersHorizontal" | "Truck" | "Building2" | "Hammer" | "FlaskConical" | "ScanLine" | "LockKeyhole";

export type Module = { slug: string; name: string; icon: IconName; appLine: string; bullets: string[]; pack: "core" | "jewelry" };

/** Home-screen order of the app. */
export const modules: Module[] = [
  {
    slug: "reports", name: "Reports Centre", icon: "ChartColumn", pack: "core",
    appLine: "Every report you may open, in one searchable list, with your saved views.",
    bullets: [],
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
    slug: "production", name: "Production", icon: "Factory", pack: "core",
    appLine: "BOMs, production plans and orders, material to the floor, receipts costed batch by batch, variance and the Production Journal.",
    bullets: ["BOMs, production plans and orders", "Material issued to the floor", "Receipts costed batch by batch", "Variance and the Production Journal"],
  },
  {
    slug: "sales", name: "Sales & Accounts Receivable", icon: "ReceiptText", pack: "core",
    appLine: "Billing at the counter, orders and estimates, receipts, and what customers owe.",
    bullets: ["Quotations, orders, invoices and returns", "Credit limits", "Bill-wise outstanding and ageing"],
  },
  {
    slug: "transport", name: "Transport & Delivery", icon: "Truck", pack: "core",
    appLine: "Dispatch, own vehicles and trips, hired transporters and their freight bills.",
    bullets: [],
  },
  {
    slug: "customer-services", name: "Customer Services", icon: "HeartHandshake", pack: "core",
    appLine: "Savings schemes, repairs and the dates that bring customers back.",
    bullets: ["Savings schemes", "Customer orders"],
  },
  {
    slug: "finance", name: "Finance & Accounts", icon: "Scale", pack: "core",
    appLine: "Vouchers, books, cheques and the final accounts.",
    bullets: [
      "True double-entry ledger",
      "Trial balance, profit and loss, balance sheet and cash flow",
      "Bank reconciliation and the cheque (PDC) register",
      "Budgets and cost centres",
    ],
  },
  {
    slug: "fixed-assets", name: "Fixed Assets", icon: "Building2", pack: "core",
    appLine: "The asset register, depreciation, disposals and the asset schedule.",
    bullets: [],
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
    slug: "control-panel", name: "Control Panel", icon: "SlidersHorizontal", pack: "core",
    appLine: "Every setting in one place: company, users, documents, workflow, accounting and tax, each module, and your data and licence.",
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
    appLine: "Loans against pledged jewelry: valuation, interest, renewals, custody, notices and auctions.",
    bullets: ["Valuation and interest", "Renewals and custody", "Notices and auctions"],
  },
];

/** Extra line the home page shows on the Trade & Finance card. */
export const tradeFinanceExtra = "LCs, bank guarantees, foreign-currency revaluation.";
