// Prepares public/screens/* from the raw app screenshots: redacts sensitive
// details (blurred copy of the region, layout stays readable), crops, writes
// WebP, builds a scratch contact sheet for visual verification, and makes the
// 1200x630 Open Graph image. Re-runnable: node scripts/prep-screens.mjs
import sharp from "sharp";
import { mkdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SRC = "C:/Users/Gaurav Chaudhary/Documents/Tivora ERP/Assests/";
const OUT = "public/screens/";
const SHEET = join(tmpdir(), "tivora-contact-sheet.png");
const R = (left, top, width, height) => ({ left, top, width, height });

// Regions measured on the source pixels (zoomed inspection). "badge" = the red
// notification count on the bell, found by colour.
const EVEREST_WD = R(388, 740, 322, 26); // "Everest Chemicals & Pigments Pvt. Ltd." (Work Desk)
const EVEREST_EX = [R(1205, 806, 207, 20), R(1122, 824, 130, 22)]; // wraps over two lines (Exec dashboard)
const SCREENS = [
  { slug: "home-paint", file: "Home Paint.PNG", redact: ["badge"] },
  {
    slug: "work-desk",
    file: "Work Desk Paint.PNG",
    cut: R(0, 0, 1898, 893), // drops the browser status bar showing the dev URL
    redact: ["badge", R(343, 350, 228, 30) /* Balaju Hardware & Paints */, R(1020, 434, 120, 24) /* person name */, EVEREST_WD],
  },
  // mobile stills (375px): pre-cropped so text stays legible; same redactions, then cropped
  { slug: "home-paint-m1", file: "Home Paint.PNG", cut: R(371, 82, 700, 490), redact: ["badge"] },
  { slug: "home-paint-m2", file: "Home Paint.PNG", cut: R(1090, 348, 727, 482), redact: ["badge"] },
  ...[[319, "work-desk-m1"], [845, "work-desk-m2"], [1372, "work-desk-m3"]].map(([left, slug]) => ({
    slug,
    file: "Work Desk Paint.PNG",
    cut: R(left, 255, 515, 275),
    redact: ["badge", R(343, 350, 228, 30), R(1020, 434, 120, 24), EVEREST_WD],
  })),
  { slug: "executive-dashboard", file: "Executive dash Paint.PNG", redact: ["badge", ...EVEREST_EX] },
  // zoom stops for the mobile swipe row (same redactions, then cropped)
  { slug: "executive-sales", file: "Executive dash Paint.PNG", cut: R(320, 270, 643, 380), redact: ["badge", ...EVEREST_EX] },
  { slug: "executive-target", file: "Executive dash Paint.PNG", cut: R(982, 270, 901, 380), redact: ["badge", ...EVEREST_EX] },
  { slug: "executive-glance", file: "Executive dash Paint.PNG", cut: R(320, 674, 1150, 247), redact: ["badge", ...EVEREST_EX] },
  { slug: "sales-dashboard", file: "sales dash paint.PNG", redact: ["badge"] },
  { slug: "finance-dashboard", file: "Finance and sales dash paint.PNG", redact: ["badge"] },
  { slug: "dashboards", file: "Dashboards.PNG", redact: ["badge"] },
  { slug: "home-jewelry", file: "Home jewelry.PNG", redact: [] },
  { slug: "menu-paint", file: "Menu 1.PNG", redact: [], native: true },
  { slug: "menu-jewelry", file: "Menu Jewelry.PNG", redact: [], native: true },
  { slug: "menu-classic", file: "classic.PNG", redact: [], native: true },
];

/** Bounding box of the red count badge in the top bar (null if none). */
async function findBadge(buf, w) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
  for (let y = 0; y < 45; y++)
    for (let x = Math.floor(w * 0.8); x < w; x++) {
      const i = (y * info.width + x) * info.channels;
      if (data[i] > 140 && data[i + 1] < 90 && data[i + 2] < 90) {
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      }
    }
  if (x1 < 0) return null;
  // Cover, not blur (a blur of red stays a red smudge): fill with the top-bar colour sampled just right of the badge.
  const i = ((y0 + 2) * info.width + x1 + 7) * info.channels;
  return { ...R(x0 - 4, Math.max(0, y0 - 4), x1 - x0 + 9, y1 - y0 + 9), fill: { r: data[i], g: data[i + 1], b: data[i + 2] } };
}

