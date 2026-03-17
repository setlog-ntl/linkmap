import type { Metadata } from 'next';
import { AnalyticsContent } from '@/components/guides/monitoring-guide/analytics-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '웹 분석 — 모니터링 가이드 | Linkmap',
  description:
    'GA4, Plausible, Vercel Analytics 비교. 이벤트 트래킹, 페이지뷰 분석, 프라이버시 고려 사항까지.',
  keywords: ['웹 분석', 'Google Analytics', 'GA4', 'Plausible', 'Vercel Analytics', '이벤트 트래킹', '페이지뷰'],
};

export default function AnalyticsPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'monitoring/analytics',
    title: '웹 분석 — 모니터링 가이드',
    description: 'GA4, Plausible, Vercel Analytics 비교와 이벤트 트래킹 기초.',
    faqs: [
      { q: 'Google Analytics는 무료인가요?', a: 'GA4는 완전 무료입니다. 대규모 트래픽도 무료로 분석할 수 있지만, 데이터 보존 기간이 14개월로 제한됩니다.' },
      { q: 'Plausible은 왜 유료인가요?', a: 'Plausible은 쿠키를 사용하지 않고 GDPR을 완벽히 준수합니다. 프라이버시를 중시하는 EU 대상 서비스라면 쿠키 동의 배너가 필요 없어 오히려 비용 절감이 됩니다.' },
      { q: '웹 분석 도구는 사이트 속도에 영향을 주나요?', a: 'GA4 스크립트는 약 45KB로 약간의 영향이 있습니다. Plausible은 1KB 미만으로 거의 영향이 없고, Vercel Analytics는 번들에 포함되어 추가 로딩이 없습니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <AnalyticsContent />
    </>
  );
}
