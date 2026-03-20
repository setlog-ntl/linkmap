import type { Metadata } from 'next';
import { ComponentsContent } from '@/components/guides/design-ui-guide/components-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '컴포넌트 라이브러리 — 디자인/UI 가이드 | Linkmap',
  description:
    'shadcn/ui, Radix UI 등 컴포넌트 라이브러리를 활용해 빠르게 UI를 만드는 방법.',
  keywords: ['shadcn/ui', 'Radix UI', '컴포넌트', 'React', 'UI 라이브러리', '초보자'],
};

export const revalidate = false;

export default function ComponentsPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'design-ui/components',
    title: '컴포넌트 라이브러리 — 디자인/UI 가이드',
    description: 'shadcn/ui, Radix UI 등 컴포넌트 라이브러리를 활용해 빠르게 UI를 만드는 방법.',
    faqs: [
      { q: 'shadcn/ui는 npm 패키지인가요?', a: '아닙니다. shadcn/ui는 코드를 직접 프로젝트에 복사하는 방식입니다. npx shadcn@latest add 명령어로 원하는 컴포넌트만 추가합니다.' },
      { q: 'Radix UI는 뭔가요?', a: 'shadcn/ui의 기반이 되는 헤드리스(스타일 없는) 컴포넌트 라이브러리입니다. 접근성과 키보드 네비게이션이 기본 내장되어 있습니다.' },
      { q: '어떤 컴포넌트부터 설치해야 하나요?', a: 'Button, Card, Input, Dialog가 가장 자주 쓰입니다. 필요할 때마다 하나씩 추가하면 됩니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <ComponentsContent />
    </>
  );
}
