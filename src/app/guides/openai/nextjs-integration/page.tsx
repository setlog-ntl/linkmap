import type { Metadata } from 'next';
import { NextjsIntegrationGuide } from '@/components/guides/openai-guide/nextjs-integration-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'OpenAI Next.js 연동 + 스트리밍 가이드 | Linkmap',
  description:
    'Next.js App Router API Route에서 OpenAI를 연동하는 방법. 스트리밍 응답 구현과 Vercel AI SDK 사용법까지 포함합니다.',
  keywords: ['OpenAI Next.js', 'API Route', '스트리밍', 'Vercel AI SDK', 'useChat', 'streamText', 'gpt-4o'],
};

export const revalidate = false;

export default function NextjsIntegrationPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'openai/nextjs-integration',
    title: 'OpenAI Next.js 연동 + 스트리밍 가이드',
    description: 'Next.js App Router API Route에서 OpenAI를 연동하는 방법. 스트리밍 응답 구현과 Vercel AI SDK 사용법.',
    faqs: [
      { q: '클라이언트 컴포넌트에서 직접 OpenAI를 사용하면 안 되나요?', a: '클라이언트에서 직접 사용하면 API 키가 브라우저에 노출됩니다. 반드시 서버(API Route 또는 서버 컴포넌트)에서만 OpenAI SDK를 사용하세요.' },
      { q: 'Vercel AI SDK와 공식 OpenAI SDK 중 어떤 것을 쓰나요?', a: '간단한 채팅이나 스트리밍은 Vercel AI SDK가 편리합니다. 멀티모달, 임베딩, 파일 업로드 등 고급 기능이 필요하면 공식 SDK를 직접 사용하세요.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <NextjsIntegrationGuide />
    </>
  );
}
