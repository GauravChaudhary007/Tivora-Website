// Registry of every file in public/screens (written by scripts/prep-screens.mjs). Screens are
// real app captures: cropped and redacted only, never redrawn. Alt text says what is on screen.
import { DEMO_CAPTION } from "./site";

export type ScreenSlug =
  | "home-paint" | "work-desk" | "executive-dashboard" | "executive-sales" | "executive-target" | "executive-glance"
  | "home-paint-m1" | "home-paint-m2" | "work-desk-m1" | "work-desk-m2" | "work-desk-m3"
  | "sales-dashboard" | "finance-dashboard" | "dashboards" | "home-jewelry" | "menu-paint" | "menu-jewelry";

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
const paint = DEMO_CAPTION.paint;

export const SCREENS: Record<ScreenSlug, ScreenDef> = {
  "home-paint": {
    alt: "TiVora ERP Home screen for a demo company: Namaste, Paint, shortcut buttons and the module cards for Sales, Customer Services, Purchase, Store, Production, Finance, Trade and Tax.",
    width: 1600, height: 778, caption: paint, edition: "paint", src: big("home-paint", 1600), srcSet: set("home-paint", 960, 1600),
  },
  "work-desk": {
    alt: "TiVora ERP Work Desk listing three critical items under Needs you now, followed by My work and coming up, with Today in numbers at the right.",
    width: 1600, height: 753, caption: paint, edition: "paint", src: big("work-desk", 1600), srcSet: set("work-desk", 960, 1600),
  },
  "executive-dashboard": {
    alt: "TiVora ERP Executive dashboard: the whole business on one page, with a sales card, a running total against target, and an At a glance row of money received, what customers owe, what is owed and cash and bank. A supplier name is blurred.",
    width: 1600, height: 772, caption: paint, edition: "paint", src: big("executive-dashboard", 1600), srcSet: set("executive-dashboard", 960, 1600),
  },
  "executive-sales": {
    alt: "Executive dashboard sales card for Aswin 2083: sales for the period against the same days last month.",
    width: 643, height: 380, caption: paint, edition: "paint", src: big("executive-sales", 643),
  },
  "executive-target": {
    alt: "Executive dashboard chart: running total of sales across the month against target.",
    width: 901, height: 380, caption: paint, edition: "paint", src: big("executive-target", 901),
  },
  "executive-glance": {
    alt: "Executive dashboard At a glance row: money received, what customers owe, and what you owe. A supplier name is blurred.",
    width: 1150, height: 247, caption: paint, edition: "paint", src: big("executive-glance", 960), srcSet: set("executive-glance", 960, 1150),
  },
  "home-paint-m1": {
    alt: "TiVora ERP Home screen, top left: Namaste, Paint, shortcut buttons, and the Sales and Accounts Receivable and Customer Services module cards.",
    width: 700, height: 490, caption: paint, edition: "paint", src: big("home-paint-m1", 700),
  },
  "home-paint-m2": {
    alt: "TiVora ERP Home screen, more module cards: Purchase and Accounts Payable, Store and Inventory, Trade and Finance, and Tax and IRD.",
    width: 727, height: 482, caption: paint, edition: "paint", src: big("home-paint-m2", 727),
  },
  "work-desk-m1": {
    alt: "Work Desk critical card: a customer over the credit limit under Sales and Accounts Receivable, with a Review button. The customer name is blurred.",
    width: 515, height: 275, caption: paint, edition: "paint", src: big("work-desk-m1", 515),
  },
  "work-desk-m2": {
    alt: "Work Desk critical card: a manufacturing order 49 days past its due date, with a Receive button.",
    width: 515, height: 275, caption: paint, edition: "paint", src: big("work-desk-m2", 515),
  },
  "work-desk-m3": {
    alt: "Work Desk critical card: an abnormal-loss journal that is not posted, with a Manufacturing Account button.",
    width: 515, height: 275, caption: paint, edition: "paint", src: big("work-desk-m3", 515),
  },
  "sales-dashboard": {
    alt: "TiVora ERP Sales and Accounts Receivable dashboard with sales, bills and returns cards and a sales by day chart.",
    width: 1600, height: 774, caption: paint, edition: "paint", src: big("sales-dashboard", 1600), srcSet: set("sales-dashboard", 960, 1600),
  },
  "finance-dashboard": {
    alt: "TiVora ERP Finance and Accounts dashboard with income, running expenses, cash and bank cards and an income and expenses by month chart.",
    width: 1600, height: 776, caption: paint, edition: "paint", src: big("finance-dashboard", 1600), srcSet: set("finance-dashboard", 960, 1600),
  },
  dashboards: {
    alt: "TiVora ERP Dashboards index: one dashboard for the whole business and one for each module.",
    width: 1600, height: 778, caption: paint, edition: "paint", src: big("dashboards", 1600), srcSet: set("dashboards", 960, 1600),
  },
  "home-jewelry": {
    alt: "TiVora ERP – Jewelry Home screen with shortcut buttons and module cards including Karigar / Workshop, Manufacturing, RFID and Gold Loans.",
    width: 1600, height: 778, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: big("home-jewelry", 1600), srcSet: set("home-jewelry", 960, 1600),
  },
  "menu-paint": {
    alt: "TiVora ERP side menu listing the modules with entry counts, and recently opened pages.",
    width: 284, height: 922, caption: DEMO_CAPTION.core, edition: "core", src: "/screens/menu-paint-1x.webp",
  },
  "menu-jewelry": {
    alt: "TiVora ERP – Jewelry side menu: the core modules plus Karigar / Workshop, Manufacturing, RFID and Gold Loans.",
    width: 289, height: 930, caption: DEMO_CAPTION.jewelry, edition: "jewelry", src: "/screens/menu-jewelry-1x.webp",
  },
};
