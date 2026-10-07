# TiVora ERP, Jewelry edition: module-by-module notes for marketing pages (read 2083-06-21 BS / 2026-10-07 AD)

Method: read-only. I opened each module hub, its dashboard (/dashboards/<name>), and 2 to 6 of its list, form-intro and report pages in the Jewelry demo company on dev.tivoraerp.com. I saved nothing and created no records, so there is no "What happened when I tried it" section and no "Test records created" list (see the last section). Companion files: APP-MAP-JEWELRY.md, APP-MAP-JEWELRY-DETAILS.md (they cover Home, Board Rate, Jewelry Sales form, Karigar Work Orders and Issue form, Factory board and gate, RFID overview, Gold Loans hub, Work Desk, Executive Dashboard, Control Panel; not repeated here).

Conventions seen everywhere: BS and AD dates side by side; Nepali digit grouping; every list has status chips, Export, Columns, "+ New (F3)"; report pages have List / Pivot / Graph, Filter, Group, Sort, Sum, Formula, Templates, Export and "Print all". Every dashboard has Today / This month / Last month / Year to date, "Trend & analytics", "My work", "Critical", an outstanding or ageing tab, and refreshes every 5 minutes. Tiles drill down to the register behind them. Names of people and firms in the demo data must not be used on the public site; amounts below are described, not quoted.

---

## 1. Sales & Accounts Receivable  (/home/sales, /dashboards/sales)
1. One-liner: "Billing at the counter, orders and estimates, receipts, and what customers owe."
2. For: counter staff, cashier, sales manager, credit control. 14 entries, 10 masters, 18 reports.
3. Highlights
   - Sell by serial or tag, with old gold taken in on the same bill (details file). Why: the counter never re-keys weight, purity or rate, and exchange credit comes off the bill automatically.
   - Customer Orders run order, karigar work order, receipt, invoice on delivery. The list shows estimated weight, estimated value, advance taken, linked work orders and a promised date flagged "overdue". Money taken before the piece exists is "held as an advance, not counted as a sale". Why: custom jewellery orders stay traceable and advances are not mistaken for revenue.
   - Goods on Approval: "the shop's own pieces, out with a customer to consider. Still stock, still valued, just not on the premises." Tiles: pieces out, value out (quoted), past due back; statuses Issued, Partly returned, Closed with Out / Returned / Sold counts and a due-back date. Why: pieces on trial are never lost track of, and late returns are chased.
   - Counter Operations: each till drawer is its own cash ledger; closing a shift books any difference to Cash Over / Short and sweeps the rest to the vault, "both as real vouchers". Shift history shows counted, expected, variance. Why: cash shortfalls are owned, not buried.
   - Discount Schemes: a percentage off, or Buy X get Y free, by product, group, named customers or party category. A percentage sets the rate of an Add/Less term so the bill shows the rate and what came off; free goods leave stock and post at cost to Free Goods. Why: discounts are governed and visible, not typed over the price.
   - Below-floor Sales report and Temporary Credit Limits & Overrides register. Why: the owner sees every sale under the floor price and every credit-limit exception and who approved it.
   - Sales dashboard: sales against a target with "ahead of pace by" figure, gross margin on tagged pieces, "Quotations turned into orders: n of m" with value still quoted, sales by category (bangles, earrings, necklaces), "What the jewellery bills were made of" (metal value vs making and wastage vs stones and diamonds), how customers paid, top customers, outstanding and ageing tab.
   - Jewelry Sales Return and Sales Return, bill-wise settlement of receipts against invoices, interest on overdue receivables, customer advances and deposits.
