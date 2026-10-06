// node video/sheet.mjs  -> video/out/sheet.png (contact sheet of video/out/shots/*.png, 3 columns) for review
import sharp from "sharp";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
const d = fileURLToPath(new URL("./out/shots/", import.meta.url));
const f = readdirSync(d).filter((x) => x.endsWith(".png")).sort();
const cols = 3, w = 640, h = 360, rows = Math.ceil(f.length / cols);
const imgs = await Promise.all(f.map((x) => sharp(d + x).resize(w, h).toBuffer()));
await sharp({ create: { width: cols * w, height: rows * h, channels: 3, background: "#444" } }).composite(imgs.map((b, i) => ({ input: b, left: (i % cols) * w, top: Math.floor(i / cols) * h }))).png().toFile(d + "../sheet.png");
console.log(f.join(" "));
