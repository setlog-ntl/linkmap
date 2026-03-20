import type { Metadata } from 'next';
import { ErrorTrackingContent } from '@/components/guides/monitoring-guide/error-tracking-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '에러 추적 — 모니터링 가이드 | Linkmap',
  description:
    'Sentry 설치부터 에러 그룹핑, 알림 설정, LogRocket 세션 리플레이까지. 프로덕션 에러를 빠르게 잡는 방법.',
  keywords: ['에러 추적', 'Sentry', 'LogRocket', '에러 모니터링', '세션 리플레이', '알림 설정'],
};

export const revalidate = false;

export default function ErrorTrackingPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'monitoring/error-tracking',
    title: '에러 추적 — 모니터링 가이드',
    description: 'Sentry 설치부터 에러 그룹핑, 알림 설정, LogRocket 세션 리플레이까지.',
    faqs: [
      { q: 'Sentry는 무료인가요?', a: '개발자 플랜은 무료이며 월 5,000건의 에러 이벤트를 추적할 수 있습니다. 소규모 프로젝트에 충분합니다.' },
      { q: 'console.log 대신 Sentry를 써야 하는 이유는?', a: 'console.log는 브라우저 개발자 도구에서만 볼 수 있지만, Sentry는 실제 사용자 환경의 에러를 자동 수집하고 알림을 보내줍니다.' },
      { q: 'LogRocket과 Sentry의 차이는?', a: 'Sentry는 에러 자체를 추적하고, LogRocket은 사용자의 화면을 녹화하여 에러 발생 전후 맥락을 확인할 수 있습니다. 둘을 함께 쓰면 가장 효과적입니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <ErrorTrackingContent />
    </>
  );
}
