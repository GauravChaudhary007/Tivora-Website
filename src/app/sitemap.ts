import type { MetadataRoute } from "next";
import { site, routes } from "@/content/site";
import { modulePages } from "@/content/module-pages";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [...routes, ...modulePages.map((m) => `/modules/${m.slug}/`)].map((path) => ({ url: `${site.url}${path}`, lastModified: new Date(), priority: path === "/" ? 1 : 0.7 }));
}
