// Sample data for each module's "product moment" (components/moments/ModuleMoment.tsx): a simplified screen of the module at work, shown with the caption
// "Simplified screen with sample data". Names and figures are sample data in the style of the CEO brochure, not customers or results.
export type ModuleMomentData = {
  /** Window title, e.g. the register shown. */
  screen: string;
  tiles: { label: string; value: string; note?: string; tone?: "no" | "ok" }[];
  /** Table heading row; the last column is the status. */
  cols: [string, string, string, string];
  rows: [string, string, string, string][];
  /** Row whose status is acted on: its button, the status before (shown as waiting) and after (shown as done). */
  act: { row: number; button: string; after: string };
  /** One line that confirms what the system did after the action. */
  result: string;
};

export const MODULE_MOMENTS: Record<string, ModuleMomentData> = {
  sales: {
    screen: "Sales orders",
    tiles: [
      { label: "Sales today", value: "Rs 24.6 L", note: "▲ 12% vs target pace", tone: "ok" },
      { label: "Collection today", value: "Rs 18.2 L", note: "▲ 8% vs yesterday" },
      { label: "Receivable over 60 days", value: "Rs 41.3 L", note: "6 customers need action", tone: "no" },
    ],
    cols: ["Order", "Customer", "Amount", "Status"],
    rows: [
      ["SO-1043", "Everest Builders", "Rs 8.4 L", "Waiting approval"],
      ["SO-1044", "Himal Hardware", "Rs 3.2 L", "Invoiced"],
      ["SO-1045", "Koshi Paints House", "Rs 5.7 L", "Delivered"],
      ["SO-1046", "Annapurna Builders", "Rs 2.1 L", "Quotation"],
    ],
    act: { row: 0, button: "Approve", after: "Approved" },
    result: "Approved: the challan is ready, stock is reserved and the salesperson is notified.",
  },
  purchase: {
    screen: "Purchase orders",
    tiles: [
      { label: "Open purchase orders", value: "12" },
      { label: "Due this week", value: "Rs 31.5 L" },
      { label: "Goods received, not billed", value: "3", tone: "no" },
    ],
    cols: ["PO", "Item", "Quantity", "Status"],
    rows: [
      ["PO-0384", "Acrylic resin", "1,300 kg", "Draft"],
      ["PO-0381", "Titanium dioxide", "4,500 kg", "LC opened"],
      ["PO-0382", "Tin container 20 L", "400 pcs", "Received"],
      ["PO-0383", "Pigment paste, blue", "730 kg", "Approved"],
    ],
    act: { row: 0, button: "Send", after: "Sent to vendor" },
    result: "Sent: the vendor has the PO by email, and goods received will post at true landed cost.",
  },
  inventory: {
    screen: "Stock by godown",
    tiles: [
      { label: "Items below reorder", value: "5", tone: "no" },
      { label: "Inventory days", value: "48", note: "Target 40" },
      { label: "Stock accuracy", value: "99.1%", tone: "ok" },
    ],
    cols: ["Item", "Godown", "In stock", "Status"],
    rows: [
      ["Titanium dioxide", "Main godown", "3,100 kg", "Below reorder"],
      ["Acrylic resin", "Main godown", "5,900 kg", "OK"],
      ["Tin container 20 L", "Packing store", "600 pcs", "OK"],
      ["Pigment paste, blue", "Plant store", "120 kg", "Below reorder"],
    ],
    act: { row: 0, button: "Raise PR", after: "PR raised" },
    result: "Purchase request raised from the reorder policy and sent to the Purchase desk.",
  },
  "customer-services": {
    screen: "Service requests",
    tiles: [
      { label: "Open complaints", value: "7", note: "▼ 4 this week", tone: "ok" },
      { label: "Resolution time", value: "1.8 days" },
      { label: "Repeat complaints", value: "2", tone: "no" },
    ],
    cols: ["Request", "Customer", "Subject", "Status"],
    rows: [
      ["SR-0215", "Himal Hardware", "Shade mismatch", "Open"],
      ["SR-0216", "Koshi Paints House", "Late delivery", "In progress"],
      ["SR-0217", "Annapurna Builders", "Repair visit", "Scheduled"],
      ["SR-0218", "Lalitpur Paint Centre", "Scheme query", "Resolved"],
    ],
    act: { row: 0, button: "Resolve", after: "Resolved" },
    result: "Resolved: the customer is informed and the resolution time counts on the team's KPIs.",
  },
  transport: {
    screen: "Dispatch register",
    tiles: [
      { label: "Dispatches today", value: "14" },
      { label: "On-time delivery", value: "91%", note: "Target 95%" },
      { label: "Freight payable", value: "Rs 2.3 L" },
    ],
    cols: ["Challan", "Customer", "Vehicle", "Status"],
    rows: [
      ["DN-2201", "Himal Hardware", "Own van 4512", "Loaded"],
      ["DN-2202", "Koshi Paints House", "Hired transporter", "In transit"],
      ["DN-2203", "Annapurna Builders", "Own truck 7720", "Delivered"],
      ["DN-2204", "Pokhara Paint Depot", "Hired transporter", "Planned"],
    ],
    act: { row: 0, button: "Mark delivered", after: "Delivered" },
    result: "Delivered: the trip closes, the invoice is ready and the customer gets it by email.",
  },
  finance: {
    screen: "Vouchers",
    tiles: [
      { label: "Cash and bank", value: "Rs 1.36 Cr", note: "After 7-day dues" },
      { label: "Receivable days", value: "42" },
      { label: "Payable days", value: "38" },
    ],
    cols: ["Voucher", "Party", "Amount", "Status"],
    rows: [
      ["PV-0455", "Supplier payment", "Rs 3.4 L", "Waiting approval"],
      ["RV-0912", "Himal Hardware", "Rs 6.1 L", "Posted"],
      ["JV-0120", "Depreciation", "Rs 0.8 L", "Posted"],
      ["CN-0031", "Koshi Paints House", "Rs 0.4 L", "Posted"],
    ],
    act: { row: 0, button: "Approve", after: "Posted" },
    result: "Posted: the ledgers, cash position and payables update at once, with the full audit trail.",
  },
  "fixed-assets": {
    screen: "Asset register",
    tiles: [
      { label: "Assets in register", value: "128" },
      { label: "Book value", value: "Rs 2.7 Cr" },
      { label: "Depreciation this year", value: "Rs 31.2 L" },
    ],
    cols: ["Asset", "Category", "Book value", "Status"],
    rows: [
      ["R-1 Refining Line", "Plant & machinery", "Rs 84.0 L", "Depreciation due"],
      ["PK-1 Pouch FFS", "Plant & machinery", "Rs 22.5 L", "Posted"],
      ["Delivery van 4512", "Vehicles", "Rs 18.2 L", "Posted"],
      ["Office server", "Computers", "Rs 3.1 L", "Posted"],
    ],
    act: { row: 0, button: "Post depreciation", after: "Posted" },
    result: "Depreciation posted to the ledger and the asset schedule updated.",
  },
  "trade-finance": {
    screen: "Letters of credit",
    tiles: [
      { label: "LC limit used", value: "72%" },
      { label: "Headroom", value: "Rs 1.4 Cr" },
      { label: "Short-term loan headroom", value: "9%", tone: "no" },
    ],
    cols: ["LC", "Goods", "Value", "Status"],
    rows: [
      ["LC-083/12", "Titanium dioxide", "USD 58,600", "Documents received"],
      ["LC-083/11", "LED bulbs and MCBs", "USD 41,200", "Accepted"],
      ["LC-083/10", "Acrylic resin", "USD 23,900", "Settled"],
      ["LC-083/13", "Tin plate", "USD 18,400", "Opened"],
    ],
    act: { row: 0, button: "Accept", after: "Accepted" },
    result: "Accepted: the maturity is on the calendar, the margin held is updated and the bank limit shows its headroom.",
  },
  "tax-ird": {
    screen: "Sales invoices to IRD",
    tiles: [
      { label: "Output VAT", value: "Rs 12.4 L" },
      { label: "Input VAT", value: "Rs 9.1 L" },
      { label: "VAT payable", value: "Rs 3.3 L" },
    ],
    cols: ["Invoice", "Customer", "VAT", "Status"],
    rows: [
      ["SI-2083/84-00413", "Koshi Paints House", "Rs 74,100", "Ready"],
      ["SI-2083/84-00412", "Himal Hardware", "Rs 41,600", "Synced, locked"],
      ["SI-2083/84-00411", "Everest Builders", "Rs 1,09,200", "Synced, locked"],
      ["SI-2083/84-00410", "Annapurna Builders", "Rs 27,300", "Synced, locked"],
    ],
    act: { row: 0, button: "Issue", after: "Synced, locked" },
    result: "Issued: VAT posts to the VAT books and Annex 13, the bill reaches IRD and is locked for good.",
  },
  reports: {
    screen: "Reports Centre",
    tiles: [
      { label: "Reports", value: "136" },
      { label: "Saved views", value: "12" },
      { label: "Opened today", value: "9" },
    ],
    cols: ["Report", "Module", "Period", "Status"],
    rows: [
      ["Receivable ageing", "Sales", "Kartik 2083", "Run"],
      ["Stock summary", "Store", "Kartik 2083", "Ready"],
      ["Trial balance", "Finance", "FY 2083/84", "Ready"],
      ["VAT book", "Tax & IRD", "Kartik 2083", "Ready"],
    ],
    act: { row: 0, button: "Open", after: "Ready" },
    result: "Ready in seconds, with every figure drilling down to the voucher behind it.",
  },
};