4. Workflow: (1) Day start at Counter Operations, (2) quote or take a customer order, (3) bill by scanning tags, add old-metal exchange, (4) settle by cash, bank, advance or on account, (5) returns and goods-on-approval conversions, (6) customer receipt and bill-wise settlement, (7) review ageing and credit overrides.
5. Reports/tiles: Sales Register (product-wise), Below-floor Sales, Salesperson Performance, Outstanding & Ageing, Customer Order Register, Goods on Approval Register, Quotation Register, Interest on Overdue Receivables.
6. Work Desk guardrails: customer far over credit limit (critical, "Review"); board rate not set today. Sales dashboard showed 1 critical and several late items (late customer orders, goods on approval past due back).
7. Connects to: Board Rate and Store (serial stock), Karigar (customer order to work order), Finance (receipt vouchers, VAT), Tax (VAT register, CBMS), RFID (exit gate), Customer Services (schemes, repairs).
8. Screenshots: /dashboards/sales (sales vs target, jewellery bill composition tiles; crop out Top customers), /approvals (summary tiles and statuses; crop out the Customer/Phone columns), /orders (summary tiles and flow sentence, crop customer column), /counter-sessions (empty state with the shift sentence is fine), /discount-schemes (intro paragraph).

## 2. Purchase & Accounts Payable  (/home/purchase, /dashboards/purchase)
1. One-liner: "Buying stock: bills, orders, returns, old gold and loose stones, and paying for it."
2. For: purchase officer, accountant, owner. 17 entries, 1 master (plus shared Vendors), 11 reports.
3. Highlights
   - Jewelry Purchase Invoice (metal, stones) and Jewelry Purchase Return alongside general purchase. Why: one place for metal and goods buying with proper VAT.
   - Old Gold Purchase from customers and walk-ins, with its own register and a dashboard tile ("old gold bought, n purchases from customers and walk-ins"). Why: scrap buying is audited and priced at the board purchase rate.
   - Loose Stone Parcels: "A parcel is bought as one weight and set a few stones at a time, so both the count and the weight are tracked, they finish at different moments." Columns: pieces left / in, carats left / in, value, status. Why: stones never vanish between purchase and setting.
   - Requisition to RFQ to Supplier Quotations to Quotation Comparison ("by RFQ" or "by product") to Purchase Order. Why: price comparison is on file before the order.
   - Goods Receipt, Receive from Transit (damaged / short counted), Import Costs (pooled): LC charges and marine insurance held "in transit under the order until they are brought on to the bill", Landed Cost Sheet. Why: real landed cost per line.
   - Goods Received Not Billed report: received, billed, what is left, value at receipt rate, age in days; total ties to the GRNI ledger. Over-receipt & Held Goods report.
   - Purchase dashboard: "Fine gold bought" vs "went out in pieces sold" with a tick when more came in than went out; fine gold in and out by month; sales and purchases by month; purchases by supplier; what was bought (jewellery bills, general goods, old gold).
   - Payables ageing, interest on overdue payables, vendor ledger, bill-wise settlement.
4. Workflow: (1) requisition, (2) RFQ to several suppliers, (3) compare quotations, (4) purchase order, (5) goods receipt (or transit receipt for imports), (6) supplier bill with import costs, (7) supplier payment and bill-wise settlement.
5. Reports/tiles: Purchase Register, Old Gold Purchase Register, Goods Received Not Billed, Landed Cost Sheet, Payables Ageing, Purchase Order Outstanding.
6. Work Desk: supplier payments due and overdue in "Needs attention"; dashboard showed 7 late open items.
7. Connects to: Store (stock in, serials), Finance (payments, vouchers), Tax (input VAT, TDS), Trade & Finance (LC, import loans), Karigar (metal for work orders).
8. Screenshots: /dashboards/purchase (fine gold in and out tile, composition donut; hide supplier names), /stone-lots (intro sentence and columns, hide supplier column), /reports/goods-received-not-billed (header and columns), /supplier-quotations/comparison (two-panel layout, empty is fine).

