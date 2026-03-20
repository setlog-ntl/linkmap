import type { Metadata } from 'next';
import { SchedulingContent } from '@/components/guides/automation-guide/scheduling-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'cron과 스케줄링 — 시간 기반 자동화 | Linkmap',
  description:
    'cron 문법 기초, Vercel Cron Jobs, Inngest/Trigger.dev 비교, 큐(Queue) 개념까지 초보자 눈높이로 설명합니다.',
  keywords: ['cron', '스케줄링', 'Vercel Cron', 'Inngest', 'Trigger.dev', 'Queue', '큐', '자동화', '초보자'],
};

export const revalidate = false;

export default function SchedulingPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'automation/scheduling',
    title: 'cron과 스케줄링 — 시간 기반 자동화',
    description: 'cron 문법 기초부터 Vercel Cron Jobs, Inngest, Trigger.dev 비교, 큐(Queue) 개념까지.',
    faqs: [
      { q: 'cron 표현식은 어떻게 읽나요?', a: '"분 시 일 월 요일" 5자리로 구성됩니다. 예를 들어 "0 9 * * 1"은 매주 월요일 9시 0분을 의미합니다.' },
      { q: 'Vercel Cron Jobs는 무료인가요?', a: '무료 플랜에서 매일 1회 실행 가능한 Cron Job 2개를 제공합니다. Pro 플랜은 분 단위까지 가능합니다.' },
      { q: 'Inngest와 Trigger.dev의 차이는?', a: 'Inngest는 이벤트 기반 워크플로우에 강하고, Trigger.dev는 복잡한 장기 실행 작업에 적합합니다. 둘 다 서버리스 환경에서 잘 동작합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <SchedulingContent />
    </>
  );
}
