import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGlossaryTermJsonLd } from '@/lib/seo/json-ld';
import { GlossaryDetail } from '@/components/glossary/glossary-detail';
import {
  GLOSSARY_ENTRIES,
  GLOSSARY_CATEGORIES,
  getGlossaryEntry,
} from '@/data/seo/glossary-terms';

export const revalidate = false;
export const dynamicParams = false;

export function generateStaticParams() {
  return GLOSSARY_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getGlossaryEntry(slug);
  if (!entry) return {};

  const cat = GLOSSARY_CATEGORIES[entry.category];
  const description = entry.definition ?? entry.oneLiner;

  return {
    title: `${entry.term} (${entry.termEn})란? — ${cat.label} 용어 | Linkmap 용어사전`,
    description: description.slice(0, 155),
    keywords: [
      `${entry.term}란`,
      `${entry.term} 뜻`,
      entry.termEn,
      '바이브 코딩 용어',
      '개발 용어사전',
      ...(entry.aliases ?? []),
    ],
    alternates: { canonical: `https://www.linkmap.biz/glossary/${entry.slug}` },
    openGraph: {
      title: `${entry.term} (${entry.termEn})란?`,
      description: entry.oneLiner,
      url: `https://www.linkmap.biz/glossary/${entry.slug}`,
      type: 'article',
    },
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getGlossaryEntry(slug);
  if (!entry) notFound();

  const jsonLd = generateGlossaryTermJsonLd({
    slug: entry.slug,
    term: entry.term,
    termEn: entry.termEn,
    definition: entry.definition ?? entry.oneLiner,
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <GlossaryDetail entry={entry} />
    </>
  );
}
