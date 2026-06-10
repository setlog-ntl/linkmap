import type { Metadata } from 'next';
import { CostSavingContent } from '@/components/guides/ai-basics-guide/cost-saving-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'AI 비용 관리 · 토큰 절약 — AI 기초 가이드 | Linkmap',
  description:
    'AI API 토큰과 요금 구조를 이해하고, 모델 선택·max_tokens·프롬프트 캐싱·컨텍스트 관리로 비용 폭탄을 막는 방법을 초보자 눈높이로 설명합니다.',
  keywords: ['AI 비용', '토큰 절약', 'LLM 요금', 'max_tokens', '프롬프트 캐싱', 'AI 비용 관리', '모델 선택'],
};

export const revalidate = false;

export default function CostSavingPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'ai-basics/cost-saving',
    parentSlug: 'ai-basics',
    title: 'AI 비용 관리 · 토큰 절약 — AI 기초 가이드',
    description: 'AI API 토큰과 요금 구조, 비용 폭탄을 막는 5가지 절약 방법을 정리합니다.',
    faqs: [
      { q: 'AI API 비용은 어떻게 매겨지나요?', a: '주고받은 글의 양(토큰) 개수로 매겨집니다. 보통 출력 토큰이 입력 토큰보다 5~10배 비싸고, 한국어는 영어보다 토큰을 2~3배 더 사용합니다.' },
      { q: '비용을 가장 크게 줄이는 방법은?', a: '작업 난이도에 맞는 저렴한 모델을 고르는 것(모델 다운시프트)과, max_tokens로 출력 길이를 제한하는 것입니다. 이 둘만으로도 비용을 절반 이하로 줄일 수 있습니다.' },
      { q: '대화가 길어지면 왜 비용이 늘어나나요?', a: 'AI는 상태를 기억하지 못해 매 요청마다 지금까지의 대화 전체를 다시 받습니다. 대화가 길수록 입력 토큰이 누적되므로, 오래된 맥락은 요약하거나 잘라내는 것이 좋습니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <CostSavingContent />
    </>
  );
}
