import type { Metadata } from 'next';
import { StripeContent } from '@/components/guides/payment-guide/stripe-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Stripe 결제 연동 — Checkout, Payment Intent, 테스트 | Linkmap',
  description:
    'Stripe Checkout 흐름, Payment Intent 개념, 테스트 카드 번호, Next.js 연동 코드 예시를 초보자 눈높이로 설명합니다.',
  keywords: ['Stripe', 'Payment Intent', 'Checkout', '테스트 카드', 'Next.js', '결제 연동'],
};

export const revalidate = false;

export default function StripePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'payment/stripe',
    title: 'Stripe 결제 연동 — Checkout, Payment Intent, 테스트',
    description: 'Stripe Checkout 흐름, Payment Intent 개념, 테스트 카드 번호, Next.js 연동 코드 예시.',
    faqs: [
      { q: 'Stripe 테스트 모드에서 실제 결제가 되나요?', a: '아닙니다. 테스트 모드에서는 실제 카드가 청구되지 않습니다. 테스트 카드 번호(4242 4242 4242 4242)를 사용하세요.' },
      { q: 'Payment Intent와 Checkout Session의 차이는?', a: 'Checkout Session은 Stripe가 제공하는 결제 페이지를 사용하는 방식이고, Payment Intent는 직접 결제 UI를 구성할 때 사용합니다. 초보자는 Checkout Session부터 시작하세요.' },
      { q: 'Stripe는 한국에서도 사용 가능한가요?', a: '네, Stripe는 한국 사업자 등록이 가능합니다. 다만 한국 소비자에게 익숙한 카카오페이, 네이버페이 등은 토스페이먼츠가 더 잘 지원합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <StripeContent />
    </>
  );
}
