// Builds narration lines from every film's caption cues, voices them with Piper, writes video/narration.json + video/audio/<film>-<i>.wav.
// Usage: node video/voice.mjs [film...]   (re-run after caption changes; then node video/mix-audio.mjs)
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
const PY = "video/.venv/Scripts/python.exe";
const films = process.argv.length > 2 ? process.argv.slice(2) : ["master", "owner", "money", "stock", "sales"];
// Scenes whose caption cascade is too fast to speak one by one: [offset in scene, spoken line] instead.
const OVERRIDE = {
  master: {
    M12: [0.6, "Made for Nepal. Bikram Sambat dates, VAT registers, TDS certificates, and C B M S ready."],
    M13: [0.3, "Jewelry is available now. General trading and Paint are next."],
  },
};
const SKIP = /^(\d{4}|TIVORA ERP ·|\d{4}-\d\d-\d\d|Balanced|.*demo data)/i;
const ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
const TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split(" ");
const num = (n) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : ""));
// Spoken form of a caption (the on-screen text is untouched).
const speak = (t) =>
  t
    .replace(/\s+/g, " ").replace(/&/g, "and").replace(/\bP&L\b/g, "profit and loss")
    .replace(/\b(BS|AD|LCs?|HSN|NRV|BOM|IRD|CBMS|RFQ)\b/g, (m) => m.split("").join(" ").replace(/ s$/, "s"))
    .replace(/Ctrl K/g, "Control K").replace(/Annex (\d+)/g, (_, n) => "Annex " + num(+n))
    .replace(/\b(\d{1,2})\b(?!-)/g, (_, n) => num(+n)).replace(/(\d+)-(\d+)/g, (_, a, b) => `${num(+a)} to ${num(+b)}`)
    .replace(/\s+([.,?!])/g, "$1");
// The approved explanatory script (docs/NARRATION-SCRIPT.md) wins over caption-derived lines: rows are | t | fit | scene | text |.
const SECTION = { Master: "master", Owner: "owner", Books: "money", Buy: "stock", From: "sales" };
const script = {};
if (existsSync("docs/NARRATION-SCRIPT.md")) {
  let film;
  for (const line of readFileSync("docs/NARRATION-SCRIPT.md", "utf8").split(/\r?\n/)) {
    const h = /^## (\w+)/.exec(line);
    if (h) film = SECTION[h[1]];
    const r = /^\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|[^|]*\|\s*(.+?)\s*\|\s*$/.exec(line);
    if (film && r) (script[film] ??= []).push([+r[1], r[3], +r[2]]);
  }
}
mkdirSync("video/audio", { recursive: true });
const all = existsSync("video/narration.json") ? JSON.parse(readFileSync("video/narration.json", "utf8")) : {};
const jobs = [];
for (const f of films) {
  if (script[f]) {
    all[f] = script[f];
    all[f].forEach((l, i) => jobs.push([`video/audio/${f}-${i}.wav`, l[1]]));
    continue;
  }
  const j = JSON.parse(readFileSync(`video/films/${f}.json`, "utf8"));
  const cues = [];
  for (const s of j.scenes) {
    const ov = OVERRIDE[f]?.[s.id];
    if (ov) { cues.push({ t: s.in + ov[0], end: s.out, text: ov[1], fixed: true }); continue; }
    const group = new Map(); // simultaneous cues in a scene are spoken as one line
    for (const c of s.captions ?? []) {
      if (SKIP.test(c.text.trim())) continue;
      if (s.type === "wall" && group.size && [...group.keys()].some((k) => Math.abs(k - c.t) < 0.01)) continue; // wall: module names only
      const k = Math.round(c.t * 100) / 100;
      const g = group.get(k) ?? { t: s.in + c.t, end: s.in + c.t + c.dur, parts: [] };
      g.parts.push(c.text); g.end = Math.max(g.end, s.in + c.t + c.dur);
      group.set(k, g);
    }
    for (const g of group.values()) cues.push({ t: g.t, end: g.end, text: speak(g.parts.join(". ").replace(/\.\./g, ".")) });
  }
  cues.sort((a, b) => a.t - b.t);
  // Cues that would be spoken on top of each other become one line (about 2.4 words a second).
  const est = (x) => x.split(" ").length * 0.42 + 0.3;
  for (let i = 0; i < cues.length - 1; ) {
    cues[i].base ??= est(cues[i].text);
    if (!cues[i].fixed && !cues[i + 1].fixed && cues[i + 1].t < cues[i].t + cues[i].base + 0.15) {
      cues[i].text = cues[i].text.replace(/[.]$/, "") + ". " + cues[i + 1].text;
      cues[i].end = Math.max(cues[i].end, cues[i + 1].end);
      cues.splice(i + 1, 1);
    } else i++;
  }
  all[f] = cues.map((c, i) => [+(c.t + 0.1).toFixed(2), c.text, +Math.max(1.2, Math.min(c.end - c.t + 0.4, (cues[i + 1]?.t ?? j.duration) - c.t - 0.1)).toFixed(2)]);
  all[f].forEach((l, i) => jobs.push([`video/audio/${f}-${i}.wav`, l[1]]));
}
writeFileSync("video/narration.json", JSON.stringify(all, null, 1));
writeFileSync("video/voice/lines.json", JSON.stringify(jobs));
execFileSync(PY, ["video/voice.py", "video/voice/lines.json"], { stdio: ["ignore", "ignore", "inherit"] });
// Trim the silence Piper leaves at both ends so lines fit their windows.
const FF = ["./video/node_modules/ffmpeg-static/ffmpeg.exe", "./node_modules/ffmpeg-static/ffmpeg.exe"].find(existsSync);
const TRIM = "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse";
for (const [path] of jobs) {
  execFileSync(FF, ["-y", "-loglevel", "error", "-i", path, "-af", TRIM, path + ".tmp.wav"]);
  execFileSync("node", ["-e", `require("fs").renameSync(${JSON.stringify(path + ".tmp.wav")},${JSON.stringify(path)})`]);
}
console.log(`voiced ${jobs.length} lines for ${films.join(", ")}`);
