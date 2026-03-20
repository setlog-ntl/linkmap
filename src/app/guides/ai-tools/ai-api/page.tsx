import type { Metadata } from 'next';
import { AiApiContent } from '@/components/guides/ai-tools-guide/ai-api-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'AI API 연동 기초 — AI 도구 가이드 | Linkmap',
  description:
    'OpenAI, Anthropic API 키 발급부터 토큰 비용 관리, 스트리밍 응답 구현까지.',
  keywords: ['OpenAI API', 'Anthropic API', 'AI API', '토큰 비용', '스트리밍', 'GPT API', 'Claude API'],
};

export const revalidate = false;

export default function AiApiPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'ai-tools/ai-api',
    title: 'AI API 연동 기초 — AI 도구 가이드',
    description: 'OpenAI, Anthropic API 키 발급부터 토큰 비용 관리, 스트리밍 응답 구현까지.',
    faqs: [
      { q: 'AI API는 얼마나 비용이 드나요?', a: 'GPT-4o는 입력 100만 토큰당 $2.5, 출력 $10입니다. 간단한 앱이라면 월 $5 이내로 충분합니다.' },
      { q: '스트리밍 응답은 왜 필요한가요?', a: '전체 응답을 기다리지 않고 토큰이 생성되는 대로 보여줘 체감 속도가 훨씬 빠릅니다.' },
      { q: 'API 키가 노출되면 어떻게 되나요?', a: '다른 사람이 내 키로 API를 호출해 요금이 청구됩니다. 반드시 환경변수로 관리하고 클라이언트에 노출하지 마세요.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <AiApiContent />
    </>
  );
}
