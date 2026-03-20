import type { Metadata } from 'next';
import { TossContent } from '@/components/guides/payment-guide/toss-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '토스페이먼츠 결제 연동 — 결제 위젯, 빌링키, 가상계좌 | Linkmap',
  description:
    '토스페이먼츠의 결제 위젯, 빌링키(정기결제), 가상계좌 흐름을 초보자 눈높이로 설명합니다.',
  keywords: ['토스페이먼츠', '결제 위젯', '빌링키', '정기결제', '가상계좌', '한국 PG'],
};

export const revalidate = false;

export default function TossPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'payment/toss',
    title: '토스페이먼츠 결제 연동 — 결제 위젯, 빌링키, 가상계좌',
    description: '토스페이먼츠의 결제 위젯, 빌링키(정기결제), 가상계좌 흐름을 설명합니다.',
    faqs: [
      { q: '토스페이먼츠와 토스 앱은 같은 건가요?', a: '다릅니다. 토스 앱은 송금/은행 서비스이고, 토스페이먼츠는 사업자를 위한 결제 대행(PG) 서비스입니다.' },
      { q: '빌링키란 무엇인가요?', a: '빌링키는 고객의 카드 정보를 암호화한 토큰입니다. 정기결제(구독) 시 매번 카드 정보를 입력하지 않아도 자동 결제할 수 있게 해줍니다.' },
      { q: '가상계좌 결제는 어떻게 확인하나요?', a: '가상계좌는 입금 확인이 비동기로 이루어집니다. 토스페이먼츠가 입금 확인 웹훅을 보내주므로, 웹훅 엔드포인트를 반드시 구현해야 합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <TossContent />
    </>
  );
}
