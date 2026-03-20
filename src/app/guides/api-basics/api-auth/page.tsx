import type { Metadata } from 'next';
import { ApiAuthContent } from '@/components/guides/api-basics-guide/api-auth-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'API 인증 방식 — API 연동 기초 | Linkmap',
  description:
    'API Key, Bearer Token, OAuth 등 API 인증 방식을 비교하고 사용법을 설명합니다.',
  keywords: ['API Key', 'Bearer Token', 'OAuth', 'API 인증', 'Authorization', '보안', '초보자'],
};

export const revalidate = false;

export default function ApiAuthPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'api-basics/api-auth',
    title: 'API 인증 방식 — API Key, Bearer Token, OAuth',
    description: 'API Key, Bearer Token, OAuth 등 API 인증 방식을 비교하고 사용법을 설명합니다.',
    faqs: [
      { q: 'API Key와 Bearer Token의 차이는?', a: 'API Key는 고정된 문자열로 간단하지만 보안이 약합니다. Bearer Token은 로그인 후 발급받는 임시 토큰으로 만료 시간이 있어 더 안전합니다.' },
      { q: 'OAuth는 언제 사용하나요?', a: '사용자가 Google, GitHub 등 다른 서비스 계정으로 로그인할 때 사용합니다. "GitHub으로 로그인" 버튼이 대표적인 OAuth 사례입니다.' },
      { q: 'API Key는 어디에 보관해야 하나요?', a: '절대 코드에 직접 쓰면 안 됩니다. .env.local 파일에 저장하고, 서버 사이드에서만 사용하세요. NEXT_PUBLIC_ 접두사를 붙이면 브라우저에 노출되니 주의하세요.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <ApiAuthContent />
    </>
  );
}
