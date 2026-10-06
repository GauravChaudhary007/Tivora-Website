// WV0: redact -> crop -> video/frames/<id>.png (+ plates.json, _contact.png, _plates.png).
// Re-runnable and deterministic:  node video/prep-frames.mjs
// Raw captures stay outside public/; outputs go to the git-ignored video/frames/.
import sharp from "sharp";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PLATES, REDACT, REDACT_1X, SIGMA, SRC1X, SRC2X } from "./plates.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "video/frames");
mkdirSync(OUT, { recursive: true });
const PNG = { compressionLevel: 9, palette: false };
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/** Bounding box of the red count badge on the bell (colour search, scaled from scripts/prep-screens.mjs). */
function findBadge(raw, info, k) {
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
  for (let y = 0; y < 45 * k; y++)
    for (let x = Math.floor(info.width * 0.8); x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      if (raw[i] > 140 && raw[i + 1] < 90 && raw[i + 2] < 90) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    }
  if (x1 < 0) return null;
  const i = ((y0 + 2 * k) * info.width + x1 + 7 * k) * info.channels; // top-bar colour just right of the badge
  const p = 2 * k; // tight: the badge overlaps the bell, so a wide cover would erase the icon
  return { l: x0 - p, t: Math.max(0, y0 - p), w: x1 - x0 + 1 + 2 * p, h: y1 - y0 + 1 + 2 * p, note: "notification badge", mode: "cover", fill: { r: raw[i], g: raw[i + 1], b: raw[i + 2] } };
}

/** Variance of the Laplacian of a grey image (sharpness measure for the blur check). */
function lapVar(grey, w, h) {
  let n = 0, s = 0, s2 = 0;
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const v = grey[i - 1] + grey[i + 1] + grey[i - w] + grey[i + w] - 4 * grey[i];
      s += v; s2 += v * v; n++;
    }
  return n ? s2 / n - (s / n) ** 2 : 0;
}
const stat = async (buf, w, h) => {
  const g = await sharp(buf).greyscale().raw().toBuffer();
  let m = 0, m2 = 0;
  for (const v of g) { m += v; m2 += v * v; }
  m /= g.length; m2 /= g.length;
  return { lap: lapVar(g, w, h), sd: Math.sqrt(Math.max(0, m2 - m * m)) };
};

const sources = [...new Set(PLATES.map((p) => p.src))];
const done = new Map(); // src -> { raw, redacted, regions, scale, width, height }
const report = [];
for (const src of sources) {
  const scale = PLATES.find((p) => p.src === src).scale;
  const path = scale === 2 ? join(ROOT, SRC2X, src) : SRC1X + src;
  const { data, info } = await sharp(readFileSync(path)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const regions = [...((scale === 2 ? REDACT[src] : REDACT_1X[src]) ?? [])];
  const badge = findBadge(data, info, scale);
  const badgeExpected = scale === 2 || ["Executive dash Paint.PNG", "sales dash paint.PNG"].includes(src);
  if (badge) regions.unshift(badge);
  else if (badgeExpected) throw new Error(`${src}: notification badge not found`);
  for (const q of regions)
    if (q.l < 0 || q.t < 0 || q.l + q.w > info.width || q.t + q.h > info.height) throw new Error(`${src}: redaction "${q.note}" exceeds the source`);
  const raw = await sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } }).png(PNG).toBuffer();
  const overlays = [];
  for (const q of regions)
    overlays.push({
      left: q.l, top: q.t,
      input: q.mode === "cover"
        ? Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${q.w}" height="${q.h}"><ellipse cx="${q.w / 2}" cy="${q.h / 2}" rx="${q.w / 2}" ry="${q.h / 2}" fill="rgb(${q.fill.r},${q.fill.g},${q.fill.b})"/></svg>`) // round badge: an ellipse keeps the bell icon around it
        : await sharp(raw).extract({ left: q.l, top: q.t, width: q.w, height: q.h }).blur(SIGMA[scale]).png().toBuffer(),
    });
  const redacted = overlays.length ? await sharp(raw).composite(overlays).png(PNG).toBuffer() : raw;
  for (const q of regions) { // automatic checks (spec WV0 acceptance 4)
    // badge: the ellipse's inscribed rectangle (the part that is only badge); blur: the whole region
    const ix = q.mode === "cover" ? Math.round(q.w * 0.146) : 0, iy = q.mode === "cover" ? Math.round(q.h * 0.146) : 0;
    const rect = { left: q.l + ix, top: q.t + iy, width: q.w - 2 * ix, height: q.h - 2 * iy };
    const [a, c] = await Promise.all([stat(await sharp(raw).extract(rect).png().toBuffer(), rect.width, rect.height), stat(await sharp(redacted).extract(rect).png().toBuffer(), rect.width, rect.height)]);
    if (q.mode === "cover") {
      if (c.sd >= 6) throw new Error(`${src}: badge cover not flat (sd ${c.sd.toFixed(1)})`);
      const px = await sharp(redacted).extract({ left: q.l, top: q.t, width: q.w, height: q.h }).raw().toBuffer();
      for (let i = 0; i < px.length; i += 3) if (px[i] > 140 && px[i + 1] < 90 && px[i + 2] < 90) throw new Error(`${src}: red badge pixels remain`);
      q.check = `sd ${c.sd.toFixed(2)}, no red left`;
    } else {
      const ratio = a.lap > 1 ? c.lap / a.lap : 0;
      if (ratio > 0.2) throw new Error(`${src}: "${q.note}" still sharp (laplacian ratio ${ratio.toFixed(3)})`);
      q.check = `lap ${ratio.toFixed(4)}`;
    }
    report.push(`${src} | ${q.mode} | ${q.l},${q.t},${q.w},${q.h} | ${q.note} | ${q.check}`);
  }
  if (process.argv.includes("--dump")) { // review aid: the whole redacted source, to hunt for anything missed
    mkdirSync(join(OUT, "_redacted"), { recursive: true });
    writeFileSync(join(OUT, "_redacted", src.replace(/\.png$/i, "") + ".png"), redacted);
  }
  done.set(src,{ raw, redacted, regions, scale, width: info.width, height: info.height });
}

