// node video/render.mjs <film> [--preview] [--from s --to s] [--shots t1,t2,...] [--skip-720]
// Full run writes public/videos/tivora-<film>-v1-{1080,720}.mp4, -poster.jpg, tivora-<film>-v1.en.vtt and enforces the budgets.
// --from/--to render a range to video/out/test/ (no budgets). --shots dumps single PNG frames to video/out/shots/ (fast review).
import { chromium } from "playwright-core";
import ffmpegPath from "ffmpeg-static";
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, statSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { serve, root } from "./serve.mjs";
import { vtt } from "./captions.mjs";

const args = process.argv.slice(2);
const film = args.find((a) => !a.startsWith("--"));
const opt = (n) => { const i = args.indexOf("--" + n); return i < 0 ? null : args[i + 1]; };
const flag = (n) => args.includes("--" + n);
if (!film) { console.error("usage: node video/render.mjs <film> [--preview] [--from s --to s] [--shots t,t]"); process.exit(2); }
const J = JSON.parse(readFileSync(join(root, `video/films/${film}.json`), "utf8"));
const FPS = 30, ranged = opt("from") != null || opt("to") != null, preview = flag("preview");
const from = +(opt("from") ?? 0), to = +(opt("to") ?? J.duration);
const shots = opt("shots")?.split(",").map(Number);

// tokens guard: every colour in tokens.js must still exist in globals.css
const css = readFileSync(join(root, "src/app/globals.css"), "utf8").toLowerCase();
const tok = readFileSync(join(root, "video/engine/tokens.js"), "utf8");
for (const hex of new Set(tok.match(/#[0-9a-fA-F]{6}/g))) if (!css.includes(hex.toLowerCase())) throw new Error(`token ${hex} is not in globals.css`);

const srv = await serve(4317);
const browser = await chromium.launch({ channel: "chrome", executablePath: process.env.CHROME_PATH || undefined, args: ["--font-render-hinting=none", "--disable-lcd-text"] });
const dsf = preview ? 0.5 : 1;
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: dsf })).newPage();
page.on("pageerror", (e) => console.error("PAGE ERROR", e.message));
page.on("console", (m) => { if (m.type() === "error") console.error("console:", m.text()); });
await page.goto(`http://127.0.0.1:4317/video/engine/index.html?film=${film}`);
await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 120000 });
const err = await page.evaluate(() => window.__error);
if (err) { console.error(err); process.exit(1); }
const warns = await page.evaluate(() => window.__warnings);
warns.forEach((w) => console.warn("WARN", w));
const seek = async (t) => { await page.evaluate((t) => window.__seek(t), t); await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))); };

if (shots) {
  const d = join(root, "video/out/shots"); mkdirSync(d, { recursive: true });
  for (const t of shots) { await seek(t); await page.screenshot({ path: join(d, `${film}-${t.toFixed(2).padStart(6, "0")}.png`) }); }
  console.log("shots ->", d); await browser.close(); srv.close(); process.exit(0);
}

const outDir = ranged || preview ? join(root, "video/out", preview ? "preview" : "test") : join(root, "public/videos");
mkdirSync(outDir, { recursive: true });
const base = `tivora-${film}-v1`, name = ranged ? `${film}-${from}-${to}` : base;
const f1080 = join(outDir, ranged || preview ? `${name}.mp4` : `${base}-1080.mp4`);
const enc = preview
  ? ["-vf", "scale=960:540", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "veryfast", "-crf", "26", "-r", "15"]
  : ["-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p", "-preset", "slow", "-crf", "20", "-maxrate", "1400k", "-bufsize", "2800k", "-g", "60", "-movflags", "+faststart"];
const ff = spawn(ffmpegPath, ["-y", "-f", "image2pipe", "-framerate", FPS, "-i", "-", ...enc, "-an", f1080], { stdio: ["pipe", "ignore", "pipe"] });
let ffErr = ""; ff.stderr.on("data", (d) => (ffErr += d));
const done = new Promise((r) => ff.on("close", r));
const t0 = Date.now(), n0 = Math.round(from * FPS), n1 = Math.round(to * FPS);
for (let f = n0; f < n1; f++) {
  await seek(f / FPS);
  const png = await page.screenshot({ type: "png" });
  if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
  if (f % 150 === 0) console.log(`frame ${f - n0}/${n1 - n0}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
ff.stdin.end();
if ((await done) !== 0) { console.error(ffErr.slice(-2000)); process.exit(1); }
await browser.close(); srv.close();
console.log(`encoded ${f1080} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
if (ranged || preview) process.exit(0);

// 720p, poster, VTT
const run = (a) => { const r = spawnSync(ffmpegPath, ["-y", ...a], { encoding: "utf8" }); if (r.status !== 0) { console.error(r.stderr.slice(-1500)); process.exit(1); } };
run(["-i", f1080, "-vf", "scale=1280:-2:flags=lanczos", "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p", "-preset", "slow", "-crf", "23", "-maxrate", "600k", "-bufsize", "1200k", "-g", "60", "-movflags", "+faststart", "-an", join(outDir, `${base}-720.mp4`)]);
run(["-ss", String(J.poster), "-i", f1080, "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "4", join(outDir, `${base}-poster.jpg`)]);
writeFileSync(join(outDir, `${base}.en.vtt`), vtt(J));
const B = J.budget || { m1080: 18, m720: 7, poster: 0.15 };
const sz = (f) => statSync(join(outDir, f)).size / 1e6;
const rows = [[`${base}-1080.mp4`, B.m1080], [`${base}-720.mp4`, B.m720], [`${base}-poster.jpg`, B.poster]];
let bad = false;
for (const [f, max] of rows) { const s = sz(f); console.log(`${f}  ${s.toFixed(2)} MB (budget ${max})`); if (s > max) bad = true; }
if (bad) { console.error("BUDGET EXCEEDED"); process.exit(1); }