async function redact(buf, regions) {
  const overlays = [];
  for (const { fill, ...r } of regions)
    overlays.push({
      input: fill ? await sharp({ create: { width: r.width, height: r.height, channels: 3, background: fill } }).png().toBuffer() : await sharp(buf).extract(r).blur(8).toBuffer(),
      left: r.left,
      top: r.top,
    });
  return overlays.length ? sharp(buf).composite(overlays).png().toBuffer() : buf;
}

mkdirSync(OUT, { recursive: true });
const tiles = [];
for (const s of SCREENS) {
  const raw = readFileSync(SRC + s.file);
  const { width } = await sharp(raw).metadata();
  const regions = [];
  // Owner decision: the demo data is test data, so nothing is blurred or covered. The redact lists above are kept for reference only.
  for (const r of []) {
    if (r === "badge") {
      const b = await findBadge(raw, width);
      if (!b) throw new Error(`${s.slug}: notification badge not found`);
      regions.push(b);
    } else regions.push(r);
  }
  const done = await redact(raw, regions);
  const cut = s.cut ? await sharp(done).extract(s.cut).toBuffer() : done;
  const { width: w } = await sharp(cut).metadata();
  const sizes = s.native ? [["1x", w]] : [...new Set([960, 1600].map((n) => Math.min(n, w)))].map((n) => [n, n]);
  for (const [label, n] of sizes) await sharp(cut).resize({ width: n }).webp({ quality: 82 }).toFile(`${OUT}${s.slug}-${label}.webp`);
  if (!s.cut || s.slug === "work-desk") regions.forEach((r, i) => tiles.push({ label: `${s.slug} #${i}`, before: sharp(raw).extract(pad(r, 30, width)), after: sharp(done).extract(pad(r, 30, width)) }));
  console.log(s.slug, sizes.map((x) => x[0]).join(","), `${w}x${(await sharp(cut).metadata()).height}`, `redactions:${regions.length}`);
}
function pad(r0, p, maxW) {
  const r = { left: r0.left, top: r0.top, width: r0.width, height: r0.height };
  const left = Math.max(0, r.left - p), top = Math.max(0, r.top - p);
  return { left, top, width: Math.min(maxW - left, r.width + 2 * p), height: r.height + 2 * p };
}

// Scratch contact sheet (not committed): before | after, enlarged 2x, per redaction.
const rows = [];
for (const t of tiles) {
  const [b, a] = await Promise.all([t.before, t.after].map(async (p) => {
    const m = await p.clone().metadata();
    return p.resize({ width: Math.min(560, m.width * 2), kernel: "nearest" }).png().toBuffer();
  }));
  rows.push({ b, a, h: Math.max((await sharp(b).metadata()).height, (await sharp(a).metadata()).height) });
}
let y = 0;
const comps = [];
for (const r of rows) { comps.push({ input: r.b, left: 0, top: y }, { input: r.a, left: 580, top: y }); y += r.h + 12; }
if (comps.length) {
  await sharp({ create: { width: 1140, height: y, channels: 3, background: "#ff00ff" } }).composite(comps).png().toFile(SHEET);
  console.log("contact sheet:", SHEET);
}

// Open Graph image: official logo centred on the ground colour, tagline under it.
const logo = await sharp(readFileSync("public/brand/tivora-official.svg"), { density: 300 }).resize({ width: 760 }).png().toBuffer();
const lh = (await sharp(logo).metadata()).height;
const tag = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="80"><text x="600" y="50" text-anchor="middle" font-family="Manrope, Segoe UI, sans-serif" font-size="40" font-weight="700" fill="#1C1A16">One platform. Every business.</text></svg>`);
const top = Math.round((630 - lh - 90) / 2);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#F6F4F0" } })
  .composite([{ input: logo, left: 220, top }, { input: tag, left: 0, top: top + lh + 40 }])
  .png().toFile("src/app/opengraph-image.png");
console.log("opengraph-image.png written");
