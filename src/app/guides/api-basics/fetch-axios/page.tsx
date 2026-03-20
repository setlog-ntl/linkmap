import type { Metadata } from 'next';
import { FetchAxiosContent } from '@/components/guides/api-basics-guide/fetch-axios-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'HTTP 요청 보내기 — API 연동 기초 | Linkmap',
  description:
    'fetch API 사용법, GET/POST 요청, 헤더와 바디, JSON 파싱을 예시와 함께 설명합니다.',
  keywords: ['fetch', 'axios', 'HTTP', 'GET', 'POST', 'JSON', 'API 요청', '초보자'],
};

export const revalidate = false;

export default function FetchAxiosPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'api-basics/fetch-axios',
    title: 'HTTP 요청 보내기 — fetch와 axios',
    description: 'fetch API 사용법, GET/POST 요청, 헤더와 바디, JSON 파싱을 예시와 함께 설명합니다.',
    faqs: [
      { q: 'fetch와 axios 중 무엇을 써야 하나요?', a: '처음 배우는 분은 fetch를 추천합니다. 브라우저 내장이라 설치 없이 바로 사용 가능하고, Next.js에서도 기본 지원합니다.' },
      { q: 'async/await 없이도 API 호출이 가능한가요?', a: '네, .then() 체이닝으로도 가능합니다. 하지만 async/await가 코드 가독성이 훨씬 좋아 현대 JavaScript에서는 이 방식을 권장합니다.' },
      { q: 'Content-Type은 왜 설정해야 하나요?', a: '서버에게 "내가 보내는 데이터 형식이 JSON입니다"라고 알려주는 역할입니다. POST 요청 시 JSON 데이터를 보낼 때 필수입니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <FetchAxiosContent />
    </>
  );
}