// ---- plates
const meta = {};
for (const p of PLATES) {
  const s = done.get(p.src), c = p.crop;
  if (c.l < 0 || c.t < 0 || c.l + c.w > s.width || c.t + c.h > s.height) throw new Error(`${p.id}: crop exceeds ${p.src} (${s.width}x${s.height})`);
  await sharp(s.redacted).extract({ left: c.l, top: c.t, width: c.w, height: c.h }).png(PNG).toFile(join(OUT, `${p.id}.png`));
  meta[p.id] = { w: c.w, h: c.h, scale: p.scale, edition: p.edition };
}
writeFileSync(join(OUT, "plates.json"), JSON.stringify(meta, null, 2) + "\n");

// ---- contact sheet 1: every redaction, before | after (padded, source resolution, capped 760 px wide)
const rows = [];
for (const [src, s] of done)
  for (const q of s.regions) {
    const p = 40, left = Math.max(0, q.l - p), top = Math.max(0, q.t - p);
    const rect = { left, top, width: Math.min(s.width - left, q.w + 2 * p), height: Math.min(s.height - top, q.h + 2 * p) };
    const fit = (buf) => sharp(buf).extract(rect).resize({ width: Math.min(760, rect.width), kernel: "nearest" }).png().toBuffer();
    const [a, c] = [await fit(s.raw), await fit(s.redacted)];
    rows.push({ a, c, h: Math.max((await sharp(a).metadata()).height, (await sharp(c).metadata()).height), label: `${src}: ${q.note}` });
  }
let y = 0;
const comps = [];
for (const r of rows) {
  comps.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1540" height="22"><text x="4" y="16" font-family="monospace" font-size="15" fill="#fff">${esc(r.label)}</text></svg>`), left: 0, top: y });
  y += 22;
  comps.push({ input: r.a, left: 0, top: y }, { input: r.c, left: 780, top: y });
  y += r.h + 14;
}
await sharp({ create: { width: 1540, height: y, channels: 3, background: "#222" } }).composite(comps).png(PNG).toFile(join(OUT, "_contact.png"));

// ---- contact sheet 2: plate thumbnails with the redaction boxes that fall inside each crop
const TW = 460, TH = 300, COLS = 4;
const cells = [];
for (const p of PLATES) {
  const s = done.get(p.src), c = p.crop;
  const k = Math.min(TW / c.w, TH / c.h);
  const boxes = s.regions.filter((q) => q.l < c.l + c.w && q.l + q.w > c.l && q.t < c.t + c.h && q.t + q.h > c.t)
    .map((q) => `<rect x="${(q.l - c.l) * k}" y="${(q.t - c.t) * k}" width="${q.w * k}" height="${q.h * k}" fill="none" stroke="#f0f" stroke-width="2"/>`).join("");
  const img = await sharp(join(OUT, `${p.id}.png`)).resize({ width: Math.round(c.w * k) }).png().toBuffer();
  const m = await sharp(img).metadata();
  const th = await sharp(img).composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${m.width}" height="${m.height}">${boxes}</svg>`) }]).png().toBuffer();
  cells.push({ th, id: p.id });
}
const sheet = cells.flatMap((c, i) => {
  const x = (i % COLS) * (TW + 10) + 5, yy = Math.floor(i / COLS) * (TH + 30);
  return [
    { input: c.th, left: x, top: yy + 25 },
    { input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="20"><text x="0" y="15" font-family="monospace" font-size="15" fill="#fff">${c.id}</text></svg>`), left: x, top: yy + 3 },
  ];
});
await sharp({ create: { width: COLS * (TW + 10) + 10, height: Math.ceil(cells.length / COLS) * (TH + 30) + 10, channels: 3, background: "#222" } }).composite(sheet).png(PNG).toFile(join(OUT, "_plates.png"));

console.log(report.join("\n"));
console.log(`\n${PLATES.length} plates, ${report.length} redactions (incl. badge covers) -> ${OUT}`);
