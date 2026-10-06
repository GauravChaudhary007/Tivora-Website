// Writes the logo variants from the official file (recolour / cut only) and
// asserts logo integrity: every variant keeps exactly the source's path data.
// Run: node scripts/brand-variants.mjs
import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";

const DIR = "public/brand/";
const src = readFileSync(DIR + "tivora-official.svg", "utf8").replace(/\r\n/g, "\n").split("\n");
// 1-indexed line ranges that are luminance masks / clip paths: never recoloured.
const MASKED = [[3, 5], [7, 10], [17, 20], [69, 74]];
const GLYPHS = [30, 43]; // white glyphs inside the four symbol circles
const SYMBOL_END = 45; // lines 1-45 = symbol; 46-66 wordmark; 67 descriptor

const inRange = (n, rs) => rs.some(([a, b]) => n >= a && n <= b);
const dark = (lines) =>
  lines.map((l, i) => {
    const n = i + 1;
    if (inRange(n, MASKED)) return l;
    l = l.replaceAll("#6E4A14", "#F6F4F0").replaceAll("#5E574B", "#A99E8B");
    return n >= GLYPHS[0] && n <= GLYPHS[1] ? l.replaceAll('"white"', '"#110D08"') : l;
  });

const symbolSrc = [
  src[0].replace('width="581" height="100" viewBox="0 0 581 100"', 'width="96" height="96" viewBox="0 2 96 96"'),
  ...src.slice(1, SYMBOL_END),
  "<defs>",
  ...src.slice(68, 71), // clip0 def (lines 69-71)
  src[74], // </defs>... (line 75)
  src[75], // </svg>
];
assert.match(symbolSrc[0], /viewBox="0 2 96 96"/, "symbol header rewrite failed");
// Symbol line numbers 1-45 match the source, so the same mask/glyph rules apply.
const symbolDark = dark(symbolSrc);

const out = {
  "tivora-logo-dark.svg": dark(src),
  "tivora-symbol.svg": symbolSrc,
  "tivora-symbol-dark.svg": symbolDark,
};
for (const [name, lines] of Object.entries(out)) writeFileSync(DIR + name, lines.join("\n") + "\n");

// --- integrity: path `d` multiset per variant equals the source subset -------
const ds = (text) => [...text.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]).sort();
const srcAll = ds(src.join("\n"));
const srcSymbol = ds(src.slice(0, SYMBOL_END).join("\n"));
const expect = {
  "tivora-official.svg": srcAll,
  "tivora-logo-dark.svg": srcAll,
  "tivora-symbol.svg": srcSymbol,
  "tivora-symbol-dark.svg": srcSymbol,
};
for (const [name, want] of Object.entries(expect)) {
  const got = ds(readFileSync(DIR + name, "utf8"));
  assert.deepEqual(got, want, `${name}: path data differs from source`);
}
// masks/clipPaths byte-identical to source in the dark lockup
const dk = readFileSync(DIR + "tivora-logo-dark.svg", "utf8").split("\n");
for (const [a, b] of MASKED) assert.deepEqual(dk.slice(a - 1, b), src.slice(a - 1, b), `mask lines ${a}-${b} altered`);
// no old bronze / slate left in the dark files outside masks
for (const name of ["tivora-logo-dark.svg", "tivora-symbol-dark.svg"]) {
  const body = readFileSync(DIR + name, "utf8");
  assert.ok(!/#6E4A14|#5E574B/.test(body), `${name}: unconverted brand colour`);
}
console.log("brand-variants: OK (", Object.keys(expect).length, "files, path data identical to source )");
