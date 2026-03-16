import type { Metadata } from 'next';
import { DeployGuide } from '@/components/guides/deploy-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '배포 완전 정복 — 바이브 코더 가이드 | Linkmap',
  description:
    '코드를 작성하고 세상에 공개하기까지의 모든 과정. 수동 배포 vs 자동 배포, 배포 파이프라인, 플랫폼 비교를 초보자 눈높이로 설명합니다.',
  keywords: ['배포', 'Deploy', 'CI/CD', 'Vercel', 'Cloudflare', 'Railway', 'Netlify', '자동 배포', '초보자'],
};

export default function DeployGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'deploy',
    title: '배포 완전 정복 — 바이브 코더 가이드',
    description: '코드를 작성하고 세상에 공개하기까지의 모든 과정. 배포 파이프라인과 플랫폼 비교를 초보자 눈높이로 설명합니다.',
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <DeployGuide />
    </>
  );
}
