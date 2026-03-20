import type { Metadata } from 'next';
import { OpenAIApiKeyGuide } from '@/components/guides/openai-guide/api-key-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'OpenAI API 키 발급 + 설정 가이드 | Linkmap',
  description:
    'OpenAI 콘솔에서 API 키를 발급하고 .env.local에 등록하는 방법. 요금 한도 설정으로 예상치 못한 비용을 방지하는 방법 포함.',
  keywords: ['OpenAI API 키', 'API 키 발급', 'OPENAI_API_KEY', '환경변수', '요금 한도', 'platform.openai.com'],
};

export const revalidate = false;

export default function OpenAIApiKeyPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'openai/api-key',
    title: 'OpenAI API 키 발급 + 설정 가이드',
    description: 'OpenAI 콘솔에서 API 키를 발급하고 .env.local에 등록하는 방법. 요금 한도 설정 포함.',
    faqs: [
      { q: 'API 키를 분실했어요', a: '키 생성 시 한 번만 표시됩니다. 분실했다면 해당 키를 삭제하고 새 키를 발급하세요.' },
      { q: 'NEXT_PUBLIC_OPENAI_API_KEY로 설정해도 되나요?', a: '절대 안 됩니다. NEXT_PUBLIC_ 접두사를 붙이면 브라우저 번들에 키가 포함되어 공개됩니다. OPENAI_API_KEY (NEXT_PUBLIC 없이)로 설정하세요.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <OpenAIApiKeyGuide />
    </>
  );
}
