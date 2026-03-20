import type { Metadata } from 'next';
import { AiToolsGuide } from '@/components/guides/ai-tools-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'AI 도구 활용 가이드 — 바이브 코더 가이드 | Linkmap',
  description:
    '바이브코딩 개념부터 프롬프트 엔지니어링, Cursor·Claude Code 활용, AI API 연동까지 초보자 눈높이로 설명합니다.',
  keywords: ['바이브코딩', 'AI 코딩', 'Cursor', 'Claude Code', 'ChatGPT', '프롬프트 엔지니어링', 'AI API'],
};

export const revalidate = false;

export default function AiToolsGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'ai-tools',
    title: 'AI 도구 활용 가이드 — 바이브 코더 가이드',
    description: '바이브코딩 개념부터 프롬프트 엔지니어링, Cursor·Claude Code 활용, AI API 연동까지 초보자 눈높이로 설명합니다.',
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <AiToolsGuide />
    </>
  );
}
