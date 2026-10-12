import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { modulePages } from "@/content/module-pages";
import { ModuleDetail } from "@/components/pages/ModuleDetail";

export const dynamicParams = false;

const list = modulePages;

export function generateStaticParams() {
  return list.map((m) => ({ slug: m.slug }));
}

const find = (slug: string) => list.find((m) => m.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const m = find((await params).slug);
  if (!m) return {};
  return pageMeta({ title: m.name, description: m.description, path: `/modules/${m.slug}/` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const m = find((await params).slug);
  if (!m) notFound();
  return <ModuleDetail m={m} />;
}
