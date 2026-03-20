import type { Metadata } from 'next';
import { PackageManagerGuide } from '@/components/guides/package-manager-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '패키지 매니저 가이드 — 바이브 코더 가이드 | Linkmap',
  description:
    'npm, yarn, pnpm 비교부터 package.json 이해, npm 에러 해결까지 초보자 눈높이로 설명합니다.',
  keywords: ['npm', 'yarn', 'pnpm', 'package.json', '패키지 매니저', 'node_modules', '초보자'],
};

export const revalidate = false;

export default function PackageManagerGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'package-manager',
    title: '패키지 매니저 가이드 — 바이브 코더 가이드',
    description:
      'npm, yarn, pnpm 비교부터 package.json 이해, npm 에러 해결까지 초보자 눈높이로 설명합니다.',
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <PackageManagerGuide />
    </>
  );
}
