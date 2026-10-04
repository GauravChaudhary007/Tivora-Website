import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A self-contained server (.next/standalone) so the Docker image ships only
  // what the site needs to run — no dev dependencies, no source.
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Videos, posters and logos never change in place — a new cut gets a new
        // file name — so browsers can keep them for a long time.
        source: "/:dir(videos|brand)/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
