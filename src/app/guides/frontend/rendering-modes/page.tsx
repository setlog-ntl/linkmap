import type { Metadata } from 'next';
import { RenderingModesContent } from '@/components/guides/frontend-guide/rendering-modes-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'CSR vs SSR vs SSG — 렌더링 방식 비교 | Linkmap',
  description:
    '클라이언트 사이드 렌더링(CSR), 서버 사이드 렌더링(SSR), 정적 사이트 생성(SSG)의 차이와 Next.js에서 각각을 선택하는 기준을 설명합니다.',
  keywords: ['CSR', 'SSR', 'SSG', '렌더링', 'Next.js', 'App Router', '서버 컴포넌트', '초보자'],
};

export default function RenderingModesPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'frontend/rendering-modes',
    title: 'CSR vs SSR vs SSG — 렌더링 방식 비교',
    description: 'CSR, SSR, SSG의 차이와 Next.js에서 각각을 선택하는 기준.',
    faqs: [
      { q: 'Next.js App Router에서 기본 렌더링 방식은?', a: 'App Router에서는 기본적으로 서버 컴포넌트를 사용합니다. fetch() 기본값은 SSG(정적 캐시)이고, cache: "no-store"를 추가하면 SSR이 됩니다.' },
      { q: 'SEO가 중요한 페이지는 어떤 방식을 써야 하나요?', a: 'SSR 또는 SSG를 사용하세요. CSR은 초기 HTML이 비어있어 검색 엔진이 내용을 읽지 못합니다.' },
      { q: '대시보드는 왜 CSR이 좋은가요?', a: '로그인이 필요한 개인화 데이터는 SEO가 필요없고, 실시간으로 자주 바뀌어서 CSR이 적합합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <RenderingModesContent />
    </>
  );
}
