// Builds the cPanel (static) package: out/ + PHP form handler + .htaccess.
// The Next.js API routes can't be part of a static export, so they are moved aside
// during the build and restored afterwards; deploy/static/api/demo/index.php replaces /api/demo.
import { execSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, readFileSync, renameSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

await import("./check-videos.mjs"); // warns (REQUIRE_VIDEOS=1: fails) when public/videos/ lacks a film

const api = "src/app/api";
const parked = "src/.api-parked";
rmSync("out", { recursive: true, force: true });
// Stale dev-server type output breaks type-checking of the parked routes.
rmSync(".next/dev", { recursive: true, force: true });
renameSync(api, parked);
try {
  execSync("npx next build", { stdio: "inherit", env: { ...process.env, STATIC_EXPORT: "1" } });
} finally {
  renameSync(parked, api);
}

const routes = ["", "platform/", "modules/", "work-desk/", "industries/", "industries/jewelry/", "about/", "contact/"];
const required = [...routes.map((r) => `out/${r}index.html`), "out/404.html", "out/sitemap.xml", "out/robots.txt"];
const missing = required.filter((f) => !existsSync(f));
if (missing.length) throw new Error(`Static export incomplete, missing: ${missing.join(", ")}`);

// The default image optimizer does not exist in a static export.
const htmlFiles = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith(".html") ? [p] : [];
  });
const bad = htmlFiles("out").filter((f) => readFileSync(f, "utf8").includes("_next/image"));
if (bad.length) throw new Error(`"_next/image" found in: ${bad.join(", ")}`);

cpSync("deploy/static", "out", { recursive: true });
console.log("\nStatic site ready in out/ — zip its contents and upload to public_html.");
