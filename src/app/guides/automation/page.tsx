import type { Metadata } from 'next';
import { AutomationGuide } from '@/components/guides/automation-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '자동화/통합 가이드 — 바이브 코더 가이드 | Linkmap',
  description:
    '웹훅, 스케줄링, SNS API 연동까지. 수동 작업을 자동화하는 방법을 초보자 눈높이로 설명합니다.',
  keywords: ['자동화', '웹훅', 'Webhook', 'cron', '스케줄링', 'SNS API', '카카오 API', '초보자'],
};

export default function AutomationGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'automation',
    title: '자동화/통합 가이드 — 바이브 코더 가이드',
    description: '웹훅, 스케줄링, SNS API 연동까지. 수동 작업을 자동화하는 방법을 초보자 눈높이로 설명합니다.',
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <AutomationGuide />
    </>
  );
}
