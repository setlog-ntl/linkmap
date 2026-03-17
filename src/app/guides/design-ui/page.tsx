import type { Metadata } from 'next';
import { DesignUiGuide } from '@/components/guides/design-ui-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '디자인/UI 가이드 — 바이브 코더 가이드 | Linkmap',
  description:
    '웹 디자인 기초부터 Tailwind CSS, 컴포넌트 라이브러리, 반응형 디자인까지 초보자 눈높이로 설명합니다.',
  keywords: ['웹 디자인', 'Tailwind CSS', 'shadcn/ui', '반응형', 'UI', 'CSS', '초보자'],
};

export default function DesignUiGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'design-ui',
    title: '디자인/UI 가이드 — 바이브 코더 가이드',
    description: '웹 디자인 기초부터 Tailwind CSS, 컴포넌트 라이브러리, 반응형 디자인까지 초보자 눈높이로 설명합니다.',
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <DesignUiGuide />
    </>
  );
}
