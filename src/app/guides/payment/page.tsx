import type { Metadata } from 'next';
import { PaymentGuide } from '@/components/guides/payment-guide';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '결제 연동 가이드 — 바이브 코더 가이드 | Linkmap',
  description:
    '온라인 결제의 구조부터 Stripe, 토스페이먼츠 연동, 결제 웹훅 처리까지 초보자 눈높이로 설명합니다.',
  keywords: ['결제', 'Stripe', '토스페이먼츠', 'PG사', '웹훅', 'Payment Intent', '초보자'],
};

export default function PaymentGuidePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'payment',
    title: '결제 연동 가이드 — 바이브 코더 가이드',
    description: '온라인 결제의 구조부터 Stripe, 토스페이먼츠 연동, 결제 웹훅 처리까지 초보자 눈높이로 설명합니다.',
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <PaymentGuide />
    </>
  );
}
