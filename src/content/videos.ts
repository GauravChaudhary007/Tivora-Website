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
    posterAlt: "TiVora ERP walkthrough, 1:40: modules, Work Desk, dashboards, reports, Nepal dates and tax",
    transcript: [
      [0.6, "This is TiVora ERP, from HiTech in Kathmandu."],
      [3.6, "One platform for every business, from the counter to the books."],
      [9.2, "Here is how it works. A bill is raised at the counter. The stock moves, the production floor knows what to make, and the ledger already has the entry. You type it once."],
      [19.2, "This is the real software."],
      [22.2, "Every module sits on one Home screen, so nobody has to hunt through menus."],
      [27.2, "Search any entry with Control K, or star the ones you use every day."],
      [31.2, "The Work Desk shows the owner what needs attention each morning: a credit limit, a late order, a journal not posted."],
      [37.2, "And what is due, and who is keeping up."],
      [41.2, "Each module has its own dashboard, and one page shows the whole business."],
      [46.2, "Twelve modules work from the same books: sales and purchase, stock and production, transport and delivery, customer services, finance, fixed assets, trade finance, tax, reports, and the control panel."],
      [61.2, "A quotation becomes a sales order at the quoted prices. Every bill carries its V A T, paid or not. And letters of credit are followed from application to retirement."],
      [71.2, "Reports live in one searchable place: the day book, stock movement, and receivables ageing as a list, a pivot or a graph. The trial balance balances."],
      [80.2, "It is made for Nepal: Bikram Sambat dates, V A T registers, T D S, and Annex nine and thirteen."],
      [86.2, "Jewelry is available now. General trading and Paint are next."],
      [90.2, "TiVora ERP. One platform. Every business."],
      [95.8, "Request a demo, and see it on your own numbers."],
    ],
  },
  owner: {
    id: "owner",
    title: "The owner's morning.",
    duration: 64,
    posterAlt: "TiVora ERP Work Desk: the cards that need the owner now, with the module tabs above",
    transcript: [
      [1, "The owner's morning, on TiVora."],
      [4.3, "Everything starts on Home. Your most used entries are one click away."],
      [9.5, "The Work Desk is where the day begins. It gathers what needs you from every module, sorted by late, today, this week or snoozed. A customer is over the credit limit. A production order is weeks late. A journal has not been posted. Each one has its action beside it, so you fix it there."],
      [32.3, "Then the numbers: who owes you, and whom you owe, in one view."],
      [38.3, "Sales for the last thirty days. The V A T this month, output less input. And work assigned, done, on time or overdue."],
      [46.8, "Every module has a dashboard of its own. Sales against the same days last month, a running total against target, and what customers owe."],
      [58, "TiVora ERP. One platform. Every business."],
    ],
  },
  money: {
    id: "money",
    title: "Books, banks and tax.",
    duration: 72,
    posterAlt: "TiVora ERP Trial Balance showing Balanced, with vouchers, letters of credit and tax reports in the film",
    transcript: [
      [1, "Books, banks and tax."],
      [4.3, "This is where the money is kept: vouchers, books, cheques and the final accounts."],
      [10.3, "Receipts, payments and contra entries are made against a cash or bank book, so every rupee has a place."],
      [18.3, "When an import-loan or L C payment is made, its voucher posts by itself. Nobody retypes it."],
      [25.3, "Every voucher stays in date order, in B S and A D, so any entry can be found and checked."],
      [32.3, "The trial balance is always up to today, and it balances."],
      [36.3, "From it come the profit and loss, balance sheet, cash flow and funds flow."],
      [41.3, "Fixed assets have their own register, with depreciation and the asset schedule built in."],
      [48.5, "Trade finance is covered too: letters of credit, import loans and bank guarantees, from application to retirement, with foreign currency revalued at month end."],
      [60.5, "For tax: V A T registers, Annex nine and thirteen, and T D S certificates by party."],
      [65.8, "It is C B M S ready, and built to I R D's current formats."],
    ],
  },
  stock: {
    id: "stock",
    title: "Buy. Store. Make. Deliver.",
    duration: 68,
    posterAlt: "TiVora ERP Stock Report with opening, inward, outward and closing quantities by product",
    transcript: [
      [1, "Buy. Store. Make. Deliver."],
      [4.2, "One entry moves the stock, from purchase to delivery."],
      [7.2, "Buying starts with a requisition and a request for quotation. Supplier quotes are compared side by side, import costs are pooled into the goods, and what is received but not yet billed stays visible."],
      [20.2, "In the godown: indents, approvals, transfers and stock audit, with batches, H S N codes and every godown tracked."],
      [28.2, "Stock is valued, and you see opening, inward, outward and closing for every product."],
      [34.2, "On the floor: plan, order, issue, receive. Bills of materials, plants and machines, with yield, loss and batch trace."],
      [44.2, "A late order reaches the owner's desk by itself."],
      [48.8, "Delivery runs on your own vehicles or hired transporters, with freight bills and document expiry."],
      [55.8, "The floor knows what to make, and the ledger already has it."],
      [62, "TiVora ERP. One platform. Every business."],
    ],
  },
  sales: {
    id: "sales",
    title: "From quotation to receipt.",
    duration: 62,
    posterAlt: "TiVora ERP Sales Invoices list with dates in AD and BS, VAT and payment status",
    transcript: [
      [1, "From quotation to receipt."],
      [4.3, "The day starts at the counter, with price lists, discount schemes, counters and tills."],
      [14.8, "Sales below the floor price, and temporary credit limits, are reported."],
      [20.3, "A quotation becomes the sales order at the quoted prices, so nothing is entered twice."],
      [28.2, "Every bill is dated in both calendars."],
      [31.8, "Each line carries its V A T, and every bill shows paid, partly paid or unpaid."],
      [37.8, "You see what each customer still owes, in ageing bands, as a list, a pivot or a graph."],
      [50.8, "Over the credit limit? The Work Desk flags it, and so does the dashboard."],
      [56, "TiVora ERP. One platform. Every business."],
    ],
  },
};

/** Audio-enhanced versions (owner decision) replace the plain renders wherever the file exists. The master's enhanced 720 has no audio track, so the master keeps its plain files. */
const NO_ENHANCED: FilmId[] = ["master"];
const pick = (id: FilmId, base: string, res: "1080" | "720") => {
  const enhanced = `${base}-${res}-enhanced.mp4`;
  return !NO_ENHANCED.includes(id) && existsSync(join(process.cwd(), "public", "videos", enhanced)) ? enhanced : `${base}-${res}.mp4`;
};

/** Exact file names the renderer must write into public/videos/ (docs/VIDEO-SPEC.md 4.3), with enhanced versions preferred. */
export function videoFiles(id: FilmId) {
  const base = `tivora-${id}-${VERSION}`;
  return {
    src1080: pick(id, base, "1080"),
    src720: pick(id, base, "720"),
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
