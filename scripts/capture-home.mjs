// Captures the app screens the home page features need, from a NON-Jewelry company.
// You sign in yourself, then switch company in the top bar; this script never sees or stores a password.
// Run:  node scripts/capture-home.mjs   (needs video/node_modules for playwright-core)
// Output: assests/home-captures/<name>.png (viewport) and <name>-full.png (whole page). Review for real names before use.
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { existsSync, unlinkSync } from "node:fs";
const { chromium } = createRequire(new URL("../video/", import.meta.url))("playwright-core");

const BASE = "https://dev.tivoraerp.com";
const OUT = "assests/home-captures";
// Unknown routes are logged as SKIP, not fatal.
const ROUTES = [
  "/desk", "/desk/performance", "/dashboards", "/dashboards/executive", "/dashboards/sales", "/dashboards/accounts",
  "/dashboards/production", "/dashboards/purchase", "/dashboards/inventory", "/dashboards/planning", "/dashboards/store",
  "/planning", "/material-planning", "/mrp", "/production", "/production/plans", "/approvals", "/workflow/approvals",
  "/quotations", "/sales-orders", "/invoices", "/treasury/lcs", "/treasury", "/landed-cost",
  "/home", "/home/sales", "/home/purchase", "/home/inventory", "/home/process-mfg", "/home/accounts", "/home/tax", "/home/treasury", "/home/reports", "/home/transport", "/home/services", "/home/fixedassets",
  "/reports-centre", "/reports/trial-balance", "/reports/receivable-outstanding", "/reports/standard/stock-summary", "/reports/standard/day-book",
  "/vouchers/cash-bank",
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: false });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(BASE + "/login");
console.log("1) Sign in in the browser window (waiting up to 5 minutes)...");
await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 300000 });
// Instead of waiting for Enter in a terminal, wait for the file assests/home-captures/GO to appear (the assistant creates it when you say you have switched company).
console.log("2) Switch to a company that is NOT Jewelry (top bar). Waiting for the GO file...");
while (!existsSync(`${OUT}/GO`)) await new Promise((r) => setTimeout(r, 1000));
unlinkSync(`${OUT}/GO`);

const log = [];
for (const r of ROUTES) {
  const name = r.replace(/^\//, "").replace(/[\/?=&]/g, "_") || "root";
  try {
    const res = await page.goto(BASE + r, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1500);
    const body = (await page.innerText("body").catch(() => "")).slice(0, 4000);
    if ((res && res.status() >= 400) || /\b(404|not found|page not found)\b/i.test(body.slice(0, 300))) {
      console.log("SKIP", r);
      log.push({ route: r, ok: false });
      continue;
    }
    await page.screenshot({ path: `${OUT}/${name}.png` });
    await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });
    console.log("ok  ", r, "->", page.url().replace(BASE, ""));
    log.push({ route: r, ok: true, final: page.url().replace(BASE, "") });
  } catch (e) {
    console.log("FAIL", r, e.message.split("\n")[0]);
    log.push({ route: r, ok: false });
  }
}
writeFileSync(`${OUT}/_log.json`, JSON.stringify(log, null, 1));
await browser.close();
console.log(`Done. Frames in ${OUT}/`);
