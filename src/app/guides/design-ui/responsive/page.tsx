import type { Metadata } from 'next';
import { ResponsiveContent } from '@/components/guides/design-ui-guide/responsive-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '반응형 디자인 — 디자인/UI 가이드 | Linkmap',
  description:
    '모바일 퍼스트 설계, 브레이크포인트, Flexbox와 Grid 레이아웃.',
  keywords: ['반응형', '모바일 퍼스트', 'Flexbox', 'Grid', '레이아웃', 'CSS', '초보자'],
};

export default function ResponsivePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'design-ui/responsive',
    title: '반응형 디자인 — 디자인/UI 가이드',
    description: '모바일 퍼스트 설계, 브레이크포인트, Flexbox와 Grid 레이아웃.',
    faqs: [
      { q: '모바일 퍼스트가 뭔가요?', a: '모바일 화면을 먼저 디자인하고, 큰 화면으로 확장하는 접근법입니다. Tailwind CSS의 기본 철학이기도 합니다.' },
      { q: 'Flexbox와 Grid 중 뭘 써야 하나요?', a: '1차원(한 줄) 배치는 Flexbox, 2차원(행+열) 배치는 Grid가 적합합니다. 실무에서는 둘을 함께 사용합니다.' },
      { q: '브레이크포인트는 몇 개가 적당한가요?', a: 'Tailwind 기본 브레이크포인트(sm, md, lg, xl)로 충분합니다. 대부분 sm과 md만으로도 잘 대응됩니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <ResponsiveContent />
    </>
  );
}
