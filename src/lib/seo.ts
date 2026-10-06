import type { Metadata } from "next";

/**
 * Per-page metadata. A page-level `openGraph` replaces the parent's, so the share
 * image is repeated here (title, description and path vary; the image does not).
 */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", siteName: "TiVora ERP", images: ["/opengraph-image.png"] },
  };
}
