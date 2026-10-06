// Adds narration + a quiet ambient bed to the silent films. Usage: node video/mix-audio.mjs [film...]
// Narration clips: video/audio/clip-N.wav (git-ignored, N = order in narration-index.json); timings: narration.json.
// Silent masters are kept in video/out/silent/ so the mix can be redone without re-rendering video.
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync } from "node:fs";
import { createRequire } from "node:module";
const req = createRequire(import.meta.url);
const FF = ["./node_modules/ffmpeg-static/ffmpeg.exe", "./video/node_modules/ffmpeg-static/ffmpeg.exe"].find(existsSync) ?? req("ffmpeg-static");
const nar = JSON.parse(readFileSync("video/narration.json", "utf8"));
const OUTRO_AT = { master: 95.8, owner: 58.3, money: 66.3, stock: 62.3, sales: 56.3 };
const LEN = { master: 100, owner: 64, money: 72, stock: 68, sales: 62 };
const MAX_TEMPO = 1.2; // ponytail: faster than 1.2x sounds hurried; shorten the line instead
const dur = (f) => +/Duration: (\d+):(\d+):([\d.]+)/.exec(spawnSync(FF, ["-hide_banner", "-i", f], { encoding: "utf8" }).stderr).slice(1).reduce((a, v) => a * 60 + +v, 0);

let n = 1; // clip 0 is the outro
const order = ["master", "owner", "money", "stock", "sales"];
const first = {};
for (const f of order) { first[f] = n; n += nar[f].length; }

for (const film of process.argv.length > 2 ? process.argv.slice(2) : order) {
  const lines = [{ clip: 0, t: OUTRO_AT[film], max: LEN[film] - OUTRO_AT[film] - 0.2 }, ...nar[film].map((l, i) => ({ clip: first[film] + i, t: l[0], max: l[2] }))];
  const inputs = [];
  const filt = [];
  lines.forEach((l, i) => {
    const d = dur(`video/audio/clip-${l.clip}.wav`);
    const tempo = Math.min(MAX_TEMPO, Math.max(1, d / l.max));
    if (d / tempo > l.max + 0.3) console.warn(`  ${film} clip ${l.clip} @${l.t}s: ${d.toFixed(1)}s in a ${l.max}s window (still over by ${(d / tempo - l.max).toFixed(1)}s)`);
    inputs.push("-i", `video/audio/clip-${l.clip}.wav`);
    filt.push(`[${i + 1}:a]atempo=${tempo.toFixed(3)},adelay=${Math.round(l.t * 1000)}|${Math.round(l.t * 1000)},apad[v${i}]`);
  });
  const L = lines.length;
  // Ambient bed: A-major pad (A2, E3, A3, C#4) with slow tremolo, low-passed, fading in and out.
  const pad = `aevalsrc='0.5*sin(2*PI*110*t)+0.35*sin(2*PI*164.81*t)+0.25*sin(2*PI*220*t)+0.15*sin(2*PI*277.18*t)*(0.7+0.3*sin(2*PI*0.1*t))':d=${LEN[film]}:s=44100,lowpass=f=700,afade=t=in:d=3,afade=t=out:st=${LEN[film] - 4}:d=4,volume=0.05[bed]`;
  filt.push(`${lines.map((_, i) => `[v${i}]`).join("")}amix=inputs=${L}:normalize=0,atrim=0:${LEN[film]}[voice]`);
  filt.push(pad);
  filt.push(`[voice]asplit[vo][sc];[bed][sc]sidechaincompress=threshold=0.02:ratio=6:attack=20:release=400[duck];[vo][duck]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[out]`);
  mkdirSync("video/out/silent", { recursive: true });
  for (const res of ["1080", "720"]) {
    const dst = `public/videos/tivora-${film}-v1-${res}.mp4`;
    const silent = `video/out/silent/tivora-${film}-v1-${res}.mp4`;
    if (!existsSync(silent)) copyFileSync(dst, silent); // keep the silent master once
    execFileSync(FF, ["-y", "-hide_banner", "-loglevel", "error", "-i", silent, ...inputs, "-filter_complex", filt.join(";"), "-map", "0:v", "-map", "[out]", "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-t", String(LEN[film]), dst], { stdio: "inherit" });
    console.log(`${film} ${res}: ${(readFileSync(dst).length / 1e6).toFixed(1)} MB`);
  }
}
