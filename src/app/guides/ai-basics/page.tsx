import type { Metadata } from 'next';
import { AiBasicsGuide } from '@/components/guides/ai-basics-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'AI 기초 이해 가이드 — 바이브 코더 가이드 | Linkmap',
  description:
    'LLM 작동 원리, AI 모델 비교, 토큰과 컨텍스트 윈도우, 안전한 AI 사용법을 초보자 눈높이로 설명합니다.',
  keywords: ['AI 기초', 'LLM', '대규모 언어 모델', '토큰', '컨텍스트 윈도우', 'AI 모델 비교', '할루시네이션', 'AI 안전'],
};

export const revalidate = false;

export default function AiBasicsGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'ai-basics',
    title: 'AI 기초 이해 가이드 — 바이브 코더 가이드',
    description: 'LLM 작동 원리, AI 모델 비교, 토큰과 컨텍스트 윈도우, 안전한 AI 사용법을 초보자 눈높이로 설명합니다.',
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <AiBasicsGuide />
    </>
  );
}
