import type { Metadata } from 'next';
import { EmailContent } from '@/components/guides/communication-guide/email-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '이메일 알림 연동 — Resend·SendGrid 비교 | Linkmap',
  description:
    'Resend와 SendGrid를 비교하고, 트랜잭셔널 이메일과 마케팅 이메일의 차이, 기본 코드 예시를 초보자 눈높이로 설명합니다.',
  keywords: ['이메일', 'Resend', 'SendGrid', '트랜잭셔널 이메일', '마케팅 이메일', 'SMTP', 'API'],
};

export default function EmailPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'communication/email',
    title: '이메일 알림 연동 — Resend·SendGrid 비교',
    description: 'Resend와 SendGrid를 비교하고, 트랜잭셔널/마케팅 이메일의 차이와 기본 코드 예시를 설명합니다.',
    faqs: [
      { q: 'Resend와 SendGrid 중 어떤 걸 써야 하나요?', a: '개발자 경험과 React 이메일 템플릿을 중시하면 Resend, 대량 마케팅 이메일이 필요하면 SendGrid를 추천합니다.' },
      { q: 'SMTP와 API 방식의 차이는?', a: 'SMTP는 이메일 전용 프로토콜로 기존 시스템과 호환성이 좋고, API는 HTTP 요청으로 더 빠르고 모니터링이 쉽습니다.' },
      { q: '트랜잭셔널 이메일이란?', a: '비밀번호 재설정, 결제 확인 등 사용자 행동에 의해 자동 발송되는 이메일입니다. 마케팅 이메일과 달리 수신 동의가 필요하지 않습니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <EmailContent />
    </>
  );
}
