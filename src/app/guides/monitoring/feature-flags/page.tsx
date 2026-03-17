import type { Metadata } from 'next';
import { FeatureFlagsContent } from '@/components/guides/monitoring-guide/feature-flags-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '피처 플래그 — 모니터링 가이드 | Linkmap',
  description:
    '피처 플래그로 점진적 롤아웃, A/B 테스트 구현하기. LaunchDarkly, Vercel Feature Flags 사용법.',
  keywords: ['피처 플래그', 'Feature Flags', 'A/B 테스트', '점진적 롤아웃', 'LaunchDarkly', 'Vercel'],
};

export default function FeatureFlagsPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'monitoring/feature-flags',
    title: '피처 플래그 — 모니터링 가이드',
    description: '피처 플래그로 점진적 롤아웃, A/B 테스트 구현하기.',
    faqs: [
      { q: '피처 플래그가 뭔가요?', a: '코드를 배포하되, 특정 기능의 ON/OFF를 서버에서 원격으로 제어하는 기술입니다. 재배포 없이 기능을 켜고 끌 수 있습니다.' },
      { q: 'if문으로 분기하면 되는데 왜 피처 플래그 도구를 쓰나요?', a: 'if문은 코드를 수정하고 재배포해야 합니다. 피처 플래그 도구는 대시보드에서 즉시 ON/OFF할 수 있고, 특정 사용자 비율에만 적용하는 등 세밀한 제어가 가능합니다.' },
      { q: 'A/B 테스트와 피처 플래그의 차이는?', a: 'A/B 테스트는 피처 플래그의 한 가지 활용법입니다. 사용자를 A/B 그룹으로 나누어 다른 버전을 보여주고 성과를 비교하는 것입니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <FeatureFlagsContent />
    </>
  );
}
