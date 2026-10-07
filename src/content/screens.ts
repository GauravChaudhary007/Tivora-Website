// Registry of every file in public/screens (written by scripts/prep-screens.mjs). Screens are
// real app captures of the Jewelry demo company: cropped only, never redrawn, blurred or covered.
// Slug names like "home-paint", "work-desk" and "executive-*" are historical (they began as the Paint
// edition); every capture is now the Jewelry company, and "home-jewelry" reuses the "home-paint" files.
import { DEMO_CAPTION } from "./site";
export type ScreenSlug =
  | "home-paint"
  | "home-jewelry"
  | "work-desk"
  | "executive-dashboard"
  | "executive-sales"
  | "executive-target"
  | "executive-glance"
  | "home-paint-m1"
  | "home-paint-m2"
  | "work-desk-m1"
  | "work-desk-m2"
  | "work-desk-m3"
  | "sales-dashboard"
  | "finance-dashboard"
  | "dashboards"
  | "module-sales"
  | "module-purchase"
  | "module-inventory"
  | "module-karigar"
  | "module-factory"
  | "module-rfid"
  | "module-gold-loans"
  | "module-customer-services"
  | "module-transport"
  | "module-finance"
  | "module-fixed-assets"
  | "module-trade-finance"
  | "module-tax-ird";
