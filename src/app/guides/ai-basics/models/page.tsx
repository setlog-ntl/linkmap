import type { Metadata } from 'next';
import { ModelsContent } from '@/components/guides/ai-basics-guide/models-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'AI 모델 비교 — AI 기초 가이드 | Linkmap',
  description:
    '2026년 주요 AI 모델(Claude, GPT, Gemini, Llama, DeepSeek)의 성능, 가격, 특징을 객관적으로 비교합니다.',
  keywords: ['AI 모델 비교', 'Claude', 'GPT-5', 'Gemini', 'Llama', 'DeepSeek', 'LLM 가격', 'AI 모델 선택'],
};

export const revalidate = false;

export default function ModelsPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'ai-basics/models',
    title: 'AI 모델 비교 — AI 기초 가이드',
    description: '2026년 주요 AI 모델의 성능, 가격, 특징을 객관적으로 비교합니다.',
    faqs: [
      { q: '어떤 AI 모델이 코딩에 가장 좋나요?', a: '2026년 기준 Claude Opus 4.8이 코딩에서 강력한 성능을 보이지만, 상황과 예산에 따라 다릅니다. 비용을 줄이고 싶다면 DeepSeek V4나 Gemini Flash도 좋은 선택입니다.' },
      { q: 'AI 모델 비용은 얼마나 드나요?', a: '모델마다 다르지만, 가벼운 사용(일 10~20회)이면 월 $5~15, 일반 개발 수준이면 월 $30~80 정도입니다. 오픈소스 모델을 자체 호스팅하면 무료로도 가능합니다.' },
      { q: '오픈소스 AI 모델이란 무엇인가요?', a: '소스 코드와 모델 가중치가 공개되어 누구나 사용/수정할 수 있는 모델입니다. Llama 4, DeepSeek가 대표적이며, 자체 서버에서 무료로 운영할 수 있어 프라이버시와 비용 면에서 유리합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <ModelsContent />
    </>
  );
}