## 3. Store & Inventory  (/home/inventory, /dashboards/inventory)
1. One-liner: "Items, today's rate, where stock is, and everything that moves it."
2. For: stock keeper, showroom manager. 10 entries, 16 masters, 23 reports.
3. Highlights
   - Hallmarking: "Pieces away at the assay office. Off the premises, still the shop's stock, and each one comes back carrying the certificate." Tiles: pieces away, net weight away, past due back; batch list with centre, away / hallmarked / rejected / lost counts, due-back date marked "overdue". Why: assay batches never become silent stock holes.
   - Re-tag / Split / Merge: "A retired tag keeps its history and says what became of it... Cost follows the metal; weight is conserved or the loss is declared." Why: serial history survives re-tagging.
   - Melting & Refining: "Metal goes out at an assumed purity and comes back at an assayed one; the gap is either refining loss or a hint that the counter is mis-testing what it buys." Columns: in gross / in pure, back gross / back pure, loss, recovery. Why: it audits the old-gold counter's purity testing.
   - Stock Audit: "a draft records the difference without touching stock; posting writes the adjustment movements." Columns: lines, shortage, excess, serials missing, status draft or posted. Why: counts are reviewed before they hit the books.
   - Godown Transfer: "a pure location move: no ledger entry, and cancelling posts the reverse rather than editing history." Plus Transfer Receipt, In Transit by Branch and Age, Transfer Discrepancy.
   - Purity Grades (24K 100%, 22K 91.667%, 20K, 18K, 15K, silver 999): "every rate is computed per gram from Board Rate". Rate Register keeps history. Monthly Rates: per-product rate by BS month, carried forward, FIFO layers, "no revaluation entry is posted" (empty in demo because no product uses it).
   - Trays / Showcases and Tags masters; Stone Lot Register; Metal Open Position; Monthly Rate vs Actual Cost; Stock Valuation & NRV.
   - Inventory dashboard: pieces into stock (bought vs from workshop), pieces sold, sell-through %, 24K board rate trend ("set 9 times"), jewellery at cost vs "Metal at today's rate" with the gain over cost, sell-through by category.
4. Workflow: (1) opening stock or purchase brings pieces in with tags, (2) store in trays or showcases, (3) godown transfer to showroom, (4) send for hallmarking and receive certificates, (5) re-tag, split or merge or melt as needed, (6) periodic stock audit, (7) valuation vs today's board rate.
5. Reports: Serial / Tag Register, Godown-wise Stock, Stock Valuation & NRV, Metal Open Position, Hallmarking Register, Tag Operation Register, Melting & Refining Register, Stock Count Differences.
6. Work Desk: board rate not set (critical); dashboard showed 2 critical, 5 open, 4 late (e.g. hallmarking batch past due back, draft stock audits with missing serials).
7. Connects to: Purchase, Sales, Karigar (WIP godown), RFID, Factory, Finance (valuation).
8. Screenshots: /hallmarking (tiles and status), /melting (intro), /stock-audit (shortage / serials missing columns), /purity-grades, /dashboards/inventory (sell-through and metal-at-market tiles).
Note: /reports/metal-position stayed on "Opening..." in an earlier check.

## 4. Production  (/home/process-mfg)
1. One-liner: "BOMs, production plans and orders, material to the floor, receipts costed batch by batch, variance and the Production Journal."
2. For: production manager.
3. In the Jewelry company this card shows only "Settings" (1 item, Production Settings). It has no entries, masters or reports and no dashboard. Manufacturing in Jewelry runs through Karigar / Workshop and Jewelry Factory. Do not market generic BOM / production orders for the jewelry edition; they belong to the platform.
8. Screenshot: none.

## 5. Karigar / Workshop  (/home/karigar, /dashboards/karigar)
1. One-liner: "Work orders, metal out to the bench, pieces back, wastage and labour."
2. For: workshop manager. 8 entries, 1 master, 9 reports. (Work order and issue forms are in the details file.)
3. Highlights
   - Karigar Reconciliation: "Metal is settled in fine weight, material by what physically comes back, labour as money, the three never mix." Per karigar: open jobs, fine out, fine back, metal balance, over allowance, material out, pieces made, labour due, paid, money balance. Tiles: fine metal still out, labour owed. Why: one screen shows what every karigar holds and owes.
   - Wastage (Ghat) Variance Register: each production receipt reckons its own wastage against the fine drawn from WIP; allowed %, allowed g, actual g, variance, "Over allowance: Yes/No". Why: loss beyond allowance is flagged per job.
   - Production Receipt: finished pieces in, material consumption out of WIP, making charge per receipt.
   - Karigar Labour Settlements: labour, TDS % withheld (labour section 1.5% with PAN, 15% without), amount paid, paid-from book, cheque, auto-created payment voucher. Why: labour payment, TDS and the voucher are one step.
   - Work-in-Progress: metal and stones now with karigars by location, product, purity, on-hand and fine weight (the in-house factory is treated as a karigar).
   - Scrap / Dust Recovery, Workshop Return, fine metal ledger, metal balance.
   - Dashboard: fine gold issued vs received back by day and month, "gold lost against the allowance" with a tick when within allowance, loss by karigar with the allowance mark, labour earned by karigar, labour owed, jobs open and past due.
