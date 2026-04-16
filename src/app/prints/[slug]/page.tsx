import { prints } from "@/data/prints";
import { notFound } from "next/navigation";
import PrintDetail from "@/components/PrintDetail";

export function generateStaticParams() {
  return prints.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const print = prints.find((p) => p.slug === slug);
  if (!print) return {};
  return {
    title: `${print.title} — Sina Sharifi`,
    description: print.story,
  };
}

export default async function PrintPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const print = prints.find((p) => p.slug === slug);
  if (!print) notFound();
  return <PrintDetail print={print} />;
}
