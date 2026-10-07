// One entry per business module that has its own page (/modules/<slug>/). Adding a module (Planning, Maintenance,
// Production, ...) is ONE entry here: the route, sitemap, menu, footer and /modules card links all read this list.
// Source: docs/APP-MAP-MODULES-JEWELRY.md (live Jewelry edition). Rules: no customer, supplier or karigar names, no sample
// figures presented as results, no counts of modules, no AI, IRD-certified or price claims.
import type { IconName } from "./modules";
import type { ScreenSlug } from "./screens";

export type ModuleGroup = "Core modules" | "Jewellery pack";
export type Highlight = { icon: IconName; title: string; what: string; why: string };
export type ModulePage = {
  slug: string;
  /** App name, used as the page's h1 and in the menu. */
  name: string;
  group: ModuleGroup;
  icon: IconName;
  tagline: string;
  /** One-line label for the header menu. */
  short: string;
  /** Page <meta description>. */
  description: string;
  forWho: string[];
  highlights: Highlight[];
  workflow: { title: string; detail: string }[];
  reports: string[];
  /** What the Work Desk tells you for this module. */
  alerts: string[];
  /** Slugs of other module pages. */
  connectsTo: string[];
  screen?: ScreenSlug;
  /** The matching entry in modules.ts when its slug differs (used by the /modules cards). */
  indexSlug?: string;
};

export const GROUPS: ModuleGroup[] = ["Core modules", "Jewellery pack"];

