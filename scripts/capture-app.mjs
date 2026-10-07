// Captures full-resolution frames of the Tivora dev app for the launch videos.
// You sign in yourself in the window that opens; this script never sees or stores the password.
// Run:  node scripts/capture-app.mjs   (needs video/node_modules: run `npm install` inside video/ once if missing)
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
// playwright-core lives in video/node_modules (npm install inside video/ if it is missing)
const { chromium } = createRequire(new URL("../video/", import.meta.url))("playwright-core");

const BASE = "https://dev.tivoraerp.com";
const OUT = "assests/app-captures";
// Skipped on purpose: pages listing real-looking people (users, parties) or personal notifications.
const ROUTES = [
  "/dashboards/executive", "/dashboards/sales", "/dashboards/accounts",
  "/home/karigar", "/home/factory", "/home/rfid", "/home/goldloans", "/factory", "/rfid", "/board-rate", "/pos/new/jewelry",
  "/home", "/dashboards", "/desk", "/desk/performance", "/start",
  "/home/sales", "/home/purchase", "/home/inventory", "/home/process-mfg", "/home/transport",
  "/home/services", "/home/accounts", "/home/fixedassets", "/home/treasury", "/home/tax", "/home/admin",
  "/home/reports", "/reports-centre", "/vouchers/cash-bank", "/reports/standard/day-book",
  "/reports/standard/stock-summary", "/reports/trial-balance", "/reports/receivable-outstanding",
  "/treasury/lcs", "/quotations", "/pos", "/pos/general",
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: false });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(BASE + "/login");
console.log("Sign in in the browser window. Waiting up to 5 minutes...");
await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 300000 });

for (const r of ROUTES) {
  const name = r.replace(/^\//, "").replace(/[\/?=&]/g, "_") || "root";
  try {
    await page.goto(BASE + r, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/${name}.png` });
    await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });
    console.log("ok  ", r);
  } catch (e) {
    console.log("FAIL", r, e.message.split("\n")[0]);
  }
}
await browser.close();
console.log(`Done. Frames in ${OUT}/ (review for real names before use).`);
