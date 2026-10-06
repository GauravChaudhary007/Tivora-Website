// Build guard for the launch videos (docs/VIDEO-SPEC.md 4.3). Run by `prebuild` and scripts/build-static.mjs.
// public/videos/ is git-ignored, so a fresh clone has no films. Pages omit a film whose files are missing,
// so a build never ships a dead player. By default this only warns loudly; set REQUIRE_VIDEOS=1 to fail instead
// (use it for the real release build, where every film must be present).
import { existsSync, readFileSync } from "node:fs";

const src = readFileSync("src/content/videos.ts", "utf8");
const version = src.match(/const VERSION = "([^"]+)"/)?.[1];
const ids = [...src.matchAll(/^ {4}id: "(\w+)"/gm)].map((m) => m[1]);
if (!version || !ids.length) throw new Error("check-videos: could not read VERSION / film ids from src/content/videos.ts");

const names = ids.flatMap((id) => {
  const b = `tivora-${id}-${version}`;
  return [`${b}-1080.mp4`, `${b}-720.mp4`, `${b}-poster.jpg`, `${b}.en.vtt`];
});
const missing = names.filter((n) => !existsSync(`public/videos/${n}`));

if (missing.length) {
  const msg =
    `Launch videos missing from public/videos/ (${missing.length} of ${names.length}):\n  ${missing.join("\n  ")}\n` +
    `Run \`npm run video:render\` to create them.`;
  if (process.env.REQUIRE_VIDEOS === "1") {
    console.error(`\nERROR: ${msg}\n`);
    process.exit(1);
  }
  console.warn(`\n!!! WARNING: ${msg}\n!!! Pages with a missing film are built WITHOUT its player. Set REQUIRE_VIDEOS=1 to make this an error.\n`);
} else {
  console.log(`Launch videos: all ${names.length} files present.`);
}
