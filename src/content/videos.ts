// Launch-video registry (docs/VIDEO-SPEC.md section 5). Server-only: it touches the file system.
// The renderer (video/render.mjs) writes these files into public/videos/; they are git-ignored.
// Transcript lines are the on-screen caption texts of docs/VIDEO-SPEC.md 2.1-2.5, [seconds, text];
// video/verify.mjs (WV4) compares them with video/films/<id>.json, so keep both in step.
import { existsSync } from "node:fs";
import { join } from "node:path";

export type FilmId = "master" | "owner" | "money" | "stock" | "sales";

export type Film = {
  id: FilmId;
  title: string;
  duration: number;
  posterAlt: string;
  transcript: readonly (readonly [number, string])[];
};

const VERSION = "v1";

export const FILMS: Record<FilmId, Film> = {
  master: {
    id: "master",
    title: "One platform. Every business.",
    duration: 100,
    posterAlt: "Tivora ERP walkthrough, 1:40: modules, Work Desk, dashboards, reports, Nepal dates and tax",
    transcript: [
      [1.4, "TIVORA ERP · FROM HITECH, KATHMANDU"],
      [3.8, "One platform."],
      [6.4, "Every business."],
      [9, "A bill at the counter."],
      [11, "The stock moves with it."],
      [13, "The floor knows what to make."],
      [15, "And the ledger already has it."],
      [17, "Typed once. Every number agrees."],
      [19.6, "This is the real screen."],
      [22.2, "Every module, one Home."],
      [24.2, "Star any entry to keep it here."],
      [27.2, "Ctrl K searches the menu."],
      [29.2, "One login. Switch company. Dates in BS and AD."],
      [31.2, "Mornings start with what needs you."],
      [33, "Over the credit limit."],
      [34.3, "An order late on the floor."],
      [35.6, "A journal not posted."],
      [37.2, "What's due, and who is on time."],
      [41.2, "A dashboard for every module."],
      [43.3, "The whole business on one page."],
      [46, "Sales & Accounts Receivable"],
      [46, "Counter to receipt."],
      [47.25, "Purchase & Accounts Payable"],
      [47.25, "Requisition to payment."],
      [48.5, "Store & Inventory"],
      [48.5, "Every godown."],
      [49.75, "Production"],
      [49.75, "BOM to batch cost."],
      [51, "Transport & Delivery"],
      [51, "Trips and freight."],
      [52.25, "Customer Services"],
      [52.25, "Birthdays, anniversaries."],
      [53.5, "Finance & Accounts"],
      [53.5, "Vouchers to final accounts."],
      [54.75, "Fixed Assets"],
      [54.75, "Register and depreciation."],
      [56, "Trade & Finance"],
      [56, "LCs and foreign currency."],
      [57.25, "Tax & IRD"],
      [57.25, "VAT, Annex 9 and 13, TDS."],
      [58.5, "Control Panel"],
      [58.5, "Every setting, one place."],
      [59.75, "Reports Centre"],
      [59.75, "Every report, one place."],
      [61.2, "A quotation becomes the sales order, at the quoted prices."],
      [63.7, "Every bill with its VAT, paid or not."],
      [66.2, "LC and import-loan payments post as automatic vouchers."],
      [68.7, "Letters of credit, from application to retirement."],
      [71.1, "Every report, in one searchable place."],
      [73.5, "Day book in BS and AD."],
      [75.25, "Stock: opening, in, out, closing."],
      [76.75, "Ageing, as a list, pivot or graph."],
      [78.2, "Balanced."],
      [80, "2083"],
      [81.6, "2083-06-20 BS · 2026-10-06 AD"],
      [81.8, "Made for the way Nepal does business."],
      [82.5, "Bikram Sambat dates and fiscal years."],
      [83.4, "VAT registers, Annex 9 and Annex 13."],
      [84.3, "TDS by party, with certificates."],
      [85.2, "CBMS-ready, built to IRD's current formats."],
      [86.2, "Built one trade at a time."],
      [86.4, "Tivora ERP – Jewelry, demo data."],
      [86.8, "Available now Tivora ERP – Jewelry"],
      [87.2, "Coming General trading and Paint"],
      [93.2, "One platform. Every business."],
    ],
  },
  owner: {
    id: "owner",
    title: "The owner's morning.",
    duration: 64,
    posterAlt: "Tivora ERP Work Desk: the cards that need the owner now, with the module tabs above",
    transcript: [
      [1, "TIVORA ERP · WORK DESK & DASHBOARDS"],
      [1, "The owner's morning."],
      [4.9, "Namaste. Your entries, one click away."],
      [5.6, "Star any entry to keep it on Home."],
      [9.2, "One desk for every module."],
      [13.6, "Late, today, this week, snoozed."],
      [17.2, "A customer over the credit limit."],
      [17.8, "The action is one click away."],
      [20.4, "A production order 55 days late."],
      [21, "The action is one click away."],
      [23.6, "A journal not posted."],
      [24.2, "The action is one click away."],
      [27.3, "Coming up: the TDS deposit and the VAT return."],
      [32.1, "Who owes you, and whom you owe."],
      [35.1, "Sales, last 30 days."],
      [38.2, "VAT this month: output less input."],
      [42.2, "Assigned, done, on time, overdue."],
      [42.9, "Per person, by week or month."],
      [46.7, "A dashboard for every module."],
      [47.5, "Open items, critical, late."],
      [50.6, "Sales against the same days of Bhadra."],
      [53.2, "A running total against target."],
      [55.3, "What customers owe. What you owe."],
    ],
  },
  money: {
    id: "money",
    title: "Books, banks and tax.",
    duration: 72,
    posterAlt: "Tivora ERP Trial Balance showing Balanced, with vouchers, letters of credit and tax reports in the film",
    transcript: [
      [1, "TIVORA ERP · FINANCE, TRADE & TAX"],
      [1, "Books, banks and tax."],
      [4.9, "Vouchers, books, cheques and the final accounts."],
      [10.1, "Receipts, payments and contra, against a cash or bank book."],
      [14.2, "LC and import-loan payments post as automatic vouchers."],
      [18.2, "Every voucher in date order. BS and AD."],
      [21.5, "VAT on the purchase, already in the books."],
      [25.1, "Trial balance, up to today."],
      [29.6, "Balanced."],
      [32.1, "P&L, balance sheet, cash flow, funds flow."],
      [36.2, "Asset register, depreciation, the asset schedule."],
      [41.1, "Letters of credit, import loans, bank guarantees."],
      [44.6, "From application to retirement."],
      [48.4, "Foreign-currency exposure and month-end revaluation."],
      [52, "VAT registers and the monthly VAT report."],
      [54.85, "Annex 13, Annex 9 and CBMS totals."],
      [57.2, "TDS by party, with certificates."],
      [59.4, "2083"],
      [60.4, "2083"],
      [62, "2083-06-20 BS · 2026-10-06 AD"],
      [62.2, "CBMS-ready. Built to IRD's current formats."],
    ],
  },
  stock: {
    id: "stock",
    title: "Buy. Store. Make. Deliver.",
    duration: 68,
    posterAlt: "Tivora ERP Stock Report with opening, inward, outward and closing quantities by product",
    transcript: [
      [1, "TIVORA ERP · STOCK & PRODUCTION"],
      [1, "Buy. Store. Make. Deliver."],
      [4.1, "The stock moves with it."],
      [7.3, "From requisition and RFQ to the order."],
      [10.4, "Supplier quotations, compared."],
      [13.1, "Import costs, pooled into the goods."],
      [16.2, "Received but not billed. Payables ageing."],
      [20.2, "Indents, approvals, godown transfers, stock audit."],
      [23.9, "Batches, HSN and every godown."],
      [26.4, "Stock valued, with NRV."],
      [28.2, "Opening, inward, outward, closing."],
      [30.2, "Product by product, in a second unit if you need it."],
      [34.2, "Plan, order, issue, receive."],
      [37.1, "Bills of materials, plants and machines."],
      [40.3, "Yield and loss. Batch trace. Machine efficiency."],
      [44.3, "A late order reaches the owner's desk."],
      [48.5, "Own vehicles, hired transporters, freight bills."],
      [51.8, "Document expiry for vehicles and drivers."],
      [54.5, "Deliver."],
      [57.5, "The floor knows what to make."],
      [59.5, "And the ledger already has it."],
    ],
  },
  sales: {
    id: "sales",
    title: "From quotation to receipt.",
    duration: 62,
    posterAlt: "Tivora ERP Sales Invoices list with dates in AD and BS, VAT and payment status",
    transcript: [
      [1, "TIVORA ERP · SALES & RECEIVABLES"],
      [1, "From quotation to receipt."],
      [4.2, "Day start at the counter."],
      [6.5, "Price lists, discount schemes, counters and tills."],
      [10.2, "Below-floor sales and temporary credit limits, reported."],
      [14.8, "A quotation becomes the sales order, at the quoted prices."],
      [20.2, "Every bill, dated in AD and BS."],
      [22.7, "VAT on every line of the list."],
      [25.2, "Paid, partly paid, unpaid."],
      [28.2, "Sold by quantity and rate."],
      [31.2, "What each customer still owes."],
      [34.2, "0-⁠30, 31-⁠60, 61-⁠90, over 90 days."],
      [37.7, "Over the credit limit, flagged on the Work Desk."],
      [41.7, "The same flag, on the dashboard."],
      [44.7, "Sales against the same days last month."],
      [47.6, "Quotations turned into orders."],
      [50.7, "The dates that bring customers back."],
      [52.1, "Birthdays and anniversaries."],
    ],
  },
};

/** Exact file names the renderer must write into public/videos/ (docs/VIDEO-SPEC.md 4.3). */
export function videoFiles(id: FilmId) {
  const base = `tivora-${id}-${VERSION}`;
  return {
    src1080: `${base}-1080.mp4`,
    src720: `${base}-720.mp4`,
    poster: `${base}-poster.jpg`,
    vtt: `${base}.en.vtt`,
  };
}

export function videoUrls(id: FilmId) {
  const f = videoFiles(id);
  return {
    src1080: `/videos/${f.src1080}`,
    src720: `/videos/${f.src720}`,
    poster: `/videos/${f.poster}`,
    vtt: `/videos/${f.vtt}`,
  };
}

/** True when all four files for the film exist (checked when the page is built or rendered). */
export function filmReady(id: FilmId): boolean {
  return Object.values(videoFiles(id)).every((f) => existsSync(join(process.cwd(), "public", "videos", f)));
}

export function fmtTime(s: number): string {
  const t = Math.floor(s);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}
