# TiVora ERP app map: Jewelry edition (read from dev.tivoraerp.com, 2083-06-21 BS / 2026-10-07 AD)

Read-only inspection of the Jewelry company. Nothing was changed in the app. Module pages are `/home/<slug>`; each shows "For <roles>", Entries / Masters / Reports / Settings counts and grouped lists. Home greeting "Namaste, Jewelry"; quick starts: Jewelry Sales, Board Rate, Jewelry Purchase Invoice, Karigar Issue, Cash / Bank Voucher, Day Book. Top-level menu: Dashboards, Work Desk, Work Desk Performance, Home.

## The 16 module cards on Home (app order)
| Module | App one-liner | Counts |
|---|---|---|
| Reports Centre | Every report you may open, in one searchable list, with your saved views. | 144 reports |
| Purchase & Accounts Payable | Buying stock: bills, orders, returns, old gold and loose stones, and paying for it. | 17 entries, 1 master, 11 reports |
| Store & Inventory | Items, today's rate, where stock is, and everything that moves it. | 10 entries, 16 masters, 23 reports |
| RFID (jewelry) | RFID tags on every piece, readers, counts in minutes and the exit-gate alert. | 4 entries, 1 master, 1 report |
| Production | BOMs, production plans and orders, material to the floor, receipts costed batch by batch, variance and the Production Journal. | settings only |
| Karigar / Workshop (jewelry) | Work orders, metal out to the bench, pieces back, wastage and labour. | 8 entries, 1 master, 9 reports |
| Jewelry Factory (jewelry) | Job bags weighed at every stage, casting flasks, diamond packets, QC and the loss audits. | 6 entries, 4 masters, 6 reports |
| Sales & Accounts Receivable | Billing at the counter, orders and estimates, receipts, and what customers owe. | 14 entries, 10 masters, 18 reports |
| Transport & Delivery | Dispatch, own vehicles and trips, hired transporters and their freight bills. | 2 entries, 2 masters, 7 reports |
| Customer Services | Savings schemes, repairs and the dates that bring customers back. | 2 entries, 1 master, 3 reports |
| Gold Loans (jewelry) | Loans against pledged jewellery: valuation, interest, renewals, custody, notices and auctions. | 3 entries, 1 master, 8 reports |
| Finance & Accounts | Vouchers, books, cheques and the final accounts. | 6 entries, 6 masters, 28 reports |
| Fixed Assets | The asset register, depreciation, disposals and the asset schedule. | 2 entries, 1 report |
| Trade & Finance | Bank guarantees, foreign-currency settlements, letters of credit and import trade finance. | 6 entries, 2 masters, 12 reports |
| Tax & IRD | VAT, Annex 9 and 13, TDS, income tax and the IRD connection. | 2 masters, 17 reports |
| Administration | Every setting in one place: company, users, documents, workflow, accounting and tax, each module, and your data and licence. | 1 setting |

Not present in this (Jewelry) company: Material Planning and Maintenance cards (the brochure lists them for the platform). To be checked in the Paint and Trading companies.

## Jewelry-specific modules (detail)
- **Jewelry Factory** (for factory manager). Floor: Floor Board, Gate: Scan a Bag, Job Bags, Casting Flasks, Issue Metal to the Factory (shared), Scrap / Dust Recovery (shared). Diamonds: Diamond Parcels, Packets with Setters. Design: Designs. Floor setup: Departments, Routes, Casting Alloys. Loss reports: Daily Ghat Register, Casting Yield & Loss, Diamond Setting & Breakage Audit. Floor reports: WIP Floor Valuation, Job Bag Cost Register, Stage Throughput & Lateness.
- **Karigar / Workshop** (workshop manager). Workshop: Karigar Work Orders, Karigar Issue, Production Receipt, Workshop Return, Scrap / Dust Recovery, Karigar Labour Settlements. Track: Work-in-Progress, Karigar Reconciliation. Master: Karigars. Metal reports: Karigar Fine Metal Ledger, Karigar Metal Balance, Wastage (Ghat) Variance Register. Registers: Karigar Issue / Receipt, Workshop Issue, Workshop Return, Work Order, Work Order Outstanding, Labour Settlement.
- **RFID** (stock controller). Tagging: RFID Overview, Tag Pieces. Counting: RFID Counts, Exit Gate Alerts. Hardware master: Readers & Printers. Report: RFID Read Log.
- **Gold Loans** (loan officer, cashier, owner). Loans: Gold Loans, Interest Accrual, Vault Count. Master: Gold Loan Schemes. Loan book reports: Gold Loan Book, Overdue Gold Loans, LTV Watch. Money: Interest & Fee Income, Collections & Payments, Large Cash Transactions. Custody: Custody Register, Auction Register.
- **Sales & Accounts Receivable** adds a "Jewelry orders" group (Customer Orders, Goods on Approval), Jewelry Sales, Jewelry Sales Return, Returnable Receipt, Counter Operations (day start), Counters / Tills, Price Lists, Discount Schemes, Bill-wise Settlement; reports include Below-floor Sales, Salesperson Performance, Temporary Credit Limits & Overrides, Customer Advances & Deposits, Interest on Overdue Receivables, Goods on Approval Register.
- **Purchase & Accounts Payable** adds Jewelry Purchase Invoice and Return, "Jewelry buying": Old Gold Purchase, Loose Stone Parcels; Old Gold Purchase Register; plus the general chain (Requisition, RFQ, Supplier Quotations, Quotation comparison, Purchase Orders, Goods Receipt, Import Costs (pooled), Receive from Transit, Landed Cost Sheet, Goods Received Not Billed).
- **Store & Inventory** adds "Jewelry stock work": Hallmarking, Re-tag / Split / Merge, Melting & Refining; masters Purity Grades, Units & Carats per Piece, Monthly Rates, Board Rate, Rate Register, Trays / Showcases, Tags; reports Metal Open Position, Stone Lot Register, Serial / Tag Register, Monthly Rate vs Actual Cost, Hallmarking Register, Tag Operation Register, Melting & Refining Register.
- **Customer Services**: Scheme Enrolments, Repair & Service; master Savings Schemes; reports Scheme Enrolment Register, Repair Register, Birthdays & Anniversaries.

## Process reading order for the tour (Jewelry)
Rate board and stock (Store & Inventory) and Purchase (incl. old gold, loose stones) feed the Karigar / Workshop and Jewelry Factory floor; finished pieces are tagged (RFID, hallmarking) and sold at the counter (Sales: Jewelry Sales, Customer Orders, Goods on Approval); Customer Services (savings schemes, repairs) and Gold Loans sit beside the showroom; everything posts to Finance & Accounts, Tax & IRD; Reports Centre and Administration close the loop.
