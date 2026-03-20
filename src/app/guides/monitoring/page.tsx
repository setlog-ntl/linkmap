import type { Metadata } from 'next';
import { MonitoringGuide } from '@/components/guides/monitoring-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '모니터링 가이드 — 바이브 코더 가이드 | Linkmap',
  description:
    '에러 추적, 웹 분석, 피처 플래그까지. 배포 후 서비스를 안정적으로 운영하는 방법을 초보자 눈높이로 설명합니다.',
  keywords: ['모니터링', 'Sentry', 'Google Analytics', '에러 추적', '피처 플래그', 'A/B 테스트', '초보자'],
};

export const revalidate = false;

export default function MonitoringGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'monitoring',
    title: '모니터링 가이드 — 바이브 코더 가이드',
    description: '에러 추적, 웹 분석, 피처 플래그까지. 배포 후 서비스를 안정적으로 운영하는 방법을 초보자 눈높이로 설명합니다.',
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <MonitoringGuide />
    </>
  );
}
