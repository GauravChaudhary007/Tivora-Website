# Tivora ERP: motion-graphics video spec (v1)

Owner: Head of Department (creative + technical direction), 2026-10-06.
Audience: the Sonnet engineers who build it (work packages WV0-WV4, section 6). This file is the single source of direction for the videos. Where it is silent, choose the smallest thing that works and note it in the PR.

Binding inputs: `docs/REVAMP-SPEC.md` section B (tokens) and section H (claims), `AGENTS.md`, `../Tivora ERP/directives/tivora-product-knowledge.md`. User decisions already made: the product is described as **"HiTech Intelligent ERP Solution" / "intelligent ERP"**; no "AI", "AI-powered" or any AI feature. No audio tool exists: **captions-first, silent films** (no music unless a licensed royalty-free track is supplied later; see 7.7).

This spec **amends REVAMP-SPEC** in three places: (1) section C "video tour" was cut; it is back by user request; (2) checklist F "no `<video>` in `src`" becomes "`<video>` only in `src/components/ui/VideoPlayer.tsx`"; (3) E1 removed `ffmpeg-static` from the site; it lives in the separate `video/` package (section 4), never in the root `package.json`.

---

## 0. What was inspected, and what it decided

| Input | Finding that drives a decision |
|---|---|
| 27 routes in `assests/app-captures/` (3840x2160, 2x; `-full` = full page) | The app renders as a column inside a wide canvas: every frame needs a crop (section 1.3). Module hubs share one layout (title block, quick-entry buttons, 4 cards: Dashboard / Entries / Masters / Reports). **The app now shows 12 modules** on Home: Reports Centre, Purchase & Accounts Payable, Store & Inventory, Production, Sales & Accounts Receivable, Transport & Delivery, Customer Services, Finance & Accounts, Fixed Assets, Trade & Finance, Tax & IRD, Control Panel. The site says "ten modules" (risk 7.1); the films never state a count. |
| `start.png` | Byte-for-byte the same layout as `home.png` (only "Recently opened" differs). Unused. |
| `pos.png` (route `/pos`) | Is **not** a POS terminal: it is the "Sales Invoices" list. `pos_general.png` is the same table titled "General Sales". So there is no evidence for a "POS" screen. The word **POS is cut**; the beat becomes **counter billing**, evidenced by `home_sales` ("Counter Operations" under Day start, "Counter / Till" master) plus the invoices list. |
| `home_reports.png` | Only one card ("All Reports"). Replaced by `reports-centre-full.png` (120 reports, searchable). Unused. |
| `home_services.png` | Evidence is thin: a dashboard and one report, "Birthdays & Anniversaries", plus the app line "Savings schemes, repairs and the dates that bring customers back." Captions use only the birthdays/anniversaries fact. |
| `home_tax.png` | Shows "CBMS Totals" and the description "...and the IRD connection". Captions use "CBMS-ready" / "built to IRD's current formats" only; **never zoom on or caption "IRD connection"**. |
| `desk.png`, `desk-full.png` | Strongest owner story: "Needs you now" (3 CRITICAL cards), module tabs with counts, Late / Today / This week / Snoozed, "Coming up" (Deposit the TDS withheld in Bhadra; File Bhadra's VAT return), Today in numbers, Outstanding, Sales last 30 days, VAT this month, Alerts. Alerts block is full of party names: not used. "Metal out ... karigars" card appears in the Paint demo: not used. |
| No executive dashboard in the new captures | `dashboards.png` is the index only. The Executive dashboard comes from the older 1x capture `Tivora ERP/Assests/Executive dash Paint.PNG` (1908x921) with the existing redactions from `scripts/prep-screens.mjs`. 1x source: **max zoom 1.6** (section 2.0). |
| Sensitive data (section 3) | Plausible-real party names on 9 frames (Balaju Hardware & Paints, Patan Building Materials Suppliers, Everest Chemicals & Pigments Pvt. Ltd., Narayani Solvents & Chemicals Pvt. Ltd., Sirsiya Freight Movers Pvt. Ltd., Birgunj Clearing & Forwarding Services, Trans-Himalaya Shipping Agency Pvt. Ltd., Himal Packaging Industries Pvt. Ltd., Zhejiang Yuanlong Chemical Industry Co., Ltd., and **Himalayan General Insurance Co. Ltd., which is the name of a real Nepali insurer**); a person's name (Bishnu Adhikari); a real bank (NABIL) with references on the LC list; a PAN number on the Day Book and Stock Report headers; the red notification badge on every top bar. |
| `Tivora ERP/Assests/Tivora_Launch_15s.mp4` (earlier 15 s cut) | Contains a "Tivora AI · Ask. It answers." beat (forbidden claim) and the wordmark set in a typeface with a truncated descriptor (forbidden: logo must be the file). **Superseded; must not be published.** Nothing from it is reused. |
| Reference reel (`assests/WhatsApp Video ...mp4`) | Principles only, as in REVAMP-SPEC 0: one hero object transformed; isometric worlds in one accent with small pinned info cards; dark editorial pages with giant type; masked and zoom transitions; very few elements per frame. |
| Site (`src/lib/iso.ts`, `src/components/home/IsoWorld.tsx`, `world.ts`, `beats.ts`, `globals.css`, `public/brand/*`) | The films reuse the real world SVG (extracted from the built page, not redrawn), the beat titles verbatim, the colour/ease/duration tokens, and only the four existing logo files. |
| Deploy (`next.config.ts`, `deploy/static/.htaccess`, `Dockerfile`, `.dockerignore`) | Docker copies `public/` from the build context; static export copies `public/` into `out/`. Video cache/MIME rules were removed earlier and must come back (WV3). `.dockerignore` does not exclude `public/videos`, so locally rendered files ship in both builds. |

---

## 1. Lineup

### 1.1 Films

| Id | Title (on screen) | Length | Theme | Lives on |
|---|---|---|---|---|
| `master` | One platform. Every business. | **100.0 s** | Every module and feature the frames evidence | `/` (new scene "See it in 100 seconds") |
| `owner` | The owner's morning. | 64.0 s | Home, Work Desk, performance, dashboards | `/work-desk/` |
| `money` | Books, banks and tax. | 72.0 s | Finance & Accounts, vouchers, day book, trial balance, fixed assets, Trade & Finance, Tax & IRD | `/platform/` |
| `stock` | Buy. Store. Make. Deliver. | 68.0 s | Purchase, Store & Inventory, stock report, Production, Transport | `/modules/` (in `#production`) |
| `sales` | From quotation to receipt. | 62.0 s | Sales & AR, quotation, counter billing, receivables, credit limits, Customer Services | `/modules/` (in `#sales`) |

`/industries/jewelry/` gets **no film in v1**: every new capture is the Paint demo, and the only Jewelry frames are `Home jewelry` and `Menu Jewelry` (two stills, not 60 s). A Paint walkthrough on the one "available now" product page would blur which edition is on sale. It gets a Jewelry cut when Jewelry-edition captures exist (risk 7.3).

The master is exactly 100.0 s so the home heading "See it in 100 seconds" is literally true.

### 1.2 Feature-to-evidence map (master)

Every beat cites its plate (section 1.3). Beats without a plate were cut.

| Feature (from the brief to HoD) | Master beat | Plate(s) | Evidence on the frame |
|---|---|---|---|
| Home & modules | M4 | `home-modules` | "Namaste, Paint", "Start with" favourites, 12 module cards with app one-liners |
| Ctrl K search | M5 | `home-topbar` | "Search the menu... Ctrl K" pill. Caption says *searches the menu* (not "finds any record") |
| BS + AD dates | M5, M12 | `home-dateline`, `daybook-head`, `invoices` | "2083-06-20 BS · 2026-10-06 AD"; separate DATE (AD) / DATE (BS) columns |
| Company switch | M5 | `home-topbar` | "Kathmandu Paints · switch company" |
| Work Desk "Needs you now" | M6 | `desk-main` | 3 CRITICAL cards, Review / Receive / Manufacturing Account buttons |
| Work Desk performance | M7 | `desk-perf`, `desk-main` | Assigned / Done / Complete / On time / Due today / Overdue, leaderboard; Coming up: TDS deposit, VAT return |
| Executive dashboard | M8 | `dashboards`, `exec` | Dashboards index; Sales · Aswin 2083 vs same days of Bhadra; running total against target; At a glance |
| Sales / AR | M9, M10 | `hub-sales`, `quotations`, `invoices` | Counter Operations, Quotation / Estimate, Sales Order, Delivery Note, Sales Invoice, Customer Receipt |
| Purchase / AP | M9 | `hub-purchase` | Purchase Requisition, RFQ, Supplier Quotations, Quotation comparison, Goods Receipt, Supplier Payment |
| Inventory / stock | M9, M11 | `hub-inventory`, `stock-report` | Store Indent, Godown Transfer, Stock Audit; Stock Report opening / in / out / closing |
| Production & manufacturing | M9 | `hub-production` | Production Plan, Order, Material Issue / Return, Production Receipt, Bills of Materials |
| Transport & delivery | M9 | `hub-transport` | Vehicle Trips, Freight Bill, Vehicles, Drivers |
| Customer services | M9 | `hub-services` | Birthdays & Anniversaries |
| Finance & accounts | M9, M10, M11 | `hub-accounts`, `vouchers`, `daybook`, `tb-balanced` | Vouchers, Day Book, Trial Balance "Balanced" |
| Fixed assets | M9 | `hub-fixedassets` | Fixed Asset Register, Post Depreciation, Fixed Asset Schedule |
| Trade & finance, LCs | M9, M10 | `hub-treasury`, `lcs` | Letters of Credit "From application to retirement", USD and NPR values |
| Tax & IRD | M9, M12 | `hub-tax` | VAT registers, Annex 13, Annex 9, CBMS Totals, TDS |
| Reports centre | M11 | `reports-centre` | "Find a report", 120 reports, saved report views |
| Standard reports | M11 | `daybook`, `stock-report`, `receivable`, `tb-balanced` | Day Book, Stock Report, Receivable Outstanding (List / Pivot / Graph, ageing), Trial Balance |
| Cash / bank voucher entry | M10 | `vouchers` | + Receipt / + Payment / + Receipt & Payment / + Contra; "Automatic" source = Letter of credit / Import loan |
| Quotations | M10 | `quotations` | "Within validity a quotation converts to a Sales Order at exactly the quoted prices." |
| POS | (cut, see 0) counter billing in M9/M10 | `hub-sales`, `invoices` | Counter Operations, Counter / Till, Sales Invoices list with VAT and payment status |
| Administration | M9 | `hub-admin` | "Control Panel: every setting in one place: company, users, documents, workflow, accounting and tax..." (the app now names it Control Panel; the Work Desk tab still says Administration) |
| One trade at a time | M13 | `jewelry-home` | Karigar / Workshop, Manufacturing, RFID, Gold Loans cards |

### 1.3 Plate registry (crop rectangles)

A **plate** = one redacted, cropped PNG at source resolution, produced by WV0 into `video/frames/<id>.png`. Rectangles are `left, top, width, height` in **source pixels**. They were measured on 1280-wide previews (x3 for 2x frames) and are accurate to about +-20 px: WV0 confirms each on the contact sheet and records the final numbers in `video/plates.mjs`. The `-full` files are 3810 px wide (scrollbar removed); re-measure x on those.

2x frames, folder `assests/app-captures/`:

| Plate id | Source file | Crop (l, t, w, h) | Content |
|---|---|---|---|
| `home-modules` | home.png | 980, 120, 2360, 1960 | Greeting, date line, Start with, 12 module cards, Recently opened |
| `home-topbar` | home.png | 520, 0, 2810, 108 | Back, Home, Modules, Ctrl K search, Help, company, switch company, BS date. Ends before the bell (x 3330) |
| `home-dateline` | home.png | 1000, 135, 700, 120 | "Namaste, Paint" + "2083-06-20 BS · 2026-10-06 AD · Kathmandu Paints" |
| `desk-main` | desk.png | 580, 120, 3120, 1800 | Header to the 5th "My work" row (excludes the Zhejiang row) |
| `desk-outstanding` | desk-full.png | 600, 2960, 2480, 640 | Outstanding: Receivable, Payable, Promised and ordered |
| `desk-sales30` | desk-full.png | 600, 3680, 1560, 790 | "Sales, last 30 days" bar chart |
| `desk-vat` | desk-full.png | 2160, 4450, 780, 250 | "VAT this month" card |
| `desk-perf` | desk_performance.png | 860, 120, 2600, 680 | Work Desk performance KPIs + leaderboard |
| `dashboards` | dashboards.png | 980, 120, 2360, 1320 | Dashboards index, 11 cards |
| `hub-sales` | home_sales.png | 980, 120, 2360, 1700 | Sales & Accounts Receivable hub |
| `hub-purchase` | home_purchase.png | 980, 120, 2360, 1700 | Purchase & Accounts Payable hub |
| `hub-inventory` | home_inventory.png | 980, 120, 2360, 1800 | Store & Inventory hub |
| `hub-production` | home_process-mfg.png | 980, 120, 2360, 1530 | Production hub |
| `hub-transport` | home_transport.png | 980, 120, 2360, 1330 | Transport & Delivery hub |
| `hub-services` | home_services.png | 980, 120, 1300, 500 | Customer Services hub (two cards) |
| `hub-accounts` | home_accounts-full.png | 950, 120, 2380, 2440 | Finance & Accounts hub, full Reports card |
| `hub-fixedassets` | home_fixedassets.png | 980, 120, 1780, 640 | Fixed Assets hub (three cards) |
| `hub-treasury` | home_treasury.png | 980, 120, 2360, 1480 | Trade & Finance hub |
| `hub-tax` | home_tax.png | 980, 120, 2360, 1500 | Tax & IRD hub |
| `hub-admin` | home_admin.png | 980, 120, 2360, 500 | Control Panel hub |
| `reports-centre` | reports-centre-full.png | 960, 110, 2400, 4460 | Search, module chips, saved views, all 12 report cards (tall: camera scrolls) |
| `vouchers` | vouchers_cash-bank.png | 480, 120, 3350, 1380 | Cash / Bank Voucher list |
| `daybook-head` | reports_standard_day-book.png | 480, 120, 1700, 170 | "Day Book" + "2026-07-17 to 2026-10-06 AD · 2083-04-01 to 2083-06-20 BS · 54 vouchers" |
| `daybook` | reports_standard_day-book.png | 480, 640, 3330, 1060 | Printable header, first three vouchers (stops above the Everest line at y ~1710) |
| `stock-report` | reports_standard_stock-summary.png | 480, 120, 3330, 2040 | Stock Report, filters, product table |
| `tb-top` | reports_trial-balance.png | 480, 120, 3330, 2040 | Trial Balance header and ledger rows |
| `tb-balanced` | reports_trial-balance-full.png | 440, 3300, 3370, 346 | Total row and "Balanced" |
| `receivable` | reports_receivable-outstanding.png | 480, 120, 3350, 720 | Receivable Outstanding with List / Pivot / Graph and ageing buckets |
| `lcs` | treasury_lcs.png | 480, 120, 3350, 680 | Letters of Credit list |
| `quotations` | quotations.png | 480, 120, 3350, 560 | Quotation / Estimate list |
| `invoices` | pos.png | 480, 120, 3350, 1140 | Sales Invoices list |
| `general-sales-head` | pos_general.png | 480, 120, 1500, 130 | "General Sales · 9 recorded — non-serialized stock sold by quantity and rate." |

1x frames, folder `../Tivora ERP/Assests/` (same redactions as `scripts/prep-screens.mjs`):

| Plate id | Source file | Crop | Content |
|---|---|---|---|
| `exec` | Executive dash Paint.PNG | 300, 70, 1608, 851 | Executive dashboard without sidebar and top bar |
| `sales-dash` | sales dash paint.PNG | 300, 70, 1605, 851 | Sales & AR dashboard |
| `jewelry-home` | Home jewelry.PNG | 300, 0, 1587, 918 | Jewelry Home: quick entries and module grid |
| `menu-jewelry` | Menu Jewelry.PNG | 0, 0, 289, 930 | Jewelry menu strip |

Unused on purpose: `start`, `home_reports`, every `-full` not listed above, `Dashboards.PNG`, `Finance and sales dash paint.PNG` (its "A loss" / negative cash cards are not a launch image), `Work Desk Paint.PNG` (replaced by the 2x `desk`), `Menu 1.PNG`, `classic.PNG`.

### 1.4 Callout anchors (percent of plate: x, y, w, h)

Computed from the crops above; WV1/WV2 fine-tune on the rendered frame (a ring must sit on the UI it names, with 1-2% padding).

- `home-modules`: greeting + date 1.2, 1.5, 28.5, 4.6 · Start with buttons 1.2, 11.8, 40.6, 3.5 · module grid 1.2, 23.0, 97.7, 58.2 · Recently opened 1.2, 84.2, 97.7, 15.0.
- `home-topbar`: Ctrl K pill 20.4, 14, 27.3, 69 · company 74.6, 14, 9.8, 69 · switch company 85.4, 14, 6.4, 69 · BS date 92.3, 14, 7.3, 69.
- `desk-main`: header 0.9, 1.3, 39.6, 5.3 · module tabs 0.9, 9.0, 85.1, 3.0 · Needs you now row 0.9, 15.0, 73.8, 22.8 · card 1 1.0, 18.2, 23.8, 19.5 · card 2 25.9, 18.2, 23.8, 19.5 · card 3 50.7, 18.2, 23.8, 19.5 (action buttons sit in the bottom-right 30% x 20% of each card) · Late / Today / This week / Snoozed tabs 1.0, 42.5, 22.0, 3.5 · Coming up 79.1, 45.3, 20.3, 13.3 · Today in numbers 79.1, 61.7, 20.3, 20.0.
- `desk-perf`: KPI row 0.8, 24.3, 98.4, 22.5 · leaderboard 0.8, 52.9, 98.4, 33.5.
- `dashboards`: Executive card 1.3, 15.9, 31.8, 18.9 · Production card 1.3, 58.4, 31.8, 18.9.
- `exec` (1x): sales card 1.2, 23.5, 40.0, 44.7 · running total 42.4, 23.5, 56.0, 44.7 · At a glance first three cards 1.2, 71.0, 61.5, 29.0 (never frame the fourth "Cash & bank" card alone: it shows negative figures).
- Every `hub-*` (width 2360): title block 1.2, 0.8, 71.7, (180 / plate h) · Dashboard card x 1.2 w 23.5 · Entries x 26.0 w 23.4 · Masters x 50.8 w 23.4 · Reports x 75.6 w 23.4; cards start at y = (480 - 120) / plate h (360 / plate h) except `hub-services`, `hub-tax`, `hub-admin` where they start at (366 - 120) / plate h.
- `hub-tax`: Reports card 50.8, 16.4, 23.3, 81.2 · Annex 13 / Annex 9 / CBMS lines 52.2, 51.6, 17.2, 11.8 · TDS lines 52.2, 83.6, 17.2, 11.4.
- `reports-centre`: search box 1.9, 3.9, 32.0, 1.6 · "120 reports" 91.5, 8.5, 6.5, 0.6 · Tax & IRD card 26.4, 75.1, 22.8, 24.4.
- `vouchers`: + Receipt ... + Contra buttons 73.3, 2.2, 26.1, 5.4 · DATE (AD / BS) column 10.2, 29.3, 8.1, 67.0 · "Automatic" source chips rows 1, 6, 7, 9: 28.3, 30.4, 6.0, 4.0 (row pitch 7.6%).
- `daybook`: printable header 2.4, 9.0, 30.0, 8.0 · DATE column (AD over BS) 3.0, 30.0, 4.7, 60.0 · "VAT Receivable (Input)" line 24.8, 88.0, 9.0, 3.0.
- `stock-report`: filters 1.6, 10.3, 97.3, 7.4 · CLOSING QTY column 86.5, 28.0, 10.8, 72.0.
- `tb-balanced`: total row 1.0, 46.5, 98.0, 14.2 · "Balanced" 2.1, 79.0, 4.5, 11.0.
- `receivable`: List / Pivot / Graph ... Export toolbar 1.7, 30.6, 57.0, 8.3 · ageing buckets 73.9, 47.9, 24.8, 47.9.
- `lcs`: subtitle 1.0, 11.5, 38.1, 4.9 · FC VALUE + NPR columns 47.5, 39.7, 18.8, 48.5 · STATE column 82.5, 39.7, 6.0, 48.5.
- `quotations`: subtitle 1.0, 11.8, 34.2, 5.9 · status "Order SO-00003" 82.4, 74.0, 6.3, 7.5.
- `invoices`: All / Unpaid / Partly paid / Overdue / Paid pills 1.0, 14.5, 23.4, 4.0 · DATE (AD) + DATE (BS) 9.1, 30.3, 14.1, 61.8 · VAT 60.9, 30.3, 7.2, 61.8 · PAYMENT chips 77.9, 30.3, 7.2, 61.8.
- `jewelry-home` (1x): quick entries 4.3, 1.5, 61.4, 4.4 · Karigar / Workshop 4.5, 41.0, 21.8, 24.7 · RFID 73.2, 41.0, 21.9, 24.7 · Gold Loans 4.5, 68.0, 21.8, 20.7.

---

## 2. Storyboards

### 2.0 Shared look, grammar and tokens

**Canvas.** 1920x1080, 30 fps, title-safe margins 96 px left/right, 72 px top/bottom. Silent: no audio track at all.

**Tones** (REVAMP-SPEC B1, read from the built site CSS, never re-typed): `night` #110D08 ground with `.bg-ember` glow for logo, type and world scenes; `ground` #F6F4F0 for screen scenes; `paper` for caption panels. Gold is never text on light (B2).

**Type** (fonts come from the built site CSS: Source Serif 4 600, Manrope, IBM Plex Mono 500):

| Role | Spec at 1080p | Use |
|---|---|---|
| Giant | serif 600, 300 px, line-height 0.85, letter-spacing -0.04em | one or two words, full-bleed moments ("2083", "Balanced.") |
| Display | serif 600, 120 px, -0.025em | film titles, tagline |
| H2 caption | serif 600, 64 px, -0.015em, max 22 ch per line, 2 lines max | the main caption line |
| Kicker | Manrope 700, 32 px | sub-line under an H2, module wall line |
| Eyebrow | Plex Mono 500, 20 px, uppercase, 0.14em | scene labels, doc numbers, demo bug |
| Callout label | Manrope 700, 22 px, ink on gold chip, radius 10 px | label beside a ring |

**Caption placement.** Captions sit in the lower-left zone (x 96-1000, y 760-984). On `ground` scenes the caption sits on a `paper` panel (radius 24, padding 32/40, `--shadow-card`): text never sits directly on a screenshot (B2). On `night` scenes no panel. Reading rule: on screen at least max(1.2 s, characters / 15 s); the module wall (M9) is the one documented exception, because the module name is also legible in the frame and the transcript carries the text.

**Screen presentation.** A plate is shown in the site's browser frame look (`Screen.tsx`: `--radius-frame` 14 px scaled, three dots, address pill "Tivora ERP", `--shadow-frame`). Stage box: plate fitted to 1600 px wide (z = 1) or 880 px tall for tall plates, centred; when a caption panel is up, the focal point is shifted to x = 62% of the frame so UI and caption don't overlap. Camera = `{t, x, y, z}`: focal point in % of the plate, zoom relative to fit. **Zoom limits:** 2x plates z <= 2.2; 1x plates (`exec`, `sales-dash`, `jewelry-home`, `menu-jewelry`) z <= 1.6. Ken-burns drift between keys: linear, <= 0.6% of plate per second, so held frames still breathe.

**3D tilt.** Entries use `perspective: 2400px` with `rotateX(8deg) rotateY(-12deg)` settling to 0 over 1.2 s (`expo.out`). Nothing tilts more than 14 degrees. Text in a plate must be flat (0 degrees) whenever a caption refers to it.

**Callouts.** Gold 3 px ring (rounded rect, radius 10 px) around the anchor from 1.4; drawn with `stroke-dashoffset` in `--duration-base`; optional spotlight (rest of plate darkened by a `rgb(17 13 8 / 0.35)` overlay, fade `--duration-slow`); optional label chip outside the ring. Markers point at real UI; they never cover or alter it. Max two rings at once.

**Transitions** (only these five):

| Code | Name | What | Duration / ease |
|---|---|---|---|
| T1 | Mask open | rounded-square clip (`inset(..% round 32%)`, the symbol's corner ratio `--radius-module`) opens to full frame, or closes to a square | 0.9 s, `inOut` |
| T2 | Push-through | camera zooms into a UI element (scale x6 in the last 0.4 s) and match-cuts to the plate that element opens | 0.7 s, `expo.out` |
| T3 | Slide stack | next plate rises from y +12% with the entry tilt while the previous recedes (scale 0.92, opacity 0) | 0.7 s, `expo.out` |
| T4 | Type wipe | a giant word crosses the frame and its body carries the tone change night <-> ground | 1.0 s, `inOut` |
| T5 | Cut | hard cut, only on a caption change | 0 |

**Motion tokens** (from `src/lib/motion.ts`, mirroring `globals.css`): `expo.out` (= `--ease-out-expo`) for arrivals; `power2.inOut` (= `--ease-in-out`) for camera pans and masks; durations `fast` 0.16 s (ring pop), `base` 0.32 s (caption out, ring draw), `slow` 0.7 s (caption in: 24 px rise + fade, plate entrances), `reveal` 1.0 s (titles, T4). Nothing else.

**Logo.** Only `/brand/tivora-symbol-dark.svg` and `/brand/tivora-logo-dark.svg` on night, via `<img>`, never retyped, recoloured or outlined. The only transform allowed beyond scale/opacity is the hero's documented isometric tilt of the symbol file (`rotateX(55deg) rotateZ(-45deg)`). Lockup at least 560 px wide (descriptor legible). Clear space 1/4 of the symbol height.

**Isometric world.** The real world SVG from the home page (extracted by WV1 from the built page, section 4), camera on its `data-cam` group exactly like `makeCamera` in `world.ts`; districts `data-d` = counter, godown, floor, ledger; links `data-link` lit via `stroke-dashoffset`; chip `data-chip` (`SI-2083/84-00001`). Never shown as the logo.

**Demo caption.** First Paint plate in each film: the full standard caption `Demo company "Kathmandu Paints", sample figures. The Paint edition is coming.` for 3.0 s as an eyebrow line bottom-right. After that, a persistent bug bottom-right on every Paint plate: `Demo company · sample figures` (mono 18 px, `--color-muted`). Jewelry plate: `Tivora ERP – Jewelry, demo data.` The end card repeats the full Paint caption.

**Shared end card** (every film, last 4.0 s, night): reversed lockup 560 px wide, top-centre; display line **Request a demo**; below in Manrope 32 px ground: `www.hitechnepal.com.np`; mono 24 px muted-dark: `01-5389641 · 01-5389642 · 01-5389643`; bottom eyebrow: `Tivora ERP is a product of HiTech Solutions and Services Pvt. Ltd., Kathmandu.` and the full Paint demo caption. Entrance: lockup fade + 24 px rise (slow), lines stagger 0.12 s.

**Shared cut intro** (cuts only, 0.0-4.0 s, night): symbol scales 0.9 -> 1 with ember glow (reveal, expo.out); at 1.0 s the film title in Display rises in to the right of the symbol; eyebrow above it `Tivora ERP · <theme>`; at 3.3 s everything fades (base) or wipes (T4) into the first scene.

**Shared cut outro** (cuts only, last 6.5 s): 2.5 s lockup + tagline **One platform. Every business.** (Display, centred, fade-up slow), then the 4.0 s end card.

Timecodes below are `mm:ss.s` absolute. "Hold" = camera drift only.

### 2.1 MASTER: "One platform. Every business." (100.0 s, poster at 00:33.0)

| # | In - Out | Tone | Picture and camera | On-screen text (exact) | Overlays | Out transition |
|---|---|---|---|---|---|---|
| M0 | 00:00.0 - 00:03.5 | night | Black to ember glow (0-0.7 s). Symbol (dark) centre, 22% of frame height, scale 0.9 -> 1.0 (reveal). At 1.4 s the full lockup replaces it by a left-to-right clip wipe (slow). | Eyebrow above lockup, 2.0 s: `TIVORA ERP · FROM HITECH, KATHMANDU` | none | at 3.0 s lockup cross-fades back to the symbol alone (base) |
| M1 | 00:03.5 - 00:09.0 | night | Symbol tilts isometric (rotateX 55, rotateZ -45, scale 1 -> 1.6, 1.6 s inOut) and cross-fades into the world (3.9-4.6 s) whose four slab tops sit where the projected squares were; districts separate along the diagonals (1.2 s expo.out). Camera slow push 1.0 -> 1.1. | Giant, left third, stacked: `One platform.` (3.8-6.4 s) then `Every business.` (6.4-9.0 s) | none | T5 on caption change |
| M2 | 00:09.0 - 00:19.0 | night | Chip `SI-2083/84-00001` travels Counter -> Godown -> Floor -> Ledger (2.0 s per district: 0.7 s travel expo.out, 1.3 s dwell); link behind it lights gold; camera pans/zooms to the active district (scale 1.0 -> 1.35), inactive districts 35% opacity. 17.0-19.0 s: all lit, camera pulls back to 1.0, chip parked on Ledger. | H2, lower-left, one per district: `A bill at the counter.` · `The stock moves with it.` · `The floor knows what to make.` · `And the ledger already has it.` then 17.0-19.0 s Display centred: `Typed once. Every number agrees.` | Info card pinned to the active district (night-3 card, mono eyebrow + Manrope 24): `Sales & Accounts Receivable` · `Store & Inventory` · `Production` · `Finance & Accounts · Tax & IRD` | T1 into M3 |
| M3 | 00:19.0 - 00:22.0 | night -> ground | Ledger slab's top face scales to cover the frame; at 19.6 s `home-modules` reveals through T1 (rounded square -> full frame at radius-frame); background tweens night -> ground 19.6-21.0 s. Plate full view z 1.0. | H2 on paper panel: `This is the real screen.` + demo caption (full, 3.0 s) | none | hold into M4 |
| M4 | 00:22.0 - 00:27.0 | ground | `home-modules`: 0-1.5 s z 1.0 focal 50,40; ring on Start with; 1.5-5.0 s push to module grid (z 1.35, focal 50,52, inOut 2.0 s), slow drift down. | H2: `Every module, one Home.` kicker (from 2.2 s): `Star any entry to keep it here.` | ring: Start with buttons (0.4-2.0 s), then module grid (2.4-4.6 s) | T3 |
| M5 | 00:27.0 - 00:31.0 | ground | `home-topbar` enters as a wide strip at z 1.0 (strip fills 1600 px), tilt entry; 0.6 s push to the Ctrl K pill (z 1.9, focal 34,50); 2.2 s pan right to company / switch / BS date (focal 86,50). | H2: `Ctrl K searches the menu.` (27.2-29.2) then `One login. Switch company. Dates in BS and AD.` (29.2-31.0) | ring Ctrl K pill; then ring around company + switch company; then BS date | T3 |
| M6 | 00:31.0 - 00:37.0 | ground | `desk-main` slides up (T3). 0-1.2 s z 1.0 focal 45,30; 1.2-2.0 s push to Needs you now row (z 1.45, focal 37,27); then ring each card 1.3 s each with a 0.2 s slide of focal point between cards. | H2: `Mornings start with what needs you.` (31.2-33.6), kicker cycles with the rings: `Over the credit limit.` · `An order late on the floor.` · `A journal not posted.` | 3 numbered gold markers (28 px ring, numerals 1-3, mono) on the CRITICAL chips; ring on each card's action button when its kicker shows | T5 |
| M7 | 00:37.0 - 00:41.0 | ground | Split: left 45% `desk-main` cropped live to Coming up (focal 89,52, z 1.9); right 55% `desk-perf` KPI row (focal 50,35, z 1.2). Both enter T3 staggered 0.12 s. | H2: `What's due, and who is on time.` | ring on "Deposit the TDS withheld in Bhadra" + "File Bhadra's VAT return"; ring on ON TIME + OVERDUE KPIs | T3 |
| M8 | 00:41.0 - 00:46.0 | ground | `dashboards` z 1.0 (0-1.6 s), ring on Executive card; T2 push-through into it (1.6-2.3 s) match-cut to `exec` at z 1.0; 2.3-5.0 s push to sales card (z 1.5, focal 21,46) then pan to running total (focal 70,46). | H2: `A dashboard for every module.` (41.2-43.2) then `The whole business on one page.` (43.3-46.0) | rings: Executive card; then sales card "vs the same days of Bhadra" line | T5 |
| M9 | 00:46.0 - 01:01.0 | ground | **Module wall.** 12 hub plates on a 3D wall (4 x 3 grid, `rotateY(-14deg) rotateX(6deg)`, tiles 1100 px wide with 80 px gaps). Camera flies tile to tile, 1.25 s each (0.45 s move inOut, 0.8 s dwell at z so the tile fills 1400 px); active tile flat (0 deg) while dwelling, others 40% opacity. Order: sales, purchase, inventory, production, transport, services, accounts, fixedassets, treasury, tax, admin, reports-centre (top area only). | Top-left module name in H2 (exactly the app name), kicker beneath: Sales & Accounts Receivable · `Counter to receipt.` / Purchase & Accounts Payable · `Requisition to payment.` / Store & Inventory · `Every godown.` / Production · `BOM to batch cost.` / Transport & Delivery · `Trips and freight.` / Customer Services · `Birthdays, anniversaries.` / Finance & Accounts · `Vouchers to final accounts.` / Fixed Assets · `Register and depreciation.` / Trade & Finance · `LCs and foreign currency.` / Tax & IRD · `VAT, Annex 9 and 13, TDS.` / Control Panel · `Every setting, one place.` / Reports Centre · `Every report, one place.` | one ring per tile on the evidence: Counter Operations button; RFQ + Supplier Quotations; Godown Transfer; Bills of Materials; Vehicle Trips; Birthdays & Anniversaries; Final accounts block; Post Depreciation; Letters of Credit; Annex lines; description line; "All Reports" | at 01:00.4 the wall pulls back to show all 12 tiles at once (0.6 s), then T3 |
| M10 | 01:01.0 - 01:11.0 | ground | Four proof shots, 2.5 s each, T3 between them, each z 1.0 -> 1.25 push to its callout: `quotations` (focal 30,40) · `invoices` (focal 65,55) · `vouchers` (focal 30,50) · `lcs` (focal 45,50). | `A quotation becomes the sales order, at the quoted prices.` · `Every bill with its VAT, paid or not.` · `LC and import-loan payments post as automatic vouchers.` · `Letters of credit, from application to retirement.` | rings: subtitle + "Order SO-00003" · VAT column + PAYMENT chips · "Automatic" chips · FC VALUE + NPR columns | T3 |
| M11 | 01:11.0 - 01:20.0 | ground | `reports-centre` 2.5 s: camera scrolls the tall plate (focal y 8% -> 60%, z 1.4); `daybook-head` + `daybook` 1.75 s (head strip on top, table below, push to the DATE column); `stock-report` 1.5 s (pan along to CLOSING QTY); `receivable` 1.25 s (ring toolbar + ageing); `tb-balanced` 2.0 s: push to "Balanced" (z 2.0) and hold. | `Every report, in one searchable place.` (71.2-73.5) · `Day book in BS and AD.` · `Stock: opening, in, out, closing.` · `Ageing, as a list, pivot or graph.` · Giant (centre, 78.0-80.0): `Balanced.` | rings as listed; on "Balanced" a gold underline sweep (0.32 s) under the app's own "Balanced" | T4: the giant `Balanced.` carries the ground -> night change |
| M12 | 01:20.0 - 01:26.0 | night | Giant `2083` full width, gold fill sweep left-to-right via `background-clip: text` (0-1.4 s), then slides up 18% while four lines stack in, one every 0.9 s (slow, 24 px rise). | Mono under 2083: `2083-06-20 BS · 2026-10-06 AD` · H2: `Made for the way Nepal does business.` · lines (Manrope 32): `Bikram Sambat dates and fiscal years.` / `VAT registers, Annex 9 and Annex 13.` / `TDS by party, with certificates.` / `CBMS-ready, built to IRD's current formats.` | none | T1 closing to a square that becomes the Jewelry plate frame |
| M13 | 01:26.0 - 01:30.0 | night | `jewelry-home` in a frame at 62% width, right; `menu-jewelry` strip overlaps its left edge (y parallax +40 px over 4 s). Camera z 1.0 -> 1.2 toward the Karigar / RFID / Gold Loans row. | H2: `Built one trade at a time.` · line 1 with green "Available now" pill (ok / ok-tint): `Tivora ERP – Jewelry` · line 2 with "Coming" pill (muted): `General trading and Paint` · Jewelry demo caption | rings: Karigar / Workshop, RFID, Gold Loans (0.4 s stagger) | plates fly back (scale 0.4, toward centre, 0.7 s) |
| M14 | 01:30.0 - 01:35.0 | night | The world returns small and centred, districts slide back along the diagonals into four slabs (1.0 s inOut), slabs un-tilt and cross-fade into the symbol `<img>` (exact inverse of M1, 1.2 s); symbol -> lockup wipe (0.7 s). | Display under the lockup: `One platform. Every business.` | none | lockup moves up into end-card position |
| M15 | 01:35.0 - 01:40.0 | night | Shared end card (holds 5.0 s here). | as section 2.0 | none | end (last frame = end card, also used as the fallback still) |

### 2.2 CUT `owner`: "The owner's morning." (64.0 s, poster at 00:19.0)

| # | In - Out | Picture and camera | On-screen text (exact) | Overlays |
|---|---|---|---|---|
| O0 | 00:00.0 - 00:04.0 | Shared cut intro, eyebrow `TIVORA ERP · WORK DESK & DASHBOARDS` | Display: `The owner's morning.` | |
| O1 | 00:04.0 - 00:09.0 | T1 open into `home-modules`, focal 25,8 z 1.6 (greeting + Start with), drift right. | H2: `Namaste. Your entries, one click away.` kicker: `Star any entry to keep it on Home.` | ring Start with; demo caption full |
| O2 | 00:09.0 - 00:17.0 | T3 to `desk-main` z 1.0 (0-1.5 s); push to header (focal 22,4 z 1.8); pan along module tabs (focal 50,10); drop to Late / Today / This week / Snoozed (focal 15,44). | `One desk for every module.` (9.2-12.6) · `Late, today, this week, snoozed.` (12.8-17.0) | rings: header; module tab counts; the four tabs |
| O3 | 00:17.0 - 00:27.0 | Needs you now, one card per 3.3 s at z 2.0 (focal on card 1 / 2 / 3 centres: 13,28 / 38,28 / 63,28), 0.3 s pans between. | H2 per card: `A customer over the credit limit.` · `A production order 55 days late.` · `A journal not posted.` kicker (all three): `The action is one click away.` | marker 1-3 on CRITICAL chips; ring on Review / Receive / Manufacturing Account |
| O4 | 00:27.0 - 00:32.0 | Focal 89,52 z 2.0 (Coming up), then down to Today in numbers (focal 89,70). | `Coming up: the TDS deposit and the VAT return.` | ring Coming up rows |
| O5 | 00:32.0 - 00:38.0 | T3 `desk-outstanding` z 1.0, push to Receivable + Payable (focal 30,45 z 1.3); T5 to `desk-sales30` at 35.0 s, bars rise via a left-to-right clip reveal of the real chart (0.7 s). | `Who owes you, and whom you owe.` · `Sales, last 30 days.` | ring the two totals (₹ figures visible in UI, never typed in a caption) |
| O6 | 00:38.0 - 00:42.0 | `desk-vat` card centred at 900 px wide, flat, slow push. | `VAT this month: output less input.` | ring the card's sub-line |
| O7 | 00:42.0 - 00:47.0 | T3 `desk-perf`, KPI row then leaderboard (focal 50,35 -> 50,68). | `Assigned, done, on time, overdue.` kicker: `Per person, by week or month.` | rings ON TIME, OVERDUE; Month / Week toggle |
| O8 | 00:47.0 - 00:51.0 | T3 `dashboards` z 1.0, drift; T2 into Executive card. | `A dashboard for every module.` kicker: `Open items, critical, late.` | ring the "open items · critical · late" lines of two cards |
| O9 | 00:51.0 - 00:57.5 | `exec` three stops 2.1 s each (sales card focal 21,46 z 1.5; running total focal 70,46 z 1.4; glance focal 32,85 z 1.4). | `Sales against the same days of Bhadra.` · `A running total against target.` · `What customers owe. What you owe.` | rings per stop |
| O10 | 00:57.5 - 01:04.0 | Shared cut outro | `One platform. Every business.` then end card | |

### 2.3 CUT `money`: "Books, banks and tax." (72.0 s, poster at 00:28.0)

| # | In - Out | Picture and camera | On-screen text (exact) | Overlays |
|---|---|---|---|---|
| F0 | 00:00.0 - 00:04.0 | Shared cut intro, eyebrow `TIVORA ERP · FINANCE, TRADE & TAX` | Display: `Books, banks and tax.` | |
| F1 | 00:04.0 - 00:10.0 | T1 into `hub-accounts` (tall): title block (z 1.4) then camera scrolls down the Reports card (focal 87,10 -> 87,80). | `Vouchers, books, cheques and the final accounts.` | rings Entries card; then Final accounts block |
| F2 | 00:10.0 - 00:18.0 | T3 `vouchers`: buttons (focal 86,5 z 1.8), then rows (focal 30,55 z 1.3). | `Receipts, payments and contra, against a cash or bank book.` (10.2-14.0) · `LC and import-loan payments post as automatic vouchers.` (14.2-18.0) | ring + Receipt ... + Contra; ring the "Automatic" chips |
| F3 | 00:18.0 - 00:25.0 | `daybook-head` strip drops in on top (slow), `daybook` below; push to DATE column (z 1.8, focal 6,55), pan to the VAT line (focal 30,88). | `Every voucher in date order. BS and AD.` · `VAT on the purchase, already in the books.` | rings head period line; DATE column; VAT Receivable (Input) |
| F4 | 00:25.0 - 00:32.0 | `tb-top` z 1.0 then camera scrolls (focal 50,30 -> 50,85, 3.0 s); T5 to `tb-balanced`, push to "Balanced" (z 2.2). | `Trial balance, up to today.` then Giant centred (29.6-32.0): `Balanced.` | ring "Balanced"; gold underline sweep |
| F5 | 00:32.0 - 00:36.0 | `hub-accounts` Final accounts + Cost centre blocks (focal 87,60 z 1.8). | `P&L, balance sheet, cash flow, funds flow.` | ring Final accounts |
| F6 | 00:36.0 - 00:41.0 | T3 `hub-fixedassets`, z 1.2, drift. | `Asset register, depreciation, the asset schedule.` | rings Fixed Asset Register, Post Depreciation, Fixed Asset Schedule |
| F7 | 00:41.0 - 00:49.0 | T3 `hub-treasury` (41-44.5: quick entries + Entries card), T2 into "Letters of Credit" to `lcs` (44.5-49). | `Letters of credit, import loans, bank guarantees.` · `From application to retirement.` | rings Letters of Credit, Import Loans (TR / STL), Bank Guarantee; then FC VALUE + NPR, STATE |
| F8 | 00:49.0 - 00:52.0 | Back to `hub-treasury` Reports card (focal 87,40 z 1.8). | `Foreign-currency exposure and month-end revaluation.` | ring FC Exposure & Revaluation, Facility Utilisation & Headroom |
| F9 | 00:52.0 - 01:00.0 | T3 `hub-tax`: Reports card VAT block (52-54.7), IRD returns block (54.7-57.4), TDS block (57.4-60). z 1.9. | `VAT registers and the monthly VAT report.` · `Annex 13, Annex 9 and CBMS totals.` · `TDS by party, with certificates.` | rings per block (never on the hub description line) |
| F10 | 01:00.0 - 01:05.5 | T4 to night: Giant `2083` gold sweep, mono `2083-06-20 BS · 2026-10-06 AD`. | H2: `CBMS-ready. Built to IRD's current formats.` | |
| F11 | 01:05.5 - 01:12.0 | Shared cut outro | | |

### 2.4 CUT `stock`: "Buy. Store. Make. Deliver." (68.0 s, poster at 00:38.0)

| # | In - Out | Picture and camera | On-screen text (exact) | Overlays |
|---|---|---|---|---|
| S0 | 00:00.0 - 00:04.0 | Shared cut intro, eyebrow `TIVORA ERP · STOCK & PRODUCTION` | Display: `Buy. Store. Make. Deliver.` | |
| S1 | 00:04.0 - 00:07.0 | World (night), chip parked on Godown, camera on Godown + Floor (scale 1.25), links Godown-Floor lit. | H2: `The stock moves with it.` (beats.ts) | info card `Store & Inventory` |
| S2 | 00:07.0 - 00:16.0 | T1 into `hub-purchase`: quick entries (focal 25,9 z 1.8), Entries card scroll (focal 37,40 -> 37,70). | `From requisition and RFQ to the order.` · `Supplier quotations, compared.` · `Import costs, pooled into the goods.` | rings Purchase Requisition + RFQ; Quotation comparison; Import Costs (pooled) + Landed Cost Sheet |
| S3 | 00:16.0 - 00:20.0 | Reports card (focal 87,40 z 1.8). | `Received but not billed. Payables ageing.` | rings Goods Received Not Billed, Payables Ageing, Reorder Report |
| S4 | 00:20.0 - 00:28.0 | T3 `hub-inventory`: Entries (focal 37,40), Masters (focal 62,45), Reports (focal 87,45), z 1.8. | `Indents, approvals, godown transfers, stock audit.` · `Batches, HSN and every godown.` · `Stock valued, with NRV.` | rings per card |
| S5 | 00:28.0 - 00:34.0 | T3 `stock-report`: filters (z 1.6, focal 50,13), then pan the table to CLOSING QTY (focal 85,55). | `Opening, inward, outward, closing.` kicker: `Product by product, in a second unit if you need it.` | rings filter row ("2nd unit"); CLOSING QTY |
| S6 | 00:34.0 - 00:44.0 | T3 `hub-production`: quick entries (34-37), Masters (37-40), Reports (40-44). | `Plan, order, issue, receive.` · `Bills of materials, plants and machines.` · `Yield and loss. Batch trace. Machine efficiency.` | rings Production Plan ... Production Receipt; Bills of Materials, Plants & Machines, Downtime Reasons; Yield and Loss, Batch Trace, Machine & Supervisor Efficiency, Manufacturing Account |
| S7 | 00:44.0 - 00:49.0 | `desk-main` card 2 at z 2.0 (focal 38,28). | `A late order reaches the owner's desk.` | marker on CRITICAL; ring Receive |
| S8 | 00:49.0 - 00:55.0 | T3 `hub-transport`, quick entries then Reports. | `Own vehicles, hired transporters, freight bills.` · `Document expiry for vehicles and drivers.` | rings Vehicle Trips + Freight Bill; Vehicle & Driver Document Expiry, Freight Cost per Customer |
| S9 | 00:55.0 - 01:01.5 | T4 to night; world: chip runs Godown -> Floor -> Ledger (2.0 s each), all lit at the end. | `The floor knows what to make.` then `And the ledger already has it.` | info cards as master M2 |
| S10 | 01:01.5 - 01:08.0 | Shared cut outro | | |

### 2.5 CUT `sales`: "From quotation to receipt." (62.0 s, poster at 00:22.0)

| # | In - Out | Picture and camera | On-screen text (exact) | Overlays |
|---|---|---|---|---|
| A0 | 00:00.0 - 00:04.0 | Shared cut intro, eyebrow `TIVORA ERP · SALES & RECEIVABLES` | Display: `From quotation to receipt.` | |
| A1 | 00:04.0 - 00:12.0 | T1 into `hub-sales`: quick entries (focal 25,9 z 1.8) 4-7 s; Masters PRICING + SALES SETUP (focal 62,40) 7-9.5 s; Reports (focal 87,55) 9.5-12 s. | `Day start at the counter.` · `Price lists, discount schemes, counters and tills.` · `Below-floor sales and temporary credit limits, reported.` | rings Counter Operations; Price List, Discount Scheme, Counter / Till; Below-floor Sales, Temporary Credit Limits & Overrides |
| A2 | 00:12.0 - 00:18.0 | T3 `quotations` z 1.0 -> 1.5 (focal 30,30 then 85,75). | `A quotation becomes the sales order, at the quoted prices.` | rings subtitle; "Order SO-00003" |
| A3 | 00:18.0 - 00:27.0 | T3 `invoices`: pills (18-21), dates (21-24), VAT + payment (24-27), z 1.6. | `Every bill, dated in AD and BS.` · `VAT on every line of the list.` · `Paid, partly paid, unpaid.` | rings pills; DATE (AD) + DATE (BS); VAT; PAYMENT |
| A4 | 00:27.0 - 00:30.0 | `general-sales-head` strip, z 1.0 flat, slow push. | `Sold by quantity and rate.` | ring the subtitle |
| A5 | 00:30.0 - 00:38.0 | T3 `receivable`: toolbar (30-34), ageing buckets (34-38). | `What each customer still owes.` · `0-30, 31-60, 61-90, over 90 days.` | rings List / Pivot / Graph; ageing headers |
| A6 | 00:38.0 - 00:43.0 | `desk-main` card 1 (focal 13,28 z 2.0), then T2 into `exec` glance (focal 50,85 z 1.5) showing "1 customer over the credit limit". | `Over the credit limit, flagged on the Work Desk.` | marker on card 1; ring the red pill on `exec` |
| A7 | 00:43.0 - 00:48.5 | T3 `sales-dash` (1x): sales card (z 1.3), then "Quotations turned into orders". | `Sales against the same days last month.` · `Quotations turned into orders.` | rings |
| A8 | 00:48.5 - 00:55.5 | T3 `hub-services` (z 1.3), push to Birthdays & Anniversaries. | `The dates that bring customers back.` kicker: `Birthdays and anniversaries.` | ring the report |
| A9 | 00:55.5 - 01:02.0 | Shared cut outro | | |

### 2.6 Caption rules (all films)

- Short, specific, the trade's own words; app labels quoted exactly. Never: seamless, unlock, empower, next-gen, revolution, all-in-one, effortless, real-time, instantly, smart, AI.
- No ₹ / Rs / NPR figures typed in captions (they may be visible in the UI as demo data).
- Never "available now" except the Jewelry line in M13; nothing else implies it is on sale.
- No customer or supplier names in any caption, no HiTech figures in any film (they belong on About).

---

## 3. Redaction list

Treatment rules: **blur** = composite a Gaussian-blurred copy of the same region (sigma 16 on 2x frames, sigma 8 on 1x: same visual strength as the site's screens), so the table layout stays readable but no text can be read at the film's maximum zoom (2.2x). **Cover** = solid fill sampled from the surrounding colour (used for the red badge, because a blurred red stays a red smudge). **Never** replace with invented names or numbers (that would fabricate data on a real screen). Redactions apply to the full source image **before** cropping, including regions outside the plate (defence in depth). Coordinates are source px, +-20 px, confirmed by WV0 on the contact sheet.

| Source frame | Region (l, t, w, h) | What | Treatment |
|---|---|---|---|
| every 2x frame | found by colour (red > 140, green/blue < 90) in y < 135, x > 0.8 w | notification badge on the bell ("11") | cover, top-bar colour sampled right of the badge (port `findBadge` from `scripts/prep-screens.mjs`, scaled x2) |
| desk.png, desk-full.png | 645, 520, 375, 46 | "Balaju Hardware & Paints" (card 1 title) | blur |
| desk.png, desk-full.png | 1790, 650, 265, 40 | "Bishnu Adhikari" (person, card 2) | blur |
| desk.png, desk-full.png | 717, 1508, 530, 46 | "Everest Chemicals & Pigments Pvt. Ltd." (row 3) | blur |
| desk.png, desk-full.png | 1032, 2060, 590, 46 | "Zhejiang Yuanlong Chemical Industry Co. Ltd." (row 6, outside `desk-main`) | blur |
| desk-full.png | 654, 3272, 394, 166 | Receivable list: Balaju..., Patan Building Materials Suppliers | blur |
| desk-full.png | 1273, 3200, 430, 336 | Payable list: Everest..., Himalayan General Insurance Co. Ltd., Trans-Himalaya Shipping Agency Pvt. Ltd., Birgunj Clearing & Forwarding Services | blur |
| desk-full.png | the whole "My work" list below y 2100 and the Alerts block (y > 4700) | more party names (Zhejiang, Himalayan General Insurance, Sirsiya, Narayani, Balaju Factory & Depot) | blur rows' title lines, or leave as is only if outside every plate; WV0 blurs them anyway |
| reports_trial-balance.png, -full.png | 725, 645, 700, 105 | ledger names 110001-110002 (Balaju..., Patan...) | blur |
| reports_trial-balance.png, -full.png | 725, 1498, 700, 496 | ledger names 210001-210008 (Everest, Himal Packaging, Zhejiang, Himalayan General Insurance, Sirsiya, Birgunj, Trans-Himalaya, Narayani) | blur |
| reports_standard_day-book.png | 985, 735, 150, 32 | PAN number after "PAN" in the printable header | blur |
| reports_standard_day-book.png | 1350, 1708, 570, 42 | "To Everest Chemicals & Pigments Pvt. Ltd." (below `daybook`) | blur |
| reports_standard_stock-summary.png | 985, 744, 150, 32 | PAN number in the printable header | blur |
| vouchers_cash-bank.png | 2360, 630, 410, 410 | LEDGERS cells PV-00008 to PV-00005 (Narayani x2, Sirsiya, Birgunj) | blur |
| reports_receivable-outstanding.png | 530, 535, 470, 190 | PARTY column (Balaju x2, Patan) | blur |
| treasury_lcs.png | 845, 535, 360, 190 | BANK · BANK REF (NABIL is a real bank; references look real) | blur |
| treasury_lcs.png | 1530, 535, 520, 190 | SUPPLIER (Zhejiang...) | blur |
| quotations.png | 1850, 530, 450, 50 | CUSTOMER (Patan...) | blur |
| pos.png, pos_general.png | 1515, 530, 455, 630 | CUSTOMER column (Balaju, Patan, Walk-in) | blur (whole column: simpler and uniform) |
| Executive dash Paint.PNG (1x) | badge (finder at 1x) + `EVEREST_EX` = 1205, 806, 207, 20 and 1122, 824, 130, 22 | badge; "Everest..." under We owe | cover; blur (copy the constants from `prep-screens.mjs` with a comment pointing back) |
| sales dash paint.PNG (1x) | badge | badge | cover |
| home.png, hub frames, dashboards, desk_performance, reports-centre-full | badge only | | cover |
| Home jewelry.PNG, Menu Jewelry.PNG | none (verify on the sheet) | | |

Kept on purpose (demo, not sensitive): "Kathmandu Paints", "Paint Industries" (demo login, outside all plates anyway), "Demo Owner · Administrator", "Demo", "Walk-in customer" (blurred with its column regardless), module and report names, document numbers (SI-, PV-, LC-, QT-, JV-), month names (Bhadra, Shrawan, Aswin), "Kalimati, Kathmandu" (HiTech's own area, demo address), "hitech-support" role label.

---

## 4. Render pipeline

### 4.1 Decision

**A deterministic HTML + GSAP timeline page, stepped frame by frame by Playwright (`playwright-core` driving the user's installed Chrome), piped as PNG to ffmpeg (`ffmpeg-static`), encoded to H.264 MP4.** No Remotion, no paid tools, no cloud.

Why: GSAP and the world, tokens and fonts already exist in this repo, so the films reuse them instead of re-implementing a look in another tool; `seek(t)` on a paused GSAP timeline is exactly deterministic; Playwright + Chrome is already installed and used by `scripts/capture-app.mjs`; ffmpeg-static pins the encoder version so every machine produces the same bitstream settings.

**Separate package.** All tooling lives in `video/` with its own `package.json` (`playwright-core`, `ffmpeg-static`, exact versions). Reason: the Docker `deps` stage runs `npm ci` on the root `package.json`; `ffmpeg-static` downloads a ~75 MB binary in postinstall, which must never enter the site image. Node resolves `sharp` and `gsap` from the root `node_modules` by walking up, so nothing is duplicated.

**No WebM.** Only H.264 MP4 (1080p + 720p). Every browser the site targets plays H.264; VP9 doubles render time and storage for roughly 25% smaller files, and the 720p rendition already covers slow connections.

### 4.2 Steps

1. `npm run build:static` (root) once: gives `out/` with the site CSS (tokens + fonts) and the home page markup.
2. `node video/prep-frames.mjs` (WV0): plates + contact sheet into `video/frames/`.
3. `node video/extract-world.mjs` (WV1): serves `out/`, opens `/` in Chrome, finds the world `<svg>` that contains `[data-chip]`, inlines computed `fill`, `stroke`, `stroke-width`, `opacity`, `font-family`, `font-size`, `font-weight` on every element, writes `video/build/iso-world.svg`, and asserts it contains 4 `[data-d]`, 4 `[data-link]`, `[data-chip]`, `[data-cam]`.
4. `node video/render.mjs <film|all> [--preview] [--from s --to s]` (WV1):
   - starts a `node:http` static server on 127.0.0.1:4317 mapping `/` -> `out/`, `/video/` -> `video/`, `/gsap/` -> `node_modules/gsap/dist/`;
   - reads `out/index.html` for its `<link rel="stylesheet">` hrefs and the `<html class>` (next/font variables), and passes them to the engine page;
   - `chromium.launch({ channel: "chrome" })` (override with env `CHROME_PATH`), viewport 1920x1080, `deviceScaleFactor: 1`;
   - opens `/video/engine/index.html?film=<id>`; waits for `window.__ready` (fonts.ready + every `<img>`.decode());
   - for frame f in 0..N-1: `await page.evaluate(t => window.__seek(t), f / 30)`, wait two `requestAnimationFrame`s, `page.screenshot({ type: "png" })`, write to ffmpeg stdin (respect backpressure);
   - ffmpeg 1080: `-f image2pipe -framerate 30 -i - -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -crf 20 -maxrate 1400k -bufsize 2800k -g 60 -movflags +faststart -an`;
   - ffmpeg 720 from the 1080 file: `-vf scale=1280:-2:flags=lanczos -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -crf 23 -maxrate 600k -bufsize 1200k -g 60 -movflags +faststart -an`;
   - poster: `-ss <film.poster> -frames:v 1 -vf scale=1280:-2 -q:v 4` -> JPG;
   - WebVTT from the film JSON (one cue per caption, same text, same times);
   - prints duration and sizes, exits non-zero if a budget (4.3) is exceeded.
   - `--preview`: 960x540 at 15 fps into `video/out/preview/`, for review only.
   Expected time: 3000 frames at ~80-120 ms each is 4-6 min per 100 s film; about 25 min for all five.
5. Determinism rules for the engine: no `Date`, no `Math.random`, no CSS transitions or keyframe animations (all motion is in the one paused GSAP timeline), `gsap.ticker.lagSmoothing(0)`, images preloaded, fonts loaded before frame 0.

### 4.3 Files, budgets, where they live

| File (in `public/videos/`) | Budget |
|---|---|
| `tivora-master-v1-1080.mp4` | <= 18 MB |
| `tivora-master-v1-720.mp4` | <= 7 MB |
| `tivora-{owner,money,stock,sales}-v1-1080.mp4` | <= 12 MB each |
| `tivora-{owner,money,stock,sales}-v1-720.mp4` | <= 5 MB each |
| `tivora-<film>-v1-poster.jpg` (1280x720) | <= 150 KB each |
| `tivora-<film>-v1.en.vtt` | (text) |
| whole folder | <= 90 MB |

The version (`v1`) is in every file name: a new cut gets a new name, so long cache lifetimes are safe.

**Not committed.** `public/videos/` is git-ignored (about 85 MB per version; the repo already carries 31 MB of deleted videos in history). Both deploys are built on the owner's machine, where the files exist after `npm run video:render`: Docker's `COPY . .` and the static export both pick up `public/videos/`. A fresh clone without renders must fail loudly, not ship broken players: `scripts/check-videos.mjs` (root) verifies that every file referenced in `src/content/videos.ts` exists, and runs as `prebuild` and inside `scripts/build-static.mjs`. If HiTech later wants CI builds, move `public/videos/*.mp4` to Git LFS (Gitea supports it); out of scope now.

Also git-ignored: `video/node_modules/`, `video/frames/`, `video/build/`, `video/out/`.

### 4.4 Script and file ownership (what each owns)

| Path | Owns |
|---|---|
| `video/package.json` | deps (`playwright-core`, `ffmpeg-static`, exact versions); scripts `prep`, `world`, `render`, `verify` |
| `video/plates.mjs` | the plate registry (1.3) and redaction regions (3): data only, exported |
| `video/prep-frames.mjs` | redact -> crop -> `video/frames/<id>.png` + `video/frames/plates.json` (`{id: {w, h, scale: 1|2, edition}}`) + `video/frames/_contact.png` |
| `video/extract-world.mjs` | `video/build/iso-world.svg` from the built home page |
| `video/engine/index.html`, `engine.js`, `engine.css` | the timeline engine: builds one paused GSAP timeline from a film JSON; exposes `__ready`, `__seek(t)`, `__duration` |
| `video/films/<id>.json` | one film: metadata, scenes, captions (single source for burned-in text, VTT and the site transcript) |
| `video/render.mjs` | server, Playwright stepping, ffmpeg, poster, VTT, budget check |
| `video/verify.mjs` | WV4 checks (section 6) |
| `scripts/check-videos.mjs` | site build guard |

Film JSON shape (WV1 defines, WV2 follows):

```json
{
  "id": "master", "title": "One platform. Every business.", "duration": 100.0, "poster": 33.0,
  "scenes": [
    {
      "id": "M4", "in": 22.0, "out": 27.0, "type": "screen", "tone": "ground",
      "plate": "home-modules", "enter": "T3",
      "camera": [{ "t": 0, "x": 50, "y": 40, "z": 1 }, { "t": 1.5, "x": 50, "y": 40, "z": 1 }, { "t": 3.5, "x": 50, "y": 52, "z": 1.35, "ease": "inOut" }],
      "callouts": [{ "t": 0.4, "dur": 1.6, "x": 1.2, "y": 11.8, "w": 40.6, "h": 3.5, "label": null }],
      "captions": [{ "t": 0.2, "dur": 4.6, "style": "h2", "text": "Every module, one Home." }, { "t": 2.2, "dur": 2.6, "style": "kicker", "text": "Star any entry to keep it here." }]
    }
  ]
}
```

Scene `type`s the engine supports (and nothing more): `logo`, `type` (giant/display words), `world` (iso world with chip/camera/cards), `screen` (one plate), `split` (two plates), `wall` (module wall), `endcard`. `in`/`out` are absolute seconds; everything inside a scene is relative.

---

## 5. Website integration

### 5.1 Components

- `src/content/videos.ts`: registry `{ slug, title, duration, src1080, src720, poster, vtt, transcript: {t, text}[] }`, built by importing `video/films/<id>.json` (only `id`, `title`, `duration`, `poster` and caption texts/times are read; server-only module).
- `src/components/ui/VideoBlock.tsx` (server): `<figure>` with a lazy poster `<img loading="lazy" decoding="async" width="1280" height="720">` inside the site frame style (`rounded-frame`, `shadow-frame`), the title and duration in a caption ("1:40 · no sound, words on screen"), the demo caption (`DEMO_CAPTION.paint`), and the transcript as `<details><summary>Read the video as text</summary><ol>` with `mm:ss` stamps. Wraps the client island.
- `src/components/ui/VideoPlayer.tsx` (client, the only place `<video>` may appear, target < 2 KB gz): renders a play button over the poster (`<button>` >= 64 px, `aria-label="Play video: <title>, <m:ss>, no sound"`, focus ring per B2). **No `<video>` element exists until the click**, so nothing (not even metadata) downloads on page load. On click: choose 720p if `navigator.connection?.saveData`, or `effectiveType` is `slow-2g`/`2g`/`3g`, or `innerWidth < 1024`; else 1080p. Mount `<video src controls playsInline muted autoplay preload="auto" poster>` + `<track kind="captions" srclang="en" label="English" src=vtt>` (default off: the words are burned in; the track exists for assistive tech and a future Nepali track), move focus to the video. **No autoplay-on-view anywhere** (data cost on Nepali mobile networks, and reduced motion): this was optional in the brief and is decided off.
- Reduced motion: nothing moves until the user presses play; the poster is a still. Pressing play is an explicit choice, so the film plays.

### 5.2 Placement

| Page | Where | Film | Copy |
|---|---|---|---|
| `/` | new `src/components/home/VideoScene.tsx`, `night` tone, between `ModuleTrack` (ground) and `TradesScene` (ground). This also fixes today's two adjacent ground sections. | `master` | Eyebrow `Tivora ERP in motion` · H2 **See it in 100 seconds.** · Body: Every module, the Work Desk, the reports and the Nepal details, on the real screens. No sound needed: the words are on screen. |
| `/platform/` | after the "Three reasons" section, before `#nepal` | `money` | H2 **Books, banks and tax.** · Body: Vouchers to the trial balance, letters of credit, VAT and TDS, in 72 seconds. |
| `/modules/` | inside `#sales` after its bullets; inside `#production` after its bullets | `sales`, `stock` | H3 only (the section already has its H2): `From quotation to receipt, in a minute.` / `Buy, store, make and deliver, in 68 seconds.` |
| `/work-desk/` | right after `PageHero` | `owner` | H2 **The owner's morning.** · Body: The Work Desk, performance and dashboards, in a minute. |
| `/industries/jewelry/` | none in v1 (1.1) | | |

### 5.3 Page weight

Per page with a player: JS +~2 KB gz (one island, shared chunk); poster ~100-150 KB, lazy (below the fold on every page); video bytes 0 until play. Home first-load JS goes from 147.1 KB to about 149 KB gz (budget 150). On play: 720p about 0.6 Mbit/s, 1080p about 1.4 Mbit/s.

### 5.4 Serving

- `next.config.ts` (standalone): extend the cache rule source to `/:dir(brand|screens|videos)/:file*`.
- `deploy/static/.htaccess`: `AddType video/mp4 .mp4`, `AddType text/vtt .vtt`, `ExpiresByType video/mp4 "access plus 30 days"`, `ExpiresByType text/vtt "access plus 30 days"`; do not add mp4 to DEFLATE. Apache serves byte ranges by default (needed for seeking); verify with `curl -I -H "Range: bytes=0-1"` (expect 206).
- `npm run build` / `build:static` call `scripts/check-videos.mjs` first.

### 5.5 Accessibility

Silent video with all information as burned-in text plus a text transcript next to it (WCAG 1.2.1 media alternative); captions track; native controls (keyboard operable) after play; poster has `alt` describing the film ("Tivora ERP walkthrough, 1:40: modules, Work Desk, dashboards, reports, Nepal dates and tax"); play button is a real `<button>`; nothing flashes more than 3 times a second (no hard cuts faster than 0.4 s, no strobing gold).

---

## 6. Work packages

Engineers own **disjoint files**. Order: **WV0 -> WV1 -> (WV2 and WV3 in parallel) -> WV4**. WV3 may start its components against `video/films/master.json` as soon as WV1 commits it. Do not push or deploy without the owner's go-ahead. `.gitea/` is untouched.

| WV | Files owned | Depends on | Done when (acceptance) |
|---|---|---|---|
| **WV0 Frame prep** | `video/package.json`, `video/plates.mjs`, `video/prep-frames.mjs`, root `.gitignore` (add `/video/node_modules/`, `/video/frames/`, `/video/build/`, `/video/out/`, `/public/videos/`) | none | (1) `node video/prep-frames.mjs` writes every plate in 1.3 and `plates.json`; re-running gives byte-identical PNGs. (2) Throws if any badge expected on a 2x frame is not found, or a crop exceeds its source. (3) `_contact.png` shows, per redaction, before / after at 2x zoom, plus every plate as a thumbnail with redaction boxes outlined; the HoD or owner signs it off in the PR. (4) Automatic check per blurred region: variance of the Laplacian after / before <= 0.2; per covered badge: region standard deviation < 6. (5) No file written into `public/`. |
| **WV1 Engine + master** | `video/engine/**`, `video/extract-world.mjs`, `video/render.mjs`, `video/films/master.json` | WV0, `out/` built | (1) `node video/render.mjs master` produces the four master files (1080, 720, poster, VTT). (2) Duration 100.0 s +-1 frame. (3) Rendering the same film twice gives frame-identical output (compare MD5 of frames 0, 1500, 2999 extracted with ffmpeg). (4) Every caption and transition in 2.1 is present at its timecode (WV1 posts a sheet of frames at each scene mid-point). (5) Logo only via the two `/brand/*-dark.svg` files; no text node in the engine spells TIVORA. (6) Zoom limits respected (engine warns if z exceeds 2.2 / 1.6 for the plate's scale). (7) Budgets in 4.3 met. |
| **WV2 Feature cuts** | `video/films/owner.json`, `money.json`, `stock.json`, `sales.json` | WV1 | Same checks as WV1 (2)-(7) per cut; durations 64.0 / 72.0 / 68.0 / 62.0 s; every caption text exactly as 2.2-2.5. If a callout anchor does not land on its UI, adjust the % in the JSON, never the plate. |
| **WV3 Site integration** | `src/content/videos.ts`, `src/components/ui/VideoBlock.tsx`, `src/components/ui/VideoPlayer.tsx`, `src/components/home/VideoScene.tsx`, inserts in `src/app/page.tsx`, `src/app/platform/page.tsx`, `src/app/modules/page.tsx`, `src/app/work-desk/page.tsx`, `next.config.ts` (cache rule), `deploy/static/.htaccess`, `scripts/check-videos.mjs`, `scripts/build-static.mjs` (call the check), root `package.json` (`prebuild`, and `video:prep` / `video:render` / `video:verify` passthroughs: `npm --prefix video run ...`) | WV1 for master; WV2 for the cuts (until then the cut slots render nothing, behind a `ready` flag in `videos.ts`) | (1) lint, `npx next typegen && npx tsc --noEmit`, `npm run build`, `npm run build:static` all green. (2) Network log (Playwright) on each page: zero requests to `/videos/*.mp4` before clicking play; poster requested only near the viewport. (3) Click play: video plays in Chrome, picks 1080 on desktop, 720 with Save-Data emulated or at 375 px width. (4) Keyboard: Tab to play, Enter starts, focus lands on the video. (5) Transcript text equals the film's caption texts in order. (6) Home first-load JS <= 150 KB gz, others <= 140 KB gz (same method as REVAMP-SPEC results log). (7) `grep -rn "<video" src` matches only `VideoPlayer.tsx`. (8) Removing one mp4 makes both builds fail with a message naming the missing file and `npm run video:render`. |
| **WV4 Verification** | `video/verify.mjs`; results log appended at the bottom of this file | WV1-WV3 | `node video/verify.mjs` checks, for all 5 films: (1) durations as specified, all <= 120 s; (2) sizes vs 4.3; (3) stream facts from `ffmpeg -i`: h264 High, yuv420p, 1920x1080 / 1280x720, 30 fps, no audio stream, `moov` before `mdat`; (4) plays in Chrome: a test page loads each file, `readyState >= 3`, `duration` matches, `currentTime` advances after 2 s; (5) VTT valid (header, increasing non-overlapping cues) and cue texts and times equal the film JSON; (6) claims grep over all caption texts, VTTs and built transcript HTML (regex below) returns nothing except "available now" in master M13; (7) redaction QA: extracts a frame every 0.5 s during every scene that shows a plate with redactions into `video/out/qa/<film>/` plus a contact sheet; a human reviews it at 100% and confirms no redacted text is readable (no OCR tool is available, so this sign-off is mandatory and recorded); (8) site checks: WV3 (1)-(8) re-run; `curl` range request returns 206 on the static build served by `php -S` (or Apache) and on the standalone server. |

Claims grep (case-insensitive) for WV4 (6): `certified|approved|guarantee|\bAI\b|AI-powered|artificial|free|trial|discount|WhatsApp|SMS|mobile app|App Store|Google Play|uptime|next-gen|revolution|launched|seamless|unlock|empower|all-in-one|real-time|instantly|smart|\bPOS\b|Rs\.?\s?\d|NPR\s?\d|₹|25\+|10,000|available now`.

---

## 7. Risks and open questions for the owner

1. **Module count.** The app now shows 12 modules (adds Transport & Delivery and Fixed Assets; "Administration" is now "Control Panel"; "Production Plan and Manufacturing" is now "Production"). The site still says "Ten modules" (home Scene 6, `/modules/`). The films avoid any count. Decide the site wording; `src/content/modules.ts` may need the two new modules.
2. **Real-looking names in the demo data.** "Himalayan General Insurance Co. Ltd." is a real insurer's name and NABIL a real bank; the rest are plausible. All are blurred (section 3). A demo dataset with clearly fictional names, recaptured with `scripts/capture-app.mjs`, would remove every blur and make the tables readable on screen.
3. **Paint everywhere, Jewelry is what is on sale.** Every new capture is the Paint demo. Films carry the demo caption and the M13 "Jewelry available now / General trading and Paint coming" line. Jewelry-edition captures of Home, Work Desk, dashboards, sales and Karigar screens would allow a Jewelry cut for `/industries/jewelry/` (none in v1).
4. **No POS screen.** Route `/pos` shows the Sales Invoices list. "POS" is not claimed; if a counter/POS billing screen exists, capture it and it replaces A3/M10 shot 2.
5. **Executive dashboard is the old 1x capture.** Softer than the rest, zoom capped at 1.6. Capture the executive dashboard (and the module dashboards) at 2x.
6. **The earlier 15 s launch cut must not be published**: it shows "Tivora AI · Ask. It answers." and a typeset wordmark.
7. **Music.** Films are silent with no audio track; the player says "no sound". If HiTech supplies a licensed royalty-free track, it is added by re-muxing (`-c:v copy`, AAC 128k, fade out on the end card), no re-render; budgets grow by ~1.6 MB per 100 s.
8. **Videos are not in git.** A fresh clone needs `npm run video:render` (about 25 min for all five, needs Chrome) before a build; the build guard fails loudly otherwise. Git LFS is the upgrade path if CI builds are wanted.
9. **Renders are deterministic per machine.** Chrome updates can shift font rasterising slightly; re-render all films after a Chrome major update before comparing.
10. **Visible but not claimed:** "refreshes every 5 min", "Wall Board", dark-mode toggle, "IRD connection", "Metal out ... karigars" on the Paint desk. None are captioned; if HiTech wants any of them featured, confirm they work as the label suggests.
11. **Nepali version.** Captions-first makes a Nepali edition a re-render with translated caption texts (and a `ne` VTT); not in v1. Org default for client-facing output is English.
12. **Dates age.** Frames show 2083-06-20 BS / 2026-10-06 AD; fine for launch, but the M12 date line should match the frames, not "today".

---

## Results log (WV4 fills this in)

| Date | Film | Duration | 1080 size | 720 size | Poster | VTT cues = JSON | Plays in Chrome | Redaction QA signed by |
|---|---|---|---|---|---|---|---|---|
| | master | | | | | | | |
| | owner | | | | | | | |
| | money | | | | | | | |
| | stock | | | | | | | |
| | sales | | | | | | | |
