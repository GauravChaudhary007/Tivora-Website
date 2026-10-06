import type { NextConfig } from "next";

// STATIC_EXPORT=1 (see scripts/build-static.mjs) produces plain HTML in `out/`
// for shared hosting / cPanel without Node.js. Default stays the standalone
// server used by the Docker image.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // A self-contained server (.next/standalone) so the Docker image ships only
  // what the site needs to run: no dev dependencies, no source.
  output: staticExport ? "export" : "standalone",
  // Same URLs in both builds: /about/ is out/about/index.html on Apache.
  trailingSlash: true,
  // Screens are pre-sized WebP files served as plain <img>; no image optimizer
  // exists in a static export.
  images: { unoptimized: true },
  poweredByHeader: false,
  ...(staticExport
    ? {}
    : {
        async headers() {
          return [
            {
              // Logos and screenshots never change in place (a new cut gets a new
              // file name), so browsers can keep them for a long time.
              source: "/:dir(brand|screens)/:file*",
              headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
            },
          ];
        },
      }),
};

export default nextConfig;
