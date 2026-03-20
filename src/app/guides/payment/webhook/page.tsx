import type { Metadata } from 'next';
import { WebhookContent } from '@/components/guides/payment-guide/webhook-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '결제 웹훅 처리 — 시그니처 검증, 멱등성, 재시도 | Linkmap',
  description:
    '결제 웹훅이 필요한 이유, 이벤트 시그니처 검증, 멱등성 처리, 재시도 로직을 초보자 눈높이로 설명합니다.',
  keywords: ['웹훅', 'Webhook', '시그니처 검증', '멱등성', '재시도', '결제 이벤트'],
};

export const revalidate = false;

export default function WebhookPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'payment/webhook',
    title: '결제 웹훅 처리 — 시그니처 검증, 멱등성, 재시도',
    description: '결제 웹훅이 필요한 이유, 이벤트 시그니처 검증, 멱등성 처리, 재시도 로직.',
    faqs: [
      { q: '웹훅 없이 결제 확인이 가능한가요?', a: '폴링(주기적 조회)으로 가능하지만, 실시간성이 떨어지고 API 호출 비용이 증가합니다. 웹훅이 표준 방식입니다.' },
      { q: '웹훅 시그니처 검증을 안 하면 어떻게 되나요?', a: '공격자가 가짜 결제 완료 이벤트를 보내 무료로 상품을 탈취할 수 있습니다. 반드시 시그니처를 검증하세요.' },
      { q: '멱등성이 왜 중요한가요?', a: '네트워크 문제로 같은 웹훅이 여러 번 전달될 수 있습니다. 멱등성 처리 없이는 결제가 중복 처리될 위험이 있습니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <WebhookContent />
    </>
  );
}
