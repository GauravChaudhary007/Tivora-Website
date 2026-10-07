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
  /** File version when it differs from VERSION (an owner-supplied cut). */
  version?: string;
  /** Owner-supplied file in public/videos/, served as the 1080 source as-is. */
  file?: string;
  /** false: no caption file exists for this cut, so the player gets no captions track. */
  captions?: boolean;
};

const VERSION = "v1";

export const FILMS: Record<FilmId, Film> = {
  master: {
    id: "master",
    title: "The ERP that tells you what's next.",
    duration: 124,
    posterAlt: "TiVora ERP film, 2:04: the Work Desk, every branch live, one entry for the whole chain, dashboards and access control",
    version: "v3",
    file: "Tivora_ERP_Film_v3.mp4",
    captions: false,
    // Owner-supplied cut (Tivora_ERP_Film_v3.mp4): its on-screen headlines, read from the frames.
    transcript: [
      [0, "Does your team know what to do today, without asking you?"],
      [30, "Every company. Every branch. Live."],
      [40, "Work Desk. Every person. Their own desk."],
      [50, "One entry. Everything else follows."],
      [70, "The same chain runs in purchase and production."],
      [90, "Your business, anywhere. Open only to the right people."],
      [100, "Plus solutions made for your industry."],
      [108, "Zero re-typing. Mistakes stopped. Nothing forgotten. Live numbers."],
      [112, "The next-generation ERP, by HiTech. 28+ years, 10,000+ clients, 15+ branches, 100+ professionals."],
      [118, "TiVora ERP, HiTech Intelligent ERP Solution. The ERP that tells you what's next."],
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
      [38.3, "Sales for the last thirty days. The VAT this month, output less input. And work assigned, done, on time or overdue."],
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
      [18.3, "When an import-loan or LC payment is made, its voucher posts by itself. Nobody retypes it."],
      [25.3, "Every voucher stays in date order, in BS and AD, so any entry can be found and checked."],
      [32.3, "The trial balance is always up to today, and it balances."],
      [36.3, "From it come the profit and loss, balance sheet, cash flow and funds flow."],
      [41.3, "Fixed assets have their own register, with depreciation and the asset schedule built in."],
      [48.5, "Trade finance is covered too: letters of credit, import loans and bank guarantees, from application to retirement, with foreign currency revalued at month end."],
      [60.5, "For tax: VAT registers, Annex nine and thirteen, and TDS certificates by party."],
      [65.8, "It is connected to IRD, and issued bills are locked forever."],
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
      [20.2, "In the godown: indents, approvals, transfers and stock audit, with batches, HSN codes and every godown tracked."],
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
      [31.8, "Each line carries its VAT, and every bill shows paid, partly paid or unpaid."],
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
  const film = FILMS[id];
  const base = `tivora-${id}-${film.version ?? VERSION}`;
  return {
    src1080: film.file ?? pick(id, base, "1080"),
    src720: pick(id, base, "720"),
    poster: `${base}-poster.jpg`,
    ...(film.captions === false ? {} : { vtt: `${base}.en.vtt` }),
  };
}

export function videoUrls(id: FilmId) {
  const f = videoFiles(id);
  return {
    src1080: `/videos/${f.src1080}`,
    src720: `/videos/${f.src720}`,
    poster: `/videos/${f.poster}`,
    vtt: f.vtt && `/videos/${f.vtt}`,
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
