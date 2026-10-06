// Extracts the real iso world from the built home page (npm run build:static first) -> video/build/iso-world.svg,
// and the site's @font-face rules -> video/build/fonts.css. Never redraws the world.
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { serve, root } from "./serve.mjs";

const build = join(root, "video/build");
mkdirSync(build, { recursive: true });

// fonts: copy every @font-face from the built CSS, urls made absolute (/_next/static/media/...)
const cssDir = join(root, "out/_next/static/chunks");
const faces = readdirSync(cssDir).filter((f) => f.endsWith(".css")).flatMap((f) => readFileSync(join(cssDir, f), "utf8").match(/@font-face\{[^}]*\}/g) || []);
if (!faces.length) throw new Error("no @font-face in out/: run npm run build:static first");
writeFileSync(join(build, "fonts.css"), faces.map((r) => r.replace(/url\(\.\.\/media\//g, "url(/_next/static/media/").replace(/\_/g, "_")).join("\n"));

const srv = await serve(4318);
const browser = await chromium.launch({ channel: "chrome", executablePath: process.env.CHROME_PATH || undefined });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, javaScriptEnabled: false });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4318/");
const svg = await page.evaluate(() => {
  const el = [...document.querySelectorAll("svg")].find((s) => s.querySelector("[data-chip]") && s.querySelectorAll("[data-d]").length === 4 && s.querySelectorAll("[data-link]").length === 4);
  if (!el) return null;
  const props = ["fill", "stroke", "stroke-width", "opacity", "font-family", "font-size", "font-weight", "stroke-linecap"];
  const clone = el.cloneNode(true);
  const src = [el, ...el.querySelectorAll("*")], dst = [clone, ...clone.querySelectorAll("*")];
  src.forEach((s, i) => {
    const cs = getComputedStyle(s);
    props.forEach((p) => dst[i].style.setProperty(p, cs.getPropertyValue(p)));
    dst[i].removeAttribute("class");
  });
  clone.removeAttribute("class");
  clone.querySelectorAll("[data-d],[data-chip]").forEach((g) => g.removeAttribute("style"));
  clone.querySelector("[data-cam]").removeAttribute("transform");
  clone.querySelectorAll("[data-link]").forEach((l) => l.style.removeProperty("stroke-dashoffset"));
  return clone.outerHTML;
});
await browser.close();
srv.close();
if (!svg) throw new Error("world svg not found in out/index.html");
const n = (re) => (svg.match(re) || []).length;
if (n(/data-d=/g) !== 4 || n(/data-link=/g) !== 4 || n(/data-chip=/g) !== 1 || n(/data-cam=/g) !== 1) throw new Error("world svg failed assertions");
writeFileSync(join(build, "iso-world.svg"), svg);
console.log("wrote video/build/iso-world.svg (" + svg.length + " B) and fonts.css (" + faces.length + " faces)");