export type ScreenDef = {
  alt: string;
  /** Intrinsic size of the largest file (the width/height attributes, so layout never shifts). */
  width: number;
  height: number;
  caption: string;
  edition: "paint" | "jewelry" | "core";
  src: string;
  srcSet?: string;
};
const set = (slug: string, ...w: number[]) => w.map((n) => `/screens/${slug}-${n}.webp ${n}w`).join(", ");
const big = (slug: string, w: number) => `/screens/${slug}-${w}.webp`;
export const SCREENS: Record<ScreenSlug, ScreenDef> = {
  "home-paint": {
    alt: "TiVora ERP Home screen for a Jewelry company: shortcut buttons (Jewelry Sales, Board Rate, Jewelry Purchase Invoice, Karigar Issue) and module cards including RFID, Karigar / Workshop, Jewelry Factory, Gold Loans, Sales, Purchase, Store and Finance.",
    width: 2400, height: 1500, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("home-paint", 2400), srcSet: set("home-paint", 960, 1600, 2400),
  },
  "home-jewelry": {
    alt: "TiVora ERP Home screen for a Jewelry company: shortcut buttons (Jewelry Sales, Board Rate, Jewelry Purchase Invoice, Karigar Issue) and module cards including RFID, Karigar / Workshop, Jewelry Factory, Gold Loans, Sales, Purchase, Store and Finance.",
    width: 2400, height: 1500, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("home-paint", 2400), srcSet: set("home-paint", 960, 1600, 2400),
  },
  "work-desk": {
    alt: "TiVora ERP Work Desk for a Jewelry company: eight critical items under Needs you now, such as a customer over the credit limit, today's board rate not set, gold loan notices and bags waiting at a workshop stage, then My work and coming up.",
    width: 2400, height: 1500, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("work-desk", 2400), srcSet: set("work-desk", 960, 1600, 2400),
  },
  "executive-dashboard": {
    alt: "TiVora ERP Executive dashboard for a Jewelry company: sales for the month against target with a running-total chart, and an At a glance row of gross profit, money received, what customers owe and what is owed, with cash and bank, stock, gold position and orders below.",
    width: 2400, height: 1500, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("executive-dashboard", 2400), srcSet: set("executive-dashboard", 960, 1600, 2400),
  },
  "executive-sales": {
    alt: "Executive dashboard sales card for the month: sales total, comparison with the same days last month, progress against target, bills, average bill and returns.",
    width: 970, height: 672, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("executive-sales", 970),
  },
  "executive-target": {
    alt: "Executive dashboard chart: running total of sales across the month against the target pace.",
    width: 1346, height: 672, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("executive-target", 1346),
  },
  "executive-glance": {
    alt: "Executive dashboard At a glance row: gross profit on tagged pieces, money received, what customers owe and what is owed to suppliers.",
    width: 2330, height: 450, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("executive-glance", 2330), srcSet: set("executive-glance", 960, 1600, 2330),
  },
  "home-paint-m1": {
    alt: "TiVora ERP Home screen, top left: Namaste, Jewelry, shortcut buttons including Jewelry Sales and Board Rate, and the first module cards.",
    width: 1170, height: 780, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("home-paint-m1", 1170),
  },
  "home-paint-m2": {
    alt: "TiVora ERP Home screen, more module cards: Karigar / Workshop, Jewelry Factory, Customer Services and Gold Loans.",
    width: 1150, height: 750, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("home-paint-m2", 1150),
  },
  "work-desk-m1": {
    alt: "Work Desk critical card: a customer over the credit limit under Sales and Accounts Receivable, with a Review button.",
    width: 770, height: 375, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("work-desk-m1", 770),
  },
  "work-desk-m2": {
    alt: "Work Desk critical card: a gold loan whose notice has run out, with an Open the loan button.",
    width: 770, height: 372, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("work-desk-m2", 770),
  },
  "work-desk-m3": {
    alt: "Work Desk critical card: an RFID exit gate read of a piece the books say is in stock, with a Resolve button.",
    width: 770, height: 372, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("work-desk-m3", 770),
  },
  "sales-dashboard": {
    alt: "TiVora ERP Sales and Accounts Receivable dashboard for a Jewelry company: sales, bills, gross margin and returns cards with a sales by day chart.",
    width: 2400, height: 1500, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("sales-dashboard", 2400), srcSet: set("sales-dashboard", 960, 1600, 2400),
  },
  "finance-dashboard": {
    alt: "TiVora ERP Finance and Accounts dashboard: income, running expenses and profit for the period, cash and bank, money in and out, and an income and expenses by month chart.",
    width: 2400, height: 1500, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("finance-dashboard", 2400), srcSet: set("finance-dashboard", 960, 1600, 2400),
  },
  "dashboards": {
    alt: "TiVora ERP Dashboards index: an Executive dashboard for the whole business and one dashboard for each module, including Karigar / Workshop, Jewelry Factory, RFID and Gold Loans.",
    width: 2400, height: 1500, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("dashboards", 2400), srcSet: set("dashboards", 960, 1600, 2400),
  },
  "module-sales": {
    alt: "Sales and Accounts Receivable module page: entries, masters, reports and settings, including Counter Operations, Jewelry Sales and customer receipts.",
    width: 2400, height: 1500, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("module-sales", 2400), srcSet: set("module-sales", 960, 1600, 2400),
  },
  "module-purchase": {
    alt: "Purchase and Accounts Payable module page: purchase requisitions, orders, bills, jewelry purchase and old gold purchase entries, with vendor reports.",
    width: 2400, height: 1500, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("module-purchase", 2400), srcSet: set("module-purchase", 960, 1600, 2400),
  },
  "module-inventory": {
    alt: "Store and Inventory module page: opening stock, godown transfers, hallmarking and melting entries, masters for products and board rates, and stock reports.",
    width: 2400, height: 1500, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("module-inventory", 2400), srcSet: set("module-inventory", 960, 1600, 2400),
  },
  "module-karigar": {
    alt: "Karigar / Workshop module page: work orders, karigar issue and receipt, wastage and labour settlement entries, with fine metal ledger and balance reports.",
    width: 2400, height: 1164, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("module-karigar", 2400), srcSet: set("module-karigar", 960, 1600, 2400),
  },
  "module-factory": {
    alt: "Jewelry Factory floor board: job bags laid out by stage from CAD and casting through setting, final polish and QC, with weights and days at each stage.",
    width: 2400, height: 1386, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("module-factory", 2400), srcSet: set("module-factory", 960, 1600, 2400),
  },
  "module-rfid": {
    alt: "RFID overview: tag, reader and count figures, a find-a-piece search, the exit gate alert and recent counts, with readers listed below.",
    width: 2400, height: 1168, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("module-rfid", 2400), srcSet: set("module-rfid", 960, 1600, 2400),
  },
  "module-gold-loans": {
    alt: "Gold Loans module page: loan entries, interest accrual and vault count, schemes, and loan book, overdue, custody and auction reports.",
    width: 2400, height: 1170, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("module-gold-loans", 2400), srcSet: set("module-gold-loans", 960, 1600, 2400),
  },
  "module-customer-services": {
    alt: "Customer Services module page: scheme enrolments, repair and service entries, savings schemes and customer registers.",
    width: 2400, height: 917, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("module-customer-services", 2400), srcSet: set("module-customer-services", 960, 1600, 2400),
  },
  "module-transport": {
    alt: "Transport and Delivery module page: delivery notes, vehicle trips and freight bills, vehicle and driver masters, and trip and freight reports.",
    width: 2400, height: 1170, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("module-transport", 2400), srcSet: set("module-transport", 960, 1600, 2400),
  },
  "module-finance": {
    alt: "Finance and Accounts module page: cash and bank vouchers, journals, notes and bank reconciliation, with the day book, ledgers, trial balance and final account reports.",
    width: 2400, height: 1500, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("module-finance", 2400), srcSet: set("module-finance", 960, 1600, 2400),
  },
  "module-fixed-assets": {
    alt: "Fixed Assets module page: the fixed asset register and post depreciation entries, and the asset schedule report.",
    width: 2400, height: 917, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("module-fixed-assets", 2400), srcSet: set("module-fixed-assets", 960, 1600, 2400),
  },
  "module-trade-finance": {
    alt: "Trade and Finance module page: letters of credit, advance TT, import loans and foreign currency payments, with facility utilisation and guarantee reports.",
    width: 2400, height: 1294, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("module-trade-finance", 2400), srcSet: set("module-trade-finance", 960, 1600, 2400),
  },
  "module-tax-ird": {
    alt: "Tax and IRD module page: tax groups and TDS sections, with VAT registers, Annex 13, TDS and income tax reports.",
    width: 2400, height: 1500, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("module-tax-ird", 2400), srcSet: set("module-tax-ird", 960, 1600, 2400),
  },
};
