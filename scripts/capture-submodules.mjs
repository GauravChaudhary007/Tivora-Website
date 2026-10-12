// Captures the sub-module screens of each module (its Entries, Masters and Reports pages) for the module pages' collages.
// Read-only: it only opens pages (GET), never clicks a button, fills a form or saves anything. Pages that are settings, users, roles, licence, backup,
// import, recalculation, year-close or numbering are skipped. You sign in yourself and switch to a non-Jewelry company; this script never sees a password.
// Run:  node scripts/capture-submodules.mjs   (needs video/node_modules for playwright-core). When it asks, create the file assests/sub-captures/GO.
// Output: assests/sub-captures/<module>/<NN>-<slug>.png (the 1440 x 900 screen) and assests/sub-captures/manifest.json.
import { createRequire } from "node:module";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
const { chromium } = createRequire(new URL("../video/", import.meta.url))("playwright-core");

const BASE = "https://dev.tivoraerp.com";
const OUT = "assests/sub-captures";
const MODULES = [
  ["sales", "/home/sales"], ["purchase", "/home/purchase"], ["inventory", "/home/inventory"], ["customer-services", "/home/services"],
  ["transport", "/home/transport"], ["finance", "/home/accounts"], ["fixed-assets", "/home/fixedassets"], ["trade-finance", "/home/treasury"], ["tax-ird", "/home/tax"],
];
const PER = { Entries: 5, Masters: 2, Reports: 6 }; // links taken from each column, in page order
const SKIP = /recalc|year[-\s]?clos|close[-\s]?year|delete|reset|import|backup|restore|numbering|users?\b|roles?\b|licen[cs]e|control[-\s]?panel|password|settings|admin|logout|sign[-\s]?out/i;

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: false });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(BASE + "/login");
console.log("1) Sign in in the browser window (waiting up to 5 minutes)...");
await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 300000 });
console.log("2) Switch to a company that is NOT Jewelry (top bar). Waiting for the file " + OUT + "/GO ...");
while (!existsSync(`${OUT}/GO`)) await new Promise((r) => setTimeout(r, 1000));
unlinkSync(`${OUT}/GO`);

const manifest = [];
for (const [mod, route] of MODULES) {
  await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1200);
  // Each link in the Entries / Masters / Reports cards: its section, text and href. The card is the nearest ancestor whose text starts with the heading.
  const links = await page.evaluate(() => {
    const out = [];
    for (const a of document.querySelectorAll("a[href]")) {
      const r = a.getBoundingClientRect();
      if (r.left < 230 || r.top < 230 || r.width === 0) continue; // not the left menu, not the header tabs
      let el = a.parentElement;
      let section = "";
      for (let i = 0; i < 8 && el; i++, el = el.parentElement) {
        const m = /^(Entries|Masters|Reports|Settings)\b/.exec(el.innerText || "");
        if (m && el.querySelectorAll("a[href]").length < 80) { section = m[1]; break; }
      }
      if (section) out.push({ section, text: a.innerText.trim(), href: a.getAttribute("href") });
    }
    return out;
  });
  const taken = { Entries: 0, Masters: 0, Reports: 0 };
  const seen = new Set();
  let n = 0;
  mkdirSync(`${OUT}/${mod}`, { recursive: true });
  for (const l of links) {
    if (!(l.section in taken) || taken[l.section] >= PER[l.section] || seen.has(l.href)) continue;
    if (!l.href.startsWith("/") || SKIP.test(l.href) || SKIP.test(l.text)) continue;
    seen.add(l.href);
    try {
      const res = await page.goto(BASE + l.href, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(1200);
      const body = (await page.innerText("body").catch(() => "")).slice(0, 600);
      const fin = page.url().replace(BASE, "");
      if ((res && res.status() >= 400) || /not-included|\/login/.test(fin) || /\b(404|not found|not included)\b/i.test(body.slice(0, 300))) {
        console.log("SKIP", mod, l.href);
        continue;
      }
      n++;
      const file = `${String(n).padStart(2, "0")}-${l.href.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "_").slice(0, 60)}.png`;
      await page.screenshot({ path: `${OUT}/${mod}/${file}` });
      taken[l.section]++;
      manifest.push({ module: mod, section: l.section, title: l.text, href: l.href, file: `${mod}/${file}` });
      console.log("ok  ", mod, l.section, "|", l.text);
    } catch (e) {
      console.log("FAIL", mod, l.href, e.message.split("\n")[0]);
    }
  }
}
writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 1));
await browser.close();
console.log(`Done. ${manifest.length} screens in ${OUT}/`);
