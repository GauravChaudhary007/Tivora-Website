# TiVora ERP, Jewelry edition: what hands-on use of the app showed (2083-06-21 BS / 2026-10-07 AD)

Companion to APP-MAP-JEWELRY.md. I opened forms, lists, boards and dashboards in the Jewelry company on dev.tivoraerp.com and never pressed save or finalize, so nothing was changed.

## How every screen behaves
Lists have status filter chips, Rows per page, Export, Columns and a "+ New ... (F3)" button. Forms have "Finalize (F2)", Cancel, "More" and a "Panel (F8)". Dates show BS and AD together. Amounts use Nepali grouping (Rs 9,30,580.86). Any menu entry can be starred as a favourite. Ctrl K searches the menu, F1 gives help for the screen, and there are notifications and a dark theme. Home shows "Namaste, Jewelry", START WITH shortcuts (Jewelry Sales, Board Rate, Jewelry Purchase Invoice, Karigar Issue, Cash / Bank Voucher, Day Book), the module cards with entries / masters / reports counts, and "Recently opened". `/dashboards` has one dashboard per module with open, critical and late counts.

## Board Rate (/board-rate): the rate behind every jewelry document
Each metal has a sales rate and a purchase rate (Rs per gram), for Gold 24K fine and Silver 999 fine. Purity rates follow: base rate x purity % + the grade's offset (Gold 24K 100%, 22K 91.667%, 20K 83.333%, 18K 75%, 15K 62.5%, Silver 999 99.9%). "Save & publish board rate", plus a rate history register. The page says which rate each entry takes:
- Sales rate: jewellery sales bill, sales invoice, quotation, sales order, customer order, savings-scheme gold credited on instalments.
- Purchase rate: jewellery purchase invoice, purchase order, old gold purchase, old metal taken in on a sales bill, stock opening, karigar work order, and stock valuation / metal position on dashboards.
- A saved document keeps the rate it was saved with. The Work Desk raises a CRITICAL item when today's board rate is not set: "Bills cannot price metal until today's is entered".

## Jewelry Sales (/pos/jewelry, new sale /pos/new/jewelry)
- The list shows invoice no., AD and BS dates, type, customer, status, items, VAT, total, payment (Paid / Unpaid / Overdue n d) and balance, with filters All / Unpaid / Partly paid / Overdue / Paid.
- A new sale sells by serial number. You scan or type the tag, or search in-stock pieces by serial, product or purity (for example "Diamond Earrings, Studs 18K, 18K, 3.940 g"). The piece carries its preset retail figures. Alternatively a new or negative-inventory serial can be created at the counter, for stock physically present but not yet formally entered.
- Customer defaults to walk-in. There is "+ New customer", agent, salesman, due days and tags.
- Old Gold / Silver Exchange: pick the product handed over, gross weight or quantity, purity, impurity %, rate. A raw metal brings its purity and today's board rate. The goods go into stock at the value credited and the credit comes off the bill.
- Receipt & adjustment: total bill value, net bill amount, balance. A sale must settle against a customer (cash, bank, earlier receipts and advances, on account) or a cash/bank book. Saving without either is refused.
- Related: Jewelry Sales Return, Customer Orders, Goods on Approval, Counter Operations (day start), Quotation, Sales Orders, Delivery Note, Returnable Receipt, Price Lists, Discount Schemes, Counters / Tills.

## Karigar / Workshop
- Work Orders are "the spine every metal issue, material issue and finished-piece receipt hangs off". The list shows work order, ordered and due dates, karigar (including "Factory (In-house)"), expected pieces (such as 3 x 22K Gold Rings), metal issued, metal back and status (open, partially received, closed).
- Karigar Issue (new): why it is going out (Production, Repair, Maintenance, Sample); basis (against a work order, against finished goods, or direct material issue); making quoted (optional); karigar, work order, issue date, FROM godown (Main Store or Showroom Counter) TO Work In Progress. Lines are raw metal in grams at its purity, diamonds and stones in carats, components in pieces. Issues carry an Approved status.
- Also Production Receipt, Workshop Return, Scrap / Dust Recovery, Karigar Labour Settlements, Work-in-Progress, Karigar Reconciliation, the Karigars master, the fine-metal ledger and balance, and the Wastage (Ghat) Variance Register.

