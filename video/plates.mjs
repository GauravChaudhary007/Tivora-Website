// Plate registry (docs/VIDEO-SPEC.md 1.3) and redaction regions (section 3). Data only.
// Rectangles are { l, t, w, h } in SOURCE pixels, measured on the source images by WV0.
// Redactions apply to the full source image BEFORE cropping (defence in depth).
export const SRC2X = "assests/app-captures/";
export const SRC1X = "C:/Users/Gaurav Chaudhary/Documents/Tivora ERP/Assests/";
export const SIGMA = { 2: 16, 1: 8 }; // blur strength per source scale (spec section 3)

const r = (l, t, w, h) => ({ l, t, w, h });
const b = (l, t, w, h, note) => ({ ...r(l, t, w, h), note, mode: "blur" });
// The -full captures are 3810 px wide (scrollbar removed), so their content sits 15 px further right on the desk page (measured by cross-correlation; trial balance is only +2).
const shift = (list, dx, dy = 0, tag = "") => list.map((x) => ({ ...x, l: x.l + dx, t: x.t + dy, note: x.note + tag }));

// ---- redactions per source file (blur unless stated). Badge covers are found by colour in prep-frames.mjs.
const DESK = [
  b(640, 520, 370, 46, "Balaju Hardware & Paints (card 1 title)"),
  b(1745, 650, 205, 46, "Bishnu Adhikari (person, card 2)"),
  b(717, 1508, 530, 46, "Everest Chemicals & Pigments (row 3)"),
  b(1032, 2060, 590, 46, "Zhejiang Yuanlong (row 6)"),
];
const DESK_FULL_EXTRA = [
  b(654, 3272, 394, 166, "Receivable list: Balaju, Patan"),
  b(1070, 2243, 620, 48, "PO-00007 from Zhejiang Yuanlong (My work row 7)"),
  b(785, 2610, 530, 46, "Confirm Everest Chemicals & Pigments (My work row 9)"),
  b(785, 2798, 490, 46, "Confirm Himalayan General Insurance (My work row 10)"),
  b(668, 4934, 335, 44, "Alert: Balaju Hardware & Paints"),
  b(780, 5138, 345, 46, "Alert: Balaju Factory & Depot"),
  b(668, 5757, 405, 44, "Alert: Sirsiya Freight Movers"),
  b(668, 5963, 510, 44, "Alert: Birgunj Clearing & Forwarding"),
  b(668, 6168, 515, 44, "Alert: Everest Chemicals & Pigments"),
  b(668, 6374, 515, 44, "Alert: Narayani Solvents & Chemicals"),
  b(1273, 3200, 430, 336, "Payable list: Everest, Himalayan General Insurance, Trans-Himalaya, Birgunj"),
];
const TB = [
  b(725, 645, 700, 105, "ledgers 110001-110002 (Balaju, Patan)"),
  b(725, 1498, 700, 496, "ledgers 210001-210008 (suppliers, insurer)"),
];

export const REDACT = {
  "desk.png": DESK,
  "desk-full.png": [...shift(DESK, 15, 0, " [full]"), ...DESK_FULL_EXTRA],
  "reports_trial-balance.png": TB,
  "reports_trial-balance-full.png": shift(TB, 2, 0, " [full]"),
  "reports_standard_day-book.png": [
    b(985, 735, 150, 32, "PAN number (printable header)"),
    b(1350, 1708, 570, 42, "To Everest Chemicals & Pigments"),
  ],
  "reports_standard_stock-summary.png": [b(985, 744, 150, 32, "PAN number (printable header)")],
  "vouchers_cash-bank.png": [b(2360, 630, 410, 410, "LEDGERS cells PV-00008..PV-00005")],
  "reports_receivable-outstanding.png": [b(530, 535, 470, 190, "PARTY column")],
  "treasury_lcs.png": [b(845, 535, 360, 190, "BANK / BANK REF"), b(1530, 535, 520, 190, "SUPPLIER")],
  "quotations.png": [b(1850, 530, 450, 50, "CUSTOMER")],
  "pos.png": [b(1515, 530, 455, 630, "CUSTOMER column")],
  "pos_general.png": [b(1515, 530, 455, 630, "CUSTOMER column")],
};
// 1x sources (same constants as scripts/prep-screens.mjs EVEREST_EX)
export const REDACT_1X = {
  "Executive dash Paint.PNG": [b(1205, 806, 207, 20, "Everest (We owe, line 1)"), b(1122, 824, 130, 22, "Everest (We owe, line 2)")],
};