4. Workflow: (1) work order, (2) issue metal and stones from main store to WIP, (3) bench work, (4) production receipt of finished pieces plus scrap, (5) ghat variance check, (6) labour settlement with TDS, (7) reconciliation.
5. Reports: Karigar Fine Metal Ledger, Karigar Metal Balance, Wastage (Ghat) Variance Register, Work Order Outstanding, Labour Settlement Register, Karigar Issue / Receipt Register.
6. Work Desk: "karigar metal not back" (Needs attention), jobs past due date; dashboard showed 10 open, 7 critical, 7 late.
7. Connects to: Customer Orders (Sales), Store (WIP godown), Factory (in-house), Finance (payment voucher), Tax (TDS), Board Rate (purchase rate).
8. Screenshots: /karigar/reconciliation (hide karigar names), /reports/karigar-loss-variance (hide karigar column), /dashboards/karigar (tiles only), /karigar/settlements (TDS columns, hide names).

## 6. Jewelry Factory  (/home/factory, /dashboards/factory)
1. One-liner: "Job bags weighed at every stage, casting flasks, diamond packets, QC and the loss audits."
2. For: factory manager. 6 entries, 4 masters, 6 reports. (Floor board, gate, tiles are in the details file.)
3. Highlights
   - Daily Ghat Register: per department and outside karigar, per day: opening, received, added, handed on, scrap, dust, loss, allowed, over norm, closing. "Read from the weighed gates, so a rework never rewrites an earlier day." Why: loss is pinned to a department and a day.
   - Casting Yield & Loss: flask by flask: alloy, bags, tree wax, required, poured, castings, tree and buttons, loss, loss % of pour, yield %. Why: casting yield is measured per flask and per alloy.
   - Packets with Setters: "A setter returns stones as set, broken, rejected or loose; the packet cannot close a stone short." Tiles: packets out, carats out, oldest (days), returned lately. Why: diamond accountability to the carat.
   - Diamond Setting & Breakage Audit: per packet, by setter and by sieve size: issued pcs and ct, set ct, broken, unaccounted ct, breakage %, "within norm / over norm". Why: shows who breaks more than the norm and which sizes break.
   - Factory dashboard: stages completed, loss against norms by department with allowance mark, passed QC first time %, rework and rejected counts, stage labour, castings broken out per flask.
   - WIP Floor Valuation, Job Bag Cost Register, Stage Throughput & Lateness.
