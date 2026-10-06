// node video/verify-frames.mjs <film> : extracts start+0.2 / mid / end-0.2 of every scene from the 1080 MP4 into video/out/qa/<film>/ and builds contact sheets (6 per sheet, 2x3) for human review.
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const film = process.argv[2] || "master", root = fileURLToPath(new URL("..", import.meta.url));
const J = JSON.parse(readFileSync(root + `video/films/${film}.json`, "utf8")), out = root + `video/out/qa/${film}/`;
mkdirSync(out, { recursive: true });
const pts = J.scenes.flatMap((s) => [[s.id + "a", s.in + 0.25], [s.id + "b", (s.in + s.out) / 2], [s.id + "c", Math.min(J.duration - 0.05, s.out - 0.15)]]);
for (const [n, t] of pts) spawnSync(ffmpeg, ["-y", "-ss", String(t), "-i", root + `public/videos/tivora-${film}-v1-1080.mp4`, "-frames:v", "1", out + n + ".png"]);
for (let i = 0; i < pts.length; i += 6) {
  const g = pts.slice(i, i + 6), imgs = await Promise.all(g.map(([n]) => sharp(out + n + ".png").resize(800, 450).toBuffer()));
  await sharp({ create: { width: 1600, height: 1350, channels: 3, background: "#444" } }).composite(imgs.map((b, k) => ({ input: b, left: (k % 2) * 800, top: Math.floor(k / 2) * 450 }))).png().toFile(out + `sheet-${String(i / 6).padStart(2, "0")}.png`);
}
console.log(pts.map(([n, t]) => n + "@" + t.toFixed(2)).join(" "));