## Jewelry Factory (the floor)
- The Floor Board shows every open job bag in the department it is waiting for or at. Tiles: bags open (with rush and export), late, metal on the floor (grams), loss today against allowed, diamonds with setters (carats and grams), flasks (building, poured).
- Department columns in route order: CAD / CAM, Wax Tree & Mould, Casting (with loss %), Filing & Pre-polish, Diamond Bagging, Setting (with a named setter and packets), Final Polish, Rhodium / Plating, QC & tag, Ready to receive. Each bag shows number, design code, pieces, weight, at work or waiting, and days.
- Gate, Scan a Bag: scan the pouch label, weigh in or out (a scale can be connected), hand it over. The weight each department takes and gives back goes onto the bag's job card and the daily ghat register.
- Masters: Departments, Routes, Casting Alloys, Designs, Diamond Parcels, Packets with Setters. Reports: Daily Ghat Register, Casting Yield & Loss, Diamond Setting & Breakage Audit, WIP Floor Valuation, Job Bag Cost Register, Stage Throughput & Lateness.

## RFID
Overview: pieces in stock, tag coverage % (and how many have no tag), readers (fixed and handheld), reads today, counts open, open alerts. "Find a piece" by tag or serial. Exit-gate alerts: a piece read at the exit gate that the books say is in stock and not billed or on approval. Recent counts (for example "14 found, 1 missing, 0 out of place"), Readers & printers, RFID Read Log.

## Gold Loans
Entries: Gold Loans, Interest Accrual, Vault Count. Scheme master. Reports: loan book, overdue, LTV watch, interest and fee income, collections and payments, large cash transactions, custody register, auction register. The Work Desk raises "notice on a loan has run out, collect or auction" and "auction surplus owed to the borrower".

## Work Desk (/desk), the owner's morning
Greeting with BS and AD date and a 5-minute refresh. Module chips with counts (59 items in total), Wall Board, Customise. NEEDS YOU NOW: critical cards each with a one-click action (Review, Set today's rate, Open the driver, Pay the surplus, Open the loan, Resolve, Receive from Setting). Found today: a customer far over the credit limit, board rate not set, a driver's licence expired, an unpaid gold-loan auction surplus, a gold-loan notice run out, an RFID exit-gate read of an unsold piece, rush job bags late in Setting and Diamond Bagging. Below: MY WORK & COMING UP (Late / Today / This week / Snoozed) and NEEDS ATTENTION cards (team overdue to-dos with "open the performance board", karigar metal not back, supplier payments due).

## Executive Dashboard (/dashboards/executive)
Period tabs: Today, This month, Last month, Year to date. Sales against target with a running-total chart or table and the target pace; gross profit on tagged pieces; money received; customers owe (and who is over their credit limit); we owe (and what is late); cash and bank split; stock on hand at cost with metal at market; gold position (grams in stock and with karigars); orders on hand; and "Where the work stands": open items on every module's desk.

## Control Panel (/control-panel)
Organisation (Company Profile, Companies, Branches, Fiscal Years, Currencies, Currency & Number Format, Go-live Checklist); Users & Security (Users, Roles & Permissions, Work Desk by Role, Work Desk follow-up, Session Activity, Business Audit Log); Documents (Numbering, Document Designer, Custom Fields); Workflow & Alerts (Approvals, Alerts & Reminders); Accounting & Tax; Module Settings, including the add-on "Jewellery pack" (Jewellery Settings, Karigar / Workshop, Jewelry Factory, Gold Loans); Data & System (Import from Excel, Backup & Database Health, Recalculate Balances, Subscription & Licence, Help & About). Some items carry plan badges (Business, Enterprise).

## Problems seen in the dev app (for HiTech)
- `/factory/bags` (Job Bags) and `/gold-loans` (Gold Loans list) showed "This screen could not be shown" (Minified React error #441) when opened directly by URL.
- `/reports/metal-position` stayed on "Opening..." during my check.
- These may be intermittent. The customer, karigar and supplier names in the data are demo records and must never appear on the public site.

## Still to read
Paint and Trading companies. Material Planning and Maintenance do not appear on this Jewelry company's Home; the brochure lists them for the platform.