// ---- plates. scale 2 = 2x capture, 1 = old 1x capture.
const P = (id, src, l, t, w, h, scale = 2, edition = "paint") => ({ id, src, crop: r(l, t, w, h), scale, edition });
export const PLATES = [
  P("home-modules", "home.png", 980, 120, 2360, 1960),
  P("home-topbar", "home.png", 520, 0, 2810, 108),
  P("home-dateline", "home.png", 1000, 135, 700, 120),
  P("desk-main", "desk.png", 580, 120, 3120, 1800),
  P("desk-outstanding", "desk-full.png", 600, 2960, 2480, 640),
  P("desk-sales30", "desk-full.png", 600, 3680, 1560, 790),
  P("desk-vat", "desk-full.png", 2160, 4450, 780, 250),
  P("desk-perf", "desk_performance.png", 860, 120, 2600, 680),
  P("dashboards", "dashboards.png", 980, 120, 2360, 1320),
  P("hub-sales", "home_sales.png", 980, 120, 2360, 1700),
  P("hub-purchase", "home_purchase.png", 980, 120, 2360, 1700),
  P("hub-inventory", "home_inventory.png", 980, 120, 2360, 1800),
  P("hub-production", "home_process-mfg.png", 980, 120, 2360, 1530),
  P("hub-transport", "home_transport.png", 980, 120, 2360, 1330),
  P("hub-services", "home_services.png", 980, 120, 1300, 500),
  P("hub-accounts", "home_accounts-full.png", 950, 120, 2380, 2440),
  P("hub-fixedassets", "home_fixedassets.png", 980, 120, 1780, 640),
  P("hub-treasury", "home_treasury.png", 980, 120, 2360, 1480),
  P("hub-tax", "home_tax.png", 980, 120, 2360, 1500),
  P("hub-admin", "home_admin.png", 980, 120, 2360, 500),
  P("reports-centre", "reports-centre-full.png", 960, 110, 2400, 4460),
  P("vouchers", "vouchers_cash-bank.png", 480, 120, 3350, 1380),
  P("daybook-head", "reports_standard_day-book.png", 480, 120, 1700, 170),
  P("daybook", "reports_standard_day-book.png", 480, 640, 3330, 1060),
  P("stock-report", "reports_standard_stock-summary.png", 480, 120, 3330, 2040),
  P("tb-top", "reports_trial-balance.png", 480, 120, 3330, 2040),
  P("tb-balanced", "reports_trial-balance-full.png", 440, 3300, 3370, 346),
  P("receivable", "reports_receivable-outstanding.png", 480, 120, 3350, 720),
  P("lcs", "treasury_lcs.png", 480, 120, 3350, 680),
  P("quotations", "quotations.png", 480, 120, 3350, 560),
  P("invoices", "pos.png", 480, 120, 3350, 1140),
  P("general-sales-head", "pos_general.png", 480, 120, 1500, 130),
  P("exec", "Executive dash Paint.PNG", 300, 70, 1608, 847, 1) /* 851 in spec; last 4 rows are the capture's dark scrollbar strip */,
  P("sales-dash", "sales dash paint.PNG", 300, 70, 1605, 847, 1) /* idem */,
  P("jewelry-home", "Home jewelry.PNG", 300, 0, 1587, 916, 1, "jewelry") /* 918 in spec; 2 dark rows */,
  P("menu-jewelry", "Menu Jewelry.PNG", 0, 0, 289, 921, 1, "jewelry") /* 930 in spec; last 9 rows are the dark strip */,
];