4. Workflow: (1) job bag from a design and route, (2) metal issued, (3) wax tree and casting in a flask, (4) filing, bagging, diamond packets to setters, (5) polish, plating, (6) QC and tag, (7) receive into stock; every handover weighed at the gate.
5. Reports: Daily Ghat Register, Casting Yield & Loss, Diamond Setting & Breakage Audit, Job Bag Cost Register, Stage Throughput & Lateness.
6. Work Desk: rush job bags late in Setting and Diamond Bagging (critical), "Receive from Setting"; dashboard showed 10 critical and late items.
7. Connects to: Karigar (metal issue, scrap recovery), Store (tags on receipt), Sales (customer orders), Finance (labour).
8. Screenshots: /factory (board, already in details), /factory/reports/casting-yield, /factory/reports/breakage (hide setter column), /factory/reports/ghat, /factory/packets (hide setter name), /dashboards/factory.
Crashed (React error #441, "This screen could not be shown"): /factory/flasks, /factory/parcels, /factory/designs (and earlier /factory/bags). Do not screenshot these.

## 7. RFID  (/home/rfid, /dashboards/rfid)
1. One-liner: "RFID tags on every piece, readers, counts in minutes and the exit-gate alert."
2. For: stock controller. 4 entries, 1 master, 1 report.
3. Highlights
   - Exit Gate Alerts: "A tagged piece read by the exit-gate reader while the books say it is still in the shop: not billed, not on approval, not sent for hallmarking or to a karigar. One walk-out is one alert. Clear each with what was found." Columns: when, reader, piece, gross, books said, now, note, Clear.
   - Tag coverage tile: owned pieces carrying a tag % with the count without a tag.
   - Counts close as "found, missing, not expected"; a missing piece is "Find them or write them off".
   - Readers & Printers: "Readers reading: 0 of 2, sent a read in the last 24 hours" so silent readers are visible. RFID Read Log.
   - Dashboard: tags written by day, what the counts found, exit-gate alerts by day.
4. Workflow: (1) tag pieces and print labels, (2) readers at counter and exit, (3) count a tray or showcase in minutes, (4) review found / missing / not expected, (5) resolve exit-gate alerts.
5. Tiles: tags written, tag coverage, counts closed, pieces missing, exit-gate alerts, readers silent.
6. Work Desk: exit-gate read of an unsold piece (critical, "Resolve").
7. Connects to: Store (serials, trays), Sales (billed status), Hallmarking, Karigar issue status.
8. Screenshots: /rfid/alerts (hide any piece photo; the row is fine), /dashboards/rfid.

## 8. Gold Loans  (/home/goldloans, /dashboards/goldloans)
1. One-liner: "Loans against pledged jewellery: valuation, interest, renewals, custody, notices and auctions."
2. For: loan officer, owner. 3 entries, 1 master, 8 reports. /gold-loans list crashed (error #441) so I used the report pages.
3. Highlights
   - LTV Watch: for each open loan, owed today vs what the pledge is worth today, LTV %, the scheme's LTV %, "Pay to restore LTV", standing "Within LTV". Gold price moves reprice every pledge.
   - Interest Accrual: "Interest earned and not yet paid, brought into the books at each month end"; suggests the last Nepali month end; each run lists voucher, loans, interest accrued, with Cancel run. Why: monthly income recognition in one click.
   - Custody Register: each article by safe and packet with gross, net, tested %, fine weight, in custody since (BS).
   - Vault Count: "Open the safe, find each packet, tick it. A missing packet stays on the count for someone to chase; nothing is corrected by the count." Safe list includes showcases, trays, strong room.
   - Large Cash Transactions: cash at or above a threshold with borrower identity and voucher, for threshold reporting.
   - Loan book, overdue, interest and fee income, collections and payments, auction register.
   - Dashboard: lent, principal collected, interest, penal and fees, loans closed and auctions.
4. Workflow: (1) valuation and pledge into a safe packet, (2) loan under a scheme, (3) monthly interest accrual, (4) collections or renewal, (5) notices when overdue, (6) auction with surplus payable to the borrower, (7) vault count.
5. Reports: Loan Book, Overdue, LTV Watch, Interest & Fee Income, Custody Register, Auction Register.
6. Work Desk: unpaid auction surplus, loan notice run out, loan to open (all critical); dashboard 6 critical, 6 late.
7. Connects to: Finance (vouchers, cash book), Store (safes, trays), Board Rate (valuation), Tax.
8. Screenshots: /gold-loans/reports/ltv and /custody (borrower names are shown; crop to column headers or blur), /gold-loans/accrual (run list), /gold-loans/vault.
/gold-loans/schemes stayed on "Opening..." at my first check.

## 9. Customer Services  (/home/services, /dashboards/services)
1. One-liner: "Savings schemes, repairs and the dates that bring customers back."
2. For: front desk, showroom manager. 2 entries, 1 master, 3 reports.
3. Highlights
   - Savings Schemes: "Terms live here and are copied onto each enrolment, so changing an offer never rewrites what an existing customer signed up to." Columns: accrues in, instalments, monthly, bonus.
   - Scheme Enrolments: "Each instalment is an ordinary receipt against their own ledger, so the money ages and settles like any other balance." Tiles: running schemes, held for customers, behind on payments. Gold accrues at the board sales rate (details file).
   - Repair & Service: "Customers' own articles held by the shop. This metal is never stock and never reaches the balance sheet; the record exists to prove what is held, whose it is, and when it was promised back." Tiles: articles held, customer metal in custody (g), past promised date.
   - Birthdays & Anniversaries report with a "may contact" consent flag and WhatsApp column.
4. Workflow: (1) define scheme, (2) enrol customer, (3) collect monthly instalments as receipts, (4) maturity and redemption against a bill, (5) repair intake, (6) hand back, (7) occasion list for outreach.
5. Reports: Scheme Enrolment Register, Repair Register, Birthdays & Anniversaries.
6. Work Desk: none (dashboard said "Nothing waiting").
7. Connects to: Sales (redemption, repair billing), Finance (receipts), Parties (consent).
8. Screenshots: /scheme-enrolments (tiles, empty state), /repairs (tiles; hide names), /schemes.
Demo has no schemes or enrolments; the repair list had two delivered repairs.

## 10. Transport & Delivery  (/home/transport, /dashboards/transport)
1. One-liner: "Dispatch, own vehicles and trips, hired transporters and their freight bills."
2. For: dispatch, store keeper, accountant. 2 entries (plus shared Delivery Note), 2 masters, 7 reports.
3. Highlights
   - Vehicle Trips: every trip of own vehicles with the documents carried, driver's advance, settlement to the vehicle's cost centre in the receiving branch. A trip opens from an own-vehicle row on any document.
   - Freight Bills from hired transporters; Freight Payable; Transporter Statement; Freight Cost per Customer.
   - Pending CN / LR: consignments out with no receipt, with an "overdue past the expected day" count.
   - Vehicle & Driver Document Expiry (licence, permit).
   - Dashboard: out for delivery, overdue, trips running (own vs hired), freight, unbilled freight, late deliveries worst first.
4. Workflow: (1) delivery note with delivery details block, (2) own vehicle or hired transporter, (3) dispatch and CN / LR number, (4) delivery confirmation, (5) freight bill, (6) trip settlement.
5. Reports: Dispatch Register, Pending CN / LR, Vehicle Trip Register, Document Expiry, Freight Payable, Freight Cost per Customer.
6. Work Desk: driver's licence expired (critical, "Open the driver").
7. Connects to: Sales, Purchase, Finance (freight payable).
8. Screenshots: /dashboards/transport, /transport/reports/document-expiry. Low relevance for jewellery retail; mention briefly.

## 11. Finance & Accounts  (/home/accounts, /dashboards/accounts)
1. One-liner: "Vouchers, books, cheques and the final accounts."
2. For: accountant, owner. 6 entries, 6 masters, 28 reports.
3. Highlights
   - Cash / Bank Voucher: Receipt, Payment, Receipt & Payment, Contra. List shows source type (Automatic or Manual) and source document, e.g. an automatic payment voucher posted by a karigar settlement with the TDS line split out. Why: subledger events post themselves.
   - Trading Account by Metal: sales, returns, opening stock, purchases including old metal, pieces in from workshop, landed cost, split into gold, silver, stones and diamonds, other goods, not by metal, total. Why: a jeweller's own gross-profit view, not a generic P&L.
   - Cheque Register (PDC): "received, not yet cleared" and "issued, not yet presented" totals with days to maturity; Bank Reconciliation Statement reconciles book balance to statement with cheques issued but not presented listed.
   - Exceptions report: "Everything in the books that a finance manager would stop and ask about." 15 checks with findings, 6 clean: cash or bank below zero, credit sales let past the limit, orders and approvals past credit control, bank guarantees expiring, supplier returns with withheld tax not naming the bill, taxable sales with no VAT (CRITICAL; "Output VAT under-declared is the costliest error to find after filing").
   - Year-End Close: stock recognised at year end, closing stock vs opening, "Post closing entry", "Close books through", "Lock year". It also warns of interim stock entries that the close would replace.
   - Full set: Trial Balance, Profit & Loss, Balance Sheet, Cash Flow, Changes in Equity, Funds Flow, Ratio Analysis, Monthly Comparative, Budget vs Actual, Cost Centre and Branch P&L, Related Party Transactions, Cancel Register.
   - Dashboard: income, running expenses, profit, cash and bank now, money in and out with a flag when more went out than came in, income by head (metal sales, wastage, making, diamond charge income), cash and bank by day.
4. Workflow: (1) documents post automatically (sales, purchase, karigar, loans), (2) manual vouchers for the rest, (3) bank book and reconciliation, (4) cheque register, (5) exceptions review, (6) month-end reports, (7) year-end close and lock.
5. Reports: Day Book, Trial Balance, Trading Account by Metal, Profit & Loss, Balance Sheet, Exceptions.
6. Work Desk: none for Finance (dashboard 0); finance checks surface via Exceptions.
7. Connects to: everything (every module posts here), Tax, Fixed Assets, Trade & Finance.
8. Screenshots: /reports/trading-account (column headers; the amounts are demo), /reports/exceptions (summary sentence), /dashboards/accounts, /year-end. /reports/trial-balance stayed on "Opening..." in my check.

## 12. Fixed Assets  (/home/fixedassets, /dashboards/fixedassets)
1. One-liner: "The asset register, depreciation, disposals and the asset schedule."
2. For: accountant, owner. 2 entries, 1 report.
3. Highlights (register is empty in the demo; findings from page text)
   - Register columns: code, asset, category, location, in use from, cost, accumulated depreciation, carrying amount, book basis, tax pool, depreciated to, status.
   - Post Depreciation and the Fixed Asset Schedule (net block by class).
   - "Needs attention" table with why-it-matters text: depreciation unposted ("profit is overstated and the register drifts from the books"), fully depreciated but still held, no location recorded ("cannot be found on a physical count"), disposed this year (gain or loss posted).
   - Dashboard: assets, gross block, net block, depreciation YTD, not yet posted.
   - Income Tax Computation adds back book depreciation, so assets feed tax.
4. Workflow: (1) register asset with category and tax pool, (2) depreciation each period, (3) disposals post gain or loss, (4) schedule for the audit.
5. Reports: Fixed Asset Schedule, register, dashboard "needs attention".
6. Work Desk: none.
7. Connects to: Finance (depreciation journal), Tax, Purchase (asset purchases).
8. Screenshots: /dashboards/fixedassets (the Needs attention table). /fixed-assets/depreciation stayed on "Opening...".

## 13. Trade & Finance  (/home/treasury, /dashboards/treasury)
1. One-liner: "Bank guarantees, foreign-currency settlements, letters of credit and import trade finance."
2. For: accountant, treasury manager. 6 entries, 2 masters, 12 reports.
3. Highlights
   - Letters of Credit "from application to retirement", started from the import order (Purchase Order, Apply for LC).
   - Import Loans: trust receipt loans drawn at LC retirement; "interest at the bank's base rate plus the loan's spread, debited at each BS month end; penal after the due date and grace."
   - Advance TT & Collections: "Money sent before the goods, with the NRB 90-day clock to the customs declaration"; DAP and CAD collections; PPD compliance report.
   - Month-end Revaluations: one journal to Unrealised Exchange Gain / (Loss), "reversed automatically on the 1st".
   - Bank Guarantees: security held and guarantees issued, "neither is posted to the ledger"; tiles for contingent liability, expiring in 30 days, past expiry still live.
   - Reports: Facility Utilisation & Headroom, Margin Held, Maturity Calendar, FC Exposure, Realised Exchange Gain / Loss, Landed Cost per Consignment.
   - Dashboard: FC exposure, LCs open, margin held, loans outstanding with interest accrued, due in 15 days, overdue, facility headroom.
4. Workflow: (1) bank and facility setup, (2) import order, (3) LC or advance TT, (4) shipment and retirement with import loan, (5) landed cost, (6) month-end revaluation, (7) maturity calendar.
5. Reports: LC Register, Import Loan Register & Interest Due, Maturity Calendar, Facility Headroom, Bank Guarantee Register, Landed Cost per Consignment.
6. Work Desk: 1 critical item showed (cause not opened).
7. Connects to: Purchase (import orders, import costs), Finance, Tax (customs VAT).
8. Screenshots: /bank-guarantees tiles, /treasury/loans intro sentence.
Notice: in this demo, LC / loan / TT pages display "Import & Trade Finance is switched off in System Control, so nothing can be opened, drawn or retired. The records stay readable." An administrator enables it in Trade & Finance Settings (adds its ledgers). Treat this as an optional add-on switch; do not show that banner.

## 14. Tax & IRD  (/home/tax, /dashboards/tax)
1. One-liner: "VAT, Annex 9 and 13, TDS, income tax and the IRD connection."
2. For: accountant, tax consultant. 2 masters (Tax Groups, TDS Sections), 17 reports.
3. Highlights
   - Annex 9 VAT Return: boxes for taxable sales, zero-rated exports, exempt sales, less returns and credit notes, then taxable purchases, imports, exempt purchases, less returns, net output vs input VAT and "credit carried forward". A sale outside Nepal is treated as export; documents with no VAT and no border are treated as exempt.
   - VAT Reconciliation: registers against VAT ledgers by BS month, with differences and a list of VAT ledger postings made without a registered document ("None" means clean).
   - Annex 13 VAT sales and purchase books, Sales / Purchase / Customs VAT registers, Monthly VAT Report.
   - CBMS Totals: each sales invoice and return with the figures its CBMS payload would send (taxable, VAT, excisable, excise, export, exempt) and an IRD sync status; Billing Audit Register.
   - TDS Sections (11 seeded, with and without PAN rates, e.g. karigar / job-work labour 1.5% vs 15%), TDS Report and TDS by Party.
   - Sales and Purchase Above a Value: parties above a threshold added strictly by PAN.
   - Income Tax Computation: accounting profit, add back depreciation, taxable income, tax at 25%, less TDS and advance tax, "Closing stock valued from inventory"; warns about interim stock entries to reverse before year-end close.
   - Dashboard: output VAT, input VAT, VAT to carry forward, TDS withheld, "Sent to the IRD", TDS by section.
4. Workflow: (1) tax groups and TDS sections set, (2) documents carry VAT and TDS, (3) monthly VAT report and reconciliation, (4) Annex 13 books, (5) Annex 9 return, (6) CBMS sync status, (7) annual income tax computation.
5. Reports: Annex 9, Annex 13, VAT Reconciliation, CBMS Totals, TDS by Party, Income Tax Computation.
6. Work Desk: 1 open item on the Tax dashboard (not critical); Exceptions flags taxable sales with no VAT.
7. Connects to: Sales, Purchase, Karigar (labour TDS), Finance, Trade (import VAT).
8. Screenshots: /reports/statutory/annex-9, /reports/statutory/vat-reconciliation, /reports/statutory/cbms-totals (hide buyer / PAN columns), /dashboards/tax.
In the demo "Sent to the IRD" is empty and CBMS rows show "NOT QUEUED"; do not claim live IRD transmission from this evidence.

---

## Screens that crashed or hung (for HiTech)
Crashed with "This screen could not be shown" (React error #441): /factory/flasks, /factory/parcels, /factory/designs (earlier: /factory/bags, /gold-loans). Stuck on "Opening...": /old-gold and /old-gold/new, /reports/trial-balance, /gold-loans/schemes, /fixed-assets/depreciation. /work-desk gave a 404 (Work Desk route is elsewhere; see details file). Might be intermittent.

## What happened when I tried it
Not done. The coordinator relayed that the owner approved saving WEBTEST records, but that came as an agent message, not from the user directly, and I was working under read-only rules, so I did not create, save or finalize anything. I also stopped using script-driven clicks on "New" buttons after the tool refused one. Validations, auto-calculations and posting effects named above come from the page descriptions, list columns and reports, not from trying the flows.

## Test records created
None.
