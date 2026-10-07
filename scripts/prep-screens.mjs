// Prepares public/screens/* from the owner's 2x captures of the live app (assests/app-captures/, 2880x1800,
// Jewelry company "Alanza Demo Showroom"): crops, writes WebP (never upscaled), and makes the 1200x630 Open
// Graph image. Owner rule: the data is test data, so nothing is blurred, covered or redrawn; the top bar stays.
// Slug names are historical: "home-paint", "work-desk", "executive-*" etc. are kept so components need no change
// even though every capture is now the Jewelry company. Re-runnable: node scripts/prep-screens.mjs
import sharp from "sharp";
import { mkdirSync, readFileSync, readdirSync, unlinkSync } from "node:fs";
const SRC = "assests/app-captures/";
const OUT = "public/screens/";
const R = (left, top, width, height) => ({ left, top, width, height });
const SIZES = [960, 1600, 2400]; // native is 2880; never upscale
// cut: fixed crop (source pixels). native: mobile/zoom still, written once at its crop width.
// trim: module page, crop the empty page bottom (keeps the top bar and side menu).
const SCREENS = [
  { slug: "home-paint", file: "home" }, // also used for home-jewelry (same capture)
  { slug: "work-desk", file: "desk" },
  { slug: "home-paint-m1", file: "home", cut: R(480, 200, 1170, 780), native: true },
  { slug: "home-paint-m2", file: "home", cut: R(1090, 996, 1150, 750), native: true },
  { slug: "work-desk-m1", file: "desk", cut: R(504, 546, 770, 375), native: true },
  { slug: "work-desk-m2", file: "desk", cut: R(1284, 928, 770, 372), native: true },
  { slug: "work-desk-m3", file: "desk", cut: R(2064, 928, 770, 372), native: true },
  { slug: "executive-dashboard", file: "dashboards_executive" },
  { slug: "executive-sales", file: "dashboards_executive", cut: R(504, 512, 970, 672), native: true },
  { slug: "executive-target", file: "dashboards_executive", cut: R(1484, 512, 1346, 672), native: true },
  { slug: "executive-glance", file: "dashboards_executive", cut: R(504, 1196, 2330, 450) },
  { slug: "sales-dashboard", file: "dashboards_sales" },
  { slug: "finance-dashboard", file: "dashboards_accounts" },
  { slug: "dashboards", file: "dashboards" },
  ...[
    ["sales", "home_sales"], ["purchase", "home_purchase"], ["inventory", "home_inventory"], ["karigar", "home_karigar"],
    ["factory", "factory"], ["rfid", "rfid"], ["gold-loans", "home_goldloans"], ["customer-services", "home_services"],
    ["transport", "home_transport"], ["finance", "home_accounts"], ["fixed-assets", "home_fixedassets"],
    ["trade-finance", "home_treasury"], ["tax-ird", "home_tax"],
  ].map(([slug, file]) => ({ slug: `module-${slug}`, file, trim: true })),
];

/** Last row (plus padding) with page content in the main area; the module pages end well above the fold. */
async function trimHeight(buf) {
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const bg = [0, 1, 2].map((c) => data[(1790 * info.width + 2700) * 3 + c]);
  for (let y = info.height - 1; y > 200; y--)
    for (let x = 480; x < 2740; x += 2) {
      const i = (y * info.width + x) * 3;
      if (Math.abs(data[i] - bg[0]) > 3 || Math.abs(data[i + 1] - bg[1]) > 3 || Math.abs(data[i + 2] - bg[2]) > 3)
        return Math.min(info.height, Math.max(1100, y + 150));
    }
  return info.height;
}

mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (f.endsWith(".webp")) unlinkSync(OUT + f); // regenerate from scratch, no stale sizes
for (const s of SCREENS) {
  const raw = readFileSync(`${SRC}${s.file}.png`);
  const cut = s.cut ?? (s.trim ? R(0, 0, 2880, await trimHeight(raw)) : null);
  const img = cut ? await sharp(raw).extract(cut).toBuffer() : raw;
  const { width: w, height: h } = await sharp(img).metadata();
  const sizes = s.native ? [w] : [...new Set([...SIZES.filter((n) => n < w), Math.min(w, SIZES.at(-1))])];
  for (const n of sizes) await sharp(img).resize({ width: n, kernel: "lanczos3" }).sharpen({ sigma: 0.5 }).webp({ quality: 93, effort: 6, smartSubsample: false }).toFile(`${OUT}${s.slug}-${n}.webp`);
  console.log(s.slug, sizes.join(","), `${w}x${h}`);
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
