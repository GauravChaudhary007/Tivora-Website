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
      [3.8, "One platform."],
      [6.4, "Every business."],
      [9.0, "A bill at the counter."],
      [11.0, "The stock moves with it."],
      [13.0, "The floor knows what to make."],
      [15.0, "And the ledger already has it."],
      [17.0, "Typed once. Every number agrees."],
      [19.6, "This is the real screen."],
      [22.0, "Every module, one Home."],
      [24.2, "Star any entry to keep it here."],
      [27.2, "Ctrl K searches the menu."],
      [29.2, "One login. Switch company. Dates in BS and AD."],
      [31.2, "Mornings start with what needs you."],
      [33.0, "Over the credit limit."],
      [34.3, "An order late on the floor."],
      [35.6, "A journal not posted."],
      [37.0, "What's due, and who is on time."],
      [41.2, "A dashboard for every module."],
      [43.3, "The whole business on one page."],
      [46.0, "Sales & Accounts Receivable. Counter to receipt."],
      [47.25, "Purchase & Accounts Payable. Requisition to payment."],
      [48.5, "Store & Inventory. Every godown."],
      [49.75, "Production. BOM to batch cost."],
      [51.0, "Transport & Delivery. Trips and freight."],
      [52.25, "Customer Services. Birthdays, anniversaries."],
      [53.5, "Finance & Accounts. Vouchers to final accounts."],
      [54.75, "Fixed Assets. Register and depreciation."],
      [56.0, "Trade & Finance. LCs and foreign currency."],
      [57.25, "Tax & IRD. VAT, Annex 9 and 13, TDS."],
      [58.5, "Control Panel. Every setting, one place."],
      [59.75, "Reports Centre. Every report, one place."],
      [61.0, "A quotation becomes the sales order, at the quoted prices."],
      [63.5, "Every bill with its VAT, paid or not."],
      [66.0, "LC and import-loan payments post as automatic vouchers."],
      [68.5, "Letters of credit, from application to retirement."],
      [71.2, "Every report, in one searchable place."],
      [73.5, "Day book in BS and AD."],
      [75.25, "Stock: opening, in, out, closing."],
      [76.75, "Ageing, as a list, pivot or graph."],
      [78.0, "Balanced."],
      [81.4, "Made for the way Nepal does business."],
      [82.0, "Bikram Sambat dates and fiscal years."],
      [82.9, "VAT registers, Annex 9 and Annex 13."],
      [83.8, "TDS by party, with certificates."],
      [84.7, "CBMS-ready, built to IRD's current formats."],
      [86.0, "Built one trade at a time."],
      [87.0, "Tivora ERP – Jewelry (available now)"],
      [88.0, "General trading and Paint (coming)"],
      [91.0, "One platform. Every business."],
      [95.0, "Request a demo"],
    ],
  },
  owner: {
    id: "owner",
    title: "The owner's morning.",
    duration: 64,
    posterAlt: "Tivora ERP Work Desk: the cards that need the owner now, with the module tabs above",
    transcript: [
      [1.0, "The owner's morning."],
      [4.2, "Namaste. Your entries, one click away."],
      [6.5, "Star any entry to keep it on Home."],
      [9.2, "One desk for every module."],
      [12.8, "Late, today, this week, snoozed."],
      [17.0, "A customer over the credit limit."],
      [17.8, "The action is one click away."],
      [20.3, "A production order 55 days late."],
      [23.6, "A journal not posted."],
      [27.2, "Coming up: the TDS deposit and the VAT return."],
      [32.2, "Who owes you, and whom you owe."],
      [35.0, "Sales, last 30 days."],
      [38.2, "VAT this month: output less input."],
      [42.2, "Assigned, done, on time, overdue."],
      [43.2, "Per person, by week or month."],
      [47.2, "A dashboard for every module."],
      [48.0, "Open items, critical, late."],
      [51.0, "Sales against the same days of Bhadra."],
      [53.1, "A running total against target."],
      [55.2, "What customers owe. What you owe."],
      [57.5, "One platform. Every business."],
      [60.0, "Request a demo"],
    ],
  },
  money: {
    id: "money",
    title: "Books, banks and tax.",
    duration: 72,
    posterAlt: "Tivora ERP Trial Balance showing Balanced, with vouchers, letters of credit and tax reports in the film",
    transcript: [
      [1.0, "Books, banks and tax."],
      [4.2, "Vouchers, books, cheques and the final accounts."],
      [10.2, "Receipts, payments and contra, against a cash or bank book."],
      [14.2, "LC and import-loan payments post as automatic vouchers."],
      [18.2, "Every voucher in date order. BS and AD."],
      [22.0, "VAT on the purchase, already in the books."],
      [25.2, "Trial balance, up to today."],
      [29.6, "Balanced."],
      [32.2, "P&L, balance sheet, cash flow, funds flow."],
      [36.2, "Asset register, depreciation, the asset schedule."],
      [41.2, "Letters of credit, import loans, bank guarantees."],
      [44.5, "From application to retirement."],
      [49.2, "Foreign-currency exposure and month-end revaluation."],
      [52.2, "VAT registers and the monthly VAT report."],
      [54.7, "Annex 13, Annex 9 and CBMS totals."],
      [57.4, "TDS by party, with certificates."],
      [61.0, "CBMS-ready. Built to IRD's current formats."],
      [65.5, "One platform. Every business."],
      [68.0, "Request a demo"],
    ],
  },
  stock: {
    id: "stock",
    title: "Buy. Store. Make. Deliver.",
    duration: 68,
    posterAlt: "Tivora ERP Stock Report with opening, inward, outward and closing quantities by product",
    transcript: [
      [1.0, "Buy. Store. Make. Deliver."],
      [4.2, "The stock moves with it."],
      [7.2, "From requisition and RFQ to the order."],
      [10.2, "Supplier quotations, compared."],
      [13.2, "Import costs, pooled into the goods."],
      [16.2, "Received but not billed. Payables ageing."],
      [20.2, "Indents, approvals, godown transfers, stock audit."],
      [23.0, "Batches, HSN and every godown."],
      [25.7, "Stock valued, with NRV."],
      [28.2, "Opening, inward, outward, closing."],
      [28.8, "Product by product, in a second unit if you need it."],
      [34.2, "Plan, order, issue, receive."],
      [37.2, "Bills of materials, plants and machines."],
      [40.2, "Yield and loss. Batch trace. Machine efficiency."],
      [44.2, "A late order reaches the owner's desk."],
      [49.2, "Own vehicles, hired transporters, freight bills."],
      [52.2, "Document expiry for vehicles and drivers."],
      [55.2, "The floor knows what to make."],
      [57.2, "And the ledger already has it."],
      [61.5, "One platform. Every business."],
      [64.0, "Request a demo"],
    ],
  },
  sales: {
    id: "sales",
    title: "From quotation to receipt.",
    duration: 62,
    posterAlt: "Tivora ERP Sales Invoices list with dates in AD and BS, VAT and payment status",
    transcript: [
      [1.0, "From quotation to receipt."],
      [4.2, "Day start at the counter."],
      [7.2, "Price lists, discount schemes, counters and tills."],
      [9.7, "Below-floor sales and temporary credit limits, reported."],
      [12.2, "A quotation becomes the sales order, at the quoted prices."],
      [18.2, "Every bill, dated in AD and BS."],
      [21.2, "VAT on every line of the list."],
      [24.2, "Paid, partly paid, unpaid."],
      [27.2, "Sold by quantity and rate."],
      [30.2, "What each customer still owes."],
      [34.2, "0-30, 31-60, 61-90, over 90 days."],
      [38.2, "Over the credit limit, flagged on the Work Desk."],
      [43.2, "Sales against the same days last month."],
      [46.0, "Quotations turned into orders."],
      [48.7, "The dates that bring customers back."],
      [49.5, "Birthdays and anniversaries."],
      [55.5, "One platform. Every business."],
      [58.0, "Request a demo"],
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
