// Regenerates the five .en.vtt files and the transcript blocks of src/content/videos.ts from video/films/*.json
// (one transcript row per burned-in caption item, VTT = merged non-overlapping cues). Run: node video/sync-text.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { items, vtt } from "./captions.mjs";

const ids = ["master", "owner", "money", "stock", "sales"];
let ts = readFileSync("src/content/videos.ts", "utf8");
for (const id of ids) {
  const film = JSON.parse(readFileSync(`video/films/${id}.json`, "utf8"));
  writeFileSync(`public/videos/tivora-${id}-v1.en.vtt`, vtt(film));
  const rows = items(film).sort((x, y) => x.start - y.start || x.order - y.order).map((c) => `      [${c.start}, ${JSON.stringify(c.text)}],
`);
  const a = ts.indexOf(`  ${id}: {`), b = ts.indexOf("transcript: [" + String.fromCharCode(10), a) + 14, c = ts.indexOf("    ],", b);
  if (a < 0 || b < 14 || c < 0) throw new Error("no transcript block for " + id);
  ts = ts.slice(0, b) + rows.join("") + ts.slice(c);
}
writeFileSync("src/content/videos.ts", ts);
