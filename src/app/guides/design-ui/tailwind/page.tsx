import type { Metadata } from 'next';
import { TailwindContent } from '@/components/guides/design-ui-guide/tailwind-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Tailwind CSS 시작하기 — 디자인/UI 가이드 | Linkmap',
  description:
    'Tailwind CSS 유틸리티 클래스, 반응형 접두사, 다크 모드 설정 방법.',
  keywords: ['Tailwind CSS', '유틸리티 클래스', '반응형', '다크 모드', 'CSS', '초보자'],
};

export default function TailwindPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'design-ui/tailwind',
    title: 'Tailwind CSS 시작하기 — 디자인/UI 가이드',
    description: 'Tailwind CSS 유틸리티 클래스, 반응형 접두사, 다크 모드 설정 방법.',
    faqs: [
      { q: 'Tailwind CSS가 뭔가요?', a: 'HTML에 직접 클래스를 넣어 스타일링하는 유틸리티 퍼스트 CSS 프레임워크입니다. 별도의 CSS 파일을 작성할 필요가 거의 없습니다.' },
      { q: '반응형은 어떻게 만드나요?', a: 'sm:, md:, lg: 같은 접두사를 클래스 앞에 붙이면 화면 크기별로 다른 스타일을 적용할 수 있습니다.' },
      { q: '다크 모드는 어떻게 하나요?', a: 'dark: 접두사를 사용합니다. 예를 들어 dark:bg-gray-900은 다크 모드일 때 배경색을 지정합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <TailwindContent />
    </>
  );
}