export const modulePages: ModulePage[] = [
  {
    slug: "sales", name: "Sales & Accounts Receivable", group: "Core modules", icon: "ReceiptText",
    short: "Billing, orders, receipts, dues",
    tagline: "Billing at the counter, orders and estimates, receipts, and what customers owe.",
    description: "Counter billing by tag or serial, old gold taken in on the bill, customer orders with advances, goods on approval, till control, discounts and receivables, in TiVora ERP.",
    forWho: ["Counter staff", "Cashier", "Sales manager", "Credit control"],
    highlights: [
      { icon: "Tag", title: "Bill by tag or serial, old gold on the same bill", what: "Scan the piece and its weight, purity and rate come with it. Old metal taken in is valued on the same bill.", why: "Nobody re-keys weight or rate at the counter, and exchange credit comes off the bill by itself." },
      { icon: "ClipboardList", title: "Customer orders that stay traceable", what: "An order runs to a workshop order, a receipt and then the invoice on delivery. The list shows estimated weight and value, advance taken, linked work orders and the promised date.", why: "Custom pieces are never lost, and an advance is held as an advance, not counted as a sale." },
      { icon: "Eye", title: "Goods on approval", what: "Pieces out with a customer to consider stay in stock and in valuation, with issued, returned and sold counts and a due-back date.", why: "Pieces on trial are tracked, and late returns are chased." },
      { icon: "Banknote", title: "Counter operations and till control", what: "Each till drawer is its own cash ledger. Closing a shift books any difference to Cash Over / Short and moves the rest to the vault, both as real vouchers.", why: "A shortfall is owned and visible, not buried in the day's cash." },
      { icon: "Percent", title: "Discount schemes with rules", what: "A percentage off, or buy some and get some free, by product, group, named customers or party category. The bill shows the rate and what came off.", why: "Discounts are governed and visible instead of typed over the price." },
      { icon: "ShieldCheck", title: "Below-floor sales and credit overrides", what: "A report of every sale under the floor price and a register of every temporary credit-limit exception with who approved it.", why: "The owner sees the exceptions without asking for them." },
      { icon: "Gauge", title: "A sales dashboard that explains the bill", what: "Sales against target, gross margin on tagged pieces, quotations turned into orders, sales by category, how customers paid, and what the bills were made of: metal, making and wastage, stones.", why: "Know whether the month is on pace and where the margin comes from." },
    ],
    workflow: [
      { title: "Open the day at Counter Operations", detail: "Set the till and the opening cash for the shift." },
      { title: "Quote or take a customer order", detail: "Estimate weight and value, take an advance, set the promised date." },
      { title: "Bill by scanning tags", detail: "Add old-metal exchange on the same bill." },
      { title: "Settle the bill", detail: "Cash, bank, advance or on account." },
      { title: "Handle returns and approval conversions", detail: "Sales returns and goods on approval turn into sales or come back to stock." },
      { title: "Receive payments", detail: "Customer receipts are settled bill by bill." },
      { title: "Review ageing and overrides", detail: "Outstanding by age, credit exceptions and below-floor sales." },
    ],
    reports: ["Sales Register (product-wise)", "Below-floor Sales", "Salesperson Performance", "Outstanding and Ageing", "Customer Order Register", "Goods on Approval Register"],
    alerts: ["A customer far over the credit limit (critical)", "Board rate not set today", "Customer orders past the promised date", "Goods on approval past the due-back date"],
    connectsTo: ["inventory", "karigar", "finance", "tax-ird", "rfid", "customer-services"],
    screen: "sales-dashboard", indexSlug: "sales",
  },
  {
    slug: "purchase", name: "Purchase & Accounts Payable", group: "Core modules", icon: "ShoppingCart",
    short: "Orders, bills, stones, payables",
    tagline: "Buying stock: bills, orders, returns, old gold and loose stones, and paying for it.",
    description: "Purchase orders with compared quotations, goods receipt, old gold purchase, loose stone parcels, landed cost and payables, in TiVora ERP.",
    forWho: ["Purchase officer", "Accountant", "Owner"],
    highlights: [
      { icon: "Gem", title: "Metal, stones and general goods in one place", what: "Jewelry purchase invoice and return sit next to general purchase, with VAT handled on each.", why: "One place for buying, whatever the goods are." },
      { icon: "Coins", title: "Old gold purchase with its own register", what: "Scrap bought from customers and walk-ins is priced at the board purchase rate and has its own register and dashboard tile.", why: "Scrap buying is audited, not a side book." },
      { icon: "Layers", title: "Loose stone parcels counted twice", what: "A parcel is bought as one weight and set a few stones at a time, so both piece count and carat weight are tracked, with pieces left and carats left.", why: "Stones do not vanish between purchase and setting." },
      { icon: "Search", title: "Quotations compared before the order", what: "Requisition, request for quotation, supplier quotations and a comparison by quotation or by product lead to the purchase order.", why: "The price comparison is on file before money is committed." },
      { icon: "Ship", title: "Real landed cost for imports", what: "Receive from transit with damaged or short counts, and pool import costs such as LC charges and marine insurance against the order until they are brought onto the bill.", why: "Each line carries its true landed cost." },
      { icon: "FileCheck", title: "Goods received, not yet billed", what: "A report of what was received but not billed, with value at the receipt rate and age in days, tied to the ledger.", why: "Nothing sits received and unpaid without someone seeing it." },
      { icon: "Gauge", title: "Fine gold in and out", what: "The dashboard sets fine gold bought against fine gold that left in pieces sold, by month.", why: "See at a glance whether the metal position is growing or shrinking." },
    ],
    workflow: [
      { title: "Requisition", detail: "Ask for what is needed." },
      { title: "Request quotations", detail: "Send to several suppliers." },
      { title: "Compare and decide", detail: "Quotation comparison by quotation or by product." },
      { title: "Purchase order", detail: "Commit the order with its terms." },
      { title: "Goods receipt", detail: "Or a transit receipt for imports." },
      { title: "Supplier bill with import costs", detail: "Landed cost is built up per line." },
      { title: "Pay the supplier", detail: "Payment is settled bill by bill." },
    ],
    reports: ["Purchase Register", "Old Gold Purchase Register", "Goods Received Not Billed", "Landed Cost Sheet", "Payables Ageing", "Purchase Order Outstanding"],
    alerts: ["Supplier payments due and overdue", "Open purchase items running late"],
    connectsTo: ["inventory", "finance", "tax-ird", "trade-finance", "karigar"],
    indexSlug: "purchase",
  },
  {
    slug: "inventory", name: "Store & Inventory", group: "Core modules", icon: "Package",
    short: "Tags, hallmarking, audits, rates",
    tagline: "Items, today's rate, where stock is, and everything that moves it.",
    description: "Serial and tag stock, hallmarking, melting and refining, stock audit, godown transfers and purity grades priced from the board rate, in TiVora ERP.",
    forWho: ["Stock keeper", "Showroom manager"],
    highlights: [
      { icon: "BadgeCheck", title: "Hallmarking batches that come back", what: "Pieces away at the assay office stay the shop's stock. Each batch shows pieces away, hallmarked, rejected or lost, and a due-back date.", why: "An assay batch never becomes a silent hole in stock." },
      { icon: "Repeat", title: "Re-tag, split and merge with history", what: "A retired tag keeps its history and records what became of it. Cost follows the metal, and weight is conserved or the loss is declared.", why: "Serial history survives every change." },
      { icon: "FlaskConical", title: "Melting and refining that audits purity testing", what: "Metal goes out at an assumed purity and returns at an assayed one. The gap shows as refining loss or a hint that the counter is mis-testing.", why: "It checks the old-gold counter as well as the stock." },
      { icon: "ClipboardCheck", title: "Stock audit that does not touch stock until posted", what: "A draft records differences, shortages, excesses and serials missing. Posting writes the adjustments.", why: "Counts are reviewed before they reach the books." },
      { icon: "ArrowLeftRight", title: "Godown transfers that never rewrite history", what: "A transfer is a pure location move with a transfer receipt, in-transit ageing and a discrepancy report. Cancelling posts the reverse.", why: "Movements between showroom and store stay clean." },
      { icon: "Scale", title: "Purity grades priced from the board rate", what: "Grades such as 24K, 22K and silver are priced per gram from Board Rate, with a rate history register.", why: "Every item reprices from one rate, not from typed values." },
      { icon: "Gauge", title: "Stock valued against today's metal", what: "The dashboard shows jewelry at cost against metal at today's rate, with sell-through by category.", why: "See the gain over cost and what is actually selling." },
    ],
    workflow: [
      { title: "Bring pieces into stock", detail: "Opening stock or purchase, each with a tag." },
      { title: "Store in trays or showcases", detail: "Know the location of every piece." },
      { title: "Transfer between godowns", detail: "Move stock to the showroom with a receipt." },
      { title: "Send for hallmarking", detail: "Receive pieces back with certificates." },
      { title: "Re-tag, split, merge or melt", detail: "Each change keeps the history." },
      { title: "Audit stock periodically", detail: "Review differences, then post." },
      { title: "Value against the board rate", detail: "Compare cost with today's metal value." },
    ],
    reports: ["Serial / Tag Register", "Godown-wise Stock", "Stock Valuation and NRV", "Metal Open Position", "Hallmarking Register", "Melting and Refining Register"],
    alerts: ["Board rate not set (critical)", "Hallmarking batch past its due-back date", "Draft stock audits with serials missing"],
    connectsTo: ["purchase", "sales", "karigar", "rfid", "factory", "finance"],
    indexSlug: "inventory",
  },
  {
    slug: "karigar", name: "Karigar / Workshop", group: "Jewellery pack", icon: "Hammer",
    short: "Metal out, pieces back, labour",
    tagline: "Work orders, metal out to the bench, pieces back, wastage and labour.",
    description: "Metal issued to workshops in fine weight, wastage against allowance, production receipts, labour settlement with TDS and a full reconciliation, in TiVora ERP.",
    forWho: ["Workshop manager"],
    highlights: [
      { icon: "Scale", title: "One reconciliation of metal, material and labour", what: "Metal is settled in fine weight, material by what physically comes back, labour as money, and the three never mix. Each karigar shows open jobs, metal balance, material out, pieces made and labour due.", why: "One screen shows what every karigar holds and owes." },
      { icon: "ShieldCheck", title: "Wastage (Ghat) variance flagged per job", what: "Each receipt reckons its own wastage against the fine gold drawn, with allowed and actual grams and an over-allowance flag.", why: "Loss beyond allowance is caught job by job." },
      { icon: "Gem", title: "Finished pieces received with consumption", what: "A production receipt brings pieces into stock, takes material out of work in progress and records the making charge.", why: "Stock, work in progress and labour all update from one entry." },
      { icon: "Calculator", title: "Labour paid with TDS in one step", what: "A settlement holds the labour, the TDS withheld at the rate with or without PAN, the book it is paid from, and creates the payment voucher.", why: "Labour payment, tax and voucher are never separate jobs." },
      { icon: "MapPin", title: "Work in progress by location", what: "Metal and stones now with karigars, by location, product and purity, on-hand and fine weight. The in-house factory is treated as a karigar.", why: "Know exactly where the metal is." },
      { icon: "Repeat", title: "Scrap, dust and returns recovered", what: "Scrap and dust recovery and workshop returns post back into the fine metal ledger.", why: "Small recoveries are counted, not forgotten." },
      { icon: "Gauge", title: "Issued, received and lost against allowance", what: "The dashboard shows fine gold issued against received by day and month, loss by karigar with the allowance marked, and labour owed.", why: "Spot who is over allowance before settlement." },
    ],
    workflow: [
      { title: "Work order", detail: "From a customer order or for stock." },
      { title: "Issue metal and stones", detail: "From the main store to work in progress." },
      { title: "Bench work", detail: "The karigar makes the pieces." },
      { title: "Production receipt", detail: "Finished pieces and scrap come back." },
      { title: "Check the ghat variance", detail: "Actual loss against the allowance." },
      { title: "Settle labour with TDS", detail: "Payment voucher is created automatically." },
      { title: "Reconcile", detail: "Metal, material and money per karigar." },
    ],
    reports: ["Karigar Fine Metal Ledger", "Karigar Metal Balance", "Wastage (Ghat) Variance Register", "Work Order Outstanding", "Labour Settlement Register", "Issue / Receipt Register"],
    alerts: ["Karigar metal not back (needs attention)", "Jobs past their due date", "Loss over the allowance"],
    connectsTo: ["sales", "inventory", "factory", "finance", "tax-ird", "purchase"],
    indexSlug: "karigar",
  },
  {
    slug: "factory", name: "Jewelry Factory", group: "Jewellery pack", icon: "FlaskConical",
    short: "Job bags, casting, diamond packets",
    tagline: "Job bags weighed at every stage, casting flasks, diamond packets, QC and the loss audits.",
    description: "Job bags weighed at every gate, daily ghat register, casting yield per flask, diamond packets with setters and breakage audit, in TiVora ERP.",
    forWho: ["Factory manager"],
    highlights: [
      { icon: "Scale", title: "A daily ghat register by department", what: "Per department and per day: opening, received, handed on, scrap, dust, loss, allowed and closing. It reads from the weighed gates, so a rework never rewrites an earlier day.", why: "Loss is pinned to a department and a day." },
      { icon: "Gauge", title: "Casting yield and loss per flask", what: "Flask by flask: alloy, tree wax, metal required and poured, castings, buttons, loss and yield.", why: "Casting yield is measured per flask and per alloy." },
      { icon: "Gem", title: "Diamond packets with setters", what: "A setter returns stones as set, broken, rejected or loose, and the packet cannot close a stone short. Tiles show packets out, carats out and the oldest packet.", why: "Diamonds are accountable to the carat." },
      { icon: "ShieldCheck", title: "Setting and breakage audit", what: "Per packet, by setter and by sieve size: issued, set, broken and unaccounted, with within-norm or over-norm.", why: "See who breaks more than the norm and which sizes break." },
      { icon: "BadgeCheck", title: "Quality checks at each stage", what: "The dashboard shows stages completed, passed first time, rework and rejected, alongside loss against norms by department.", why: "Quality problems show up where they start." },
      { icon: "Coins", title: "Job bag cost and work in progress value", what: "A job bag cost register, valuation of work in progress on the floor and stage throughput and lateness.", why: "Know what is on the floor and what it is worth." },
    ],
    workflow: [
      { title: "Job bag from a design and route", detail: "Each bag follows its route." },
      { title: "Issue metal", detail: "Weighed out at the gate." },
      { title: "Wax tree and casting", detail: "Poured in a flask." },
      { title: "Filing, bagging and setting", detail: "Diamond packets go to setters." },
      { title: "Polish and plating", detail: "Weighed on every handover." },
      { title: "QC and tag", detail: "Rework or reject is recorded." },
      { title: "Receive into stock", detail: "The piece becomes tagged stock." },
    ],
    reports: ["Daily Ghat Register", "Casting Yield and Loss", "Diamond Setting and Breakage Audit", "Job Bag Cost Register", "Stage Throughput and Lateness"],
    alerts: ["Rush job bags late in a stage (critical)", "Packets waiting to be received from setting"],
    connectsTo: ["karigar", "inventory", "sales", "finance"],
    indexSlug: "manufacturing",
  },
  {
    slug: "rfid", name: "RFID", group: "Jewellery pack", icon: "ScanLine",
    short: "Tag counts and exit-gate alerts",
    tagline: "RFID tags on every piece, readers, counts in minutes and the exit-gate alert.",
    description: "RFID tagging, stock counts in minutes and exit-gate alerts for tagged pieces that leave unbilled, in TiVora ERP.",
    forWho: ["Stock controller"],
    highlights: [
      { icon: "Bell", title: "Exit-gate alerts", what: "A tagged piece read at the exit while the books say it is still in the shop: not billed, not on approval, not at the assay office or a karigar. One walk-out is one alert, and each is cleared with what was found.", why: "An unbilled piece cannot leave quietly." },
      { icon: "Tag", title: "Tag coverage you can see", what: "A tile shows the share of owned pieces carrying a tag and how many are without.", why: "You know how much stock the readers can protect." },
      { icon: "Search", title: "Counts closed in minutes", what: "A tray or showcase is counted and closes as found, missing or not expected. A missing piece stays open: find it or write it off.", why: "Counting stops being a day of work." },
      { icon: "Eye", title: "Silent readers are visible", what: "Readers and printers show whether each reader sent a read in the last 24 hours, with a full read log.", why: "A dead reader is noticed before it matters." },
      { icon: "Gauge", title: "Dashboard of tag activity", what: "Tags written by day, what the counts found, and exit-gate alerts by day.", why: "Trends in tagging and losses at a glance." },
    ],
    workflow: [
      { title: "Tag pieces and print labels", detail: "Each piece gets its own tag." },
      { title: "Place readers", detail: "At the counter and at the exit." },
      { title: "Count a tray or showcase", detail: "Done in minutes." },
      { title: "Review the result", detail: "Found, missing, not expected." },
      { title: "Resolve exit-gate alerts", detail: "Clear each with what was found." },
    ],
    reports: ["RFID Read Log", "Counts register", "Exit Gate Alerts", "Tag coverage", "Readers and printers"],
    alerts: ["Exit-gate read of an unsold piece (critical)", "Readers that have gone silent", "Pieces missing from a count"],
    connectsTo: ["inventory", "sales", "karigar"],
    indexSlug: "rfid",
  },
  {
    slug: "gold-loans", name: "Gold Loans", group: "Jewellery pack", icon: "LockKeyhole",
    short: "LTV, interest, custody, auctions",
    tagline: "Loans against pledged jewellery: valuation, interest, renewals, custody, notices and auctions.",
    description: "Loans against pledged jewellery with LTV watch, monthly interest accrual, custody register, vault count and auctions, in TiVora ERP.",
    forWho: ["Loan officer", "Owner"],
    highlights: [
      { icon: "Gauge", title: "LTV watch on every open loan", what: "For each loan: what is owed today against what the pledge is worth today, the loan-to-value ratio, the scheme's limit, and the payment needed to restore it.", why: "A gold price move reprices every pledge, and you see the weak ones first." },
      { icon: "Calculator", title: "Month-end interest in one run", what: "Interest earned and not yet paid is brought into the books at each month end. Each run lists its voucher and loans, and can be cancelled.", why: "Monthly income recognition without a spreadsheet." },
      { icon: "LockKeyhole", title: "Custody by safe and packet", what: "Each article is recorded by safe and packet with gross, net, tested purity, fine weight and the date it came into custody.", why: "You can say where every pledge is." },
      { icon: "ClipboardCheck", title: "Vault count", what: "Open the safe, find each packet and tick it. A missing packet stays on the count for someone to chase, and nothing is corrected by the count.", why: "Gaps are chased, not smoothed over." },
      { icon: "Banknote", title: "Large cash transactions flagged", what: "Cash at or above a threshold is listed with the borrower identity and voucher.", why: "Threshold reporting is ready when you need it." },
      { icon: "Clock", title: "Notices, auctions and surplus", what: "Overdue loans move to notices and auction, and any surplus is payable to the borrower. The loan book, overdue, collections and auction registers keep the trail.", why: "Every step from default to auction is recorded." },
    ],
    workflow: [
      { title: "Value and pledge", detail: "The article goes into a safe packet." },
      { title: "Issue the loan under a scheme", detail: "Rate and LTV come from the scheme." },
      { title: "Accrue interest monthly", detail: "One run at each month end." },
      { title: "Collect or renew", detail: "Payments and renewals post to the loan." },
      { title: "Send notices when overdue", detail: "The notice trail is kept." },
      { title: "Auction if needed", detail: "Surplus is payable to the borrower." },
      { title: "Count the vault", detail: "Tick each packet." },
    ],
    reports: ["Loan Book", "Overdue", "LTV Watch", "Interest and Fee Income", "Custody Register", "Auction Register"],
    alerts: ["Unpaid auction surplus (critical)", "A loan notice that has run out", "A loan waiting to be opened"],
    connectsTo: ["finance", "inventory", "tax-ird"],
    indexSlug: "gold-loans",
  },
  {
    slug: "customer-services", name: "Customer Services", group: "Core modules", icon: "HeartHandshake",
    short: "Schemes, repairs, occasions",
    tagline: "Savings schemes, repairs and the dates that bring customers back.",
    description: "Savings schemes with enrolments, repair and service tracking for customers' own articles, and occasion lists, in TiVora ERP.",
    forWho: ["Front desk", "Showroom manager"],
    highlights: [
      { icon: "Repeat", title: "Savings schemes with terms that stay fixed", what: "Terms live in the scheme and are copied onto each enrolment, so changing an offer never rewrites what an existing customer signed up to.", why: "Customers keep the terms they joined on." },
      { icon: "Banknote", title: "Instalments as ordinary receipts", what: "Each instalment is a receipt against the customer's own ledger, so the money ages and settles like any other balance. Tiles show running schemes, money held and members behind.", why: "No separate book to reconcile." },
      { icon: "Hammer", title: "Repairs held, never mistaken for stock", what: "Customers' own articles are recorded to prove what is held, whose it is and when it was promised back. That metal is never stock and never reaches the balance sheet.", why: "Clean books and a clear promise to the customer." },
      { icon: "Bell", title: "Dates that bring customers back", what: "A birthdays and anniversaries report with a consent flag, so only customers who agreed are contacted.", why: "Outreach that respects consent." },
    ],
    workflow: [
      { title: "Define the scheme", detail: "Instalments, bonus and how it accrues." },
      { title: "Enrol the customer", detail: "Terms are copied onto the enrolment." },
      { title: "Collect instalments", detail: "Each one is a receipt." },
      { title: "Mature and redeem", detail: "Redeemed against a bill." },
      { title: "Take in a repair", detail: "Record the article and the promised date." },
      { title: "Hand back", detail: "Bill the repair if needed." },
    ],
    reports: ["Scheme Enrolment Register", "Repair Register", "Birthdays and Anniversaries"],
    alerts: ["Repairs past the promised date", "Scheme members behind on payments"],
    connectsTo: ["sales", "finance"],
    indexSlug: "customer-services",
  },
  {
    slug: "transport", name: "Transport & Delivery", group: "Core modules", icon: "Truck",
    short: "Dispatch, trips, freight bills",
    tagline: "Dispatch, own vehicles and trips, hired transporters and their freight bills.",
    description: "Dispatch, own vehicle trips, hired transporter freight bills, consignment tracking and document expiry, in TiVora ERP.",
    forWho: ["Dispatch", "Store keeper", "Accountant"],
    highlights: [
      { icon: "Truck", title: "Own vehicle trips with documents", what: "Every trip records the documents carried and the driver's advance, and settles to the vehicle's cost centre. A trip opens from an own-vehicle row on any document.", why: "Vehicle cost is known per trip." },
      { icon: "Banknote", title: "Freight bills from hired transporters", what: "Freight bills, freight payable, a transporter statement and freight cost per customer.", why: "Know what freight is owed and what each customer costs." },
      { icon: "Clock", title: "Consignments without a receipt", what: "Pending CN / LR lists consignments out with no receipt, with a count overdue past the expected day.", why: "Chase deliveries before the customer does." },
      { icon: "Bell", title: "Vehicle and driver document expiry", what: "Licence and permit expiry is tracked with a report.", why: "No vehicle leaves with an expired document." },
      { icon: "Gauge", title: "A delivery dashboard", what: "Out for delivery, overdue, trips running own against hired, freight and unbilled freight, with late deliveries worst first.", why: "See the delivery day at a glance." },
    ],
    workflow: [
      { title: "Delivery note", detail: "With a delivery details block." },
      { title: "Choose own or hired", detail: "Vehicle or transporter." },
      { title: "Dispatch", detail: "Record the CN / LR number." },
      { title: "Confirm delivery", detail: "Close the consignment." },
      { title: "Freight bill", detail: "Bill from the hired transporter." },
      { title: "Settle the trip", detail: "Own-vehicle cost goes to its cost centre." },
    ],
    reports: ["Dispatch Register", "Pending CN / LR", "Vehicle Trip Register", "Document Expiry", "Freight Payable", "Freight Cost per Customer"],
    alerts: ["A driver's licence expired (critical)", "Deliveries overdue", "Unbilled freight"],
    connectsTo: ["sales", "purchase", "finance"],
    indexSlug: "transport",
  },
  {
    slug: "finance", name: "Finance & Accounts", group: "Core modules", icon: "Scale",
    short: "Vouchers, books, final accounts",
    tagline: "Vouchers, books, cheques and the final accounts.",
    description: "Automatic and manual vouchers, trading account by metal, cheque register, bank reconciliation, exceptions review and year-end close, in TiVora ERP.",
    forWho: ["Accountant", "Owner"],
    highlights: [
      { icon: "Repeat", title: "Subledger events post themselves", what: "Cash and bank vouchers show whether they are automatic or manual and link to the source document, such as a payment voucher raised by a workshop settlement with the TDS line split out.", why: "Fewer manual entries and a trail back to the source." },
      { icon: "Gem", title: "Trading account by metal", what: "Sales, returns, opening stock, purchases including old metal, pieces from the workshop and landed cost, split into gold, silver, stones and diamonds, and other goods.", why: "A jeweller's own gross-profit view, not a generic P&L." },
      { icon: "FileCheck", title: "Cheque register and bank reconciliation", what: "Cheques received not yet cleared and issued not yet presented, with days to maturity. The reconciliation statement ties the book balance to the bank.", why: "Post-dated cheques never surprise the cash position." },
      { icon: "ShieldCheck", title: "An exceptions report for the finance manager", what: "Checks for what a finance manager would stop and ask about: cash or bank below zero, credit sales past the limit, guarantees expiring, withheld tax without a bill reference, taxable sales with no VAT.", why: "Errors are found before filing, not after." },
      { icon: "CalendarClock", title: "Year-end close with a lock", what: "Stock is recognised at year end, closing is posted, books are closed through a date and the year is locked, with a warning of interim stock entries the close would replace.", why: "A guided, locked year-end." },
      { icon: "ChartColumn", title: "The full set of final accounts", what: "Trial balance, profit and loss, balance sheet, cash flow, equity changes, funds flow, ratios, monthly comparison, budget against actual, cost centre and branch results.", why: "Everything the auditor and the owner ask for." },
    ],
    workflow: [
      { title: "Documents post automatically", detail: "Sales, purchase, workshop and loans." },
      { title: "Manual vouchers for the rest", detail: "Receipt, payment, receipt and payment, contra." },
      { title: "Bank book and reconciliation", detail: "Tie the books to the statement." },
      { title: "Cheque register", detail: "Track received and issued cheques." },
      { title: "Review exceptions", detail: "Clear every finding." },
      { title: "Month-end reports", detail: "Trial balance, P&L, balance sheet." },
      { title: "Year-end close and lock", detail: "Stock recognised, books locked." },
    ],
    reports: ["Day Book", "Trial Balance", "Trading Account by Metal", "Profit and Loss", "Balance Sheet", "Exceptions"],
    alerts: ["Finance checks surface through the Exceptions report", "Cash or bank going below zero", "Credit sales let past the limit"],
    connectsTo: ["sales", "purchase", "fixed-assets", "trade-finance", "tax-ird"],
    screen: "finance-dashboard", indexSlug: "finance",
  },
  {
    slug: "fixed-assets", name: "Fixed Assets", group: "Core modules", icon: "Building2",
    short: "Register, depreciation, disposals",
    tagline: "The asset register, depreciation, disposals and the asset schedule.",
    description: "Asset register with book and tax basis, depreciation posting, disposals with gain or loss and the fixed asset schedule, in TiVora ERP.",
    forWho: ["Accountant", "Owner"],
    highlights: [
      { icon: "ClipboardList", title: "A register with book and tax basis", what: "Each asset has a code, category, location, in-use date, cost, accumulated depreciation, carrying amount, book basis and tax pool.", why: "One register serves the books and the tax computation." },
      { icon: "Calculator", title: "Post depreciation each period", what: "Depreciation is posted from the register, with a count of what is not yet posted.", why: "Profit is not overstated and the register does not drift from the books." },
      { icon: "Bell", title: "A needs-attention list with reasons", what: "Unposted depreciation, fully depreciated assets still held, assets with no location, and disposals this year, each with why it matters.", why: "An asset with no location cannot be found at a physical count." },
      { icon: "Banknote", title: "Disposals post gain or loss", what: "Disposing of an asset records the gain or loss in the books.", why: "No manual calculation at year end." },
      { icon: "Percent", title: "Assets feed the tax computation", what: "The income tax computation adds back book depreciation.", why: "Tax follows the asset register." },
    ],
    workflow: [
      { title: "Register the asset", detail: "With category and tax pool." },
      { title: "Depreciate each period", detail: "Post from the register." },
      { title: "Dispose when needed", detail: "Gain or loss is posted." },
      { title: "Produce the schedule", detail: "Net block by class for the audit." },
    ],
    reports: ["Fixed Asset Schedule", "Asset register", "Needs-attention list"],
    alerts: ["Depreciation not yet posted", "Assets with no location recorded"],
    connectsTo: ["finance", "tax-ird", "purchase"],
    indexSlug: "fixed-assets",
  },
  {
    slug: "trade-finance", name: "Trade & Finance", group: "Core modules", icon: "Landmark",
    short: "LC, import loans, guarantees",
    tagline: "Bank guarantees, foreign-currency settlements, letters of credit and import trade finance.",
    description: "Letters of credit, import loans, advance remittances, month-end revaluation, bank guarantees and facility headroom, in TiVora ERP.",
    forWho: ["Accountant", "Treasury manager"],
    highlights: [
      { icon: "Globe", title: "Letters of credit, application to retirement", what: "An LC starts from the import order and is followed through to retirement.", why: "The whole import chain is on one trail." },
      { icon: "Banknote", title: "Import loans with interest handled", what: "Trust receipt loans are drawn at LC retirement. Interest at the bank's base rate plus the loan's spread is debited at each month end, with penal interest after the due date and grace.", why: "No spreadsheet for loan interest." },
      { icon: "Clock", title: "Advance remittances with the regulatory clock", what: "Money sent before the goods is tracked against the central bank's 90-day clock to the customs declaration, with collections and a compliance report.", why: "Deadlines are watched for you." },
      { icon: "ArrowLeftRight", title: "Month-end revaluation that reverses itself", what: "One journal books unrealised exchange gain or loss and is reversed automatically on the first.", why: "Foreign-currency balances are right at every month end." },
      { icon: "ShieldCheck", title: "Bank guarantees off the ledger", what: "Security held and guarantees issued are tracked but not posted to the ledger. Tiles show contingent liability, expiring soon and past expiry.", why: "Contingent exposure is visible, not hidden." },
      { icon: "Gauge", title: "Facility headroom and exposure", what: "Reports on facility utilisation and headroom, margin held, maturity calendar, foreign-currency exposure and landed cost per consignment.", why: "Know how much bank room is left." },
    ],
    workflow: [
      { title: "Set up banks and facilities", detail: "Limits and margins." },
      { title: "Raise the import order", detail: "From purchase." },
      { title: "Open an LC or send an advance", detail: "Each is tracked." },
      { title: "Ship and retire", detail: "Draw an import loan if needed." },
      { title: "Cost the consignment", detail: "Landed cost per consignment." },
      { title: "Revalue at month end", detail: "One journal, reversed next day." },
      { title: "Watch the maturity calendar", detail: "Nothing falls due unseen." },
    ],
    reports: ["LC Register", "Import Loan Register and Interest Due", "Maturity Calendar", "Facility Headroom", "Bank Guarantee Register", "Landed Cost per Consignment"],
    alerts: ["Guarantees expiring soon or past expiry", "Loans due in the next days", "Overdue instalments"],
    connectsTo: ["purchase", "finance", "tax-ird"],
    indexSlug: "trade-finance",
  },
  {
    slug: "tax-ird", name: "Tax & IRD", group: "Core modules", icon: "FileText",
    short: "VAT, Annex 9 and 13, TDS, CBMS",
    tagline: "VAT, Annex 9 and 13, TDS, income tax and the IRD connection.",
    description: "Annex 9 VAT return, VAT reconciliation, Annex 13 books, TDS, income tax computation and CBMS-ready invoice data, in TiVora ERP.",
    forWho: ["Accountant", "Tax consultant"],
    highlights: [
      { icon: "FileText", title: "Annex 9 VAT return built from the books", what: "Boxes for taxable sales, zero-rated exports, exempt sales and returns, then purchases and imports, net output against input VAT and the credit carried forward.", why: "The return comes from the books instead of being rebuilt by hand." },
      { icon: "FileCheck", title: "VAT reconciliation by month", what: "Registers are compared with the VAT ledgers by BS month, with differences and a list of VAT postings that have no registered document.", why: "A difference is found before filing." },
      { icon: "Layers", title: "Annex 13 books and VAT registers", what: "Sales, purchase and customs VAT registers, Annex 13 books and a monthly VAT report.", why: "The statutory books are ready when asked." },
      { icon: "ShieldCheck", title: "CBMS-ready invoice data", what: "Each sales invoice and return shows the figures its CBMS payload would carry (taxable, VAT, excise, export, exempt) with a sync status, plus a billing audit register.", why: "Invoice data is checked in the shape the IRD expects." },
      { icon: "Percent", title: "TDS sections with and without PAN", what: "TDS sections hold the rates with and without PAN, such as workshop labour. TDS report and TDS by party follow.", why: "The right rate is applied without lookup." },
      { icon: "Eye", title: "Parties above a value, strictly by PAN", what: "Sales and purchase above a threshold list parties by PAN.", why: "Threshold reporting is a report, not a project." },
      { icon: "Calculator", title: "Income tax computation", what: "Accounting profit, depreciation added back, taxable income and tax, less TDS and advance tax, with closing stock valued from inventory.", why: "A clean start to the annual computation." },
    ],
    workflow: [
      { title: "Set tax groups and TDS sections", detail: "Rates once, used everywhere." },
      { title: "Documents carry VAT and TDS", detail: "Computed on each bill." },
      { title: "Run the monthly VAT report", detail: "And reconcile it." },
      { title: "Produce the Annex 13 books", detail: "Sales and purchase." },
      { title: "File from the Annex 9 return", detail: "Boxes from the registers." },
      { title: "Check CBMS sync status", detail: "Per invoice." },
      { title: "Compute income tax", detail: "At year end." },
    ],
    reports: ["Annex 9", "Annex 13", "VAT Reconciliation", "CBMS Totals", "TDS by Party", "Income Tax Computation"],
    alerts: ["Taxable sales with no VAT (flagged by the Exceptions report)", "Open tax items awaiting review"],
    connectsTo: ["sales", "purchase", "karigar", "finance", "trade-finance"],
    indexSlug: "tax",
  },
];

export const modulePageBySlug = (slug: string) => modulePages.find((m) => m.slug === slug);
/** The /modules card for an entry in modules.ts links to its page when one exists. */
export const pageHrefForIndexSlug = (indexSlug: string) => {
  const m = modulePages.find((p) => (p.indexSlug ?? p.slug) === indexSlug);
  return m ? `/modules/${m.slug}/` : null;
};
