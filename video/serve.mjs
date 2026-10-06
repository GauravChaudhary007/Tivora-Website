// Static server shared by render.mjs and extract-world.mjs. Mapping (docs/VIDEO-SPEC.md 4.2):
// /video/* -> video/, /gsap/* -> gsap dist, /brand/* -> public/brand (logo files, unmodified), anything else -> out/.
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2" };
const MAP = [["/video/", "video"], ["/gsap/", "node_modules/gsap/dist"], ["/brand/", "public/brand"], ["/", "out"]];

export const root = ROOT;
export function serve(port = 4317) {
  const srv = createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const [prefix, dir] = MAP.find(([p]) => url.startsWith(p));
    let f = normalize(join(ROOT, dir, url.slice(prefix.length)));
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!f.startsWith(ROOT) || !existsSync(f)) { res.writeHead(404).end(); return; }
    res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream", "cache-control": "no-store" });
    createReadStream(f).pipe(res);
  });
  return new Promise((ok) => srv.listen(port, "127.0.0.1", () => ok(srv)));
}
