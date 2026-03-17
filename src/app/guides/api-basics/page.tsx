import type { Metadata } from 'next';
import { ApiBasicsGuide } from '@/components/guides/api-basics-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'API 연동 기초 — 바이브 코더 가이드 | Linkmap',
  description:
    'API 개념부터 HTTP 요청, 에러 핸들링, 인증 방식까지 초보자 눈높이로 설명합니다.',
  keywords: ['API', 'REST', 'GraphQL', 'fetch', 'HTTP', '에러 핸들링', '인증', '초보자'],
};

export default function ApiBasicsGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'api-basics',
    title: 'API 연동 기초 — 바이브 코더 가이드',
    description: 'API 개념부터 HTTP 요청, 에러 핸들링, 인증 방식까지 초보자 눈높이로 설명합니다.',
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <ApiBasicsGuide />
    </>
  );
}
