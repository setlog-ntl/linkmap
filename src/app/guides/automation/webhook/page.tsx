import type { Metadata } from 'next';
import { WebhookContent } from '@/components/guides/automation-guide/webhook-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '웹훅(Webhook) — 이벤트 기반 자동화 | Linkmap',
  description:
    '웹훅의 개념(Push vs Pull), 이벤트 수신 엔드포인트 만들기, 시그니처 검증, 디버깅 방법을 초보자 눈높이로 설명합니다.',
  keywords: ['웹훅', 'Webhook', 'Push', 'Pull', '시그니처 검증', 'RequestBin', '이벤트 기반', '초보자'],
};

export const revalidate = false;

export default function WebhookPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'automation/webhook',
    title: '웹훅(Webhook) — 이벤트 기반 자동화',
    description: '웹훅의 개념(Push vs Pull), 이벤트 수신 엔드포인트 만들기, 시그니처 검증과 디버깅.',
    faqs: [
      { q: '웹훅과 API 폴링의 차이는?', a: '폴링은 주기적으로 "새 데이터 있어?"라고 물어보는 방식(Pull)이고, 웹훅은 이벤트가 발생하면 즉시 알려주는 방식(Push)입니다. 웹훅이 실시간성과 효율성에서 훨씬 유리합니다.' },
      { q: '웹훅 시그니처 검증은 왜 필요한가요?', a: '악의적인 제3자가 가짜 웹훅 요청을 보내 시스템을 조작할 수 있습니다. 시그니처 검증으로 요청이 실제 서비스에서 온 것인지 확인합니다.' },
      { q: '웹훅 디버깅은 어떻게 하나요?', a: 'RequestBin이나 Webhook.site 같은 도구로 실제 전송되는 데이터를 확인할 수 있습니다. 로컬에서는 ngrok으로 터널을 열어 테스트합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <WebhookContent />
    </>
  );
}
